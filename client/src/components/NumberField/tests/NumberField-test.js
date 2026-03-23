/* global jest, test, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NumberFieldWrapper, { Component as NumberField } from '../NumberField';

function makeProps(obj = {}) {
  return {
    id: 'Field',
    name: 'Field',
    value: '',
    title: '',
    ...obj
  };
}

test('NumberField should render a number input by default', () => {
  const { container } = render(
    <NumberField {...makeProps({
      value: '5'
    })}
    />
  );
  const input = container.querySelector('input');
  expect(input.getAttribute('type')).toBe('number');
  expect(input.value).toBe('5');
  expect(input.className).not.toContain('undefined');
});

test('NumberField should force number type even with a type prop', () => {
  const { container } = render(
    <NumberField {...makeProps({
      type: 'text'
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('type')).toBe('number');
});

test('NumberField should pass through classes and attributes', () => {
  const { container } = render(
    <NumberField {...makeProps({
      className: 'custom-class',
      extraClass: 'extra-class',
      attributes: {
        'data-test': 'value'
      }
    })}
    />
  );
  const input = container.querySelector('input');
  expect(input.className).toContain('custom-class');
  expect(input.className).toContain('extra-class');
  expect(input.getAttribute('data-test')).toBe('value');
});

test('NumberField onChange should pass id and value', () => {
  const onChange = jest.fn();
  const { container } = render(
    <NumberField {...makeProps({
      onChange
    })}
    />
  );
  const input = container.querySelector('input');
  fireEvent.change(input, { target: { value: '42' } });
  expect(onChange).toBeCalledTimes(1);
  expect(onChange.mock.calls[0][1]).toEqual({ id: 'Field', value: '42' });
});

test('NumberField should not call onChange when readOnly', () => {
  const onChange = jest.fn();
  const { container } = render(
    <NumberField {...makeProps({
      onChange,
      readOnly: true
    })}
    />
  );
  const input = container.querySelector('input');
  fireEvent.change(input, { target: { value: '42' } });
  expect(onChange).not.toBeCalled();
});

test('NumberField fieldHolder wrapper should render a form group', () => {
  const { container } = render(
    <NumberFieldWrapper {...makeProps({
      title: 'Field'
    })}
    />
  );
  expect(container.querySelectorAll('.form-group')).toHaveLength(1);
  expect(container.querySelector('input')).not.toBeNull();
});
