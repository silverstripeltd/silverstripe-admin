/* global jest, test, expect */

import React from 'react';
import { render } from '@testing-library/react';
import { FileSchemaHandler } from '../fileSchemaModalHandler';

let capturedProps = {};
const mockComponent = (props) => {
  capturedProps = props;
  return <div data-testid="target-component">Target Component</div>;
};

function makeProps(obj = {}) {
  capturedProps = {};
  return {
    Component: mockComponent,
    schemaUrl: 'http://example.com/schema',
    fileAttributes: { ID: 1, Title: 'Test File', Description: 'Test Description' },
    actions: {
      schema: {
        setSchemaStateOverrides: jest.fn(),
      },
    },
    ...obj
  };
}

test('FileSchemaHandler renders TargetComponent', () => {
  const { getByTestId } = render(<FileSchemaHandler {...makeProps()} />);
  const targetComponent = getByTestId('target-component');
  expect(targetComponent).not.toBeNull();
});

test('FileSchemaHandler passes through props to TargetComponent', () => {
  const customProp = 'custom-value';
  render(<FileSchemaHandler {...makeProps({ customProp })} />);
  expect(capturedProps.customProp).toBe(customProp);
});

test('FileSchemaHandler passes setOverrides to TargetComponent', () => {
  render(<FileSchemaHandler {...makeProps()} />);
  expect(capturedProps.setOverrides).toBeDefined();
  expect(typeof capturedProps.setOverrides).toBe('function');
});

test('FileSchemaHandler calls setSchemaStateOverrides on mount with overrides', () => {
  const setSchemaStateOverrides = jest.fn();
  const fileAttributes = { ID: 1, Title: 'Test File', Description: 'Test Description' };
  render(
    <FileSchemaHandler
      {...makeProps({
        actions: {
          schema: { setSchemaStateOverrides },
        },
        fileAttributes,
      })}
    />
  );
  expect(setSchemaStateOverrides).toHaveBeenCalledWith(
    'http://example.com/schema',
    {
      fields: [
        { name: 'Title', value: 'Test File' },
        { name: 'Description', value: 'Test Description' },
      ],
    }
  );
});

test('FileSchemaHandler excludes ID from overrides', () => {
  const setSchemaStateOverrides = jest.fn();
  const fileAttributes = { ID: 123, Name: 'Test' };
  render(
    <FileSchemaHandler
      {...makeProps({
        actions: {
          schema: { setSchemaStateOverrides },
        },
        fileAttributes,
      })}
    />
  );
  const overrides = setSchemaStateOverrides.mock.calls[0][1];
  const hasIdField = overrides.fields.some((field) => field.name === 'ID');
  expect(hasIdField).toBe(false);
});

test('FileSchemaHandler calls setSchemaStateOverrides with null on unmount', () => {
  const setSchemaStateOverrides = jest.fn();
  const { unmount } = render(
    <FileSchemaHandler
      {...makeProps({
        actions: {
          schema: { setSchemaStateOverrides },
        },
      })}
    />
  );
  setSchemaStateOverrides.mockClear();
  unmount();
  expect(setSchemaStateOverrides).toHaveBeenCalledWith('http://example.com/schema', null);
});

test('FileSchemaHandler does not call setSchemaStateOverrides on mount without schemaUrl', () => {
  const setSchemaStateOverrides = jest.fn();
  render(
    <FileSchemaHandler
      {...makeProps({
        schemaUrl: null,
        actions: {
          schema: { setSchemaStateOverrides },
        },
      })}
    />
  );
  expect(setSchemaStateOverrides).not.toHaveBeenCalled();
});

test('FileSchemaHandler does not call setSchemaStateOverrides on unmount without schemaUrl', () => {
  const setSchemaStateOverrides = jest.fn();
  const { unmount } = render(
    <FileSchemaHandler
      {...makeProps({
        schemaUrl: null,
        actions: {
          schema: { setSchemaStateOverrides },
        },
      })}
    />
  );
  setSchemaStateOverrides.mockClear();
  unmount();
  expect(setSchemaStateOverrides).not.toHaveBeenCalled();
});

test('FileSchemaHandler handles empty fileAttributes', () => {
  const setSchemaStateOverrides = jest.fn();
  render(
    <FileSchemaHandler
      {...makeProps({
        fileAttributes: {},
        actions: {
          schema: { setSchemaStateOverrides },
        },
      })}
    />
  );
  expect(setSchemaStateOverrides).toHaveBeenCalledWith(
    'http://example.com/schema',
    { fields: [] }
  );
});

test('FileSchemaHandler handles fileAttributes with only ID', () => {
  const setSchemaStateOverrides = jest.fn();
  render(
    <FileSchemaHandler
      {...makeProps({
        fileAttributes: { ID: 456 },
        actions: {
          schema: { setSchemaStateOverrides },
        },
      })}
    />
  );
  expect(setSchemaStateOverrides).toHaveBeenCalledWith(
    'http://example.com/schema',
    { fields: [] }
  );
});

test('FileSchemaHandler handles multiple attributes correctly', () => {
  const setSchemaStateOverrides = jest.fn();
  const fileAttributes = {
    ID: 789,
    Title: 'Document',
    FileName: 'doc.pdf',
    FileSize: 1024,
    Description: 'Important document',
  };
  render(
    <FileSchemaHandler
      {...makeProps({
        fileAttributes,
        actions: {
          schema: { setSchemaStateOverrides },
        },
      })}
    />
  );
  const overrides = setSchemaStateOverrides.mock.calls[0][1];
  expect(overrides.fields).toHaveLength(4);
  expect(overrides.fields).toContainEqual({ name: 'Title', value: 'Document' });
  expect(overrides.fields).toContainEqual({ name: 'FileName', value: 'doc.pdf' });
  expect(overrides.fields).toContainEqual({ name: 'FileSize', value: 1024 });
  expect(overrides.fields).toContainEqual({ name: 'Description', value: 'Important document' });
});

test('FileSchemaHandler does not pass Component prop to TargetComponent', () => {
  render(<FileSchemaHandler {...makeProps()} />);
  expect(capturedProps.Component).toBeUndefined();
});
