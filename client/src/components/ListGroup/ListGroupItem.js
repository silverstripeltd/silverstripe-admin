import React from 'react';
import PropTypes from 'prop-types';

const ListGroupItem = ({
  onClick,
  onClickArg,
  className,
  children,
}) => {
  const handleClick = (event) => {
    if (onClick) {
      onClick(event, onClickArg);
    }
  };

  const classNameStr = `list-group-item ${className}`;
  return (
    <a role="button" tabIndex={0} className={classNameStr} onClick={handleClick}>
      {children}
    </a>
  );
};

ListGroupItem.propTypes = {
  onClickArg: PropTypes.any,
  onClick: PropTypes.func,
};

export default ListGroupItem;
