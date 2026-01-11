/* global document */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Wrapper component that fires a handler (`onClickOut`) when a user clicks
 * outside of the component.
 *
 *
 * Example:
 *
 * ```jsx
 *    const TestComponent = (props) => {
 *      const handleClickOut = () => {
 *        alert('User clicked outside of TestComponent.');
 *      }
 *
 *      return (
 *        <Focusedzone onClickOut={handleClickOut}>
 *          <div>... </div>
 *        </Focusedzone>
 *      );
 *    }
 *  ```
 */

const Focusedzone = ({
  children,
  className = '',
  onClickOut,
  passBackContainer = () => {},
}) => {
  const containerRef = useRef(null);
  const wasClicked = useRef(false);

  const handleElementClick = () => {
    wasClicked.current = true;
  };

  const handleDocumentClick = (evt) => {
    if (!wasClicked.current) {
      onClickOut(evt);
    }
    wasClicked.current = false;
  };

  const setRefs = (element) => {
    containerRef.current = element;
    if (typeof passBackContainer === 'function') {
      passBackContainer(element);
    }
  };

  // Add event listeners
  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      // Click event handlers on `el` and `document` will be both
      // triggered when user clicked inside the compoent's DOM.
      // The handler on `el` is triggered before the one on `document` based on event bubbling.
      element.addEventListener('click', handleElementClick);
      document.addEventListener('click', handleDocumentClick);
    }
    // Remove event listeners on unmount / dependency change
    // Not that even if a handler wasn't attached, removing it is safe i.e. browser won't throw error
    return () => {
      if (element) {
        element.removeEventListener('click', handleElementClick);
      }
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [onClickOut]);

  return (
    <div
      className={className}
      ref={setRefs}
    >
      {children}
    </div>
  );
};

Focusedzone.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  onClickOut: PropTypes.func.isRequired,
  passBackContainer: PropTypes.func,
};

export default Focusedzone;
