import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UnsavedChangesIndicatorTimer = ({
  isDirty = false,
  minutes,
  UnsavedChangesIndicatorComponent,
}) => {
  const [level, setLevel] = useState('none');
  const [startTime, setStartTime] = useState(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const noticeMin = minutes.notice;
  const warningMin = minutes.warning;

  useEffect(() => {
    // Do nothing if there are no minutes configured
    if (!noticeMin && !warningMin) {
      // Return a cleanup function that does nothing
      // This is to ensure consistent return type from useEffect() i.e. a cleanup function is always returned
      return () => {};
    }

    // Reset if pristine
    if (!isDirty) {
      setStartTime(null);
      setLevel('none');
      setElapsedMinutes(0);
      return () => {};
    }

    // Set start time if not set
    // Use a local variable for calculation to avoid waiting for the state update
    let currentStartTime = startTime;
    if (currentStartTime === null) {
      currentStartTime = Date.now();
      setStartTime(currentStartTime);
    }

    // Function to check elapsed time and update state
    const checkTimeSinceDirty = () => {
      const now = Date.now();
      const elapsedMs = now - currentStartTime;
      // Current elapsed minutes rounded down
      const currentMinutes = Math.floor(elapsedMs / 60000);
      // Access prev state here so don't need elapsedMinutes in the useEffect dependency array
      setElapsedMinutes((prevElapsedMinutes) => {
        if (currentMinutes > prevElapsedMinutes) {
          return currentMinutes;
        }
        return prevElapsedMinutes;
      });
      // Set level state
      const warningMs = warningMin ? warningMin * 60000 : null;
      const noticeMs = noticeMin ? noticeMin * 60000 : null;
      if (warningMs && elapsedMs >= warningMs) {
        setLevel('warning');
      } else if (noticeMs && elapsedMs >= noticeMs) {
        setLevel('notice');
      }
    };
    // Start Interval
    const interval = setInterval(checkTimeSinceDirty, 1000);
    // Clear interval on cleanup
    return () => clearInterval(interval);
  }, [isDirty, startTime, noticeMin, warningMin]);

  const componentProps = {
    level,
    elapsedMinutes,
  };
  return <UnsavedChangesIndicatorComponent {...componentProps}/>;
};

UnsavedChangesIndicatorTimer.propTypes = {
  isDirty: PropTypes.bool,
  minutes: PropTypes.shape({
    notice: PropTypes.oneOfType([PropTypes.number]),
    warning: PropTypes.oneOfType([PropTypes.number]),
  }).isRequired,
  UnsavedChangesIndicatorComponent: PropTypes.elementType.isRequired,
};

// Export a HOC that wraps a component with UnsavedChangesIndicatorTimer
const withUnsavedChangesIndicatorTimer = (WrappedComponent) => (props) => (
  <UnsavedChangesIndicatorTimer
    {...props}
    UnsavedChangesIndicatorComponent={WrappedComponent}
  />
);
export { withUnsavedChangesIndicatorTimer };

export default UnsavedChangesIndicatorTimer;
