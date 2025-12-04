import React, { memo } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n';
import classNames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';

const cssClass = 'file-status-icon';

/**
 * File status icon (e.g. restricted access) with a tooltip
 */
const FileStatusIcon = ({
  fileID,
  hasRestrictedAccess,
  isTrackedFormUpload,
  placement = 'auto',
  extraClassName,
  disableTooltip = false,
  includeBackground
}) => {
  /**
   * @param {boolean} hasRestrictedAccessParam
   * @returns {Object}
   */
  const buildTrackedFormUpload = (hasRestrictedAccessParam) => {
    const fontIconClass = hasRestrictedAccessParam
      ? 'font-icon-address-card'
      : 'font-icon-address-card-warning';
    const className = classNames('icon', `${cssClass}__icon`, fontIconClass);
    const dataTitle = hasRestrictedAccessParam
      ? i18n._t(
        'SilverStripe\\Admin\\FileStatusIcon.TRACKED_FORM_UPLOAD_RESTRICTED',
        'Form submission'
      )
      : i18n._t(
        'SilverStripe\\Admin\\FileStatusIcon.TRACKED_FORM_UPLOAD_UNRESTRICTED',
        'Form submission, unrestricted access'
      );
    return { className, 'data-title': dataTitle, 'aria-label': dataTitle };
  };

  /**
   * @returns {Object}
   */
  const buildRestrictedFileAttrs = () => {
    const className = classNames('icon', `${cssClass}__icon`, 'font-icon-user-lock');
    const dataTitle = i18n._t(
      'SilverStripe\\Admin\\FileStatusIcon.ACCESS_RESTRICTED',
      'Restricted access'
    );
    return { className, 'data-title': dataTitle, 'aria-label': dataTitle };
  };

  /**
   * @param {string} placementParam
   * @param {string} id
   * @param {string} title
   * @returns {*}
   */
  const renderTooltip = (placementParam, id, title) => (
    <UncontrolledTooltip placement={placementParam} target={id} delay={{ show: 300, hide: 0 }}>
      {title}
    </UncontrolledTooltip>
  );

  if (!isTrackedFormUpload && !hasRestrictedAccess) {
    return '';
  }
  const backgroundClass = includeBackground ? 'file-status-icon--background' : '';
  const className = classNames([cssClass, backgroundClass, extraClassName]);
  const attrs = isTrackedFormUpload
    ? buildTrackedFormUpload(hasRestrictedAccess)
    : buildRestrictedFileAttrs();
  const idType = isTrackedFormUpload ? 'tracked-form-upload' : 'restricted';
  const id = `FileStatusIcon-${idType}-${fileID}`;
  const tooltip = disableTooltip ? '' : renderTooltip(placement, id, attrs['data-title']);
  return (
    <div className={className}>
      <span id={id} {...attrs} />
      {tooltip}
    </div>
  );
};

FileStatusIcon.propTypes = {
  fileID: PropTypes.number,
  hasRestrictedAccess: PropTypes.bool,
  isTrackedFormUpload: PropTypes.bool,
  placement: PropTypes.string,
  disableTooltip: PropTypes.bool,
  extraClassName: PropTypes.string,
  includeBackground: PropTypes.bool
};

// Wrapping export in React.memo() because the old class component extended React.PureComponent
export default memo(FileStatusIcon);
