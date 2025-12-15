import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const IframeDialog = ({
  url,
  onClosed,
  isOpen = false,
  title = null,
  modalClassName,
  iframeId,
  iframeClassName,
  className,
  bodyClassName,
}) => {
  const handleClosed = () => {
    if (typeof onClosed === 'function') {
      onClosed();
    }
  };

  const renderHeader = () => {
    if (title) {
      return (
        <ModalHeader toggle={handleClosed}>{title}</ModalHeader>
      );
    }
    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClosed={handleClosed}
      className={classnames('iframe-dialog', className)}
      modalClassName={modalClassName}
    >
      {renderHeader()}
      <ModalBody className={bodyClassName}>
        <iframe
          id={iframeId}
          className={classnames('iframe-dialog__iframe', iframeClassName)}
          src={url}
          frameBorder={0}
        />
      </ModalBody>
    </Modal>
  );
};

IframeDialog.propTypes = {
  url: PropTypes.string.isRequired,
  onClosed: PropTypes.func,
  isOpen: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  modalClassName: PropTypes.string,
  iframeId: PropTypes.string,
  iframeClassName: PropTypes.string,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
};

export default IframeDialog;
