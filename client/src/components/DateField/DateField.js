import fieldHolder from 'components/FieldHolder/FieldHolder';
import momentLib from 'moment';
import modernizr from 'modernizr';
import i18n from 'i18n';
import PropTypes from 'prop-types';
import { getInputProps as getInputFieldProps, render } from '../InputField/InputField';

const localFormat = 'L';

/**
 * Check if this field has native html5 date support
 *
 * @return {Boolean}
 */
const hasNativeSupport = (props) => props.modernizr.inputtypes.date;

/**
 * If this field is to be rendered as a HTML5 date input
 *
 * @return {Boolean }
 */
const asHTML5 = (props, hasNativeSupportFn = hasNativeSupport) => (
  props.data.html5 && hasNativeSupportFn(props)
);

const getLang = (props, hasNativeSupportFn = hasNativeSupport) => {
  const lang = asHTML5(props, hasNativeSupportFn) ? props.isoLang : props.lang;
  return lang || momentLib().locale();
};

const moment = (props, hasNativeSupportFn = hasNativeSupport, ...momentArgs) => {
  momentLib.locale(getLang(props, hasNativeSupportFn));
  return momentLib(...momentArgs);
};

const triggerChange = (props, event, value) => {
  props.onChange(event, { id: props.id, value });
};

const convertToIso = (props, localDate) => {
  let isoDate = '';

  if (localDate) {
    // Input value can be in local format 'L' or ISO format
    const dateObject = moment(props, hasNativeSupport, localDate, [localFormat, 'YYYY-MM-DD']);
    if (dateObject.isValid()) {
      isoDate = dateObject.format('YYYY-MM-DD');
    }
  }

  return isoDate;
};

const convertToLocalised = (props, isoDate) => {
  let localDate = '';
  if (isoDate) {
    const dateObject = moment(props, hasNativeSupport, isoDate);
    if (dateObject.isValid()) {
      localDate = dateObject.format(localFormat);
    }
  }
  return localDate;
};

const getLocalisedValue = (props, convertToLocalisedFn = convertToLocalised) => (
  convertToLocalisedFn(props, props.value)
);

const isMultiline = () => false;

/**
 * Handles changes to the text field's value.
 *
 * @param {Event} event
 */
const handleChange = (
  props,
  event,
  asHTML5Fn = asHTML5,
  convertToIsoFn = convertToIso,
  triggerChangeFn = triggerChange
) => {
  const enteredValue = event.target.value;
  let isoValue = '';

  // When browser support input=date the date value is already in iso format and html5 is enabled
  if (asHTML5Fn(props)) {
    isoValue = enteredValue;
  } else {
    isoValue = convertToIsoFn(props, enteredValue);
  }

  if (typeof props.onChange === 'function') {
    triggerChangeFn(props, event, isoValue);
  }
};

const getInputProps = (props, asHTML5Fn = asHTML5, getLocalisedValueFn = getLocalisedValue) => {
  const resolvedHandleChange = (nextProps, event) => (
    handleChange(nextProps, event, asHTML5Fn, convertToIso, triggerChange)
  );
  const placeholder = i18n.inject(
    i18n._t('Admin.FormatExample', 'Example: {format}'),
    { format: moment(props, hasNativeSupport).endOf('month').format(localFormat) }
  );

  const value = asHTML5Fn(props)
    ? props.value
    : getLocalisedValueFn(props);
  const type = asHTML5Fn(props) ? 'date' : 'text';
  const inputProps = getInputFieldProps(props, resolvedHandleChange);
  return {
    ...inputProps,
    type,
    // `parse()` of redux-form `Field` should be used for parsing the
    // localised input value to iso format to pass to redux store but `Field`
    // is not accessible in this context.
    value,
    placeholder,
  };
};

const DateField = (_props) => {
  const defaultProps = {
    attributes: {},
    className: '',
    data: {},
    extraClass: '',
    modernizr,
    type: 'text',
    value: '',
  };

  const props = {
    ...defaultProps,
    ..._props,
  };

  const inputProps = getInputProps(props);
  return render(props, inputProps);
};

DateField.propTypes = {
  lang: PropTypes.string,
  isoLang: PropTypes.string,
  modernizr: PropTypes.object,
  data: PropTypes.shape({
    html5: PropTypes.bool,
  }),
};

export { DateField as Component };

export default fieldHolder(DateField);

// Exported for use other form fields which can override or reuse this logic
export {
  getInputProps,
  isMultiline,
  hasNativeSupport,
  asHTML5,
  getLang,
  triggerChange,
  convertToLocalised,
  convertToIso,
  moment,
  getLocalisedValue,
  handleChange,
};
