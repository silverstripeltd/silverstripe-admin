/* global jest, test, expect */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TextFieldWrapper, { Component as TextField } from '../TextField';
import { propTypes as inputFieldPropTypes } from '../../InputField/InputField';

function makeProps(obj = {}) {
  return {
    title: '',
    name: '',
    value: '',
    ...obj
  };
}

test('TextField should render input with value by default', () => {
  render(
    <TextField {...makeProps({
      id: 'Field',
      name: 'Field',
      value: 'Hello'
    })}
    />
  );
  const input = screen.getByRole('textbox');
  expect(input.getAttribute('type')).toBe('text');
  expect(input.value).toBe('Hello');
});

test('TextField uses InputField propTypes', () => {
  expect(TextField.propTypes).toBe(inputFieldPropTypes);
});

test('TextField onChange should pass id and value', () => {
  const onChange = jest.fn();
  render(
    <TextField {...makeProps({
      id: 'Field',
      name: 'Field',
      onChange
    })}
    />
  );
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'value' } });
  expect(onChange).toBeCalledTimes(1);
  expect(onChange.mock.calls[0][1]).toEqual({ id: 'Field', value: 'value' });
});

test('TextField should not call onChange when readOnly', () => {
  const onChange = jest.fn();
  render(
    <TextField {...makeProps({
      id: 'Field',
      name: 'Field',
      onChange,
      readOnly: true
    })}
    />
  );
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'value' } });
  expect(onChange).not.toBeCalled();
});

test('TextField should pass through onBlur handler', () => {
  const onBlur = jest.fn();
  render(
    <TextField {...makeProps({
      id: 'Field',
      name: 'Field',
      onBlur
    })}
    />
  );
  const input = screen.getByRole('textbox');
  fireEvent.blur(input);
  expect(onBlur).toBeCalledTimes(1);
});

test('TextField multiLine() should include columns when provided', () => {
  const { container } = render(
    <TextField {...makeProps({
      data: {
        rows: 2,
        columns: 5
      }
    })}
    />
  );
  const textarea = container.querySelector('textarea');
  expect(textarea.getAttribute('rows')).toBe('2');
  expect(textarea.getAttribute('cols')).toBe('5');
});

test('TextField multiLine() should not be multi-line for one row', () => {
  const { container } = render(
    <TextField {...makeProps({
      data: {
        rows: 1
      }
    })}
    />
  );
  expect(container.querySelectorAll('textarea')).toHaveLength(0);
  const input = screen.getByRole('textbox');
  expect(input.getAttribute('type')).toBe('text');
});

test('TextField fieldHolder wrapper should render a form group', () => {
  const { container } = render(
    <TextFieldWrapper {...makeProps({
      id: 'Field',
      name: 'Field',
      title: 'Field'
    })}
    />
  );
  expect(container.querySelectorAll('.form-group')).toHaveLength(1);
  expect(container.querySelector('input')).not.toBeNull();
});

test('TextField onChange() should call the onChange function on props', () => {
  const onChange = jest.fn();
  const { container } = render(
    <TextField {...makeProps({
      onChange
    })}
    />
  );
  const input = container.querySelector('input');
  fireEvent.change(input, { target: { value: 'x' } });
  expect(onChange).toBeCalled();
});

test('TextField multiLine() should not be multi-line for empty data', () => {
  const { container } = render(<TextField {...makeProps()}/>);
  const input = container.querySelector('input');
  expect(input.getAttribute('type')).toBe('text');
  expect(input.hasAttribute('multiline')).toBe(false);
});

test('TextField multiLine() should be multi-line for three rows', () => {
  const { container } = render(
    <TextField {...makeProps({
      data: {
        rows: 3
      }
    })}
    />
  );
  expect(container.querySelectorAll('textarea')).toHaveLength(1);
  expect(container.querySelector('textarea').getAttribute('rows')).toBe('3');
});

test('TextField attributs should assign placeholder', () => {
  const { container } = render(
    <TextField {...makeProps({
      attributes: {
        placeholder: 'txt'
      }
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('placeholder')).toBe('txt');
});
