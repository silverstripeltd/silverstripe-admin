import React, { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n';
import { withUnsavedChangesIndicatorTimer } from './UnsavedChangesIndicatorTimer';

const showComponent = (level) => ['notice', 'warning'].includes(level);

const UnsavedChangesIndicator = ({
  level = 'none',
  elapsedMinutes = 0,
}) => {
  // Use a ref instead of state to track previous level without causing re-renders
  const prevLevelRef = useRef(level);

  const ariaLive = useMemo(() => {
    if (!showComponent(level)) {
      prevLevelRef.current = level;
      return 'off';
    }
    if (level !== prevLevelRef.current) {
      prevLevelRef.current = level;
      return 'polite';
    } else {
      return 'off';
    }
  }, [level, elapsedMinutes]);

  if (!showComponent(level)) {
    return null;
  }
  // String '0' is required for i18n.inject() to work correctly if using a value of 0
  const mins = elapsedMinutes || '0';
  const message = i18n.inject(
    i18n._t('Admin.UNSAVED_CHANGES_FULL', 'Unsaved changes: {mins} mins'),
    { mins }
  );
  const shortMessage = i18n.inject(
    i18n._t('Admin.UNSAVED_CHANGES_SHORT', '{mins} mins'),
    { mins }
  );
  const icon = level === 'warning' ? 'font-icon-attention' : 'font-icon-info-circled';
  const className = `unsaved-changes-indicator unsaved-changes-indicator--${level}`;
  return (
    <div className={className} title={message} role="status" aria-live={ariaLive}>
      <span className={`unsaved-changes-indicator__icon font-icon ${icon}`} aria-hidden="true"/>
      <span className="unsaved-changes-indicator__full">
        {message}
      </span>
      <span className="unsaved-changes-indicator__short" aria-hidden="true">
        {shortMessage}
      </span>
    </div>
  );
};

UnsavedChangesIndicator.propTypes = {
  level: PropTypes.oneOf(['none', 'notice', 'warning']),
  elapsedMinutes: PropTypes.number,
};

export { UnsavedChangesIndicator as Component };

export default withUnsavedChangesIndicatorTimer(UnsavedChangesIndicator);
