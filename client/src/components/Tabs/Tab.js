import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Render an individual link for the tabset.
 * @param {string} title
 * @param {boolean} disabled
 * @param {boolean} active
 * @param {string} tabClassName
 * @param {function} onToggle
 * @returns {JSX.Element|null}
 * @constructor
 */
function Tab({ title, disabled, active, tabClassName, onToggle, tabIndex, index, onKeyDown, setTabRef }) {
  if (!title) {
    return null;
  }
  const classNames = classnames(tabClassName, { active });

  return (
    <NavItem>
      <NavLink
        onClick={onToggle}
        disabled={disabled}
        className={classNames}
        tabIndex={tabIndex}
        onFocus={onToggle}
        onKeyDown={onKeyDown}
        innerRef={el => setTabRef(el, index)}
      >
        {title}
      </NavLink>
    </NavItem>
  );
}

Tab.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  tabClassName: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  tabIndex: PropTypes.number,
  index: PropTypes.number,
  onKeyDown: PropTypes.func,
  setTabRef: PropTypes.func,
};

Tab.defaultProps = {
  disabled: false,
  active: false,
  tabIndex: 0,
  index: 0,
  onKeyDown: () => {},
  setTabRef: () => {},
};

export default Tab;
