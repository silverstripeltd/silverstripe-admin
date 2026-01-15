import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as schemaActions from 'state/schema/SchemaActions';
import { connect } from 'react-redux';

const FileSchemaHandler = (_props) => {
  const {
    Component: TargetComponent,
    ...props
  } = _props;
  const {
    schemaUrl,
    actions
  } = props;

  // Keep track of the latest values in refs to avoid stale closures
  const schemaUrlRef = useRef(schemaUrl);
  const actionsRef = useRef(actions);

  // Store the latest props in refs immediately during the render phase.
  // We do this instead of using useEffect so that if a child component runs its
  // own effects or renders immediately, 'setOverrides' already has access to
  // the fresh data from this render cycle.
  schemaUrlRef.current = schemaUrl;
  actionsRef.current = actions;

  /**
   * Compares the current properties with received properties and determines if overrides need to be
   * cleared or added.
   *
   * @param {object} propsParam
   */
  const setOverrides = useCallback((propsParam = null) => {
    if (!propsParam) {
      // clear any overrides that may be in place
      if (schemaUrlRef.current) {
        actionsRef.current.schema.setSchemaStateOverrides(schemaUrlRef.current, null);
      }
    } else if (propsParam.schemaUrl) {
      const attrs = Object.assign({}, propsParam.fileAttributes);

      delete attrs.ID;

      const overrides = {
        fields: Object.entries(attrs).map((field) => {
          const [name, value] = field;
          return { name, value };
        }),
      };
      // set overrides into redux store, so that it can be accessed by FormBuilder with the same
      // schemaUrl.
      actionsRef.current.schema.setSchemaStateOverrides(propsParam.schemaUrl, overrides);
    }
  }, []);

  useEffect(() => {
    setOverrides(_props);
    return () => {
      setOverrides();
    };
  }, []);

  return <TargetComponent setOverrides={setOverrides} {...props} />;
};

FileSchemaHandler.propTypes = {
  fileAttributes: PropTypes.object,
  Component: PropTypes.elementType,
  schemaUrl: PropTypes.string,
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch, props) {
  const actions = (props && props.actions) || {};
  return {
    actions: {
      ...actions,
      schema: bindActionCreators(schemaActions, dispatch),
    },
  };
}

const ConnectedFileSchemaHandler = connect(() => ({}), mapDispatchToProps())(FileSchemaHandler);

function fileSchemaModalHandler(AssetAdmin) {
  function mapStateToProps() {
    return {
      Component: AssetAdmin,
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(FileSchemaHandler);
}

export { FileSchemaHandler, ConnectedFileSchemaHandler };

export default fileSchemaModalHandler;
