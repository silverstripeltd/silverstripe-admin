import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const MobileMenuToggle = ({
  isOpen,
  onClick,
  controls = '',
}) => {
  const handleClick = (e) => {
    e.preventDefault();

    if (typeof onClick === 'function') {
      onClick(e);
    }
  };

  const classes = classnames({
    'cms-mobile-menu-toggle': true,
    'cms-mobile-menu-toggle--open': isOpen,
  });

  return (
    <button
      type="button"
      className={classes}
      href="#toggle-mobile-menu"
      onClick={handleClick}
      aria-controls={controls}
      aria-expanded={Boolean(isOpen)}
    >
      <span />
      <span />
      <span />
      <span />
    </button>
  );
};

MobileMenuToggle.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  controls: PropTypes.string,
};

export default MobileMenuToggle;
