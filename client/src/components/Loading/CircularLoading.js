import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const CircularLoading = ({
  className,
  size = '6em',
  block = false,
}) => {
  const classNames = classnames('ss-circular-loading-indicator', className, {
    'ss-circular-loading-indicator--block': block,
  });

  return <div style={{ height: size, width: size }} className={classNames} />;
};

CircularLoading.propTypes = {
  className: PropTypes.string,
  block: PropTypes.bool,
  size: PropTypes.string,
};

// Wrapping export in React.memo() because the old class component extended React.PureComponent
export default memo(CircularLoading);
