import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import i18n from 'i18n';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectEditMode, selectPreviewMode, selectSplitMode } from 'state/viewMode/ViewModeActions';
import { VIEW_MODE_STATES } from 'state/viewMode/ViewModeStates';
import classNames from 'classnames';

const ViewModeToggle = ({
  activeState,
  area,
  splitAvailable = true,
  onPreviewSelect,
  onEditSelect,
  onSplitSelect,
  editIconClass = 'font-icon-edit-write',
  previewIconClass = 'font-icon-eye',
  splitIconClass = 'font-icon-columns',
  dropdownToggleProps = {},
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getIconClass = () => {
    switch (activeState) {
      case VIEW_MODE_STATES.EDIT:
        return editIconClass;
      case VIEW_MODE_STATES.PREVIEW:
        return previewIconClass;
      default:
        return splitIconClass;
    }
  };

  const getTitle = () => {
    switch (activeState) {
      case VIEW_MODE_STATES.EDIT:
        return i18n._t('Admin.EDIT_MODE', 'Edit mode');
      case VIEW_MODE_STATES.PREVIEW:
        return i18n._t('Admin.PREVIEW_MODE', 'Preview mode');
      default:
        return i18n._t('Admin.SPLIT_MODE', 'Split mode');
    }
  };

  const toggle = () => {
    // Force setting state to the end of the execution queue to clear a potential race condition
    // with entwine click handlers
    window.setTimeout(() => {
      setDropdownOpen(prevState => !prevState);
    }, 0);
  };

  /**
   * Event handler for the split mode button.
   */
  const handleSplitSelect = () => {
    // notify and update the store
    onSplitSelect();
  };

  /**
   * Event handler for the preview mode button.
   */
  const handlePreviewSelect = () => {
    // notify and update the store
    onPreviewSelect();
  };

  /**
   * Event handler for the edit mode button.
   */
  const handleEditSelect = () => {
    // notify and update the store
    onEditSelect();
  };

  const renderSplitDropdownItem = () => {
    const itemClass = classNames(
      'btn', 'icon-view', 'first',
      {
        'viewmode-toggle__button': true,
        'viewmode-toggle--selected': (activeState === VIEW_MODE_STATES.SPLIT),
        disabled: (!splitAvailable)
      }
    );

    return (
      <DropdownItem
        type="button"
        disabled={!splitAvailable}
        className={itemClass}
        value={VIEW_MODE_STATES.SPLIT}
        onClick={handleSplitSelect}
        id="splitModeButton"
      >
        <span className={splitIconClass} aria-hidden="true" />
        {i18n._t('Admin.SPLIT_MODE', 'Split mode')}
      </DropdownItem>
    );
  };

  const renderEditDropDownItem = () => {
    // Highlight if chosen view mode
    const itemClass = classNames(
      'btn', 'icon-view', 'last', 'viewmode-toggle__button',
      { 'viewmode-toggle--selected': (activeState === VIEW_MODE_STATES.EDIT) }
    );

    return (
      <DropdownItem
        type="button"
        className={itemClass}
        value="content"
        onClick={handleEditSelect}
      >
        <span className={editIconClass} aria-hidden="true" />
        {i18n._t('Admin.EDIT_MODE', 'Edit mode')}
      </DropdownItem>
    );
  };

  const renderPreviewDropDownItem = () => {
    // Highlight if chosen view mode
    const itemClass = classNames(
      'btn', 'icon-view', 'viewmode-toggle__button',
      { 'viewmode-toggle--selected': (activeState === VIEW_MODE_STATES.PREVIEW) }
    );

    return (
      <DropdownItem
        type="button"
        className={itemClass}
        value="preview"
        onClick={handlePreviewSelect}
      >
        <span className={previewIconClass} aria-hidden="true" />
        {i18n._t('Admin.PREVIEW_MODE', 'Preview mode')}
      </DropdownItem>
    );
  };

  // Hide button in CMS content area when preview panel is open
  if (area === VIEW_MODE_STATES.EDIT && activeState === VIEW_MODE_STATES.SPLIT) {
    return null;
  }

  const toggleClassName = classNames(
    'btn',
    'viewmode-toggle__dropdown',
    dropdownToggleProps.classname
  );

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      className="viewmode-toggle"
    >
      <DropdownToggle
        className={toggleClassName}
        caret
        {...dropdownToggleProps}
      >
        <span className={getIconClass()} aria-hidden="true" />
        <span className="viewmode-toggle__chosen-view-title" >{getTitle()}</span>
      </DropdownToggle>
      <DropdownMenu >
        {renderSplitDropdownItem()}
        {renderEditDropDownItem()}
        {renderPreviewDropDownItem()}
        {!splitAvailable &&
        <div className="disabled-tooltip">
          <span className="disabled-tooltip-span">
            {i18n._t('Admin.SCREEN_TOO_SMALL', 'Screen size too small')}
          </span>
        </div>
          }
      </DropdownMenu>
    </Dropdown>
  );
};

ViewModeToggle.propTypes = {
  activeState: PropTypes.oneOf(Object.values(VIEW_MODE_STATES)),
  area: PropTypes.string.isRequired,
  splitAvailable: PropTypes.bool,
  onPreviewSelect: PropTypes.func,
  onEditSelect: PropTypes.func,
  onSplitSelect: PropTypes.func,
  editIconClass: PropTypes.string,
  previewIconClass: PropTypes.string,
  splitIconClass: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    activeState: state.viewMode.activeState,
    splitAvailable: state.viewMode.splitAvailable,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSplitSelect() {
      dispatch(selectSplitMode());
    },
    onEditSelect() {
      dispatch(selectEditMode());
    },
    onPreviewSelect() {
      dispatch(selectPreviewMode());
    },
  };
}

export { ViewModeToggle as Component };
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ViewModeToggle);
