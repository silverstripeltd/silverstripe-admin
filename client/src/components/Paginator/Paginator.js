import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n';

function Paginator({
  title = '',
  ...props
}) {
  // Note that props.page is 1-based i.e. the first page is 1, not 0
  const totalPages = Math.ceil(props.totalItems / props.maxItemsPerPage);

  /**
   * Creates an array of <option> elements for the page selection dropdown.
   * Each option represents a page number from 1 to totalPages.
   */
  function createOptions() {
    const options = [];
    for (let page = 1; page <= totalPages; page++) {
      options.push(<option key={page} value={page}>{page}</option>);
    }
    return options;
  }

  /**
   * Handler for whena new page is selected
   */
  function handleChangePage(page) {
    props.onChangePage(page);
  }

  /**
   * Handler for when the user selects a new page from the dropdown.
   */
  function handleSelect(evt) {
    const page = evt.target.value * 1;
    handleChangePage(page);
  }

  /**
   * Handler for when the user clicks the "Previous" button.
   */
  function handlePrev() {
    handleChangePage(props.currentPage - 1);
  }

  /**
   * Handler for when the user clicks the "Next" button.
   */
  function handleNext() {
    handleChangePage(props.currentPage + 1);
  }

  /**
   * Renders the page selection dropdown.
   */
  function renderSelect() {
    const current = props.currentPage;
    const total = totalPages;
    const ariaLabel = i18n.inject(
      i18n._t(
        'Admin.CURRENT_PAGE_CURRENTLY',
        'Current page, currently {current} of {total}'
      ),
      { current, total }
    );
    return <>
      <select
        value={current}
        onChange={(evt) => handleSelect(evt)}
        aria-label={ariaLabel}
      >
        {createOptions()}
      </select> / {totalPages}
    </>;
  }

  /**
   * Renders the "Previous" button.
   */
  function renderPrevButton() {
    if (props.currentPage === 1) {
      return null;
    }
    const label = i18n._t('Admin.PREVIOUS', 'Previous');
    return <button type="button" onClick={() => handlePrev()}>
      <span className="paginator-icon font-icon-angle-left" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </button>;
  }

  /**
   * Renders the "Next" button.
   */
  function renderNextButton() {
    if (props.currentPage === totalPages) {
      return null;
    }
    const label = i18n._t('Admin.NEXT', 'Next');
    return <button type="button" onClick={() => handleNext()}>
      <span className="paginator-icon font-icon-angle-right" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </button>;
  }

  /**
   * Generates the aria-label for the paginator navigation element.
   */
  function getAriaLabel() {
    return title
      ? i18n.inject(
        i18n._t('Admin.PAGINATION_FOR_TITLE', 'Pagination for {title}'),
        { title }
      )
      : i18n._t('Admin.PAGINATION', 'Pagination');
  }

  // Render the paginator
  return <nav aria-label={getAriaLabel()} className="paginator-footer">
    <div>
      <div className="paginator-prev">{renderPrevButton()}</div>
      <div className="paginator-page">{renderSelect()}</div>
      <div className="paginator-next">{renderNextButton()}</div>
    </div>
  </nav>;
}

Paginator.propTypes = {
  totalItems: PropTypes.number.isRequired,
  maxItemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export { Paginator as Component };

export default Paginator;
