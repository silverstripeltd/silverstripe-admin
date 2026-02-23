import fieldHolder from 'components/FieldHolder/FieldHolder';
import {
  getInputProps as getInputFieldProps,
  handleChange as handleChangeInputField,
  render as renderInputField,
  propTypes as inputFieldPropTypes,
} from '../InputField/InputField';

/**
 * Fetches the properties for the number field
 *
 * @returns {object} properties
 */
const getInputProps = (props) => {
  const inputProps = getInputFieldProps(props, handleChangeInputField);
  Object.assign(inputProps, {
    type: 'number',
  });
  return inputProps;
};

const NumberField = (_props) => {
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

NumberField.propTypes = inputFieldPropTypes;

export { NumberField as Component };

export default fieldHolder(NumberField);
