/* global jest, test, expect */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import InputField from '../InputField';

jest.mock('components/Tip/Tip', () => ({
  __esModule: true,
  default: ({ fieldTitle, id }) => <div id={id}>{fieldTitle}</div>,
  tipShape: {},
}));

function makeProps(obj = {}) {
  return {
    id: 'my-id',
    name: 'MyName',
    className: 'my-classname',
    extraClass: 'my-extra-class',
    onChange: () => {},
    onBlur: () => {},
    onFocus: () => {},
    value: 'my-value',
    readOnly: false,
    disabled: false,
    placeholder: 'My placeholder',
    type: 'text',
    autoFocus: false,
    attributes: {
      'data-abc': '123',
      'data-def': '456',
    },
    title: 'My title',
    ...obj
  };
}

test('InputField getInputProps merges className and attributes', () => {
  render(<InputField {...makeProps()} />);
  const input = screen.getByRole('textbox');
  expect(input.className).toContain('my-classname');
  expect(input.className).toContain('my-extra-class');
  expect(input.getAttribute('data-abc')).toBe('123');
  expect(input.getAttribute('data-def')).toBe('456');
  expect(input.getAttribute('placeholder')).toBe('My placeholder');
});

test('InputField onChange calls with id and value', () => {
  const onChange = jest.fn();
  render(<InputField {...makeProps({ onChange })} />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Updated value' } });
  expect(onChange).toHaveBeenCalledWith(expect.any(Object), { id: 'my-id', value: 'Updated value' });
});

test('InputField readOnly prevents onChange handler', () => {
  const onChange = jest.fn();
  render(<InputField {...makeProps({ onChange, readOnly: true })} />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Updated value' } });
  expect(onChange).not.toHaveBeenCalled();
  expect(input.readOnly).toBe(true);
});

test('InputField fires blur and focus handlers', () => {
  const onBlur = jest.fn();
  const onFocus = jest.fn();
  render(<InputField {...makeProps({ onBlur, onFocus })} />);
  const input = screen.getByRole('textbox');
  fireEvent.focus(input);
  fireEvent.blur(input);
  expect(onFocus).toHaveBeenCalled();
  expect(onBlur).toHaveBeenCalled();
});

test('InputField renders with a tip', () => {
  render(<InputField {...makeProps({ tip: { content: 'Help' } })} />);
  const tip = screen.getByText('My title');
  expect(tip.id).toBe('my-id-tip');
});

test('InputField render() renders', () => {
  const { container } = render(<InputField {...makeProps()}/>);
  expect(container.querySelectorAll('input')).toHaveLength(1);
});

test('InputField render() renders with a null value', () => {
  const { container } = render(
    <InputField {...makeProps({
      value: null
    })}
    />
  );
  expect(container.querySelectorAll('input')).toHaveLength(1);
});
