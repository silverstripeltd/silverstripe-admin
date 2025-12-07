import React, { memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * List of valid status for a Badge
 * @type {string[]}
 */
export const statuses = [
  'default',
  'info',
  'success',
  'warning',
  'danger',
  'primary',
  'secondary',
];

const Badge = ({
  status = 'default',
  inverted = false,
  className = 'rounded-pill',
  message,
}) => {
  if (!status) {
    return null;
  }

  const colourClass = inverted ? `text-bg-${status}--inverted` : `text-bg-${status}`;

  const compiledClassNames = classnames(
    className,
    'badge',
    `badge-${status}`,
    colourClass,
  );
  return (
    <span className={compiledClassNames}>
      {message}
    </span>
  );
};

Badge.propTypes = {
  message: PropTypes.node,
  status: PropTypes.oneOf(statuses),
  className: PropTypes.string,
  inverted: PropTypes.bool,
};

// Wrapping export in React.memo() because the old class component extended React.PureComponent
export default memo(Badge);
