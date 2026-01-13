/* global jest, test, describe, it, expect, beforeEach, afterEach */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Focusedzone from '../Focusedzone';

function makeProps(obj = {}) {
  return {
    className: 'my-classname',
    onClickOut: jest.fn(),
    ...obj
  };
}

test('Focusedzone.render() renders with children', () => {
  const { container } = render(
    <Focusedzone {...makeProps()}>
      <p>lorem</p>
      <p>ipsum</p>
    </Focusedzone>
  );
  expect(container.querySelectorAll('div')).toHaveLength(1);
});

test('Focusedzone renders with correct className', () => {
  const { container } = render(
    <Focusedzone {...makeProps({ className: 'custom-class' })}>
      <p>content</p>
    </Focusedzone>
  );
  const wrapper = container.querySelector('div');
  expect(wrapper.classList.contains('custom-class')).toBe(true);
});

test('Focusedzone renders with empty className by default', () => {
  const { container } = render(
    <Focusedzone {...makeProps({ className: undefined })}>
      <p>content</p>
    </Focusedzone>
  );
  const wrapper = container.querySelector('div');
  expect(wrapper.className).toBe('');
});

test('Focusedzone renders with no className prop when not provided', () => {
  const { container } = render(
    <Focusedzone onClickOut={jest.fn()}>
      <p>content</p>
    </Focusedzone>
  );
  const wrapper = container.querySelector('div');
  expect(wrapper.className).toBe('');
});

test('Focusedzone triggers onClickOut when clicking outside', () => {
  const onClickOut = jest.fn();
  render(
    <Focusedzone {...makeProps({ onClickOut })}>
      <p>content</p>
    </Focusedzone>
  );
  fireEvent.click(document);
  expect(onClickOut).toHaveBeenCalledTimes(1);
});

test('Focusedzone does not trigger onClickOut when clicking inside', () => {
  const onClickOut = jest.fn();
  const { container } = render(
    <Focusedzone {...makeProps({ onClickOut })}>
      <p data-testid="inner-content">content</p>
    </Focusedzone>
  );
  const innerElement = container.querySelector('p');
  fireEvent.click(innerElement);
  expect(onClickOut).not.toHaveBeenCalled();
});

test('Focusedzone does not trigger onClickOut when clicking on component wrapper', () => {
  const onClickOut = jest.fn();
  const { container } = render(
    <Focusedzone {...makeProps({ onClickOut })}>
      <p>content</p>
    </Focusedzone>
  );
  const wrapper = container.querySelector('div');
  fireEvent.click(wrapper);
  expect(onClickOut).not.toHaveBeenCalled();
});

test('Focusedzone resets wasClicked flag after document click', () => {
  const onClickOut = jest.fn();
  const { container } = render(
    <Focusedzone {...makeProps({ onClickOut })}>
      <p>content</p>
    </Focusedzone>
  );
  const innerElement = container.querySelector('p');
  fireEvent.click(innerElement);
  fireEvent.click(document);
  expect(onClickOut).toHaveBeenCalledTimes(1);
});

test('Focusedzone passes event object to onClickOut', () => {
  const onClickOut = jest.fn();
  render(
    <Focusedzone {...makeProps({ onClickOut })}>
      <p>content</p>
    </Focusedzone>
  );
  fireEvent.click(document);
  expect(onClickOut).toHaveBeenCalledWith(expect.any(Object));
  expect(onClickOut.mock.calls[0][0].type).toBe('click');
});

test('Focusedzone can handle multiple clicks outside', () => {
  const onClickOut = jest.fn();
  render(
    <Focusedzone {...makeProps({ onClickOut })}>
      <p>content</p>
    </Focusedzone>
  );
  fireEvent.click(document);
  fireEvent.click(document);
  fireEvent.click(document);
  expect(onClickOut).toHaveBeenCalledTimes(3);
});

test('Focusedzone renders multiple children correctly', () => {
  const { container } = render(
    <Focusedzone {...makeProps()}>
      <p>first</p>
      <div>second</div>
      <span>third</span>
    </Focusedzone>
  );
  const wrapper = container.querySelector('div');
  expect(wrapper.children).toHaveLength(3);
  expect(wrapper.children[0].textContent).toBe('first');
  expect(wrapper.children[1].textContent).toBe('second');
  expect(wrapper.children[2].textContent).toBe('third');
});

test('Focusedzone calls passBackContainer with container ref when provided', () => {
  const passBackContainer = jest.fn();
  const { container } = render(
    <Focusedzone {...makeProps({ passBackContainer })}>
      <p>content</p>
    </Focusedzone>
  );
  expect(passBackContainer).toHaveBeenCalled();
  expect(passBackContainer).toHaveBeenCalledWith(container.querySelector('div'));
});

test('Focusedzone does not call passBackContainer when not provided', () => {
  render(
    <Focusedzone onClickOut={jest.fn()}>
      <p>content</p>
    </Focusedzone>
  );
  // No error should occur, test passes if no exception is thrown
});

test('Focusedzone calls passBackContainer when containerRef updates', () => {
  const passBackContainer = jest.fn();
  const { container } = render(
    <Focusedzone {...makeProps({ passBackContainer })}>
      <p>content</p>
    </Focusedzone>
  );
  expect(passBackContainer).toHaveBeenCalledTimes(1);
  const containerDiv = container.querySelector('div');
  expect(passBackContainer).toHaveBeenCalledWith(containerDiv);
});

test('Focusedzone calls passBackContainer with correct container reference', () => {
  const passBackContainer = jest.fn();
  const { container } = render(
    <Focusedzone {...makeProps({ passBackContainer, className: 'test-wrapper' })}>
      <p>content</p>
    </Focusedzone>
  );
  const wrapper = container.querySelector('div.test-wrapper');
  expect(passBackContainer).toHaveBeenCalledWith(wrapper);
  expect(passBackContainer.mock.calls[0][0]).toBe(wrapper);
});

test('Focusedzone updates passBackContainer callback dependency', () => {
  const passBackContainer1 = jest.fn();
  const passBackContainer2 = jest.fn();
  const { container, rerender } = render(
    <Focusedzone {...makeProps({ passBackContainer: passBackContainer1 })}>
      <p>content</p>
    </Focusedzone>
  );
  expect(passBackContainer1).toHaveBeenCalledTimes(1);
  expect(passBackContainer2).not.toHaveBeenCalled();
  rerender(
    <Focusedzone {...makeProps({ passBackContainer: passBackContainer2 })}>
      <p>content</p>
    </Focusedzone>
  );
  expect(passBackContainer1).toHaveBeenCalledTimes(2);
  expect(passBackContainer2).toHaveBeenCalledTimes(1);
  expect(passBackContainer2).toHaveBeenCalledWith(container.querySelector('div'));
});
