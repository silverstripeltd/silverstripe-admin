import i18n from 'i18n';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import fetch from 'isomorphic-fetch';
import deepFreeze from 'deep-freeze-strict';
import {
  SubmissionError,
  autofill,
  initialize
} from 'redux-form';
import schemaFieldValues from 'lib/schemaFieldValues';
import { createErrorHtml } from 'lib/createErrorBlock';
import * as schemaActions from 'state/schema/SchemaActions';
import merge from 'merge';
import FormBuilder, { basePropTypes, schemaPropType } from 'components/FormBuilder/FormBuilder';
import getIn from 'redux-form/lib/structure/plain/getIn';
import { inject } from 'lib/Injector';
import getFormState from 'lib/getFormState';

/**
 * Creates a dot-separated identifier for forms generated
 * with schemas (e.g. FormBuilderLoader)
 *
 * @param {string} identifier
 * @param {object} schema
 * @returns {string}
 */
const createFormIdentifierFromProps = ({ identifier, schema = {} }) => [
  identifier,
  schema.schema && schema.schema.name,
].filter(id => id).join('.');

const FormBuilderLoader = (props) => {
  const {
    autoFocus,
    loading,
    loadingComponent: LoadingComponent,
    onSubmit,
    onSubmitSuccess,
    refetchSchemaCriteria,
    refetchSchemaOnMount = true,
    schema: schemaProp,
    schemaUrl,
  } = props;

  const [didError, setDidError] = useState(false);
  const prevPropsRef = useRef({ schemaUrl, refetchSchemaCriteria });

  // Persist the latest props to simulate class component `this.props` behavior and prevent stale closures.
  // This ensures asynchronous callbacks (e.g. fetchSchema, handleSubmit) always access
  // the latest props, even if the component re-renders while the request is pending.
  const propsRef = useRef(props);
  // Update current props on each render before running any effects or callbacks
  propsRef.current = props;

  /**
   * Get server-side validation messages returned and display them on the form.
   *
   * @param state
   * @returns {object}
   */
  const getMessages = (state) => {
    const messages = {};

    // only error messages are collected
    if (state && state.fields) {
      state.fields.forEach((field) => {
        if (field.message) {
          messages[field.name] = field.message;
        }
      });
    }
    return messages;
  };

  const getIdentifier = (propsParam = propsRef.current) => createFormIdentifierFromProps(propsParam);

  /**
   * Given a submitted schema, ensure that any errors property is merged safely into
   * the state.
   *
   * @param {Object} schema - New schema result
   * @return {Object}
   */
  const reduceSchemaErrors = (schema) => {
    // Skip if there are no errors
    if (!schema.errors) {
      return schema;
    }

    // Inherit state from current schema if not being assigned in this request
    let reduced = { ...schema };
    if (!reduced.state) {
      reduced = {
        ...reduced,
        state: propsRef.current.schema.state
      };
    }

    // Modify state.fields and replace state.messages
    reduced = {
      ...reduced,
      state: {
        ...reduced.state,
        // Replace message property for each field
        fields: reduced.state.fields.map((field) => {
          let message = schema.errors.find((error) => error.field === field.name);
          if (message) {
            message = createErrorHtml([message.value]);
          }
          return {
            ...field,
            message,
          };
        }),
        // Non-field messages
        messages: schema.errors.filter((error) => !error.field),
      },
    };

    // Can be safely discarded
    delete reduced.errors;
    return deepFreeze(reduced);
  };

  /**
   * Handles updating the schema after response is received and gathering server-side validation
   * messages.
   *
   * @param {object} data
   * @param {string} action
   * @param {function} submitFn
   * @returns {Promise}
   */
  const handleSubmit = (data, action, submitFn) => {
    let promise = null;

    // need to initialise form data and setSchema before any redirects by callbacks happen
    const newSubmitFn = () => (
      submitFn()
        .then(formSchema => {
          let schema = formSchema;
          if (schema) {
            // Before modifying schema, check if the schema state is provided explicitly
            const explicitUpdatedState = typeof schema.state !== 'undefined';

            // Merge any errors into the current state to update messages and alerts
            schema = reduceSchemaErrors(schema);
            propsRef.current.actions.schema.setSchema(
              propsRef.current.schemaUrl,
              schema,
              getIdentifier()
            );

            // If state is updated in server response, re-initialize redux form state
            if (explicitUpdatedState) {
              const schemaRef = schema.schema || propsRef.current.schema.schema;
              const formData = schemaFieldValues(schemaRef, schema.state);
              propsRef.current.actions.reduxForm.initialize(getIdentifier(), formData);
            }
          }
          return schema;
        })
    );

    if (typeof onSubmit === 'function') {
      promise = onSubmit(data, action, newSubmitFn);
    } else {
      promise = newSubmitFn();
    }

    if (!promise) {
      throw new Error('Promise was not returned for submitting');
    }

    return promise
      .then(formSchema => {
        if (!formSchema || !formSchema.state) {
          return formSchema;
        }
        const messages = getMessages(formSchema.state);

        if (Object.keys(messages).length) {
          throw new SubmissionError(messages);
        }
        return formSchema;
      });
  };

  /**
   * Checks for any state override data provided, which will take precendence over the state
   * received through fetch.
   *
   * This is important for editing a WYSIWYG item which needs the form schema and only parts of
   * the form state.
   *
   * @param {object} state
   * @returns {object}
   */
  const overrideStateData = (state) => {
    if (!propsRef.current.stateOverrides || !state) {
      return state;
    }
    const fieldOverrides = propsRef.current.stateOverrides.fields;
    let fields = state.fields;
    if (fieldOverrides && fields) {
      fields = fields.map((field) => {
        const fieldOverride = fieldOverrides.find((override) => override.name === field.name);
        // need to be recursive for the unknown-sized "data" properly
        return (fieldOverride) ? merge.recursive(true, field, fieldOverride) : field;
      });
    }

    return Object.assign({},
      state,
      propsRef.current.stateOverrides,
      { fields }
    );
  };

  /**
   * Call to make the fetching happen
   *
   * @param headerValues
   * @returns {*}
   */
  const callFetch = (headerValues) => fetch(propsRef.current.schemaUrl, {
    headers: {
      'X-FormSchema-Request': headerValues.join(','),
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      return new Promise(
        (resolve, reject) => response
          .json()
          .then((json) => {
            reject({
              status: response.status,
              statusText: response.statusText,
              json,
            });
          })
          .catch(() => {
            reject({
              status: response.status,
              statusText: response.statusText,
              json: {},
            });
          })
      );
    });

  /**
   * Convert error to a json object to pass to onLoadingError
   *
   * @param {Object} error
   */
  const normaliseError = (error) => {
    // JSON result contains errors.
    // See LeftAndMain::jsonError() for format
    if (error.json && error.json.errors) {
      return error.json;
    }

    // Standard http errors
    if (error.status && error.statusText) {
      return {
        errors: [
          {
            code: error.status,
            value: error.statusText,
            type: 'error',
          },
        ],
      };
    }

    // Handle exception
    const message = error.message
      || i18n._t('Admin.UNKNOWN_ERROR', 'An unknown error has occurred.');
    return {
      errors: [
        {
          value: message,
          type: 'error',
        },
      ],
    };
  };

  /**
   * Fetches data used to generate a form. This can be form schema and/or form state data.
   * When the response comes back the data is saved to state.
   *
   * @param {Boolean} schema If form schema data should be returned in the response.
   * @param {Boolean} state If form state data should be returned in the response.
   * @param {Boolean} errors If form errors should be returned in the response.
   * @return {Object} Promise from the AJAX request.
   */
  const fetchSchema = (schema = true, state = true, errors = true) => {
    if (propsRef.current.loading) {
      return Promise.resolve({});
    }

    // Note: `errors` is only valid for submissions, not schema requests, so omitted here
    const headerValues = [
      'auto',
      schema && 'schema',
      state && 'state',
      errors && 'errors',
    ].filter(header => header);

    // using `this.state.fetching` caused race-condition issues.
    propsRef.current.actions.schema.setSchemaLoading(propsRef.current.schemaUrl, true);

    if (typeof propsRef.current.onFetchingSchema === 'function') {
      propsRef.current.onFetchingSchema();
    }

    return callFetch(headerValues)
      .then(formSchema => {
        propsRef.current.actions.schema.setSchemaLoading(propsRef.current.schemaUrl, false);

        if (formSchema.errors) {
          if (typeof propsRef.current.onLoadingError === 'function') {
            propsRef.current.onLoadingError(formSchema);
          }
        } else if (typeof propsRef.current.onLoadingSuccess === 'function') {
          propsRef.current.onLoadingSuccess();
        }

        if (typeof formSchema.id !== 'undefined' && formSchema.state) {
          const overriddenSchema = Object.assign({},
            formSchema,
            {
              state: overrideStateData(formSchema.state),
            }
          );

          // Mock the will-be shape of the props so that the identifier is right
          const identifier = createFormIdentifierFromProps({
            ...propsRef.current,
            schema: {
              ...propsRef.current.schema,
              ...overriddenSchema,
            },
          });

          propsRef.current.actions.schema.setSchema(
            propsRef.current.schemaUrl,
            overriddenSchema,
            identifier
          );

          const schemaData = formSchema.schema || propsRef.current.schema.schema;
          const formData = schemaFieldValues(schemaData, overriddenSchema.state);

          // need to initialize the form again in case it was loaded before
          // this will re-trigger Injector.form APIs, reset values and reset pristine state as well
          propsRef.current.actions.reduxForm.initialize(
            identifier,
            formData,
            false,
            { keepSubmitSucceeded: true }
          );

          if (typeof propsRef.current.onReduxFormInit === 'function') {
            propsRef.current.onReduxFormInit();
          }

          return overriddenSchema;
        }
        return formSchema;
      })
      .catch((error) => {
        setDidError(true);
        propsRef.current.actions.schema.setSchemaLoading(propsRef.current.schemaUrl, false);
        if (typeof propsRef.current.onLoadingError === 'function') {
          return propsRef.current.onLoadingError(normaliseError(error));
        }
        // Assign onLoadingError to suppress this
        throw error;
      });
  };

  /**
   * Sets the value of a field based on actions within other fields, this is a more semantic way to
   * change a field's value than calling onChange() for the target field.
   *
   * By virtue of redux-form, it also flags the field as "meta.autofilled"
   *
   * @param field
   * @param value
   */
  const handleAutofill = (field, value) => {
    propsRef.current.actions.reduxForm.autofill(getIdentifier(), field, value);
  };

  useEffect(() => {
    // This mimics componentDidMount() from when this was a class component.
    if (refetchSchemaOnMount || !schemaProp) {
      fetchSchema();
    }
  }, []);

  useEffect(() => {
    // This mimics componentDidUpdate() from when this was a class component.
    // We check against the previous props ref to ensure this only runs when props *actually change*,
    // preventing a duplicate fetch on mount (since useEffect always runs once on mount).
    if (prevPropsRef.current.schemaUrl !== schemaUrl
      || prevPropsRef.current.refetchSchemaCriteria !== refetchSchemaCriteria
    ) {
      fetchSchema();
    }

    prevPropsRef.current = { schemaUrl, refetchSchemaCriteria };
  }, [schemaUrl, refetchSchemaCriteria]);

  if (didError) {
    return null;
  }
  // If the response from fetching the initial data
  // hasn't come back yet, don't render anything.
  if (!schemaProp || !schemaProp.schema || loading) {
    return <LoadingComponent containerClass="loading--form flexbox-area-grow" />;
  }

  const builderProps = Object.assign({}, props, {
    refetchSchemaOnMount,
    form: getIdentifier(),
    onSubmitSuccess,
    onSubmit: handleSubmit,
    onAutofill: handleAutofill,
    autoFocus
  });

  return <FormBuilder {...builderProps} />;
};

FormBuilderLoader.propTypes = Object.assign({}, basePropTypes, {
  actions: PropTypes.shape({
    schema: PropTypes.object,
    reduxFrom: PropTypes.object,
  }),
  autoFocus: PropTypes.bool,
  identifier: PropTypes.string.isRequired,
  schemaUrl: PropTypes.string.isRequired,
  schema: schemaPropType,
  refetchSchemaOnMount: PropTypes.bool.isRequired,
  refetchSchemaCriteria: PropTypes.string,
  form: PropTypes.string,
  submitting: PropTypes.bool,
  onFetchingSchema: PropTypes.func,
  onReduxFormInit: PropTypes.func,
  loadingComponent: PropTypes.elementType.isRequired,
});

const mapStateToProps = (state, ownProps) => {
  const schema = state.form.formSchemas[ownProps.schemaUrl];
  const identifier = createFormIdentifierFromProps({ ...ownProps, schema });
  const reduxFormState = getIn(getFormState(state), identifier);

  const submitting = reduxFormState && reduxFormState.submitting;
  const values = reduxFormState && reduxFormState.values;

  const stateOverrides = schema && schema.stateOverride;
  const loading = schema && schema.metadata && schema.metadata.loading;
  return { schema, submitting, values, stateOverrides, loading };
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    schema: bindActionCreators(schemaActions, dispatch),
    reduxForm: bindActionCreators({ autofill, initialize }, dispatch),
  },
});

export { FormBuilderLoader as Component, createFormIdentifierFromProps };

export default compose(
  inject(
    ['ReduxForm', 'ReduxFormField', 'Loading'],
    (ReduxForm, ReduxFormField, Loading) => ({
      loadingComponent: Loading,
      baseFormComponent: ReduxForm,
      baseFieldComponent: ReduxFormField,
    }),
    ({ identifier }) => identifier
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FormBuilderLoader);
