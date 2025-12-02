/* global document */
import i18n from 'i18n';
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as schemaActions from 'state/schema/SchemaActions';
import { reset, initialize, change } from 'redux-form';
import { isDirty } from 'redux-form/lib/immutable';
import getIn from 'redux-form/lib/structure/plain/getIn';
import getFormState from 'lib/getFormState';
import PropTypes from 'prop-types';
import Focusedzone from '../Focusedzone/Focusedzone';
import SearchBox from './SearchBox';
import SearchForm from './SearchForm';
import SearchToggle from './SearchToggle';
import mapFormSchemaToTags from './utilities/mapFormSchemaToTags';

const DISPLAY = {
  NONE: 'NONE',
  VISIBLE: 'VISIBLE',
  EXPANDED: 'EXPANDED',
};
const BEHAVIOR = {
  NONE: 'NONE',
  HIDEABLE: 'HIDEABLE',
  TOGGLABLE: 'TOGGLABLE'
};

/**
 * @param {Object} filters
 * @returns {boolean}
 */
function hasFilters(filters) {
  return (filters && Object.keys(filters).length > 0);
}

/**
 * Displays a search component that can be use to retrieve a search term and
 * display an advanced search form.
 */
const Search = (_props) => {
  const {
    onSearch,
    onHide,
    id,
    display = DISPLAY.VISIBLE,
    formSchemaUrl,
    filters = {},
    formData = {},
    placeholder = i18n._t('Admin.SEARCH', 'Search'),
    displayBehavior = BEHAVIOR.NONE,
    term = '',
    name = 'searchTerm',
    filterPrefix = '',
    forceFilters = false,
    formIsDirty,
    identifier = 'Admin.SearchForm',
    schemaName,
    tagData,
    actions,
    // This prop is unused in this component, but has a default value and is passed into SearchBox
    addFilterPrefix = false,
  } = _props;

  const props = {
    ..._props,
    // Use either the value passed into the component, or the default value
    display,
    filters,
    formData,
    placeholder,
    displayBehavior,
    term,
    name,
    filterPrefix,
    forceFilters,
    identifier,
    addFilterPrefix
  };

  const nodeRef = useRef(null);

  const termInit = term
    || (filters && filters[`${filterPrefix}${name}`])
    || '';

  const [displayState, setDisplayState] = useState(display);
  const [searchText, setSearchText] = useState(termInit);
  const [initialSearchText, setInitialSearchText] = useState(termInit);
  const [forceLoadForm, setForceLoadForm] = useState(false);

  /**
   * Populate search form with search in case a pre-existing search has been queried
   *
   * @param {Object} propsArg
   */
  const setOverrides = (propsArg) => {
    if (propsArg && (
      !hasFilters(propsArg.filters) || formSchemaUrl !== propsArg.formSchemaUrl
    )) {
      // clear any overrides that may be in place
      const schemaUrl = (propsArg && propsArg.formSchemaUrl) || formSchemaUrl;
      if (schemaUrl) {
        actions.schema.setSchemaStateOverrides(schemaUrl, null);
      }
    }

    if (propsArg && (hasFilters(propsArg.filters) && propsArg.formSchemaUrl)) {
      const filtersArg = propsArg.filters || {};
      const overrides = {
        fields: Object
          .keys(filtersArg)
          .map((mapName) => {
            const value = filtersArg[mapName];
            return { name: mapName, value };
          }),
      };

      // set overrides into redux store, so that it can be accessed by FormBuilder with the same
      // schemaUrl.
      actions.schema.setSchemaStateOverrides(propsArg.formSchemaUrl, overrides);
    }
  };

  /**
   * Get the search criteria compiled into an object.
   * @returns {Object}
   */
  const getData = (ignoreSearchTerm = false) => {
    const data = {};

    // Filter empty values
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value) {
        data[key] = value;
        // For has_one relations an autoscaffoled SearchableDropdownField will be used that itself
        // uses a react-select field which uses objects as values. We need to extract the value
        if (key.substring(key.length - 2) === 'ID'
            && typeof value === 'object'
            && value.hasOwnProperty('value')
        ) {
          data[key] = value.value;
        }
      }
    });

    // Merge data from redux-forms with text field
    if (
      !ignoreSearchTerm
      && searchText
      && typeof formData[`${filterPrefix}${name}`] === 'undefined'
    ) {
      data[`${filterPrefix}${name}`] = searchText.trim();
    }

    return data;
  };

  /**
   * Update the state search term form an input field change event.
   * @param {Object} event onChangeEvent from a input field.
   */
  const handleChange = (event) => {
    const value = event.target.value;
    if (searchText !== value) {
      setSearchText(value);
    }

    if (typeof formData[`${filterPrefix}${name}`] !== 'undefined') {
      actions.reduxForm.change(schemaName, `${filterPrefix}${name}`, value);
    }
  };

  /**
   * Try to find the input field and focus on it.
   */
  const focusInput = () => {
    if (displayState === DISPLAY.NONE) {
      return;
    }

    const node = nodeRef.current.container;
    if (!node) {
      return;
    }

    const input = node.querySelector('.search-box__content-field');
    // check that it doesn't already have focus
    if (input !== document.activeElement) {
      input.focus();
      if (input.select) {
        input.select();
      }
    }
  };

  /**
   * Try to find the first form field in the advanced form and focus on it.
   */
  const focusFirstFormField = (filter = 'input:not([type=hidden]), textarea, select, button') => {
    if (displayState !== DISPLAY.EXPANDED) {
      return;
    }

    const node = nodeRef.current.container;
    if (!node) {
      return;
    }

    const form = node.querySelector('.search-form');
    if (!form) {
      return;
    }

    const input = form.querySelector(filter);

    if (input) {
      input.focus();
      if (input.select) {
        input.select();
      }
    }
  };

  /**
   * Clear the search term and any advanced search form data.
   * @param {Object} propsArg
   */
  const clearFormData = (propsArg) => {
    if (searchText !== '') {
      setSearchText('');
    }

    const formSchemaUrlArg = (propsArg && propsArg.formSchemaUrl) || formSchemaUrl;
    if (formSchemaUrlArg) {
      const identifierArg = (propsArg && propsArg.identifier) || identifier;
      actions.schema.setSchemaStateOverrides(formSchemaUrlArg, { fields: [] });
      actions.reduxForm.reset(identifierArg);
    }
  };

  /**
   * Wrap up all the data into an object and call the onSearch method provided via the props.
   * @param {Object} overrides Data to overrides over our existing form data.
   */
  const doSearch = (overrides = {}) => {
    // Data to send to the remote service
    const searchData = {};
    const fieldData = getData();
    Object.entries(fieldData).forEach(([key, value]) => {
      // Strip any prefix from the key
      let newKey = key;
      let newValue = value;
      if (overrides.hasOwnProperty(key)) {
        newValue = overrides[key];
      }
      if (filterPrefix.length > 0 && key.startsWith(filterPrefix)) {
        newKey = key.substring(filterPrefix.length);
      }
      // Avoid adding prefixed and unprefixed keys, preferring the prefixed
      if (
        !filterPrefix.length > 0
        || key !== name
        || typeof fieldData[`${filterPrefix}${name}`] === 'undefined'
      ) {
        searchData[newKey] = newValue;
      }
    });
    const searchTextData = searchData[name] || '';
    if (
      displayState !== DISPLAY.VISIBLE ||
      initialSearchText !== searchTextData ||
      searchText !== searchTextData
    ) {
      setDisplayState(DISPLAY.VISIBLE);
      setInitialSearchText(searchTextData);
      setSearchText(searchTextData);
    }
    onSearch(searchData);
  };

  /**
   * Clear a search filter and execute a new search
   * @param {string} key Search filter name to clear
   */
  const clearFormFilter = (key) => {
    const tagItem = tagData[key];
    const clearables = { [key]: undefined };

    actions.reduxForm.change(schemaName, key, '');
    setOverrides({
      ...props,
      filters: {
        ...filters,
        [key]: undefined
      }
    });

    if (Array.isArray(tagItem.linkedFields)) {
      tagItem.linkedFields.forEach(linkFieldkey => { clearables[linkFieldkey] = undefined; });
    }
    doSearch(clearables);
  };

  /**
   * Expand fully form
   */
  const expand = () => {
    if (displayState !== DISPLAY.EXPANDED) {
      setDisplayState(DISPLAY.EXPANDED);
    }
  };

  /**
   * Focus on the requested search filter name.
   * @param {string} key Search filter name.
   */
  const focusFormFilter = (key) => {
    const tagItem = tagData[key];
    const selector = tagItem.focusSelector || `[name=${key}]`;
    expand();
    setTimeout(() => focusFirstFormField(selector), 50);
  };

  /**
   * Clear the Search component and focus on the main input field.
   */
  const clearSearchBox = () => {
    clearFormData();
    focusInput();
  };

  /**
   * Hide this field. When clicking the "X" button. If an `onHide` method has
   * been provided it will be called and the global state will have to update
   * the display props. Otherwise, the internal state will be updated instead.
   */
  const hide = () => {
    clearSearchBox();
    if (onHide) {
      onHide();
    } else if (displayState !== DISPLAY.NONE) {
      setDisplayState(DISPLAY.NONE);
    }
  };

  /**
   * Show this field when the Search Toggle is click.
   */
  const show = () => {
    setForceLoadForm(true);
    if (displayState !== DISPLAY.VISIBLE) {
      setDisplayState(DISPLAY.VISIBLE);
    }
    if (typeof formData[name] !== 'undefined') {
      actions.reduxForm.change(schemaName, name, searchText);
    }
  };

  const onClickOut = (evt) => {
    // This is a fairly rudimentory way to detect if the user clicked on an entirely different
    // DOM element, which probably uses jQuery
    // It's important that we only call show() when a relevent element is clicked, otherwise we'll
    // end up making lots of unnecessary AJAX requests to the form schema endpoint
    const buttonEl = evt.target;
    const $componentEl = window.jQuery(nodeRef.current.container);
    const filterButtonClicked = buttonEl.matches('#filters-button, .font-icon-search, .filter-open');
    // The visibility check is needed to avoid loading the form for hidden tabs (e.g. in ModelAdmin)
    if (filterButtonClicked && $componentEl.is(':visible')) {
      const buttonGridField = window.jQuery(buttonEl).closest('.grid-field');
      const componentGridField = $componentEl.closest('.grid-field');
      if (buttonGridField.length > 0 && componentGridField.length > 0) {
        // Only show the form for the relevant GridField
        if (buttonGridField[0] === componentGridField[0]) {
          show();
        }
      } else {
        // This is not a GridField, e.g. for CMSMain
        show();
      }
    }
  };

  /**
   * When toggling the advanced button
   */
  const toggle = () => {
    switch (displayState) {
      case DISPLAY.VISIBLE:
        expand();
        setTimeout(focusFirstFormField, 50);
        break;
      case DISPLAY.EXPANDED:
        show();
        break;
      default:
        // noop
    }
  };

  /**
   * Determine if the search term has changed since the last search.
   * @returns {boolean}
   */
  const searchTermIsDirty = () => searchText.trim() !== initialSearchText.trim();

  /**
   * Clear the Search component and focus on the first filter field.
   */
  const clearFilters = () => {
    clearFormData();
    focusFirstFormField();
  };

  /**
   * Take the provided tagData and format in way that will make sense for TagList.
   * @returns {Object[]}
   */
  const formatTagData = () => {
    const tagDataCopy = Object.assign({}, tagData);
    const nameKey = `${filterPrefix}${name}`;

    // Remove any tag matching the name of our form field.
    if (tagDataCopy && tagDataCopy[nameKey]) {
      delete tagDataCopy[nameKey];
    }

    // Convert the tag data to a plain array and remove un-needed attributes.
    return tagDataCopy ?
      Object.values(tagDataCopy).map(({ key, label, value }) => ({ key, label, value })) :
      [];
  };

  // If the box is not to be displayed
  if (displayState === DISPLAY.NONE) {
    if (displayBehavior === BEHAVIOR.TOGGLABLE) {
      return (<SearchToggle onToggle={show} />);
    }
    return (<div />);
  }

  useEffect(() => {
    // Set overrides on mount
    setOverrides(props);
    // Clear overrides on unmount
    return () => setOverrides();
  }, []);

  // Display the SearchBox
  const formId = `${id}_ExtraFields`;

  // Build classes
  const expanded = displayState === DISPLAY.EXPANDED;

  // Decide if we display the X button
  const hideable =
    [BEHAVIOR.HIDEABLE, BEHAVIOR.TOGGLABLE].includes(displayBehavior);

  const dirty = formIsDirty || searchTermIsDirty();
  const data = getData();
  const clearable = (Object.keys(data).length > 0);

  return (
    <Focusedzone onClickOut={onClickOut} className="search" ref={nodeRef}>
      <SearchBox
        {...props}
        name={`SearchBox__${name}`}
        onChange={handleChange}
        onSearch={doSearch}
        onToggleFilter={toggle}
        onHideFilter={show}
        onHide={hide}
        onClear={clearSearchBox}
        searchText={searchText}
        hideable={hideable}
        expanded={expanded}
        id={`${id}_searchbox`}
        showFilters={Boolean(forceFilters || formSchemaUrl)}
        dirty={dirty}
        clearable={clearable}
        onTagDelete={clearFormFilter}
        onTagClick={focusFormFilter}
        tagData={formatTagData()}
      >
        <SearchForm
          id={formId}
          identifier={identifier}
          expanded={expanded}
          forceLoadForm={forceLoadForm}
          formSchemaUrl={formSchemaUrl}
          onSearch={doSearch}
          onClear={clearFilters}
          clearable={clearable}
        />
      </SearchBox>
    </Focusedzone>
  );
};

Search.propTypes = {
  onSearch: PropTypes.func,
  onHide: PropTypes.func,

  id: PropTypes.string.isRequired,
  display: PropTypes.oneOf(Object.values(DISPLAY)),
  formSchemaUrl: PropTypes.string,
  filters: PropTypes.object,
  addFilterPrefix: PropTypes.bool,
  formData: PropTypes.object,
  placeholder: PropTypes.string,
  displayBehavior: PropTypes.oneOf(Object.values(BEHAVIOR)),
  term: PropTypes.string,
  name: PropTypes.string,
  filterPrefix: PropTypes.string,
  forceFilters: PropTypes.bool,
  formIsDirty: PropTypes.bool,
  identifier: PropTypes.string,
  schemaName: PropTypes.string,
  tagHandlers: PropTypes.object,
  borders: PropTypes.shape({
    top: PropTypes.bool,
    right: PropTypes.bool,
    bottom: PropTypes.bool,
    left: PropTypes.bool,
  })
};

function mapStateToProps(state, ownProps) {
  let filters = ownProps.filters;
  // Add filter prefix if needed.
  if (ownProps.addFilterPrefix && ownProps.filterPrefix && hasFilters(ownProps.filters)) {
    filters = Object.fromEntries(
      Object.entries(ownProps.filters).map(
        ([key, value]) => [`${ownProps.filterPrefix}${key}`, value]
      )
    );
  }

  const schema = state.form.formSchemas[ownProps.formSchemaUrl];
  if (!schema || !schema.name) {
    return { formData: {} };
  }

  const schemaName = schema.name;

  const form = getIn(getFormState(state), schemaName);

  const formData = (form && form.values) || {};
  const tagData = mapFormSchemaToTags(schema, filters, ownProps.tagHandlers || {});
  const formIsDirty = isDirty(schemaName, getFormState)(state);

  return { filters, formData, formIsDirty, schemaName, tagData };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
      reduxForm: bindActionCreators({ reset, initialize, change }, dispatch),
    },
  };
}

export { Search as Component, hasFilters };

export default connect(mapStateToProps, mapDispatchToProps)(Search);
