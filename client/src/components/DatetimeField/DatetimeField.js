import fieldHolder from 'components/FieldHolder/FieldHolder';
import moment from 'moment';
import modernizr from 'modernizr';
import i18n from 'i18n';
import {
  Component as DateField,
  asHTML5 as asHTML5DateField,
  getLocalisedValue as getLocalisedValueDateField,
  handleChange as handleDateFieldChange,
  moment as momentDateField,
} from '../DateField/DateField';
import { getInputProps as getInputFieldProps, render } from '../InputField/InputField';

const localFormat = 'L LT';
const dateOnlyLocalFormat = 'L';

const hasNativeSupport = (props) => props.modernizr.inputtypes['datetime-local'];

const asHTML5 = (props) => asHTML5DateField(props, hasNativeSupport);

const triggerChange = (props, event, value) => {
  // html5 `datetime-local` input doesn't retain second digits if they're
  // `00` but that will failed the back-end validation. So add `:00` to the
  // value if they're missing.
  if (/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value)) {
    props.onChange(event, { id: props.id, value: `${value}:00` });
  } else {
    props.onChange(event, { id: props.id, value });
  }
};

const convertToLocalised = (props, isoTime) => {
  moment.locale(props.lang);
  let localTime = '';
  if (isoTime) {
    const timeObject = momentDateField(props, hasNativeSupport, isoTime);
    if (timeObject.isValid()) {
      localTime = timeObject.format(localFormat);
    }
  }
  return localTime;
};

const convertToIso = (props, localTime) => {
  moment.locale(props.lang);
  let isoTime = '';
  if (localTime) {
    // Input value can be in local format 'L', 'L LT' or ISO format
    const formats = [localFormat, dateOnlyLocalFormat, moment.ISO_8601];
    const timeObject = momentDateField(props, hasNativeSupport, localTime, formats);
    if (timeObject.isValid()) {
      isoTime = timeObject.format('YYYY-MM-DDTHH:mm:ss');
    }
  }
  return isoTime;
};

const getLocalisedValue = (props) => getLocalisedValueDateField(props, convertToLocalised);

const handleChange = (props, event) => {
  handleDateFieldChange(props, event, asHTML5, convertToIso, triggerChange);
};

const getInputProps = (props) => {
  const placeholder = i18n.inject(
    i18n._t('Admin.FormatExample', 'Example: {format}'),
    { format: momentDateField(props, hasNativeSupport).endOf('month').format(localFormat) }
  );
  // Mirror DateField value handling since this component no longer delegates to DateField.getInputProps().
  const value = asHTML5(props)
    ? props.value
    : getLocalisedValue(props);
  const type = asHTML5(props) ? 'datetime-local' : 'text';
  const inputProps = getInputFieldProps(props, handleChange);
  return {
    ...inputProps,
    type,
    value,
    placeholder,
  };
};

const DatetimeField = (_props) => {
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

DatetimeField.propTypes = DateField.propTypes;

export { DatetimeField as Component };

export default fieldHolder(DatetimeField);
