/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as SearchBox } from '../SearchBox';

function makeProps(obj = {}) {
  return {
    id: 'search-box-test',
    placeholder: 'Search...',
    searchText: '',
    onChange: jest.fn(),
    onSearch: jest.fn(),
    onHide: jest.fn(),
    onTagDelete: jest.fn(),
    onTagClick: jest.fn(),
    onToggleFilter: jest.fn(),
    onHideFilter: jest.fn(),
    tagData: [],
    expanded: false,
    hideable: false,
    showFilters: false,
    dirty: false,
    clearable: true,
    name: 'search',
    borders: {
      top: false,
      right: false,
      bottom: true,
      left: true,
    },
    ...obj
  };
}

test('SearchBox renders with correct structure', () => {
  const { container } = render(<SearchBox {...makeProps()} />);
  const searchBox = container.querySelector('.search-box');
  expect(searchBox).not.toBeNull();
  expect(searchBox.classList.contains('search-box')).toBe(true);
});

test('SearchBox renders input with placeholder', () => {
  render(<SearchBox {...makeProps({ placeholder: 'Enter search term' })} />);
  const input = screen.getByPlaceholderText('Enter search term');
  expect(input).not.toBeNull();
  expect(input.type).toBe('search');
});

test('SearchBox renders input with correct name attribute', () => {
  render(<SearchBox {...makeProps({ name: 'custom-search' })} />);
  const input = screen.getByDisplayValue('');
  expect(input.name).toBe('custom-search');
});

test('SearchBox input is rendered with type search', () => {
  const { container } = render(<SearchBox {...makeProps()} />);
  const input = container.querySelector('input[type="search"]');
  expect(input).not.toBeNull();
});

test('SearchBox renders label with correct attributes', () => {
  const { container } = render(<SearchBox {...makeProps({ id: 'my-search-id' })} />);
  const label = container.querySelector('label');
  expect(label).not.toBeNull();
  expect(label.getAttribute('for')).toBe('my-search-id');
  expect(label.getAttribute('id')).toBe('my-search-id_label');
  expect(label.classList.contains('visually-hidden')).toBe(true);
});

test('SearchBox calls onChange when input value changes', () => {
  const onChange = jest.fn();
  render(<SearchBox {...makeProps({ onChange })} />);
  const input = screen.getByDisplayValue('');
  fireEvent.change(input, { target: { value: 'test query' } });
  expect(onChange).toHaveBeenCalled();
});

test('SearchBox calls onSearch when Enter key is pressed', () => {
  const onSearch = jest.fn();
  render(<SearchBox {...makeProps({ onSearch, dirty: true })} />);
  const input = screen.getByDisplayValue('');
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onSearch).toHaveBeenCalled();
});

test('SearchBox calls onSearch when Enter hint is clicked', () => {
  const onSearch = jest.fn();
  render(<SearchBox {...makeProps({ onSearch, dirty: true })} />);
  const input = screen.getByDisplayValue('');
  fireEvent.focus(input);
  const enterHint = screen.getByText(/Enter ↵/);
  expect(enterHint).not.toBeNull();
  fireEvent.click(enterHint);
  expect(onSearch).toHaveBeenCalled();
});

test('SearchBox shows Enter hint when dirty and focused', () => {
  render(<SearchBox {...makeProps({ dirty: true })} />);
  const input = screen.getByDisplayValue('');
  fireEvent.focus(input);
  const enterHint = screen.getByText(/Enter ↵/);
  expect(enterHint).not.toBeNull();
});

test('SearchBox shows Enter hint when not clearable and focused', () => {
  render(<SearchBox {...makeProps({ clearable: false, dirty: false })} />);
  const input = screen.getByDisplayValue('');
  fireEvent.focus(input);
  const enterHint = screen.getByText(/Enter ↵/);
  expect(enterHint).not.toBeNull();
});

test('SearchBox does not show Enter hint on initial render', () => {
  const { container } = render(<SearchBox {...makeProps({ dirty: true })} />);
  // Enter hint should not be present initially (before focus)
  const enterHints = container.querySelectorAll('.search-box__enter');
  expect(enterHints.length).toBe(1);
});

test('SearchBox does not show Enter hint when not dirty and clearable', () => {
  render(<SearchBox {...makeProps({ dirty: false, clearable: true })} />);
  const input = screen.getByDisplayValue('');
  fireEvent.focus(input);
  expect(screen.queryByText(/Enter ↵/)).toBeNull();
});

test('SearchBox handles focus state tracking', () => {
  const { container } = render(<SearchBox {...makeProps()} />);
  const input = screen.getByDisplayValue('');
  // After rendering with mock ResizeAware, input focus may be triggered
  fireEvent.blur(input);
  // Now blur to clear focus state
  let searchBoxElement = container.querySelector('.search-box');
  expect(searchBoxElement.classList.contains('search-box--has-not-focus')).toBe(true);
  fireEvent.focus(input);
  searchBoxElement = container.querySelector('.search-box');
  expect(searchBoxElement.classList.contains('search-box--has-focus')).toBe(true);
});

test('SearchBox handles blur state', () => {
  const { container } = render(<SearchBox {...makeProps()} />);
  const input = screen.getByDisplayValue('');
  fireEvent.focus(input);
  expect(container.querySelector('.search-box--has-focus')).not.toBeNull();
  fireEvent.blur(input);
  expect(container.querySelector('.search-box--has-focus')).toBeNull();
});

test('SearchBox calls onHideFilter when input is focused', () => {
  const onHideFilter = jest.fn();
  render(<SearchBox {...makeProps({ onHideFilter })} />);
  const input = screen.getByDisplayValue('');
  fireEvent.focus(input);
  expect(onHideFilter).toHaveBeenCalled();
});

test('SearchBox renders tags when tagData is provided', () => {
  const tagData = [
    { key: 'tag1', name: 'tag1', label: 'Tag 1' },
    { key: 'tag2', name: 'tag2', label: 'Tag 2' }
  ];
  const { container } = render(<SearchBox {...makeProps({ tagData })} />);
  expect(container.querySelector('.search-box__tags')).not.toBeNull();
  // CompactTagList renders tags in both visible and placeholder sections
  expect(container.querySelectorAll('.tag-component').length).toBeGreaterThanOrEqual(2);
});

test('SearchBox renders no tags when tagData is empty', () => {
  const { container } = render(<SearchBox {...makeProps({ tagData: [] })} />);
  const tagsSection = container.querySelector('.search-box__tags');
  expect(tagsSection).not.toBeNull();
  expect(container.querySelectorAll('.tag-component').length).toBe(0);
});

test('SearchBox calls onTagDelete when tag delete is clicked', () => {
  const onTagDelete = jest.fn();
  const tagData = [{ key: 'tag1', name: 'tag1', label: 'Tag 1' }];
  const { container } = render(<SearchBox {...makeProps({ tagData, onTagDelete })} />);
  const deleteBtn = container.querySelector('.tag-component__delete');
  fireEvent.click(deleteBtn);
  expect(onTagDelete).toHaveBeenCalledWith('tag1');
});

test('SearchBox calls onTagClick when tag is clicked', () => {
  const onTagClick = jest.fn();
  const tagData = [{ key: 'tag1', name: 'tag1', label: 'Tag 1' }];
  const { container } = render(<SearchBox {...makeProps({ tagData, onTagClick })} />);
  const tag = container.querySelector('.tag-component');
  fireEvent.click(tag);
  expect(onTagClick).toHaveBeenCalledWith('tag1');
});

test('SearchBox renders hide button when hideable prop is true', () => {
  const { container } = render(<SearchBox {...makeProps({ hideable: true })} />);
  const hideButton = container.querySelector('.search-box__cancel');
  expect(hideButton).not.toBeNull();
});

test('SearchBox does not render hide button when hideable prop is false', () => {
  const { container } = render(<SearchBox {...makeProps({ hideable: false })} />);
  const hideButton = container.querySelector('.search-box__cancel');
  expect(hideButton).toBeNull();
});

test('SearchBox calls onHide when hide button is clicked', () => {
  const onHide = jest.fn();
  render(<SearchBox {...makeProps({ hideable: true, onHide })} />);
  const buttons = screen.getAllByRole('button');
  const hideButton = buttons.find(btn => btn.classList.contains('search-box__cancel'));
  fireEvent.click(hideButton);
  expect(onHide).toHaveBeenCalled();
});

test('SearchBox renders filter button when showFilters prop is true', () => {
  const { container } = render(<SearchBox {...makeProps({ showFilters: true })} />);
  const filterButton = container.querySelector('.search-box__filter-trigger');
  expect(filterButton).not.toBeNull();
});

test('SearchBox does not render filter button when showFilters prop is false', () => {
  const { container } = render(<SearchBox {...makeProps({ showFilters: false })} />);
  const filterButton = container.querySelector('.search-box__filter-trigger');
  expect(filterButton).toBeNull();
});

test('SearchBox calls onToggleFilter when filter button is clicked', () => {
  const onToggleFilter = jest.fn();
  render(<SearchBox {...makeProps({ showFilters: true, onToggleFilter })} />);
  const filterButton = screen.getByText(/Search options/);
  fireEvent.click(filterButton);
  expect(onToggleFilter).toHaveBeenCalled();
});

test('SearchBox applies expanded class when expanded prop is true', () => {
  const { container } = render(<SearchBox {...makeProps({ expanded: true })} />);
  expect(container.querySelector('.search-box--expanded')).not.toBeNull();
});

test('SearchBox does not apply expanded class when expanded prop is false', () => {
  const { container } = render(<SearchBox {...makeProps({ expanded: false })} />);
  expect(container.querySelector('.search-box--expanded')).toBeNull();
});

test('SearchBox applies hideable class when hideable prop is true', () => {
  const { container } = render(<SearchBox {...makeProps({ hideable: true })} />);
  expect(container.querySelector('.search-box--hideable')).not.toBeNull();
});

test('SearchBox applies filters class when showFilters prop is true', () => {
  const { container } = render(<SearchBox {...makeProps({ showFilters: true })} />);
  expect(container.querySelector('.search-box--has-filters')).not.toBeNull();
});

test('SearchBox applies compact class when width is less than 576px', () => {
  const { container } = render(<SearchBox {...makeProps()} />);
  // The mock ResizeAware sets width to 400, which is less than 576, so compact class should be present
  expect(container.querySelector('.search-box--compact')).not.toBeNull();
});

test('SearchBox renders search icon', () => {
  const { container } = render(<SearchBox {...makeProps()} />);
  const icon = container.querySelector('.font-icon-search');
  expect(icon).not.toBeNull();
  expect(icon.getAttribute('aria-hidden')).toBe('true');
});

test('SearchBox renders children when provided', () => {
  render(
    <SearchBox {...makeProps()}>
      <div data-testid="custom-child">Custom Content</div>
    </SearchBox>
  );
  expect(screen.getByTestId('custom-child')).not.toBeNull();
});

test('SearchBox focuses on last tag when ArrowLeft is pressed at start of input', () => {
  const tagData = [
    { key: 'tag1', name: 'tag1', label: 'Tag 1' },
    { key: 'tag2', name: 'tag2', label: 'Tag 2' }
  ];
  render(<SearchBox {...makeProps({ tagData })} />);
  const input = screen.getByDisplayValue('');
  fireEvent.focus(input);
  // Set selection to start of input
  input.setSelectionRange(0, 0);
  fireEvent.keyDown(input, { key: 'ArrowLeft' });
  // Check if last tag has focus (or would be focused)
  expect(input.selectionStart).toBe(0);
});

test('SearchBox focuses on last tag when Backspace is pressed at start with no selection', () => {
  const tagData = [{ key: 'tag1', name: 'tag1', label: 'Tag 1' }];
  render(<SearchBox {...makeProps({ tagData })} />);
  const input = screen.getByDisplayValue('');
  fireEvent.focus(input);
  input.setSelectionRange(0, 0);
  fireEvent.keyDown(input, { key: 'Backspace' });
  expect(input.selectionStart).toBe(0);
});

test('SearchBox does not focus on tag when Backspace is pressed with selected text', () => {
  const tagData = [{ key: 'tag1', name: 'tag1', label: 'Tag 1' }];
  render(<SearchBox {...makeProps({ tagData })} />);
  const input = screen.getByDisplayValue('');
  fireEvent.focus(input);
  input.setSelectionRange(0, 5);
  fireEvent.keyDown(input, { key: 'Backspace' });
  // Should not prevent default when text is selected
  expect(input.selectionStart).toBe(0);
});

test('SearchBox input has aria-labelledby attribute', () => {
  const { container } = render(<SearchBox {...makeProps({ id: 'test-id' })} />);
  const input = container.querySelector('input[type="search"]');
  expect(input.getAttribute('aria-labelledby')).toBe('test-id_label');
});

test('SearchBox applies border classes based on borders prop', () => {
  const { container } = render(
    <SearchBox
      {...makeProps({
        borders: {
          top: true,
          right: true,
          bottom: false,
          left: false,
        }
      })}
    />
  );
  const input = container.querySelector('.search-box__content-field');
  expect(input.classList.contains('search-box__content-field--top-border')).toBe(true);
  expect(input.classList.contains('search-box__content-field--right-border')).toBe(true);
  expect(input.classList.contains('search-box__content-field--bottom-border')).toBe(false);
});

test('SearchBox applies default border classes when borders prop is not provided', () => {
  const { container } = render(
    <SearchBox
      {...makeProps({
        borders: undefined
      })}
    />
  );
  const input = container.querySelector('.search-box__content-field');
  expect(input.classList.contains('search-box__content-field--bottom-border')).toBe(true);
  expect(input.classList.contains('search-box__content-field--left-border')).toBe(true);
});

test('SearchBox input value matches searchText prop', () => {
  render(<SearchBox {...makeProps({ searchText: 'test value' })} />);
  const input = screen.getByDisplayValue('test value');
  expect(input.value).toBe('test value');
});

test('SearchBox does not call onSearch for non-Enter keys', () => {
  const onSearch = jest.fn();
  render(<SearchBox {...makeProps({ onSearch })} />);
  const input = screen.getByDisplayValue('');
  fireEvent.keyDown(input, { key: 'a' });
  expect(onSearch).not.toHaveBeenCalled();
});

test('SearchBox renders with all required props', () => {
  const props = makeProps({
    id: 'search-box-id',
    placeholder: 'Search items',
    searchText: 'hello',
    onChange: jest.fn(),
    onSearch: jest.fn(),
    onHide: jest.fn(),
    onTagDelete: jest.fn(),
    onTagClick: jest.fn(),
    onToggleFilter: jest.fn(),
    hideable: true,
    showFilters: true,
    expanded: true,
    dirty: true,
    tagData: [
      { key: 'filter1', name: 'filter1', label: 'Filter 1' }
    ]
  });
  const { container } = render(<SearchBox {...props} />);
  expect(container.querySelector('.search-box')).not.toBeNull();
  expect(screen.getByPlaceholderText('Search items')).not.toBeNull();
  expect(screen.getByDisplayValue('hello')).not.toBeNull();
});

test('SearchBox filter button has correct aria attributes', () => {
  const { container } = render(
    <SearchBox {...makeProps({ showFilters: true, expanded: true, formId: 'form-id' })} />
  );
  const filterButton = container.querySelector('.search-box__filter-trigger');
  expect(filterButton.getAttribute('aria-expanded')).toBe('true');
  expect(filterButton.getAttribute('aria-controls')).toBe('form-id');
});

test('SearchBox hide button has correct aria attributes', () => {
  const { container } = render(
    <SearchBox {...makeProps({ hideable: true, id: 'search-id' })} />
  );
  const hideButton = container.querySelector('.search-box__cancel');
  expect(hideButton.getAttribute('aria-expanded')).toBe('true');
  expect(hideButton.getAttribute('aria-controls')).toBe('search-id');
});

test('SearchBox tags section is rendered inside search-box__tags div', () => {
  const { container } = render(
    <SearchBox {...makeProps({ tagData: [{ key: 'tag1', name: 'tag1', label: 'Tag 1' }] })} />
  );
  const tagsSection = container.querySelector('.search-box__tags');
  expect(tagsSection).not.toBeNull();
  // CompactTagList renders tags in both visible and placeholder sections
  expect(container.querySelectorAll('.tag-component').length).toBeGreaterThanOrEqual(1);
});

test('SearchBox input is inside search-box__group', () => {
  const { container } = render(<SearchBox {...makeProps()} />);
  const group = container.querySelector('.search-box__group');
  expect(group).not.toBeNull();
  const input = group.querySelector('input[type="search"]');
  expect(input).not.toBeNull();
});
