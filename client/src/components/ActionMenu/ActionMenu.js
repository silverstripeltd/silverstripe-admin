import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import i18n from 'i18n';
import classnames from 'classnames';

const ActionMenu = ({
  className = '',
  dropdownToggleClassNames = [
    'action-menu__toggle',
    'btn',
    'btn--no-text',
    'btn--icon-xl',
  ],
  dropdownToggleProps = {},
  dropdownToggleChildren = <span className="font-icon-dot-3" aria-hidden="true" />,
  dropdownMenuProps = {},
  toggleCallback,
  children,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (event) => {
    if (toggleCallback) {
      toggleCallback(event);
    }
    // Force setting state to the end of the execution queue to clear a potential race condition
    // with entwine click handlers
    window.setTimeout(() => setIsOpen(!isOpen), 0);
  };

  const toggleClassName = classnames(
    dropdownToggleClassNames,
    dropdownToggleProps.className
  );
  const menuClassName = classnames('action-menu__dropdown', dropdownMenuProps.className);
  const toggleText = i18n._t('Admin.ACTIONS', 'View actions');

  return (
    <Dropdown
      className={classnames('action-menu', className)}
      isOpen={isOpen}
      toggle={toggle}
      {...restProps}
    >
      <DropdownToggle className={toggleClassName} title={toggleText} aria-label={toggleText} {...dropdownToggleProps} >
        {dropdownToggleChildren}
      </DropdownToggle>
      <DropdownMenu className={menuClassName} {...dropdownMenuProps}>
        {children}
      </DropdownMenu>
    </Dropdown>
  );
};

ActionMenu.propTypes = {
  toggleCallback: PropTypes.func,
  dropdownToggleClassNames: PropTypes.arrayOf(PropTypes.string),
  dropdownToggleChildren: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
};

// Wrapping export in React.memo() because the old class component extended React.PureComponent
export default memo(ActionMenu);
