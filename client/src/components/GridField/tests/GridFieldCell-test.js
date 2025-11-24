/* global jest, test, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import GridFieldCell from '../GridFieldCell';

function renderCell(props) {
  return render(
    <table>
      <tbody>
        <tr>
          <GridFieldCell {...props} />
        </tr>
      </tbody>
    </table>
  );
}

function makeProps(obj = {}) {
  return {
    ...obj,
  };
}

test('GridFieldCell renders as a table cell element', () => {
  const { container } = renderCell(makeProps());
  const td = container.querySelector('td');
  expect(td).not.toBeNull();
});

test('GridFieldCell renders with grid-field__cell class', () => {
  const { container } = renderCell(makeProps());
  const td = container.querySelector('td');
  expect(td.classList.contains('grid-field__cell')).toBe(true);
});

test('GridFieldCell applies custom className along with default class', () => {
  const { container } = renderCell(makeProps({ className: 'custom-class' }));
  const td = container.querySelector('td');
  expect(td.classList.contains('grid-field__cell')).toBe(true);
  expect(td.classList.contains('custom-class')).toBe(true);
});

test('GridFieldCell renders without className when not provided', () => {
  const { container } = renderCell(makeProps());
  const td = container.querySelector('td');
  expect(td.classList.contains('grid-field__cell')).toBe(true);
});

test('GridFieldCell calls onDrillDown when clicked', () => {
  const mockOnDrillDown = jest.fn();
  const { container } = renderCell(makeProps({ onDrillDown: mockOnDrillDown }));
  const td = container.querySelector('td');
  fireEvent.click(td);
  expect(mockOnDrillDown).toHaveBeenCalledTimes(1);
  expect(mockOnDrillDown).toHaveBeenCalledWith(expect.any(Object));
});

test('GridFieldCell does not error when onDrillDown is not provided', () => {
  const { container } = renderCell(makeProps());
  const td = container.querySelector('td');
  expect(() => {
    fireEvent.click(td);
  }).not.toThrow();
});

test('GridFieldCell handles multiple clicks', () => {
  const mockOnDrillDown = jest.fn();
  const { container } = renderCell(makeProps({ onDrillDown: mockOnDrillDown }));
  const td = container.querySelector('td');
  fireEvent.click(td);
  fireEvent.click(td);
  fireEvent.click(td);
  expect(mockOnDrillDown).toHaveBeenCalledTimes(3);
});

test('GridFieldCell passes through additional props to td element', () => {
  const { container } = renderCell(makeProps({ 'data-testid': 'test-cell', title: 'Test Title' }));
  const td = container.querySelector('td');
  expect(td.getAttribute('data-testid')).toBe('test-cell');
  expect(td.getAttribute('title')).toBe('Test Title');
});

test('GridFieldCell renders with content children', () => {
  const { container } = render(
    <table>
      <tbody>
        <tr>
          <GridFieldCell {...makeProps()}>
            <span>Cell Content</span>
          </GridFieldCell>
        </tr>
      </tbody>
    </table>
  );
  const td = container.querySelector('td');
  expect(td.textContent).toBe('Cell Content');
  expect(td.querySelector('span')).not.toBeNull();
});

test('GridFieldCell excludes onDrillDown from td props', () => {
  const mockOnDrillDown = jest.fn();
  const { container } = renderCell(makeProps({ onDrillDown: mockOnDrillDown }));
  const td = container.querySelector('td');
  expect(td.hasAttribute('onDrillDown')).toBe(false);
});

test('GridFieldCell supports multiple class names together', () => {
  const { container } = renderCell(makeProps({ className: 'class-one class-two class-three' }));
  const td = container.querySelector('td');
  expect(td.classList.contains('grid-field__cell')).toBe(true);
  expect(td.classList.contains('class-one')).toBe(true);
  expect(td.classList.contains('class-two')).toBe(true);
  expect(td.classList.contains('class-three')).toBe(true);
});

test('GridFieldCell passes click event to onDrillDown handler', () => {
  const mockOnDrillDown = jest.fn();
  const { container } = renderCell(makeProps({ onDrillDown: mockOnDrillDown }));
  const td = container.querySelector('td');
  const clickEvent = new MouseEvent('click', { bubbles: true });
  td.dispatchEvent(clickEvent);
  expect(mockOnDrillDown).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
});

test('GridFieldCell with undefined onDrillDown does not throw', () => {
  const { container } = renderCell(makeProps({ onDrillDown: undefined }));
  const td = container.querySelector('td');
  expect(() => {
    fireEvent.click(td);
  }).not.toThrow();
});

test('GridFieldCell respects onDrillDown prop type validation', () => {
  const mockOnDrillDown = jest.fn();
  const { container } = renderCell(makeProps({ onDrillDown: mockOnDrillDown }));
  const td = container.querySelector('td');
  fireEvent.click(td);
  expect(mockOnDrillDown).toHaveBeenCalled();
});
