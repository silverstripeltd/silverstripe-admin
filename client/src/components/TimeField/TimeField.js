import fieldHolder from 'components/FieldHolder/FieldHolder';
import moment from 'moment';
import modernizr from 'modernizr';
import i18n from 'i18n';
import PropTypes from 'prop-types';
import {
  asHTML5 as asHTML5DateField,
  getLocalisedValue as getLocalisedValueDateField,
  handleChange as handleDateFieldChange,
} from '../DateField/DateField';
import { getInputProps as getInputFieldProps, render } from '../InputField/InputField';

const localFormat = 'LT';

const hasNativeSupport = (props) => props.modernizr.inputtypes.time;

const asHTML5 = (props) => asHTML5DateField(props, hasNativeSupport);

const convertToLocalised = (props, isoTime) => {
  let localTime = '';
  if (isoTime) {
    const timeObject = moment(isoTime, 'HH:mm:ss');
    if (timeObject.isValid()) {
      localTime = timeObject.format(localFormat);
    }
  }
  return localTime;
};

const convertToIso = (props, localTime) => {
  let isoTime = '';
  if (localTime) {
    const timeObject = moment(localTime, localFormat);
    if (timeObject.isValid()) {
      isoTime = timeObject.format('HH:mm:ss');
    }
  }
  return isoTime;
};

const getLocalisedValue = (props) => getLocalisedValueDateField(props, convertToLocalised);

const handleChange = (props, event) => {
  handleDateFieldChange(props, event, asHTML5, convertToIso);
};

const getInputProps = (props) => {
  const placeholder = i18n.inject(
    i18n._t('Admin.FormatExample', 'Example: {format}'),
    { format: moment().endOf('month').format(localFormat) }
  );
  // Mirror DateField value handling since this component no longer delegates to DateField.getInputProps().
  const value = asHTML5(props)
    ? props.value
    : getLocalisedValue(props);
  const type = asHTML5(props) ? 'time' : 'text';
  const inputProps = getInputFieldProps(props, handleChange);
  return {
    ...inputProps,
    type,
    value,
    placeholder,
  };
};

const TimeField = (_props) => {
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

TimeField.propTypes = {
  lang: PropTypes.string,
  modernizr: PropTypes.object,
  data: PropTypes.shape({
    html5: PropTypes.bool,
  }),
};

export { TimeField as Component };

export default fieldHolder(TimeField);
