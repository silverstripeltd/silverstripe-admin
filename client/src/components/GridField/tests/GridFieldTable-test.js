/* global jest, test, expect */

import React from 'react';
import { render } from '@testing-library/react';
import GridFieldTable from '../GridFieldTable';

function makeProps(obj = {}) {
  return {
    ...obj,
  };
}

test('GridFieldTable renders a div with grid-field class', () => {
  const { container } = render(<GridFieldTable {...makeProps()} />);
  const gridField = container.querySelector('.grid-field');
  expect(gridField).not.toBeNull();
  expect(gridField.tagName).toBe('DIV');
});

test('GridFieldTable renders a table element with correct classes', () => {
  const { container } = render(<GridFieldTable {...makeProps()} />);
  const table = container.querySelector('table');
  expect(table).not.toBeNull();
  expect(table.classList.contains('table')).toBe(true);
  expect(table.classList.contains('table-hover')).toBe(true);
  expect(table.classList.contains('grid-field__table')).toBe(true);
});

test('GridFieldTable renders thead and tbody elements', () => {
  const { container } = render(<GridFieldTable {...makeProps()} />);
  const thead = container.querySelector('thead');
  const tbody = container.querySelector('tbody');
  expect(thead).not.toBeNull();
  expect(tbody).not.toBeNull();
});

test('GridFieldTable renders header prop in thead when provided', () => {
  const headerContent = <tr className="test-header"><th>Header</th></tr>;
  const { container } = render(
    <GridFieldTable {...makeProps({ header: headerContent })} />
  );
  const thead = container.querySelector('thead');
  expect(thead.querySelector('.test-header')).not.toBeNull();
  expect(thead.textContent).toBe('Header');
});

test('GridFieldTable renders empty thead when header prop is not provided', () => {
  const { container } = render(<GridFieldTable {...makeProps()} />);
  const thead = container.querySelector('thead');
  expect(thead.innerHTML.trim()).toBe('');
});

test('GridFieldTable renders rows prop in tbody when provided', () => {
  const rowsContent = [
    <tr key="row1" className="test-row1"><td>Row 1</td></tr>,
    <tr key="row2" className="test-row2"><td>Row 2</td></tr>,
  ];
  const { container } = render(
    <GridFieldTable {...makeProps({ rows: rowsContent })} />
  );
  const tbody = container.querySelector('tbody');
  expect(tbody.querySelector('.test-row1')).not.toBeNull();
  expect(tbody.querySelector('.test-row2')).not.toBeNull();
  expect(tbody.querySelectorAll('tr').length).toBe(2);
});

test('GridFieldTable renders empty tbody when rows prop is not provided', () => {
  const { container } = render(<GridFieldTable {...makeProps()} />);
  const tbody = container.querySelector('tbody');
  expect(tbody.innerHTML.trim()).toBe('');
});

test('GridFieldTable generates null header when neither header nor data is set', () => {
  const { container } = render(<GridFieldTable {...makeProps()} />);
  const thead = container.querySelector('thead');
  expect(thead.children.length).toBe(0);
});

test('GridFieldTable generates null rows when neither rows nor data is set', () => {
  const { container } = render(<GridFieldTable {...makeProps()} />);
  const tbody = container.querySelector('tbody');
  expect(tbody.children.length).toBe(0);
});

test('GridFieldTable renders with both header and rows provided', () => {
  const headerContent = <tr className="test-header"><th>Name</th><th>Status</th></tr>;
  const rowsContent = [
    <tr key="row1" className="data-row"><td>Item 1</td><td>Active</td></tr>,
    <tr key="row2" className="data-row"><td>Item 2</td><td>Inactive</td></tr>,
  ];
  const { container } = render(
    <GridFieldTable {...makeProps({ header: headerContent, rows: rowsContent })} />
  );
  const thead = container.querySelector('thead');
  const tbody = container.querySelector('tbody');
  expect(thead.querySelector('.test-header')).not.toBeNull();
  expect(tbody.querySelectorAll('.data-row').length).toBe(2);
});

test('GridFieldTable renders header element containing table header cells', () => {
  const headerContent = (
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  );
  const { container } = render(
    <GridFieldTable {...makeProps({ header: headerContent })} />
  );
  const headerCells = container.querySelectorAll('thead th');
  expect(headerCells.length).toBe(3);
  expect(headerCells[0].textContent).toBe('Column 1');
  expect(headerCells[1].textContent).toBe('Column 2');
  expect(headerCells[2].textContent).toBe('Column 3');
});

test('GridFieldTable renders multiple rows with consistent structure', () => {
  const rowsContent = [
    <tr key="row1"><td>Data A1</td><td>Data A2</td></tr>,
    <tr key="row2"><td>Data B1</td><td>Data B2</td></tr>,
    <tr key="row3"><td>Data C1</td><td>Data C2</td></tr>,
  ];
  const { container } = render(
    <GridFieldTable {...makeProps({ rows: rowsContent })} />
  );
  const rows = container.querySelectorAll('tbody tr');
  expect(rows.length).toBe(3);
  rows.forEach((row) => {
    expect(row.querySelectorAll('td').length).toBe(2);
  });
});

test('GridFieldTable does not render data prop when header and rows are provided', () => {
  const headerContent = <tr className="custom-header"><th>Test</th></tr>;
  const rowsContent = [<tr key="row1" className="custom-row"><td>Test</td></tr>];
  const { container } = render(
    <GridFieldTable {...makeProps({
      header: headerContent,
      rows: rowsContent,
      data: {
        columns: [{ name: 'Title' }],
      },
    })}
    />
  );
  const thead = container.querySelector('thead');
  const tbody = container.querySelector('tbody');
  expect(thead.querySelector('.custom-header')).not.toBeNull();
  expect(tbody.querySelector('.custom-row')).not.toBeNull();
});

test('GridFieldTable renders header prop if header is defined even if other props are missing', () => {
  const headerContent = <tr><th>Header Only</th></tr>;
  const { container } = render(
    <GridFieldTable {...makeProps({ header: headerContent })} />
  );
  const thead = container.querySelector('thead');
  expect(thead.textContent).toBe('Header Only');
  const tbody = container.querySelector('tbody');
  expect(tbody.innerHTML.trim()).toBe('');
});

test('GridFieldTable renders rows prop if rows is defined even if header is missing', () => {
  const rowsContent = [<tr key="row1"><td>Data Only</td></tr>];
  const { container } = render(
    <GridFieldTable {...makeProps({ rows: rowsContent })} />
  );
  const tbody = container.querySelector('tbody');
  expect(tbody.textContent).toBe('Data Only');
  const thead = container.querySelector('thead');
  expect(thead.innerHTML.trim()).toBe('');
});

test('GridFieldTable table has correct semantic HTML structure', () => {
  const headerContent = <tr><th>Header</th></tr>;
  const rowsContent = [<tr key="row1"><td>Data</td></tr>];
  const { container } = render(
    <GridFieldTable {...makeProps({ header: headerContent, rows: rowsContent })} />
  );
  const table = container.querySelector('table');
  expect(table.firstChild.tagName).toBe('THEAD');
  expect(table.lastChild.tagName).toBe('TBODY');
});

test('GridFieldTable renders with complex nested JSX in header', () => {
  const headerContent = (
    <tr>
      <th>
        <span className="header-wrapper">
          <strong>Important Header</strong>
        </span>
      </th>
    </tr>
  );
  const { container } = render(
    <GridFieldTable {...makeProps({ header: headerContent })} />
  );
  const headerSpan = container.querySelector('.header-wrapper');
  expect(headerSpan).not.toBeNull();
  expect(headerSpan.textContent).toBe('Important Header');
});

test('GridFieldTable renders with complex nested JSX in rows', () => {
  const rowsContent = [
    <tr key="row1">
      <td>
        <span className="cell-wrapper">
          <em>Data Content</em>
        </span>
      </td>
    </tr>,
  ];
  const { container } = render(
    <GridFieldTable {...makeProps({ rows: rowsContent })} />
  );
  const cellSpan = container.querySelector('.cell-wrapper');
  expect(cellSpan).not.toBeNull();
  expect(cellSpan.textContent).toBe('Data Content');
});

test('GridFieldTable maintains table element when header and rows are empty', () => {
  const { container } = render(
    <GridFieldTable {...makeProps()} />
  );
  const table = container.querySelector('table');
  const gridField = container.querySelector('.grid-field');
  expect(gridField).not.toBeNull();
  expect(table).not.toBeNull();
  expect(table.querySelector('thead')).not.toBeNull();
  expect(table.querySelector('tbody')).not.toBeNull();
});

test('GridFieldTable renders with multiple tbody rows having different content types', () => {
  const rowsContent = [
    <tr key="row1"><td><input type="checkbox" /></td></tr>,
    <tr key="row2"><td><a href="#test">Link</a></td></tr>,
    <tr key="row3"><td><button>Button</button></td></tr>,
  ];
  const { container } = render(
    <GridFieldTable {...makeProps({ rows: rowsContent })} />
  );
  expect(container.querySelector('input[type="checkbox"]')).not.toBeNull();
  expect(container.querySelector('a')).not.toBeNull();
  expect(container.querySelector('button')).not.toBeNull();
});

test('GridFieldTable renders with undefined header prop explicitly set', () => {
  const { container } = render(
    <GridFieldTable {...makeProps({ header: undefined })} />
  );
  const thead = container.querySelector('thead');
  expect(thead.innerHTML.trim()).toBe('');
});

test('GridFieldTable renders with undefined rows prop explicitly set', () => {
  const { container } = render(
    <GridFieldTable {...makeProps({ rows: undefined })} />
  );
  const tbody = container.querySelector('tbody');
  expect(tbody.innerHTML.trim()).toBe('');
});

test('GridFieldTable grid-field container class is correctly applied', () => {
  const { container } = render(<GridFieldTable {...makeProps()} />);
  const gridField = container.firstChild;
  expect(gridField.classList.contains('grid-field')).toBe(true);
  expect(gridField.classList.length).toBe(1);
});

test('GridFieldTable properly renders header with React fragments', () => {
  const headerContent = (
    <>
      <tr className="header1"><th>Header 1</th></tr>
      <tr className="header2"><th>Header 2</th></tr>
    </>
  );
  const { container } = render(
    <GridFieldTable {...makeProps({ header: headerContent })} />
  );
  const thead = container.querySelector('thead');
  expect(thead.querySelector('.header1')).not.toBeNull();
  expect(thead.querySelector('.header2')).not.toBeNull();
});
test('GridFieldTable handles null values in row arrays gracefully', () => {
  const rowsContent = [
    <tr key="row1"><td>Row 1</td></tr>,
    null,
    <tr key="row3"><td>Row 3</td></tr>,
  ];
  const { container } = render(
    <GridFieldTable {...makeProps({ rows: rowsContent })} />
  );
  const tbody = container.querySelector('tbody');
  const rows = tbody.querySelectorAll('tr');
  expect(rows.length).toBeGreaterThanOrEqual(2);
});
