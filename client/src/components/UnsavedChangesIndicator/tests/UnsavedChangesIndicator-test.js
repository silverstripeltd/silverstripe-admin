/* global jest, test, expect */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Component as UnsavedChangesIndicator } from '../UnsavedChangesIndicator';

jest.mock('i18n', () => ({
  _t: (key, defaultValue) => defaultValue,
  inject: (string, map) => {
    let newString = string;
    Object.entries(map).forEach(([name, value]) => {
      newString = newString.replace(`{${name}}`, value);
    });
    return newString;
  }
}));

test('UnsavedChangesIndicator does not render when none level', () => {
  const { container } = render(<UnsavedChangesIndicator level="none" />);
  expect(container.firstChild).toBeNull();
});

test('UnsavedChangesIndicator renders notice level', () => {
  const { container } = render(<UnsavedChangesIndicator level="notice" elapsedMinutes={5} />);
  const indicator = container.querySelector('.unsaved-changes-indicator');
  expect(indicator).not.toBeNull();
  expect(indicator.classList.contains('unsaved-changes-indicator--notice')).toBe(true);
  expect(container.querySelector('.font-icon-info-circled')).not.toBeNull();
  expect(screen.getByText('Unsaved changes: 5 mins')).not.toBeNull();
});

test('UnsavedChangesIndicator renders message', () => {
  const { container } = render(<UnsavedChangesIndicator level="notice" elapsedMinutes={2} />);
  expect(screen.getByText('Unsaved changes: 2 mins')).not.toBeNull();
  const shortMessage = container.querySelector('.unsaved-changes-indicator__short');
  expect(shortMessage.textContent).toBe('2 mins');
});

test('UnsavedChangesIndicator has title attribute with full message', () => {
  const { container } = render(<UnsavedChangesIndicator level="notice" elapsedMinutes={5} />);
  const indicator = container.querySelector('.unsaved-changes-indicator');
  expect(indicator.getAttribute('title')).toBe('Unsaved changes: 5 mins');
});

test('UnsavedChangesIndicator renders short message for responsive', () => {
  const { container } = render(<UnsavedChangesIndicator level="notice" elapsedMinutes={5} />);
  const shortMessage = container.querySelector('.unsaved-changes-indicator__short');
  expect(shortMessage).not.toBeNull();
  expect(shortMessage.textContent).toBe('5 mins');
});

test('UnsavedChangesIndicator short message is aria-hidden', () => {
  const { container } = render(<UnsavedChangesIndicator level="notice" elapsedMinutes={5} />);
  const shortMessage = container.querySelector('.unsaved-changes-indicator__short');
  expect(shortMessage.getAttribute('aria-hidden')).toBe('true');
});

test('UnsavedChangesIndicator renders warning level with attention icon', () => {
  const { container } = render(<UnsavedChangesIndicator level="warning" elapsedMinutes={10} />);
  const indicator = container.querySelector('.unsaved-changes-indicator');
  expect(indicator).not.toBeNull();
  expect(indicator.classList.contains('unsaved-changes-indicator--warning')).toBe(true);
  expect(container.querySelector('.font-icon-attention')).not.toBeNull();
  expect(screen.getByText('Unsaved changes: 10 mins')).not.toBeNull();
});

test('UnsavedChangesIndicator has proper accessibility attributes', () => {
  const { container } = render(<UnsavedChangesIndicator level="notice" elapsedMinutes={5} />);
  const indicator = container.querySelector('.unsaved-changes-indicator');
  expect(indicator.getAttribute('role')).toBe('status');
  expect(indicator.getAttribute('aria-live')).toBe('off');
});

test('UnsavedChangesIndicator icon is aria-hidden', () => {
  const { container } = render(<UnsavedChangesIndicator level="notice" elapsedMinutes={5} />);
  const icon = container.querySelector('.font-icon');
  expect(icon.getAttribute('aria-hidden')).toBe('true');
});

test('UnsavedChangesIndicator renders full message span', () => {
  const { container } = render(<UnsavedChangesIndicator level="notice" elapsedMinutes={5} />);
  const fullMessage = container.querySelector('.unsaved-changes-indicator__full');
  expect(fullMessage).not.toBeNull();
  expect(fullMessage.textContent).toBe('Unsaved changes: 5 mins');
});

test('UnsavedChangesIndicator has correct class structure', () => {
  const { container } = render(<UnsavedChangesIndicator level="notice" elapsedMinutes={5} />);
  const indicator = container.querySelector('.unsaved-changes-indicator');
  expect(indicator.classList.contains('unsaved-changes-indicator')).toBe(true);
  expect(indicator.classList.length).toBe(2);
});

test('UnsavedChangesIndicator sets aria-live correctly', () => {
  const { container, rerender } = render(
    <UnsavedChangesIndicator level="none" elapsedMinutes={0} />
  );
  expect(container.firstChild).toBeNull();
  rerender(<UnsavedChangesIndicator level="notice" elapsedMinutes={5} />);
  expect(container.querySelector('.unsaved-changes-indicator').getAttribute('aria-live')).toBe('polite');
  rerender(<UnsavedChangesIndicator level="notice" elapsedMinutes={6} />);
  expect(container.querySelector('.unsaved-changes-indicator').getAttribute('aria-live')).toBe('off');
  rerender(<UnsavedChangesIndicator level="warning" elapsedMinutes={10} />);
  expect(container.querySelector('.unsaved-changes-indicator').getAttribute('aria-live')).toBe('polite');
  rerender(<UnsavedChangesIndicator level="warning" elapsedMinutes={11} />);
  expect(container.querySelector('.unsaved-changes-indicator').getAttribute('aria-live')).toBe('off');
});
