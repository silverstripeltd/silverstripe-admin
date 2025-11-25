/* global jest, test, expect */
import React, { act } from 'react';
import { render } from '@testing-library/react';
import UnsavedChangesIndicatorTimer from '../UnsavedChangesIndicatorTimer';

const ONE_MINUTE = 60000;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

function makeProps(obj = {}) {
  return {
    isDirty: false,
    UnsavedChangesIndicatorComponent: ({ level, elapsedMinutes }) => (
      <div data-testid="indicator" data-level={level} data-mins={elapsedMinutes}/>
    ),
    minutes: {
      notice: 5,
      warning: 10,
    },
    ...obj,
  };
}

function getLevel(container) {
  return container.querySelector('[data-testid="indicator"]').getAttribute('data-level');
}

function getMinutes(container) {
  return container.querySelector('[data-testid="indicator"]').getAttribute('data-mins');
}

test('Container does not show status when not dirty', () => {
  const { container } = render(
    <UnsavedChangesIndicatorTimer {...makeProps({ isDirty: false })} />
  );
  expect(getLevel(container)).toBe('none');
});

test('Container shows notice after 5 minutes', () => {
  const { container } = render(
    <UnsavedChangesIndicatorTimer {...makeProps({ isDirty: true })} />
  );
  expect(getLevel(container)).toBe('none');
  act(() => jest.advanceTimersByTime(5 * ONE_MINUTE));
  expect(getLevel(container)).toBe('notice');
});

test('Container shows warning after 10 minutes', () => {
  const { container } = render(
    <UnsavedChangesIndicatorTimer {...makeProps({ isDirty: true })} />
  );
  act(() => jest.advanceTimersByTime(10 * ONE_MINUTE));
  expect(getLevel(container)).toBe('warning');
});

test('Container resets timer when becomes pristine', () => {
  const { container, rerender } = render(
    <UnsavedChangesIndicatorTimer {...makeProps({ isDirty: true })} />
  );
  act(() => jest.advanceTimersByTime(6 * ONE_MINUTE));
  expect(getLevel(container)).toBe('notice');
  rerender(<UnsavedChangesIndicatorTimer {...makeProps({ isDirty: false })} />);
  expect(getLevel(container)).toBe('none');
});

test('Container restarts timer on new dirty session', () => {
  const { rerender, container } = render(
    <UnsavedChangesIndicatorTimer {...makeProps({ isDirty: true })} />
  );
  act(() => jest.advanceTimersByTime(6 * ONE_MINUTE));
  expect(getLevel(container)).toBe('notice');
  rerender(<UnsavedChangesIndicatorTimer {...makeProps({ isDirty: false })} />);
  expect(getLevel(container)).toBe('none');
  rerender(<UnsavedChangesIndicatorTimer {...makeProps({ isDirty: true })} />);
  expect(getLevel(container)).toBe('none');
  act(() => jest.advanceTimersByTime(5 * ONE_MINUTE));
  expect(getLevel(container)).toBe('notice');
});

test('Container cleans up timers on unmount', () => {
  const { unmount } = render(
    <UnsavedChangesIndicatorTimer {...makeProps({ isDirty: true })} />
  );
  const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
  unmount();
  expect(clearIntervalSpy).toHaveBeenCalled();
  clearIntervalSpy.mockRestore();
});

test('Container never shows notice when minutes.notice is 0', () => {
  const props = {
    isDirty: true,
    minutes: { notice: 0, warning: 10 },
  };
  const { container } = render(
    <UnsavedChangesIndicatorTimer {...makeProps(props)}/>
  );
  act(() => jest.advanceTimersByTime(10 * ONE_MINUTE));
  expect(getLevel(container)).toBe('warning');
});

test('Container never shows warning when minutes.warning is 0', () => {
  const { container } = render(
    <UnsavedChangesIndicatorTimer {...makeProps({
      isDirty: true,
      minutes: { notice: 5, warning: 0 },
    })}
    />
  );
  expect(getLevel(container)).toBe('none');
  act(() => jest.advanceTimersByTime(5 * ONE_MINUTE));
  expect(getLevel(container)).toBe('notice');
  act(() => jest.advanceTimersByTime(5 * ONE_MINUTE));
  expect(getLevel(container)).toBe('notice');
});

test('Container never shows any level when both minutes are 0', () => {
  const { container } = render(
    <UnsavedChangesIndicatorTimer {...makeProps({
      isDirty: true,
      minutes: { notice: 0, warning: 0 },
    })}
    />
  );
  expect(getLevel(container)).toBe('none');
  act(() => jest.advanceTimersByTime(10 * ONE_MINUTE));
  expect(getLevel(container)).toBe('none');
});

test('Container shows correct minutes rounded down', () => {
  const { container } = render(
    <UnsavedChangesIndicatorTimer {...makeProps({
      isDirty: true,
      minutes: { notice: 5, warning: 10 },
    })}
    />
  );
  act(() => jest.advanceTimersByTime(5 * ONE_MINUTE));
  expect(getMinutes(container)).toBe('5');
  act(() => jest.advanceTimersByTime(1 * ONE_MINUTE));
  expect(getMinutes(container)).toBe('6');
  act(() => jest.advanceTimersByTime(0.5 * ONE_MINUTE));
  expect(getMinutes(container)).toBe('6');
  act(() => jest.advanceTimersByTime(0.5 * ONE_MINUTE));
  expect(getMinutes(container)).toBe('7');
});
