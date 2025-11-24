/* global jest, test, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import GridFieldAction from '../GridFieldAction';

function makeProps(obj = {}) {
  return {
    onClick: jest.fn(),
    icon: 'delete',
    record: {
      ID: 123,
    },
    ...obj,
  };
}

test('GridFieldAction renders a button with correct className', () => {
  const { container } = render(
    <GridFieldAction {...makeProps()} />
  );
  const button = container.querySelector('button');
  expect(button).not.toBeNull();
  expect(button.classList.contains('grid-field__icon-action')).toBe(true);
  expect(button.classList.contains('btn--icon-lg')).toBe(true);
});

test('GridFieldAction renders icon span with correct font-icon class', () => {
  const { container } = render(
    <GridFieldAction {...makeProps({ icon: 'edit' })} />
  );
  const iconSpan = container.querySelector('span');
  expect(iconSpan).not.toBeNull();
  expect(iconSpan.classList.contains('font-icon-edit')).toBe(true);
});

test('GridFieldAction renders icon span with aria-hidden attribute', () => {
  const { container } = render(
    <GridFieldAction {...makeProps()} />
  );
  const iconSpan = container.querySelector('span');
  expect(iconSpan.getAttribute('aria-hidden')).toBe('true');
});

test('GridFieldAction calls onClick with event and record ID on button click', () => {
  const mockOnClick = jest.fn();
  const { container } = render(
    <GridFieldAction {...makeProps({ onClick: mockOnClick })} />
  );
  const button = container.querySelector('button');
  fireEvent.click(button);
  expect(mockOnClick).toHaveBeenCalledTimes(1);
  expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object), 123);
});

test('GridFieldAction handles different icon types', () => {
  const { container: deleteContainer } = render(
    <GridFieldAction {...makeProps({ icon: 'delete' })} />
  );
  expect(deleteContainer.querySelector('.font-icon-delete')).not.toBeNull();

  const { container: editContainer } = render(
    <GridFieldAction {...makeProps({ icon: 'edit' })} />
  );
  expect(editContainer.querySelector('.font-icon-edit')).not.toBeNull();

  const { container: viewContainer } = render(
    <GridFieldAction {...makeProps({ icon: 'eye' })} />
  );
  expect(viewContainer.querySelector('.font-icon-eye')).not.toBeNull();
});

test('GridFieldAction handles multiple clicks', () => {
  const mockOnClick = jest.fn();
  const { container } = render(
    <GridFieldAction {...makeProps({ onClick: mockOnClick })} />
  );
  const button = container.querySelector('button');
  fireEvent.click(button);
  fireEvent.click(button);
  fireEvent.click(button);
  expect(mockOnClick).toHaveBeenCalledTimes(3);
});

test('GridFieldAction passes correct record ID with different record values', () => {
  const mockOnClick = jest.fn();
  const { container } = render(
    <GridFieldAction {...makeProps({ onClick: mockOnClick, record: { ID: 456 } })} />
  );
  const button = container.querySelector('button');
  fireEvent.click(button);
  expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object), 456);
});

test('GridFieldAction button is always clickable', () => {
  const mockOnClick = jest.fn();
  const { container } = render(
    <GridFieldAction {...makeProps({ onClick: mockOnClick })} />
  );
  const button = container.querySelector('button');
  expect(button.disabled).toBe(false);
});

test('GridFieldAction does not have type attribute set (defaults to submit)', () => {
  const { container } = render(
    <GridFieldAction {...makeProps()} />
  );
  const button = container.querySelector('button');
  expect(button.type).toBe('submit');
});
