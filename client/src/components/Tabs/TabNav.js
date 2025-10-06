import React, { useRef, useCallback } from 'react';
import { Nav } from 'reactstrap';
import PropTypes from 'prop-types';
import Tab from './Tab';

/**
 * Builds the tabset navigation links, will hide the links if there is only one child
 * @param {string} currentTab
 * @param {JSX.Element} children
 * @param {function} onToggle
 * @returns {JSX.Element|null}
 */
function TabNav({ currentTab, children, onToggle }) {
  const tabRefs = useRef([]);
  const setTabRef = useCallback((el, index) => {
    tabRefs.current[index] = el;
  }, []);

  const handleKeyDown = (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      return;
    }
    e.preventDefault();
    const tabCount = React.Children.count(children);
    if (e.key === 'Home') {
      tabRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      tabRefs.current[tabCount - 1]?.focus();
    } else {
      const currentIndex = tabRefs.current.findIndex(el => el === document.activeElement);
      const direction = ['ArrowRight'].includes(e.key) ? 1 : -1;
      const nextIndex = currentIndex + direction;
      let wrappedIndex = nextIndex;
      if (nextIndex < 0) {
        wrappedIndex = tabCount - 1;
      } else if (nextIndex >= tabCount) {
        wrappedIndex = 0;
      }
      tabRefs.current[wrappedIndex]?.focus();
    }
  };

  const tabs = React.Children.map(children, (child, index) => {
    const { props } = child;
    const isActive = currentTab === props.name;
    return <Tab
      {...props}
      onToggle={() => !isActive && onToggle(props.name)}
      active={isActive}
      tabIndex={isActive ? 0 : -1}
      onKeyDown={handleKeyDown}
      setTabRef={setTabRef}
      index={index}
    />;
  });

  return tabs && tabs.length > 1 ? <Nav tabs role="tablist">{tabs}</Nav> : null;
}

TabNav.propTypes = {
  currentTab: PropTypes.string,
  onToggle: PropTypes.func.isRequired
};

export default TabNav;
