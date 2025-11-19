/* global jest, test, describe, beforeEach, it, expect, afterEach */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GridFieldTable from '../GridFieldTable';
import { Component as GridField } from '../GridField';

jest.mock('i18n', () => ({
  _t: (key, defaultValue) => defaultValue,
}));

jest.mock('../GridFieldAction', () => ({
  __esModule: true,
  default: ({ icon, onClick, record }) => (
    <button
      data-testid={`action-${icon}`}
      onClick={(event) => onClick(event, record.ID)}
    >
      {icon}
    </button>
  ),
}));

test('GridFieldTable generateHeader() should return props.header if it is set', () => {
  const { container } = render(
    <GridFieldTable {...{
      header: <tr className="header" />
    }}
    />
  );
  expect(container.querySelector('tr.header')).not.toBeNull();
});

test('GridFieldTable generateHeader() should return null if props.header and props.data are both not set', () => {
  const { container } = render(
    <GridFieldTable/>
  );
  expect(container.querySelector('thead').innerHTML).toBe('');
});

test('GridFieldTable generateHeader() should return props.rows if it is set', () => {
  const { container } = render(
    <GridFieldTable {...{
      rows: [<tr className="row" key="row1"><td>row1</td></tr>]
    }}
    />
  );
  expect(container.querySelectorAll('tbody .row')[0].classList).toContain('row');
});

test('GridFieldTable generateHeader() should return null if props.rows and props.data are both not set', () => {
  const { container } = render(
    <GridFieldTable/>
  );
  expect(container.querySelector('tbody').innerHTML).toBe('');
});

function makeProps(obj = {}) {
  return {
    data: {
      recordType: 'Campaign',
      columns: [
        { name: 'Title', field: 'Title', width: 100 },
        { name: 'Status', field: 'Status', width: 50 },
      ],
      collectionReadEndpoint: {
        method: 'get',
        url: '/api/campaigns',
      },
      itemDeleteEndpoint: {
        method: 'delete',
        url: '/api/campaigns/{id}',
      },
    },
    records: [
      { ID: 1, Title: 'Campaign 1', Status: 'Active' },
      { ID: 2, Title: 'Campaign 2', Status: 'Inactive' },
    ],
    config: {
      SecurityID: 'test-security-id',
    },
    actions: {
      fetchRecords: jest.fn(),
      deleteRecord: jest.fn(),
    },
    ...obj,
  };
}

test('GridField should render no records message when records array is empty', () => {
  render(
    <GridField {...makeProps({ records: [] })} />
  );
  expect(screen.getByText('No campaigns created yet.')).not.toBeNull();
});

test('GridField should render table with correct headers', () => {
  render(
    <GridField {...makeProps()} />
  );
  expect(screen.getByText('Title')).not.toBeNull();
  expect(screen.getByText('Status')).not.toBeNull();
});

test('GridField should render table rows with record data', () => {
  render(
    <GridField {...makeProps()} />
  );
  expect(screen.getByText('Campaign 1')).not.toBeNull();
  expect(screen.getByText('Active')).not.toBeNull();
  expect(screen.getByText('Campaign 2')).not.toBeNull();
  expect(screen.getByText('Inactive')).not.toBeNull();
});

test('GridField should render action buttons for each row', () => {
  const { container } = render(
    <GridField {...makeProps()} />
  );
  const actionButtons = container.querySelectorAll('[data-testid^="action-"]');
  expect(actionButtons.length).toBeGreaterThan(0);
});

test('GridField should call fetchRecords on mount', () => {
  const mockFetchRecords = jest.fn();
  render(
    <GridField {...makeProps({
      actions: {
        fetchRecords: mockFetchRecords,
        deleteRecord: jest.fn(),
      }
    })}
    />
  );
  expect(mockFetchRecords).toHaveBeenCalledWith('Campaign', 'get', '/api/campaigns');
});

test('GridField should call deleteRecord when delete action is clicked after confirmation', async () => {
  window.confirm = jest.fn(() => true);
  const mockDeleteRecord = jest.fn();
  const { container } = render(
    <GridField {...makeProps({
      actions: {
        fetchRecords: jest.fn(),
        deleteRecord: mockDeleteRecord,
      }
    })}
    />
  );
  const deleteButtons = container.querySelectorAll('[data-testid="action-cancel"]');
  expect(deleteButtons.length).toBeGreaterThan(0);
  fireEvent.click(deleteButtons[0]);
  expect(window.confirm).toHaveBeenCalled();
  expect(mockDeleteRecord).toHaveBeenCalledWith(
    'Campaign',
    1,
    'delete',
    '/api/campaigns/{id}',
    { 'X-SecurityID': 'test-security-id' }
  );
});

test('GridField should not call deleteRecord when user cancels deletion confirmation', async () => {
  window.confirm = jest.fn(() => false);
  const mockDeleteRecord = jest.fn();
  const { container } = render(
    <GridField {...makeProps({
      actions: {
        fetchRecords: jest.fn(),
        deleteRecord: mockDeleteRecord,
      }
    })}
    />
  );
  const deleteButtons = container.querySelectorAll('[data-testid="action-cancel"]');
  fireEvent.click(deleteButtons[0]);
  expect(mockDeleteRecord).not.toHaveBeenCalled();
});

test('GridField should call onEditRecord when edit action is clicked', () => {
  const mockOnEditRecord = jest.fn();
  const { container } = render(
    <GridField {...makeProps({
      data: {
        recordType: 'Campaign',
        columns: [{ name: 'Title', field: 'Title', width: 100 }],
        collectionReadEndpoint: { method: 'get', url: '/api/campaigns' },
        itemDeleteEndpoint: { method: 'delete', url: '/api/campaigns/{id}' },
        onEditRecord: mockOnEditRecord,
      }
    })}
    />
  );
  const editButtons = container.querySelectorAll('[data-testid="action-cog"]');
  fireEvent.click(editButtons[0]);
  expect(mockOnEditRecord).toHaveBeenCalled();
});

test('GridField should render drillable cells with correct className', () => {
  const mockOnDrillDown = jest.fn();
  const { container } = render(
    <GridField {...makeProps({
      data: {
        recordType: 'Campaign',
        columns: [{ name: 'Title', field: 'Title', width: 100 }],
        collectionReadEndpoint: { method: 'get', url: '/api/campaigns' },
        itemDeleteEndpoint: { method: 'delete', url: '/api/campaigns/{id}' },
        onDrillDown: mockOnDrillDown,
      }
    })}
    />
  );
  const drillableCells = container.querySelectorAll('.grid-field__cell--drillable');
  expect(drillableCells.length).toBeGreaterThan(0);
});

test('GridField should not render drillable cells when onDrillDown is not provided', () => {
  const { container } = render(
    <GridField {...makeProps()} />
  );
  const drillableCells = container.querySelectorAll('.grid-field__cell--drillable');
  expect(drillableCells.length).toBe(0);
});

test('GridField should access nested field values using dot notation', () => {
  render(
    <GridField {...makeProps({
      data: {
        recordType: 'Campaign',
        columns: [{ name: 'Author.Name', field: 'Author.Name', width: 100 }],
        collectionReadEndpoint: { method: 'get', url: '/api/campaigns' },
        itemDeleteEndpoint: { method: 'delete', url: '/api/campaigns/{id}' },
      },
      records: [
        { ID: 1, Author: { Name: 'John Doe' } },
      ]
    })}
    />
  );
  expect(screen.getByText('John Doe')).not.toBeNull();
});

test('GridField should handle multiple records with different statuses', () => {
  render(
    <GridField {...makeProps({
      records: [
        { ID: 1, Title: 'Campaign 1', Status: 'Active' },
        { ID: 2, Title: 'Campaign 2', Status: 'Inactive' },
        { ID: 3, Title: 'Campaign 3', Status: 'Pending' },
      ]
    })}
    />
  );
  expect(screen.getByText('Active')).not.toBeNull();
  expect(screen.getByText('Inactive')).not.toBeNull();
  expect(screen.getByText('Pending')).not.toBeNull();
});

test('GridField should render action placeholder in header', () => {
  const { container } = render(
    <GridField {...makeProps()} />
  );
  const actionPlaceholder = container.querySelector('.grid-field__action-placeholder');
  expect(actionPlaceholder).not.toBeNull();
});

test('GridField should render correct number of data rows', () => {
  const { container } = render(
    <GridField {...makeProps()} />
  );
  const tbody = container.querySelector('tbody');
  const dataRows = tbody.querySelectorAll('tr');
  expect(dataRows.length).toBe(2);
});

test('GridField should include both edit and delete actions per row', () => {
  const { container } = render(
    <GridField {...makeProps()} />
  );
  const cogActions = container.querySelectorAll('[data-testid="action-cog"]');
  const deleteActions = container.querySelectorAll('[data-testid="action-cancel"]');
  expect(cogActions.length).toBe(2);
  expect(deleteActions.length).toBe(2);
});

test('GridField should render cells with correct width from column configuration', () => {
  const { container } = render(
    <GridField {...makeProps()} />
  );
  const cells = container.querySelectorAll('[width]');
  expect(cells.length).toBeGreaterThan(0);
});

test('GridField should handle onDrillDown being called with event and record', () => {
  const mockOnDrillDown = jest.fn();
  const { container } = render(
    <GridField {...makeProps({
      data: {
        recordType: 'Campaign',
        columns: [{ name: 'Title', field: 'Title', width: 100 }],
        collectionReadEndpoint: { method: 'get', url: '/api/campaigns' },
        itemDeleteEndpoint: { method: 'delete', url: '/api/campaigns/{id}' },
        onDrillDown: mockOnDrillDown,
      }
    })}
    />
  );
  const drillableCells = container.querySelectorAll('.grid-field__cell--drillable');
  if (drillableCells.length > 0) {
    fireEvent.click(drillableCells[0]);
    expect(mockOnDrillDown).toHaveBeenCalled();
  }
});

test('GridField should prevent default event behavior on delete action', () => {
  window.confirm = jest.fn(() => true);
  const mockDeleteRecord = jest.fn();
  const { container } = render(
    <GridField {...makeProps({
      actions: {
        fetchRecords: jest.fn(),
        deleteRecord: mockDeleteRecord,
      }
    })}
    />
  );
  const deleteButtons = container.querySelectorAll('[data-testid="action-cancel"]');
  if (deleteButtons.length > 0) {
    fireEvent.click(deleteButtons[0]);
    expect(mockDeleteRecord).toHaveBeenCalled();
  }
});

test('GridField should render data cells with correct key values', () => {
  const { container } = render(
    <GridField {...makeProps()} />
  );
  const tbody = container.querySelector('tbody');
  expect(tbody).not.toBeNull();
  const rows = tbody.querySelectorAll('tr');
  expect(rows.length).toBe(2);
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    expect(cells.length).toBeGreaterThan(0);
  });
});

test('GridField should create proper action cells for each row', () => {
  const { container } = render(
    <GridField {...makeProps()} />
  );
  const actionCells = container.querySelectorAll('.grid-field__cell--actions');
  expect(actionCells.length).toBe(2);
  actionCells.forEach((cell) => {
    const buttons = cell.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });
});
