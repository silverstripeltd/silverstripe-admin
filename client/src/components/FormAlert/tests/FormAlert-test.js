/* global jest, test, expect, afterEach */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormAlert from '../FormAlert';

afterEach(() => {
  jest.clearAllMocks();
});

function makeProps(obj = {}) {
  return {
    type: 'danger',
    value: 'Test alert message',
    closeLabel: '',
    visible: undefined,
    extraClass: '',
    className: '',
    ...obj
  };
}

test('FormAlert renders with success type', () => {
  const { container } = render(<FormAlert {...makeProps({ type: 'success' })} />);
  const alert = container.querySelector('.alert-success');
  expect(alert).not.toBeNull();
  expect(alert.textContent).toBe('Test alert message');
});

test('FormAlert renders with danger type', () => {
  const { container } = render(<FormAlert {...makeProps({ type: 'danger' })} />);
  const alert = container.querySelector('.alert-danger');
  expect(alert).not.toBeNull();
});

test('FormAlert renders with warning type', () => {
  const { container } = render(<FormAlert {...makeProps({ type: 'warning' })} />);
  const alert = container.querySelector('.alert-warning');
  expect(alert).not.toBeNull();
});

test('FormAlert renders with warn type (alias for warning)', () => {
  const { container } = render(<FormAlert {...makeProps({ type: 'warn' })} />);
  const alert = container.querySelector('.alert-warning');
  expect(alert).not.toBeNull();
});

test('FormAlert renders with info type', () => {
  const { container } = render(<FormAlert {...makeProps({ type: 'info' })} />);
  const alert = container.querySelector('.alert-info');
  expect(alert).not.toBeNull();
});

test('FormAlert renders with good type (alias for success)', () => {
  const { container } = render(<FormAlert {...makeProps({ type: 'good' })} />);
  const alert = container.querySelector('.alert-success');
  expect(alert).not.toBeNull();
});

test('FormAlert defaults to danger style for unknown type', () => {
  const { container } = render(<FormAlert {...makeProps({ type: 'unknown' })} />);
  const alert = container.querySelector('.alert-danger');
  expect(alert).not.toBeNull();
});

test('FormAlert applies custom className', () => {
  const { container } = render(
    <FormAlert {...makeProps({ className: 'custom-class' })} />
  );
  const alert = container.querySelector('.custom-class');
  expect(alert).not.toBeNull();
});

test('FormAlert applies extraClass', () => {
  const { container } = render(
    <FormAlert {...makeProps({ extraClass: 'extra-class' })} />
  );
  const alert = container.querySelector('.extra-class');
  expect(alert).not.toBeNull();
});

test('FormAlert applies both className and extraClass', () => {
  const { container } = render(
    <FormAlert {...makeProps({ className: 'class1', extraClass: 'class2' })} />
  );
  const alert = container.querySelector('.class1.class2');
  expect(alert).not.toBeNull();
});

test('FormAlert applies message-box class with type suffix', () => {
  const { container } = render(
    <FormAlert {...makeProps({ type: 'success' })} />
  );
  const alert = container.querySelector('.message-box.message-box--success');
  expect(alert).not.toBeNull();
});

test('FormAlert renders with text content from value prop', () => {
  render(<FormAlert {...makeProps({ value: 'Custom message' })} />);
  expect(screen.getByText('Custom message')).not.toBeNull();
});

test('FormAlert renders with HTML content from value prop', () => {
  const { container } = render(
    <FormAlert {...makeProps({ value: { html: '<strong>Bold text</strong>' } })} />
  );
  const boldText = container.querySelector('strong');
  expect(boldText).not.toBeNull();
  expect(boldText.textContent).toBe('Bold text');
});

test('FormAlert renders with React element from value prop', () => {
  const { container } = render(
    <FormAlert {...makeProps({ value: { react: <span>React content</span> } })} />
  );
  const span = container.querySelector('span');
  expect(span).not.toBeNull();
  expect(span.textContent).toBe('React content');
});

test('FormAlert renders with text from value.text property', () => {
  render(<FormAlert {...makeProps({ value: { text: 'Text from object' } })} />);
  expect(screen.getByText('Text from object')).not.toBeNull();
});

test('FormAlert renders empty div when value is empty string', () => {
  const { container } = render(
    <FormAlert {...makeProps({ value: '' })} />
  );
  const alert = container.querySelector('.alert');
  expect(alert).not.toBeNull();
  const innerDiv = alert.querySelector('div');
  expect(innerDiv.textContent).toBe('');
});

test('FormAlert does not render when value is null', () => {
  const { container } = render(
    <FormAlert {...makeProps({ value: null })} />
  );
  const alert = container.querySelector('.alert');
  expect(alert).toBeNull();
});

test('FormAlert does not render when value is undefined', () => {
  const { container } = render(
    <FormAlert {...makeProps({ value: undefined })} />
  );
  const alert = container.querySelector('.alert');
  expect(alert).toBeNull();
});

test('FormAlert renders when visible prop is true', () => {
  const { container } = render(
    <FormAlert {...makeProps({ value: 'Test', visible: true })} />
  );
  const alert = container.querySelector('.alert');
  expect(alert).not.toBeNull();
});

test('FormAlert does not render when visible prop is false', () => {
  const { container } = render(
    <FormAlert {...makeProps({ value: 'Test', visible: false })} />
  );
  const alert = container.querySelector('.alert');
  expect(alert).toBeNull();
});

test('FormAlert renders when visible prop is undefined and state.visible is true', () => {
  const { container } = render(
    <FormAlert {...makeProps({ value: 'Test', visible: undefined })} />
  );
  const alert = container.querySelector('.alert');
  expect(alert).not.toBeNull();
});

test('FormAlert shows close button when closeLabel is provided', () => {
  const { container } = render(
    <FormAlert {...makeProps({ value: 'Test', closeLabel: 'Close' })} />
  );
  const closeButton = container.querySelector('button[aria-label="Close"]');
  expect(closeButton).not.toBeNull();
});

test('FormAlert does not show close button when closeLabel is not provided', () => {
  const { container } = render(
    <FormAlert {...makeProps({ value: 'Test', closeLabel: '' })} />
  );
  const closeButton = container.querySelector('button[aria-label="Close"]');
  expect(closeButton).toBeNull();
});

test('FormAlert calls onClosed callback when close button is clicked', () => {
  const onClosed = jest.fn();
  const { container } = render(
    <FormAlert {...makeProps({ value: 'Test', closeLabel: 'Close', onClosed })} />
  );
  const closeButton = container.querySelector('button[aria-label="Close"]');
  fireEvent.click(closeButton);
  expect(onClosed).toHaveBeenCalled();
});

test('FormAlert hides alert when close button is clicked and onClosed is not provided', () => {
  const { container, rerender } = render(
    <FormAlert {...makeProps({ value: 'Test', closeLabel: 'Close' })} />
  );
  let alert = container.querySelector('.alert');
  expect(alert).not.toBeNull();
  const closeButton = container.querySelector('button[aria-label="Close"]');
  fireEvent.click(closeButton);
  rerender(<FormAlert {...makeProps({ value: 'Test', closeLabel: 'Close' })} />);
  alert = container.querySelector('.alert');
  expect(alert).toBeNull();
});

test('FormAlert is dismissible when closeLabel is provided', () => {
  const { container } = render(
    <FormAlert {...makeProps({ value: 'Test', closeLabel: 'Dismiss' })} />
  );
  const alert = container.querySelector('.alert');
  expect(alert.classList.contains('alert-dismissible')).toBe(true);
});

test('FormAlert is not dismissible when closeLabel is not provided', () => {
  const { container } = render(
    <FormAlert {...makeProps({ value: 'Test', closeLabel: '' })} />
  );
  const alert = container.querySelector('.alert');
  expect(alert.classList.contains('alert-dismissible')).toBe(false);
});

test('FormAlert renders with no type attribute displays as no-type', () => {
  const { container } = render(
    <FormAlert {...makeProps({ type: undefined })} />
  );
  const alert = container.querySelector('.message-box--no-type');
  expect(alert).not.toBeNull();
});

test('FormAlert handles complex HTML content', () => {
  const { container } = render(
    <FormAlert
      {...makeProps({
        value: {
          html: '<div><p>Paragraph</p><ul><li>Item 1</li></ul></div>'
        }
      })}
    />
  );
  const paragraph = container.querySelector('p');
  expect(paragraph).not.toBeNull();
  expect(paragraph.textContent).toBe('Paragraph');
  const listItem = container.querySelector('li');
  expect(listItem).not.toBeNull();
});

test('FormAlert renders as success alert with good type and custom message', () => {
  const { container } = render(
    <FormAlert {...makeProps({ type: 'good', value: 'Operation successful!' })} />
  );
  expect(screen.getByText('Operation successful!')).not.toBeNull();
  expect(container.querySelector('.alert-success')).not.toBeNull();
});

test('FormAlert renders without errors when given minimal props', () => {
  const { container } = render(<FormAlert value="Message" />);
  const alert = container.querySelector('.alert');
  expect(alert).not.toBeNull();
});

test('FormAlert renders with multiple classes in correct order', () => {
  const { container } = render(
    <FormAlert
      {...makeProps({
        type: 'warning',
        className: 'custom',
        extraClass: 'extra'
      })}
    />
  );
  const alert = container.querySelector('.alert');
  expect(alert.classList.contains('message-box')).toBe(true);
  expect(alert.classList.contains('message-box--warning')).toBe(true);
  expect(alert.classList.contains('custom')).toBe(true);
  expect(alert.classList.contains('extra')).toBe(true);
});
