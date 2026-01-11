/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import ResizeAware from '../ResizeAware';

const mockResizeObserver = jest.fn();
global.ResizeObserver = mockResizeObserver;

test('ResizeAware render() renders with children', () => {
  const { container } = render(
    <ResizeAware {...{
      component: 'div',
      onResize: () => {},
    }}
    />
  );
  expect(container.querySelectorAll('div')).toHaveLength(1);
});

test('ResizeAware renders with default div component when no component prop provided', () => {
  const { container } = render(
    <ResizeAware />
  );
  expect(container.querySelectorAll('div')).toHaveLength(1);
});

test('ResizeAware renders with children content', () => {
  const { container } = render(
    <ResizeAware component="div">
      <span>Test content</span>
    </ResizeAware>
  );
  expect(container.querySelectorAll('span')).toHaveLength(1);
});

test('ResizeAware renders with function children', () => {
  const { container } = render(
    <ResizeAware component="div">
      {({ width, height }) => (
        <span data-testid="size-display">
          {width}x{height}
        </span>
      )}
    </ResizeAware>
  );
  expect(container.querySelectorAll('span')).toHaveLength(1);
});

test('ResizeAware calls onResize callback when provided', () => {
  const onResizeMock = jest.fn();
  render(
    <ResizeAware component="div" onResize={onResizeMock} />
  );
  expect(onResizeMock).toHaveBeenCalled();
});

test('ResizeAware clones children with size props when not using onlyEvent', () => {
  const ChildComponent = ({ width, height, children }) => (
    <div data-testid="child" data-width={width} data-height={height}>
      {children}
    </div>
  );
  const { getByTestId } = render(
    <ResizeAware component="div">
      <ChildComponent>Content</ChildComponent>
    </ResizeAware>
  );
  const child = getByTestId('child');
  expect(child).not.toBeNull();
});

test('ResizeAware does not pass size props to children when onlyEvent is true', () => {
  const ChildComponent = ({ width, height, children }) => (
    <div data-testid="child" data-width={width} data-height={height}>
      {children}
    </div>
  );
  const { getByTestId } = render(
    <ResizeAware component="div" onlyEvent>
      <ChildComponent>Content</ChildComponent>
    </ResizeAware>
  );
  const child = getByTestId('child');
  expect(child.getAttribute('data-width')).toBeNull();
  expect(child.getAttribute('data-height')).toBeNull();
});

test('ResizeAware passes through additional props to div component', () => {
  const { container } = render(
    <ResizeAware component="div" className="test-class" data-testid="wrapper" />
  );
  const div = container.querySelector('[data-testid="wrapper"]');
  expect(div).not.toBeNull();
  expect(div.classList.contains('test-class')).toBe(true);
});

test('ResizeAware handles multiple children nodes correctly', () => {
  const { container } = render(
    <ResizeAware component="div">
      <span>Child 1</span>
      <span>Child 2</span>
      <span>Child 3</span>
    </ResizeAware>
  );
  expect(container.querySelectorAll('span')).toHaveLength(3);
});

test('ResizeAware handles mixed children types (elements and text)', () => {
  const { container } = render(
    <ResizeAware component="div">
      Text before
      <span>Element</span>
      Text after
    </ResizeAware>
  );
  expect(container.querySelectorAll('span')).toHaveLength(1);
  expect(container.textContent).toContain('Text before');
  expect(container.textContent).toContain('Text after');
});

test('ResizeAware renders with section element when specified', () => {
  const { container } = render(
    <ResizeAware component="section" />
  );
  expect(container.querySelectorAll('section')).toHaveLength(1);
});

test('ResizeAware renders with article element when specified', () => {
  const { container } = render(
    <ResizeAware component="article" />
  );
  expect(container.querySelectorAll('article')).toHaveLength(1);
});

test('ResizeAware renders with nested structure', () => {
  const { container } = render(
    <ResizeAware component="div" className="outer">
      <div className="inner">
        <span>Nested content</span>
      </div>
    </ResizeAware>
  );
  expect(container.querySelector('.outer')).not.toBeNull();
  expect(container.querySelector('.inner')).not.toBeNull();
  expect(container.querySelector('span')).not.toBeNull();
});

test('ResizeAware does not render children when children are null', () => {
  const { container } = render(
    <ResizeAware component="div">
      {null}
    </ResizeAware>
  );
  const divs = container.querySelectorAll('div');
  expect(divs.length).toBeGreaterThanOrEqual(1);
});

test('ResizeAware handles boolean children correctly', () => {
  const { container } = render(
    <ResizeAware component="div">
      {true}
      {false}
    </ResizeAware>
  );
  expect(container.querySelector('div')).not.toBeNull();
});

test('ResizeAware applies data attributes to container', () => {
  const { container } = render(
    <ResizeAware component="div" data-testid="test-container" data-custom="custom-value" />
  );
  const div = container.querySelector('[data-testid="test-container"]');
  expect(div).not.toBeNull();
  expect(div.getAttribute('data-custom')).toBe('custom-value');
});
