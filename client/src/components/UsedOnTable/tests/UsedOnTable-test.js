/* global jest, test, describe, beforeEach, it, expect */
import React from 'react';
import { render } from '@testing-library/react';
import { Component as UsedOnTable } from '../UsedOnTable';

function makeProps(obj = {}) {
  return {
    identifier: 'abc',
    loading: false,
    usedOn: null,
    tabContext: false,
    data: {
      readUsageEndpoint: {
        url: 'http://www.bob.co.nz',
        method: 'get',
      },
    },
    forceFetch: true,
    loadUsedOn: () => {},
    ...obj
  };
}

test('UsedOnTable should show a loading message when needed', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    loading: true,
  })}
  />);
  const column = container.querySelector('.used-on__message--loading');
  expect(column).not.toBeNull();
  expect(column.innerHTML).toContain('cms-content-loading-spinner');
});

test('UsedOnTable should not show a loading message if loading and there are already results', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    loading: true,
    usedOn: [
      { id: 'abc', title: 'now I know', type: 'Page', ancestors: [] },
    ]
  })}
  />);
  expect(container.querySelector('.used-on__message--loading')).toBeNull();
});

test('UsedOnTable should show a empty message when there are no results', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [],
  })}
  />);
  const column = container.querySelector('.used-on__message--empty');
  expect(column).not.toBeNull();
  expect(column.innerHTML).toContain('not in use');
});

test('UsedOnTable should show the error message if there was an error provided', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    error: 'bob did it',
  })}
  />);
  const column = container.querySelector('.used-on__message--error');
  expect(column).not.toBeNull();
  expect(column.innerHTML).toContain('bob did it');
});

test('UsedOnTable should convert index to 1-based count', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'now I know', type: 'Page', ancestors: [] },
    ]
  })}
  />);
  const index = container.querySelector('.used-on__col--index');
  expect(index.textContent).toBe('#');
  // index we're testing
  const count = container.querySelectorAll('.used-on__col--index')[1];
  expect(count.textContent).toBe('1');
});

test('UsedOnTable should add a link to table cells if the property is provided', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'now I know', type: 'Page', ancestors: [], link: 'http://www.silverstripe.org/' },
    ]
  })}
  />);
  const td = container.querySelectorAll('.used-on__cell-link');
  expect(td[1].textContent).toContain('now I know');
  expect(td[1].tagName).toBe('A');
  expect(td[1].href).toBe('http://www.silverstripe.org/');
});

test('UsedOnTable should add a link to table cell if an link is blank and ancestor link is not', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'now I know', type: 'Page', ancestors: [{ title: 'Trees', link: 'http://www.silverstripe.org/trees' }], link: '' },
    ]
  })}
  />);
  const td = container.querySelectorAll('.used-on__cell-link');
  expect(td[1].textContent).toContain('now I know');
  expect(td[1].tagName).toBe('A');
  expect(td[1].href).toBe('http://www.silverstripe.org/trees');
});

test('UsedOnTable should add a hash link to table cells if no link is provided anywhere', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'now I know', type: 'Page', ancestors: [{ title: 'Flowers', link: '' }], link: '' },
    ]
  })}
  />);
  const td = container.querySelectorAll('.used-on__cell-link');
  expect(td[1].textContent).toContain('now I know');
  expect(td[1].tagName).toBe('A');
  // Will probably be "http://localhost/#"
  expect(td[1].href.substr(-1)).toBe('#');
});

test('UsedOnTable should show the title provided', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'now I know', type: 'Boom!', ancestors: [] },
    ]
  })}
  />);
  const type = container.querySelectorAll('.used-on__type');
  expect(type[0].textContent).toContain('Boom!');
});

test('UsedOnTable should render table structure correctly', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'Test Page', type: 'Page', ancestors: [] },
    ]
  })}
  />);
  const table = container.querySelector('table.used-on__table');
  expect(table).not.toBeNull();
  expect(table.querySelector('thead')).not.toBeNull();
  expect(table.querySelector('tbody')).not.toBeNull();
});

test('UsedOnTable should truncate titles longer than 25 characters', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'This is a very long title that should be truncated', type: 'Page', ancestors: [] },
    ]
  })}
  />);
  const titleItem = container.querySelector('.used-on__title-item');
  expect(titleItem.textContent).toBe('This is a very long title...');
});

test('UsedOnTable should display ancestors in reverse order with first ancestor marked', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      {
        id: 'abc',
        title: 'Child Page',
        type: 'Page',
        ancestors: [
          { title: 'Parent', link: 'http://example.com/parent' },
          { title: 'Root', link: 'http://example.com/root' },
        ]
      },
    ]
  })}
  />);
  const titleItems = container.querySelectorAll('.used-on__title-item');
  expect(titleItems.length).toBe(3);
  expect(titleItems[0].textContent).toBe('Root');
  expect(titleItems[0].classList.contains('used-on__title-item--first')).toBe(true);
  expect(titleItems[1].textContent).toBe('Parent');
  expect(titleItems[2].textContent).toBe('Child Page');
});

test('UsedOnTable should use first item link when cell link is fallback', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      {
        id: 'abc',
        title: 'Child Page',
        type: 'Page',
        ancestors: [
          { title: 'Parent', link: 'http://example.com/parent' }
        ],
        link: ''
      },
    ]
  })}
  />);
  const links = container.querySelectorAll('.used-on__cell-link');
  expect(links[0].href).toBe('http://example.com/parent');
  expect(links[1].href).toBe('http://example.com/parent');
});

test('UsedOnTable should handle multiple rows correctly', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'Page One', type: 'Page', ancestors: [] },
      { id: 'def', title: 'Page Two', type: 'BlogPost', ancestors: [] },
      { id: 'ghi', title: 'Page Three', type: 'File', ancestors: [] },
    ]
  })}
  />);
  const rows = container.querySelectorAll('.used-on__row');
  expect(rows.length).toBe(3);
  const indices = container.querySelectorAll('.used-on__col--index');
  expect(indices[1].textContent).toBe('1');
  expect(indices[2].textContent).toBe('2');
  expect(indices[3].textContent).toBe('3');
});

test('UsedOnTable should preserve table structure with aria-live on tbody', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [],
  })}
  />);
  const tbody = container.querySelector('tbody');
  expect(tbody.getAttribute('aria-live')).toBe('polite');
});
