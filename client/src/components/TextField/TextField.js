import fieldHolder from 'components/FieldHolder/FieldHolder';
import {
  getInputProps as getInputFieldProps,
  handleChange as handleChangeInputField,
  render as renderInputField,
  propTypes as inputFieldPropTypes,
} from '../InputField/InputField';

/**
 * Determines whether this text field is a multi-line textarea or not
 *
 * @returns {boolean}
 */
const isMultiline = (props) => props.data && props.data.rows > 1;

/**
 * Fetches the properties for the text field
 *
 * @returns {object} properties
 */
const getInputProps = (props) => {
  const inputProps = getInputFieldProps(props, handleChangeInputField);

  if (isMultiline(props)) {
    Object.assign(inputProps, {
      type: 'textarea',
      rows: props.data.rows,
      cols: props.data.columns,
    });
  }

  return inputProps;
};

const TextField = (_props) => {
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

  const inputProps = getInputProps(props);
  return renderInputField(props, inputProps);
};

TextField.propTypes = inputFieldPropTypes;

export { TextField as Component };

export default fieldHolder(TextField);

// Exported for use other form fields which can override or reuse this logic
export { getInputProps, isMultiline };
