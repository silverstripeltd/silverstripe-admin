/* global jest, test, expect */

import React from 'react';
import moment from 'moment';
import { render, fireEvent } from '@testing-library/react';
import TimeFieldWrapper, { Component as TimeField } from '../TimeField';

jest.mock('modernizr', () => ({
  inputtypes: {
    time: false,
  },
}));

function getSharedProps() {
  return {
    id: 'time',
    title: '',
    name: '',
    value: ''
  };
}

function makePropsHtml4(obj = {}) {
  return {
    data: {
      html5: false,
    },
    modernizr: {
      inputtypes: {
        time: false,
      },
    },
    ...getSharedProps(),
    ...obj
  };
}

function makePropsHtml5NoBrowserSupport(obj = {}) {
  return {
    data: {
      html5: true
    },
    modernizr: {
      inputtypes: {
        time: false,
      },
    },
    ...getSharedProps(),
    ...obj
  };
}

function makePropsHtml5(obj = {}) {
  return {
    data: {
      html5: true
    },
    modernizr: {
      inputtypes: {
        time: true,
      },
    },
    ...getSharedProps(),
    ...obj
  };
}

function makePropsHtml5OptedOut(obj = {}) {
  return {
    data: {
      html5: false
    },
    modernizr: {
      inputtypes: {
        date: true,
        time: true
      }
    },
    ...obj
  };
}

test('TimeField convertToIso() html4 value', () => {
  const onChange = jest.fn();
  const { container } = render(
    <TimeField {...makePropsHtml4({
      onChange
    })}
    />
  );
  const input = container.querySelector('input#time');
  fireEvent.change(input, { target: { value: '1:22 PM' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'time', value: '13:22:00' }
  );
});

test('TimeField convertToIso() html4 invalid value', () => {
  const onChange = jest.fn();
  const { container } = render(
    <TimeField {...makePropsHtml4({
      onChange
    })}
    />
  );
  const input = container.querySelector('input#time');
  fireEvent.change(input, { target: { value: '13:99 PM' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'time', value: '' }
  );
});

test('TimeField html5 uses time input type and passes through iso time', () => {
  const onChange = jest.fn();
  const { container } = render(
    <TimeField {...makePropsHtml5({
      onChange
    })}
    />
  );
  const input = container.querySelector('input#time');
  expect(input.getAttribute('type')).toBe('time');
  fireEvent.change(input, { target: { value: '13:22:00' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'time', value: '13:22:00' }
  );
});

test('TimeField html5 without browser support renders text input type', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5NoBrowserSupport()} />
  );
  const input = container.querySelector('input#time');
  expect(input.getAttribute('type')).toBe('text');
});

test('TimeField html4 renders localised value', () => {
  const { container } = render(
    <TimeField {...makePropsHtml4({
      value: '13:22:00',
    })}
    />
  );
  const input = container.querySelector('input#time');
  const expectedValue = moment('13:22:00', 'HH:mm:ss').format('LT');
  expect(input.value).toBe(expectedValue);
});

test('TimeField html4 renders empty value for invalid ISO input', () => {
  const { container } = render(
    <TimeField {...makePropsHtml4({
      value: '13:99:99',
    })}
    />
  );
  const input = container.querySelector('input#time');
  expect(input.value).toBe('');
});

test('TimeField should pass through onBlur handler', () => {
  const onBlur = jest.fn();
  const { container } = render(
    <TimeField {...makePropsHtml4({
      onBlur,
    })}
    />
  );
  const input = container.querySelector('input#time');
  fireEvent.blur(input);
  expect(onBlur).toBeCalledTimes(1);
});

test('TimeField renders input with minimal props', () => {
  const { container } = render(
    <TimeField {...makePropsHtml4()} />
  );
  const input = container.querySelector('input');
  expect(input).not.toBeNull();
  expect(input.className).not.toContain('undefined');
});

test('TimeField fieldHolder wrapper should render a form group', () => {
  const { container } = render(
    <TimeFieldWrapper {...makePropsHtml4({
      id: 'Field',
      name: 'Field',
      title: 'Field',
    })}
    />
  );
  expect(container.querySelectorAll('.form-group')).toHaveLength(1);
  expect(container.querySelector('input')).not.toBeNull();
});

test('TimeField without html5 time field support onChange() should call the onChange function on props', () => {
  const onChange = jest.fn();
  const { container } = render(
    <TimeField {...makePropsHtml4({
      onChange
    })}
    />
  );
  const input = container.querySelector('input');
  fireEvent.change(input, { target: { value: 'x' } });
  expect(onChange).toBeCalled();
});

test('TimeField html5 false 03:24 AM', () => {
  const { container } = render(
    <TimeField {...makePropsHtml4({
      value: '03:24 AM',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('3:24 AM');
});

test('TimeField html5 false 03:24', () => {
  const { container } = render(
    <TimeField {...makePropsHtml4({
      value: '03:24',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('3:24 AM');
});

test('TimeField html5 false invalid time', () => {
  const { container } = render(
    <TimeField {...makePropsHtml4({
      value: 'invalid time',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('');
});

test('TimeField html5 false 04:22:39', () => {
  const { container } = render(
    <TimeField {...makePropsHtml4({
      value: '04:22:39',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('4:22 AM');
});

test('TimeField html5 true but no browser support 23:01:23', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5NoBrowserSupport({
      value: '23:01:23',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('11:01 PM');
});

test('TimeField html5 true but no browser support 12:22 AM', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5NoBrowserSupport({
      value: '12:22 AM',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('12:22 PM');
});

test('TimeField html5 true but no browser support invalid time', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5NoBrowserSupport({
      value: 'invalid time',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('');
});

test('TimeField html5 true 23:01:23', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5({
      value: '23:01:23',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('23:01:23');
});

test('TimeField html5 true should use iso format of time value in the input field', () => {
  const onChange = jest.fn();
  const { container } = render(
    <TimeField {...makePropsHtml5({
      id: 'time',
      value: '23:01:23',
      onChange
    })}
    />
  );
  const input = container.querySelector('input');
  fireEvent.change(input, { target: { id: 'time', value: '12:22:33' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'time', value: '12:22:33' }
  );
});

test('TimeField html5 opted out 23:01:23', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5OptedOut({
      value: '23:01:23',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('11:01 PM');
});

test('TimeField html5 opted out should suppress HTML input even if supported', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5OptedOut({
      value: '23:01:23',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('type')).toBe('text');
});

test('TimeField renders input without undefined classes', () => {
  const { container } = render(
    <TimeField {...makePropsHtml4()} />
  );
  const input = container.querySelector('input');
  expect(input.className).not.toContain('undefined');
});
