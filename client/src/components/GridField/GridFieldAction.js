import React from 'react';
import PropTypes from 'prop-types';

const GridFieldAction = ({
  onClick,
  icon,
  record,
}) => {
  const handleClick = (event) => {
    onClick(event, record.ID);
  };

  return (
    <button
      className="grid-field__icon-action btn--icon-lg"
      onClick={handleClick}
    >
      <span className={`font-icon-${icon}`} aria-hidden="true" />
    </button>
  );
};

GridFieldAction.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default GridFieldAction;
