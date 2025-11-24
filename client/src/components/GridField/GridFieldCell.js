import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const GridFieldCell = ({
  className,
  onDrillDown,
  ...props
}) => {
  const handleDrillDown = (event) => {
    if (typeof onDrillDown === 'function') {
      onDrillDown(event);
    }
  };

  const classNames = ['grid-field__cell', className];

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <td
      {...props}
      className={classnames(classNames)}
      onClick={handleDrillDown}
    />
  );
};

GridFieldCell.propTypes = {
  className: PropTypes.string,
  onDrillDown: PropTypes.func,
};

export default GridFieldCell;
