import React from 'react';
import {
  Input,
  InputGroup,
} from 'reactstrap';
import PropTypes from 'prop-types';

import Tip, { tipShape } from 'components/Tip/Tip';

/**
 * Fetches the properties for the input field
 *
 * @returns {object} properties
 */
const getInputProps = (props, handleChangeFn) => {
  const inputProps = {
    className: `${props.className || ''} ${props.extraClass || ''}`,
    id: props.id,
    name: props.name,
    disabled: props.disabled,
    readOnly: props.readOnly,
    value: props.value || '',
    placeholder: props.placeholder,
    autoFocus: props.autoFocus,
    maxLength: props.data && props.data.maxlength,
    type: props.type || null,
    onBlur: props.onBlur,
    onFocus: props.onFocus
  };

  if (props.attributes && !Array.isArray(props.attributes)) {
    Object.assign(inputProps, props.attributes);
  }

  if (!props.readOnly) {
    Object.assign(inputProps, {
      onChange: (event) => handleChangeFn(props, event),
    });
  }

  return inputProps;
};

/**
 * Handles changes to the input field's value.
 *
 * @param {Event} event
 */
const handleChange = (props, event) => {
  if (typeof props.onChange === 'function') {
    if (!event.target) {
      return;
    }
    props.onChange(event, { id: props.id, value: event.target.value });
  }
};

const renderFieldWithTip = (props, inputProps) => {
  const { id, title, tip } = props;

  return (
    <InputGroup>
      <Input {...inputProps} />
      <Tip
        {...tip}
        fieldTitle={title}
        id={`${id}-tip`}
      />
    </InputGroup>
  );
};

const render = (props, inputProps) => {
  if (props.tip) {
    return renderFieldWithTip(props, inputProps);
  }
  return <Input {...inputProps} />;
};

const InputField = (_props) => {
  const defaultProps = {
    attributes: {},
    className: '',
    extraClass: '',
    type: 'text',
    value: '',
  };

  const props = {
    ...defaultProps,
    ..._props,
  };
  const inputProps = getInputProps(props, handleChange);
  return render(props, inputProps);
};

const inputFieldPropTypes = {
  extraClass: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  autoFocus: PropTypes.bool,
  attributes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  tip: PropTypes.shape(tipShape),
  title: PropTypes.string,
};

InputField.propTypes = inputFieldPropTypes;

export { InputField as Component };

export default InputField;

// Exported for use other form fields which can override or reuse this logic
export { getInputProps, handleChange, render };
export { inputFieldPropTypes as propTypes };
