import PropTypes from 'prop-types';

export default {
  data: PropTypes.object,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['submit', 'link']),
  url: PropTypes.string,
};
