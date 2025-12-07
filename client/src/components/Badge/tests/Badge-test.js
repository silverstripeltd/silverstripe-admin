/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import Badge, { statuses } from '../Badge';

test('Badge render() should return null if status is empty', () => {
  const { container } = render(
    <Badge {...{
      status: null,
      message: '',
      className: ''
    }}
    />
  );
  expect(container.querySelector('.badge')).toBeNull();
});

test('Badge render() should return a Bootstrap style badge when valid', () => {
  const { container } = render(
    <Badge {...{
      status: 'success',
      message: 'Hello world',
      className: 'customclass'
    }}
    />
  );
  expect(container.querySelectorAll('.badge').length).toBe(1);
  expect(container.querySelectorAll('.text-bg-success').length).toBe(1);
  expect(container.querySelectorAll('.customclass').length).toBe(1);
  expect(container.innerHTML).toContain('Hello world');
});

test('Badge applies default props when not provided', () => {
  const { container } = render(
    <Badge message="Test" />
  );
  const badge = container.querySelector('.badge');
  expect(badge).not.toBeNull();
  expect(badge.classList.contains('rounded-pill')).toBe(true);
  expect(badge.classList.contains('badge-default')).toBe(true);
  expect(badge.classList.contains('text-bg-default')).toBe(true);
});

test('Badge applies default status when status is undefined', () => {
  const { container } = render(
    <Badge message="Test" status={undefined} />
  );
  const badge = container.querySelector('.badge');
  expect(badge).not.toBeNull();
  expect(badge.classList.contains('badge-default')).toBe(true);
});

test('Badge renders with inverted status color class', () => {
  const { container } = render(
    <Badge
      status="warning"
      message="Inverted"
      inverted
    />
  );
  const badge = container.querySelector('.badge');
  expect(badge.classList.contains('text-bg-warning--inverted')).toBe(true);
  expect(badge.classList.contains('text-bg-warning')).toBe(false);
  expect(badge.classList.contains('badge-warning')).toBe(true);
});

test('Badge renders with non-inverted status color class by default', () => {
  const { container } = render(
    <Badge
      status="info"
      message="Normal"
    />
  );
  const badge = container.querySelector('.badge');
  expect(badge.classList.contains('text-bg-info')).toBe(true);
  expect(badge.classList.contains('text-bg-info--inverted')).toBe(false);
});

test('Badge renders correctly with all valid statuses', () => {
  statuses.forEach((status) => {
    const { container } = render(
      <Badge status={status} message={`${status} badge`} />
    );
    const badge = container.querySelector('.badge');
    expect(badge).not.toBeNull();
    expect(badge.classList.contains(`badge-${status}`)).toBe(true);
    expect(badge.classList.contains(`text-bg-${status}`)).toBe(true);
  });
});

test('Badge renders with multiple custom classes', () => {
  const { container } = render(
    <Badge
      status="success"
      message="Multi-class"
      className="class1 class2 class3"
    />
  );
  const badge = container.querySelector('.badge');
  expect(badge.classList.contains('class1')).toBe(true);
  expect(badge.classList.contains('class2')).toBe(true);
  expect(badge.classList.contains('class3')).toBe(true);
});

test('Badge renders with message as string', () => {
  const { container } = render(
    <Badge status="primary" message="String message" />
  );
  const badge = container.querySelector('.badge');
  expect(badge.textContent).toBe('String message');
});

test('Badge renders with message as React element', () => {
  const { container } = render(
    <Badge
      status="danger"
      message={<span data-testid="custom-element">Element message</span>}
    />
  );
  const badge = container.querySelector('.badge');
  expect(badge).not.toBeNull();
  expect(badge.querySelector('[data-testid="custom-element"]')).not.toBeNull();
  expect(badge.textContent).toContain('Element message');
});

test('Badge renders with empty message', () => {
  const { container } = render(
    <Badge status="secondary" message="" />
  );
  const badge = container.querySelector('.badge');
  expect(badge).not.toBeNull();
  expect(badge.textContent).toBe('');
});

test('Badge renders with no message prop', () => {
  const { container } = render(
    <Badge status="info" />
  );
  const badge = container.querySelector('.badge');
  expect(badge).not.toBeNull();
});

test('Badge renders with numeric message', () => {
  const { container } = render(
    <Badge status="warning" message={42} />
  );
  const badge = container.querySelector('.badge');
  expect(badge.textContent).toBe('42');
});

test('Badge with inverted and custom className combines all classes', () => {
  const { container } = render(
    <Badge
      status="danger"
      message="Combined"
      className="custom-badge extra"
      inverted
    />
  );
  const badge = container.querySelector('.badge');
  expect(badge.classList.contains('badge')).toBe(true);
  expect(badge.classList.contains('badge-danger')).toBe(true);
  expect(badge.classList.contains('text-bg-danger--inverted')).toBe(true);
  expect(badge.classList.contains('custom-badge')).toBe(true);
  expect(badge.classList.contains('extra')).toBe(true);
});

test('Badge renders span element with correct structure', () => {
  const { container } = render(
    <Badge status="success" message="Test" />
  );
  const badge = container.querySelector('span.badge');
  expect(badge).not.toBeNull();
  expect(badge.tagName).toBe('SPAN');
});
