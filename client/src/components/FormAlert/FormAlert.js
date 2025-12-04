import React, { useState } from 'react';
import { Alert } from 'reactstrap';
import castStringToElement from 'lib/castStringToElement';
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * A wrapper for Alert messages in reactstrap.
 * Displays a given message.
 */
const FormAlert = ({
  extraClass = '',
  className = '',
  type,
  value,
  onClosed,
  closeLabel,
  visible,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  /**
   * Determines the style for the alert box to be shown based on messageType or other property
   * by default use "danger".
   *
   * @returns {string} can be the following values "success", "warning", "danger", "info"
   */
  const getMessageStyle = () => {
    // See ValidationResult::TYPE_ constant definitions in PHP.
    switch (type) {
      case 'good':
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      case 'warn':
      case 'warning':
        return 'warning';
      default:
        return 'danger';
    }
  };

  /**
   * Handler for when the message box is dismissed and hidden
   */
  const handleClosed = () => {
    if (typeof onClosed === 'function') {
      onClosed();
    } else {
      setIsVisible(false);
    }
  };

  /**
   * Generate the properties for the FormAlert
   * @returns {object} properties
   */
  const getMessageProps = () => {
    const typeValue = type || 'no-type';

    return {
      className: classnames([
        'message-box',
        `message-box--${typeValue}`,
        className,
        extraClass,
      ]),
      color: getMessageStyle(),
      toggle: (closeLabel) ? handleClosed : null,
      isOpen: (closeLabel) ? isVisible : true,
    };
  };

  if ((typeof visible !== 'boolean' && isVisible) || visible) {
    // needs to be inside a div because the `Alert` component does some magic with props.children
    const body = castStringToElement('div', value);
    if (body) {
      return (
        <Alert {...getMessageProps()}>
          {body}
        </Alert>
      );
    }
  }
  return null;
};

FormAlert.propTypes = {
  extraClass: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.string,
  onClosed: PropTypes.func,
  closeLabel: PropTypes.string,
  visible: PropTypes.bool,
  className: PropTypes.string,
};

export default FormAlert;
