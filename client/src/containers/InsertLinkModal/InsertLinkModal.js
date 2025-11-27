import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import fileSchemaModalHandler from 'containers/InsertLinkModal/fileSchemaModalHandler';
import * as schemaActions from 'state/schema/SchemaActions';

const InsertLinkModal = (props) => {
  const {
    isOpen,
    onInsert,
    onClosed,
    setOverrides,
  } = props;

  const prevIsOpenRef = useRef(isOpen);

  useEffect(() => {
    if (!isOpen) {
      setOverrides(null);
    }
  }, []);

  useEffect(() => {
    // Checking prevIsOpenRef.current to ensure that we do not call setOverrides() on mount
    const prevIsOpen = prevIsOpenRef.current;
    if ((isOpen && !prevIsOpen) || (!isOpen && prevIsOpen)) {
      setOverrides(isOpen ? props : null);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  const handleSubmit = (data, action) => {
    switch (action) {
      case 'action_cancel': {
        onClosed();
        break;
      }
      default: {
        onInsert(data, action);
      }
    }
    return Promise.resolve();
  };

  /**
   * Generates the properties for the modal
   * @returns {object}
   */
  const getModalProps = () => {
    const modalProps = Object.assign(
      {},
      props,
      {
        onSubmit: handleSubmit,
        onClosed,
        autoFocus: true,
        showErrorMessage: true,
      }
    );
    delete modalProps.onInsert;
    delete modalProps.sectionConfig;
    return modalProps;
  };

  const modalProps = getModalProps();
  return <FormBuilderModal {...modalProps} />;
};

InsertLinkModal.propTypes = {
  isOpen: PropTypes.bool,
  schemaUrl: PropTypes.string,
  onInsert: PropTypes.func.isRequired,
  onClosed: PropTypes.func.isRequired,
  setOverrides: PropTypes.func.isRequired,
  actions: PropTypes.object,
  requireLinkText: PropTypes.bool,
  currentPageID: PropTypes.number,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
    },
  };
}

const createInsertLinkModal = (sectionConfigKey, formName) => {
  function mapStateToProps(state, ownProps) {
    const sectionConfig = state.config.sections
      .find((section) => section.name === sectionConfigKey);
    const requireTextFieldUrl = ownProps.requireLinkText ? '?requireLinkText' : '';

    // get the schemaUrl to use as a key for overrides
    const schemaUrl = `${sectionConfig.form[formName].schemaUrl}${requireTextFieldUrl}`
      .replace(/:pageid/, ownProps.currentPageID || 0);

    return {
      sectionConfig,
      schemaUrl,
    };
  }

  return compose(
    connect(mapStateToProps, mapDispatchToProps),
    fileSchemaModalHandler
  )(InsertLinkModal);
};

export { InsertLinkModal, createInsertLinkModal };

export default compose(
  connect(() => ({}), mapDispatchToProps),
  fileSchemaModalHandler
)(InsertLinkModal);
