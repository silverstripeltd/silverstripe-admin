/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListGroupItem from '../ListGroupItem';

function makeProps(obj = {}) {
  return {
    className: '',
    onClick: jest.fn(),
    onClickArg: undefined,
    children: 'List item',
    ...obj
  };
}

test('ListGroupItem renders with default className', () => {
  const { container } = render(<ListGroupItem {...makeProps()} />);
  const link = container.querySelector('.list-group-item');
  expect(link).not.toBeNull();
  expect(link.textContent).toBe('List item');
});

test('ListGroupItem renders with custom className', () => {
  const { container } = render(
    <ListGroupItem {...makeProps({ className: 'active' })} />
  );
  const link = container.querySelector('.list-group-item');
  expect(link.classList.contains('active')).toBe(true);
  expect(link.classList.contains('list-group-item')).toBe(true);
});

test('ListGroupItem renders with children text', () => {
  render(<ListGroupItem {...makeProps({ children: 'Custom text' })} />);
  expect(screen.getByText('Custom text')).not.toBeNull();
});

test('ListGroupItem renders with multiple classes', () => {
  const { container } = render(
    <ListGroupItem {...makeProps({ className: 'active disabled' })} />
  );
  const link = container.querySelector('.list-group-item');
  expect(link.classList.contains('active')).toBe(true);
  expect(link.classList.contains('disabled')).toBe(true);
});

test('ListGroupItem is rendered as anchor element with role button', () => {
  const { container } = render(<ListGroupItem {...makeProps()} />);
  const link = container.querySelector('a');
  expect(link).not.toBeNull();
  expect(link.getAttribute('role')).toBe('button');
});

test('ListGroupItem has tabIndex of 0', () => {
  const { container } = render(<ListGroupItem {...makeProps()} />);
  const link = container.querySelector('a');
  expect(link.getAttribute('tabIndex')).toBe('0');
});

test('ListGroupItem calls onClick with correct arguments on click', () => {
  const onClick = jest.fn();
  const onClickArg = { id: 'item-1' };
  const { container } = render(
    <ListGroupItem {...makeProps({ onClick, onClickArg })} />
  );
  const link = container.querySelector('a');
  fireEvent.click(link);
  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onClick).toHaveBeenCalledWith(expect.any(Object), onClickArg);
});

test('ListGroupItem does not call onClick when not provided', () => {
  const { container } = render(
    <ListGroupItem {...makeProps({ onClick: undefined })} />
  );
  const link = container.querySelector('a');
  expect(() => {
    fireEvent.click(link);
  }).not.toThrow();
});

test('ListGroupItem onClick receives event object', () => {
  const onClick = jest.fn();
  const { container } = render(
    <ListGroupItem {...makeProps({ onClick })} />
  );
  const link = container.querySelector('a');
  fireEvent.click(link);
  const eventArg = onClick.mock.calls[0][0];
  expect(eventArg.type).toBe('click');
  expect(eventArg.target).toBe(link);
});

test('ListGroupItem with complex children renders correctly', () => {
  const children = <span className="badge">5</span>;
  const { container } = render(
    <ListGroupItem {...makeProps({ children })} />
  );
  const badge = container.querySelector('.badge');
  expect(badge).not.toBeNull();
  expect(badge.textContent).toBe('5');
});

test('ListGroupItem onClick is called multiple times on multiple clicks', () => {
  const onClick = jest.fn();
  const { container } = render(
    <ListGroupItem {...makeProps({ onClick })} />
  );
  const link = container.querySelector('a');
  fireEvent.click(link);
  fireEvent.click(link);
  fireEvent.click(link);
  expect(onClick).toHaveBeenCalledTimes(3);
});

test('ListGroupItem passes onClickArg to onClick handler', () => {
  const onClick = jest.fn();
  const onClickArg = { itemId: 42, name: 'test-item' };
  const { container } = render(
    <ListGroupItem {...makeProps({ onClick, onClickArg })} />
  );
  const link = container.querySelector('a');
  fireEvent.click(link);
  expect(onClick).toHaveBeenCalledWith(expect.any(Object), onClickArg);
  expect(onClick.mock.calls[0][1]).toEqual(onClickArg);
});

test('ListGroupItem with undefined onClickArg', () => {
  const onClick = jest.fn();
  const { container } = render(
    <ListGroupItem {...makeProps({ onClick, onClickArg: undefined })} />
  );
  const link = container.querySelector('a');
  fireEvent.click(link);
  expect(onClick).toHaveBeenCalledWith(expect.any(Object), undefined);
});

test('ListGroupItem with null onClickArg', () => {
  const onClick = jest.fn();
  const { container } = render(
    <ListGroupItem {...makeProps({ onClick, onClickArg: null })} />
  );
  const link = container.querySelector('a');
  fireEvent.click(link);
  expect(onClick).toHaveBeenCalledWith(expect.any(Object), null);
});

test('ListGroupItem with empty className string', () => {
  const { container } = render(
    <ListGroupItem {...makeProps({ className: '' })} />
  );
  const link = container.querySelector('a');
  expect(link.className).toBe('list-group-item ');
});
