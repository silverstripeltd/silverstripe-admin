import React, { useEffect, useCallback } from 'react';
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

  /**
   * Compares the current properties with received properties and determines if overrides need to be
   * cleared or added.
   *
   * @param {object} propsParam
   */
  const setOverrides = useCallback((propsParam = null) => {
    if (!propsParam) {
      // clear any overrides that may be in place
      if (schemaUrl) {
        actions.schema.setSchemaStateOverrides(schemaUrl, null);
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
      actions.schema.setSchemaStateOverrides(propsParam.schemaUrl, overrides);
    }
  }, [schemaUrl, actions]);

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
