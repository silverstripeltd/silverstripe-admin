/* global jest, test, describe, it, expect */
import React from 'react';
import { render } from '@testing-library/react';
import CircularLoading from '../CircularLoading';

test('CircularLoading render() can be displayed as "block"', () => {
  const { container } = render(
    <CircularLoading {...{
      block: true,
    }}
    />
  );
  expect(container.querySelectorAll('.ss-circular-loading-indicator--block')).toHaveLength(1);
});

test('CircularLoading render() allows extra classes to be provided', () => {
  const { container } = render(
    <CircularLoading {...{
      className: 'hello-world',
    }}
    />
  );
  expect(container.querySelectorAll('.ss-circular-loading-indicator.hello-world')).toHaveLength(1);
});

test('CircularLoading renders with default size prop', () => {
  const { container } = render(<CircularLoading />);
  const element = container.querySelector('.ss-circular-loading-indicator');
  expect(element.style.height).toBe('6em');
  expect(element.style.width).toBe('6em');
});

test('CircularLoading accepts custom size prop', () => {
  const { container } = render(
    <CircularLoading {...{
      size: '10em',
    }}
    />
  );
  const element = container.querySelector('.ss-circular-loading-indicator');
  expect(element.style.height).toBe('10em');
  expect(element.style.width).toBe('10em');
});

test('CircularLoading renders base class name', () => {
  const { container } = render(<CircularLoading />);
  expect(container.querySelectorAll('.ss-circular-loading-indicator')).toHaveLength(1);
});

test('CircularLoading renders without block class when block is false', () => {
  const { container } = render(
    <CircularLoading {...{
      block: false,
    }}
    />
  );
  expect(container.querySelectorAll('.ss-circular-loading-indicator--block')).toHaveLength(0);
});

test('CircularLoading applies both base and block classes together', () => {
  const { container } = render(
    <CircularLoading {...{
      block: true,
    }}
    />
  );
  const element = container.querySelector('.ss-circular-loading-indicator');
  expect(element.classList.contains('ss-circular-loading-indicator')).toBe(true);
  expect(element.classList.contains('ss-circular-loading-indicator--block')).toBe(true);
});

test('CircularLoading applies base, block, and custom classes together', () => {
  const { container } = render(
    <CircularLoading {...{
      block: true,
      className: 'custom-loader',
    }}
    />
  );
  const element = container.querySelector('.ss-circular-loading-indicator');
  expect(element.classList.contains('ss-circular-loading-indicator')).toBe(true);
  expect(element.classList.contains('ss-circular-loading-indicator--block')).toBe(true);
  expect(element.classList.contains('custom-loader')).toBe(true);
});

test('CircularLoading renders as a div element', () => {
  const { container } = render(<CircularLoading />);
  const element = container.querySelector('div.ss-circular-loading-indicator');
  expect(element).not.toBeNull();
  expect(element.tagName).toBe('DIV');
});

test('CircularLoading accepts multiple custom classes', () => {
  const { container } = render(
    <CircularLoading {...{
      className: 'loader loader-active',
    }}
    />
  );
  const element = container.querySelector('.ss-circular-loading-indicator');
  expect(element.classList.contains('loader')).toBe(true);
  expect(element.classList.contains('loader-active')).toBe(true);
});

test('CircularLoading with size and block props together', () => {
  const { container } = render(
    <CircularLoading {...{
      size: '12em',
      block: true,
    }}
    />
  );
  const element = container.querySelector('.ss-circular-loading-indicator');
  expect(element.style.height).toBe('12em');
  expect(element.style.width).toBe('12em');
  expect(element.classList.contains('ss-circular-loading-indicator--block')).toBe(true);
});

test('CircularLoading renders with no props', () => {
  const { container } = render(<CircularLoading />);
  const element = container.querySelector('.ss-circular-loading-indicator');
  expect(element).not.toBeNull();
  expect(element.classList.contains('ss-circular-loading-indicator')).toBe(true);
});
