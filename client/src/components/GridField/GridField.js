/* global confirm */
import React, { useEffect } from 'react';
import i18n from 'i18n';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FormConstants from 'components/Form/FormConstants';
import * as actionsImport from 'state/records/RecordsActions';
import castStringToElement from 'lib/castStringToElement';
import PropTypes from 'prop-types';
import GridFieldTable from './GridFieldTable';
import GridFieldHeader from './GridFieldHeader';
import GridFieldHeaderCell from './GridFieldHeaderCell';
import GridFieldRow from './GridFieldRow';
import GridFieldCell from './GridFieldCell';
import GridFieldAction from './GridFieldAction';

const NotYetLoaded = [];

/**
 * The component acts as a container for a grid field,
 * with smarts around data retrieval from external sources.
 */
const GridField = ({
  data,
  records,
  config,
  actions,
}) => {
  useEffect(() => {
    actions.fetchRecords(
      data.recordType,
      data.collectionReadEndpoint.method,
      data.collectionReadEndpoint.url
    );
  }, []);

  /**
   * @param {Event} event
   * @param {number} id
   */
  const editRecord = (event, id) => {
    event.preventDefault();

    if (!data) {
      return;
    }
    if (typeof data.onEditRecord === 'function') {
      data.onEditRecord(event, id);
    }
  };

  /**
   * @param {Event} event
   * @param {number} id
   */
  const deleteRecord = (event, id) => {
    event.preventDefault();
    const headers = {};
    headers[FormConstants.CSRF_HEADER] = config.SecurityID;

    // eslint-disable-next-line no-alert
    if (!confirm(
      i18n._t('CampaignAdmin.DELETECAMPAIGN', 'Are you sure you want to delete this record?')
    )) {
      return;
    }

    actions.deleteRecord(
      data.recordType,
      id,
      data.itemDeleteEndpoint.method,
      data.itemDeleteEndpoint.url,
      headers
    );
  };

  const createRowActions = (record) => (
    <GridFieldCell className="grid-field__cell--actions" key="Actions">
      <GridFieldAction
        icon="cog"
        onClick={editRecord}
        record={record}
      />
      <GridFieldAction
        icon="cancel"
        onClick={deleteRecord}
        record={record}
      />
    </GridFieldCell>
  );

  const createCell = (record, column) => {
    const handleDrillDown = data.onDrillDown;
    const cellProps = {
      className: handleDrillDown ? 'grid-field__cell--drillable' : '',
      onDrillDown: handleDrillDown ? (event) => handleDrillDown(event, record) : null,
      key: `${column.name}`,
      width: column.width,
    };
    const val = column.field.split('.').reduce((a, b) => a[b], record);
    return castStringToElement(GridFieldCell, val, cellProps);
  };

  /**
   * Create a row components for the passed record.
   */
  const createRow = (record) => {
    const rowProps = {
      className: data.onDrillDown ? 'grid-field__row--drillable' : '',
      key: `${record.ID}`,
    };
    const cells = data.columns.map((column) =>
      createCell(record, column)
    );
    const rowActions = createRowActions(record);
    return (
      <GridFieldRow {...rowProps}>
        {cells}
        {rowActions}
      </GridFieldRow>
    );
  };

  if (records === NotYetLoaded) {
    return <div>{ i18n._t('CampaignAdmin.LOADING', 'Loading...') }</div>;
  }

  if (!records.length) {
    return <div>{ i18n._t('CampaignAdmin.NO_RECORDS', 'No campaigns created yet.') }</div>;
  }

  // Placeholder to align the headers correctly with the content
  const actionPlaceholder = <th key="holder" className="grid-field__action-placeholder" />;
  const headerCells = data.columns.map((column) =>
    <GridFieldHeaderCell key={column.name}>{column.name}</GridFieldHeaderCell>
  );
  const header = <GridFieldHeader>{headerCells.concat(actionPlaceholder)}</GridFieldHeader>;
  const rows = records.map((record) =>
    createRow(record)
  );

  return (
    <GridFieldTable header={header} rows={rows} />
  );
};

GridField.propTypes = {
  data: PropTypes.shape({
    recordType: PropTypes.string.isRequired,
    headerColumns: PropTypes.array,
    collectionReadEndpoint: PropTypes.object,
    onDrillDown: PropTypes.func,
    onEditRecord: PropTypes.func,
  }),
};

function mapStateToProps(state, ownProps) {
  const recordType = ownProps.data && ownProps.data.recordType;
  return {
    config: state.config,
    records: (recordType && state.records[recordType]) ? state.records[recordType] : NotYetLoaded,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionsImport, dispatch),
  };
}

export { GridField as Component };

export default connect(mapStateToProps, mapDispatchToProps)(GridField);
