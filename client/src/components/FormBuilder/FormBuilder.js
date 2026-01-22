import React, { useState, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import merge from 'merge';
import schemaFieldValues, { schemaMerge } from 'lib/schemaFieldValues';
import { createErrorBlock } from 'lib/createErrorBlock';
import backend from 'lib/Backend';
import { withInjector } from 'lib/Injector';

/**
 * If there is structural and state data available merge those data for each field.
 * Otherwise just use the structural data. Ensure that keys don't conflict
 * with redux-form expectations.
 *
 * @param {array} fields
 * @param {Object} state Optional
 * @return {array}
 */
const normalizeFields = (fields, state) => fields.map((field) => {
  const fieldState = (state && state.fields)
    ? state.fields.find((item) => item.id === field.id)
    : {};
  const data = merge.recursive(
    true,
    schemaMerge(field, fieldState),
    {
      schemaComponent: (fieldState && fieldState.component)
        ? fieldState.component
        : field.component,
    }
  );
  if (field.children) {
    data.children = normalizeFields(field.children, state);
  }
  return data;
});

/**
 * Component used to build forms, including instantiating the correct components
 * for form fields and actions.
 *
 * Note that several methods in this component are build exactly once using useCallback
 * with no dependencies, and use the latestRef reference to get the most up to date copy
 * of context and props.
 * This is done to ensure these methods have a stable identify so that redux-form
 * (<BaseFormComponent>) doesn't cause re-renders when these methods change.
 */
const FormBuilder = (props, context) => {
  const {
    schema,
    baseFormComponent: BaseFormComponent,
    form,
    afterMessages,
    asyncValidate,
    fieldHolder,
    actionHolder,
    onAction,
    onAutofill,
    onSubmit,
    onSubmitFail,
    onSubmitSuccess,
    shouldAsyncValidate,
    touchOnBlur,
    touchOnChange,
    persistentSubmitErrors,
    autoFocus = false,
    responseRequestedSchema = ['auto'],
    formTag,
    submitting,
    identifier,
    validate,
    values,
  } = props;

  // Store the latest props and context in a ref.
  // This allows our the "stable methods" to always see the current data
  // without needing to be recreated.
  const latestRef = useRef({ props, context });

  // Update immediately for the current render cycle
  latestRef.current = { props, context };

  const [submittingAction, setSubmittingAction] = useState(null);
  const formDOMRef = useRef(null);
  const schemaStructure = schema.schema;

  // Stable API fetcher
  const submitApi = useMemo(() => backend.createEndpointFetcher({
    url: schemaStructure.attributes.action,
    method: schemaStructure.attributes.method,
  }), [schemaStructure.attributes]);

  /**
   * Default data type to component mappings.
   * Used as a fallback when no component type is provided in the form schema.
   *
   * @param {string} dataType - The data type provided by the form schema.
   * @param {string} name - name of the field component
   * @return object|null
   */
  const getComponentForDataType = useCallback((dataType, name) => {
    const { injector: latestInjector } = latestRef.current.context;
    const { identifier: latestIdentifier } = latestRef.current.props;
    const get = (type) => latestInjector.get(type, `${latestIdentifier}.${name}`);

    switch (dataType) {
      case 'Integer':
      case 'Decimal':
        return get('NumberField');
      case 'String':
      case 'Text':
        return get('TextField');
      case 'Date':
        return get('DateField');
      case 'Time':
        return get('TimeField');
      case 'Datetime':
        return get('DatetimeField');
      case 'Hidden':
        return get('HiddenField');
      case 'SingleSelect':
        return get('SingleSelectField');
      case 'Custom':
        return get('GridField');
      case 'Structural':
        return get('CompositeField');
      case 'Boolean':
        return get('CheckboxField');
      case 'MultiSelect':
        return get('CheckboxSetField');
      default:
        return null;
    }
  }, []);

  const getComponent = useCallback(({ name, schemaComponent, schemaType }) => {
    const latestProps = latestRef.current.props;
    const { injector: latestInjector } = latestRef.current.context;
    const { identifier: latestIdentifier } = latestProps;

    if (latestProps.getCustomFields) {
      const component = latestProps.getCustomFields(schemaType, `${latestIdentifier}.${name}`);
      if (component) {
        return component;
      }
    }

    if (schemaComponent !== null) {
      return latestInjector.get(schemaComponent, `${latestIdentifier}.${name}`);
    }

    return getComponentForDataType(schemaType, name);
  }, []);

  /**
   * Common functionality for building a Field or Action from schema.
   *
   * @param {Object} props Props which every form field receives. Leave it up to the
   *        schema and component to determine which props are required.
   * @returns {*}
   */
  const buildComponent = useCallback((componentProps) => {
    const inputProps = componentProps.input || {};
    const propsForComponent = {
      ...componentProps,
      ...componentProps.input,
      onChange: inputProps.onChange
        ? (event, payload) => {
          inputProps.onChange(payload ? payload.value : event);
        }
        : null,
    };
    delete propsForComponent.input;

    const SchemaComponent = getComponent(propsForComponent);

    if (SchemaComponent === null) {
      return null;
    } else if (propsForComponent.schemaComponent !== null && SchemaComponent === undefined) {
      throw Error(`Component not found in injector: ${propsForComponent.schemaComponent}`);
    }

    const latestProps = latestRef.current.props;
    if (typeof latestProps.createFn === 'function') {
      return latestProps.createFn(SchemaComponent, propsForComponent);
    }
    return <SchemaComponent key={propsForComponent.id} {...propsForComponent} />;
  }, []);

  /**
   * Maps a list of schema fields to their React Component.
   * Only top level form fields are handled here, composite fields (TabSets etc),
   * are responsible for mapping and rendering their children.
   *
   * @param {Array} fields
   * @return {Array}
   */
  const mapFieldsToComponents = useCallback((fields) => {
    const latestProps = latestRef.current.props;
    // Important: We access FieldComponent from props here to match Class behavior
    // But we must assume FieldComponent itself is stable from parent.
    const ScopedFieldComponent = latestProps.baseFieldComponent;

    return fields.map((field) => {
      let componentProps = field;
      if (field.schemaType === 'StructuralCustom') {
        componentProps = Object.assign(
          {},
          field,
          {
            children: null,
            childrenSchema: field.children,
            formFieldSchemaFunctions: {
              mapFieldsToComponents,
              normalizeFields,
            },
          }
        );
      } else if (field.children) {
        componentProps = Object.assign(
          {},
          field,
          { children: mapFieldsToComponents(field.children) }
        );
      }

      componentProps = Object.assign(
        {
          onAutofill,
          formid: form,
        },
        componentProps
      );

      if (field.schemaType === 'Structural' || field.readOnly === true) {
        return buildComponent(componentProps);
      }

      // Pass the stable buildComponent function
      return <ScopedFieldComponent key={componentProps.id} {...componentProps} component={buildComponent} />;
    });
  }, []);

  /**
   * When the action is clicked on, records which action was clicked on
   * This can allow for preventing the submit action, such as a custom action for the button
   *
   * @param {Event} event
   */
  const handleAction = (event) => {
    if (typeof onAction === 'function') {
      onAction(event, values);
    }
    if (!event.isPropagationStopped()) {
      setSubmittingAction(event.currentTarget.name);
    }
  };

  /**
   * Form submission handler passed to the Form Component as a prop.
   * Provides a hook for controllers to access for state and provide custom functionality.
   *
   * @param {Object} data Processed and validated data from redux-form
   * (originally retrieved through schemaFieldValues())
   * @return {Promise|null}
   */
  const handleSubmit = (data) => {
    // Add form action data (or default to first action, same as browser behaviour)
    let action = '';
    if (submittingAction) {
      action = submittingAction;
    } else if (schema.schema.actions[0]) {
      action = schema.schema.actions[0].name;
    }

    const dataWithAction = Object.assign({}, data, action ? { [action]: 1 } : {});
    const requestedSchema = responseRequestedSchema.join();
    const headers = {
      'X-Formschema-Request': requestedSchema,
      'X-Requested-With': 'XMLHttpRequest',
    };

    const submitFn = (customData) =>
      submitApi(customData || dataWithAction, headers)
        .then(formSchema => {
          setSubmittingAction(null);
          return formSchema;
        })
        .catch((reason) => {
          setSubmittingAction(null);
          throw reason;
        });

    if (typeof onSubmit === 'function') {
      return onSubmit(dataWithAction, action, submitFn);
    }

    return submitFn();
  };

  /**
   * Maps a list of form actions to their React Component.
   *
   * @param {Array} actions
   * @return {Array}
   */
  const mapActionsToComponents = (actions) => actions.map((action) => {
    const componentProps = Object.assign({}, action);

    if (action.children) {
      componentProps.children = mapActionsToComponents(action.children);
    } else {
      componentProps.onClick = handleAction;

      if (submitting && submittingAction === action.name) {
        componentProps.loading = true;
      }
    }
    // Use the stable buildComponent
    return buildComponent(componentProps);
  });

  /**
   * Run validation for every field on the form and return an object which list issues while
   * validating
   *
   * @param valuesParam
   * @returns {*}
   */
  const validateForm = (valuesParam) => {
    if (typeof validate === 'function') {
      return validate(valuesParam);
    }

    const sData = schema && schema.schema;
    if (!sData) {
      return {};
    }

    const validationMiddleware = context.injector.validate(identifier);

    let middlewareValidationResult = {};
    if (validationMiddleware) {
      middlewareValidationResult = validationMiddleware(valuesParam, schema.schema) || {};
    }

    return createErrorBlock(middlewareValidationResult);
  };

  // 4. Data Preparation
  const schemaData = schema.schema;
  const schemaState = schema.state;

  const normalizedFields = useMemo(() =>
    normalizeFields(schemaData.fields, schemaState),
  [schemaData.fields, schemaState]
  );

  const normalizedActions = useMemo(() =>
    normalizeFields(schemaData.actions, schemaState),
  [schemaData.actions, schemaState]
  );

  const initialValues = useMemo(() =>
    schemaFieldValues(schemaData, schemaState),
  [schemaData, schemaState]
  );

  // Map form schema to React component attribute names,
  // which requires renaming some of them (by unsetting the original keys)
  const attributes = useMemo(() => {
    const attrs = {
      ...schemaData.attributes,
      className: schemaData.attributes.class,
      encType: schemaData.attributes.enctype,
      // Turn off HTML5 validation to rely on validateForm as the sole validator
      noValidate: true,
    };
    delete attrs.class;
    delete attrs.enctype;
    return attrs;
  }, [schemaData.attributes]);

  const formProps = {
    form, // required as redux-form identifier
    afterMessages,
    fields: normalizedFields,
    fieldHolder,
    actions: normalizedActions,
    actionHolder,
    attributes,
    data: schemaData.data,
    initialValues,
    onSubmit: handleSubmit,
    valid: schemaState && schemaState.valid,
    messages: (schemaState && Array.isArray(schemaState.messages)) ? schemaState.messages : [],
    mapActionsToComponents,
    mapFieldsToComponents,
    asyncValidate,
    onSubmitFail,
    onSubmitSuccess,
    shouldAsyncValidate,
    touchOnBlur,
    touchOnChange,
    persistentSubmitErrors,
    validate: validateForm,
    autoFocus,
    setDOM: (formDOM) => { formDOMRef.current = formDOM; },
    formTag,
  };

  return (
    <BaseFormComponent
      {...formProps}
    />
  );
};

const schemaPropType = PropTypes.shape({
  id: PropTypes.string,
  schema: PropTypes.shape({
    attributes: PropTypes.shape({
      class: PropTypes.string,
      enctype: PropTypes.string,
    }),
    fields: PropTypes.array.isRequired,
  }),
  state: PropTypes.shape({
    fields: PropTypes.array,
  }),
  loading: PropTypes.bool,
  stateOverride: PropTypes.shape({
    fields: PropTypes.array,
  }),
});

const basePropTypes = {
  createFn: PropTypes.func,
  onSubmit: PropTypes.func,
  onAction: PropTypes.func,
  asyncValidate: PropTypes.func,
  onSubmitFail: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  shouldAsyncValidate: PropTypes.func,
  touchOnBlur: PropTypes.bool,
  touchOnChange: PropTypes.bool,
  persistentSubmitErrors: PropTypes.bool,
  validate: PropTypes.func,
  values: PropTypes.object,
  submitting: PropTypes.bool,
  baseFormComponent: PropTypes.elementType.isRequired,
  baseFieldComponent: PropTypes.elementType.isRequired,
  getCustomFields: PropTypes.func,
  responseRequestedSchema: PropTypes.arrayOf(PropTypes.oneOf([
    'schema', 'state', 'errors', 'auto',
  ])),
  identifier(props, propName, componentName) {
    if (!/^[A-Za-z0-9_.]+$/.test(props[propName])) {
      return new Error(`
        Invalid identifier supplied to ${componentName}. Must be a set of
        dot-separated alphanumeric strings.
      `);
    }

    return null;
  },

};

FormBuilder.propTypes = Object.assign({}, basePropTypes, {
  form: PropTypes.string.isRequired,
  schema: schemaPropType.isRequired,
  autoFocus: PropTypes.bool,
});

export {
  FormBuilder as Component,
  basePropTypes,
  schemaPropType
};

export default withInjector(FormBuilder);
