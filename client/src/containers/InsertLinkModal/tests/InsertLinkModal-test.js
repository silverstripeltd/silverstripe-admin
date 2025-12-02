/* global jest, test, expect */

import React from 'react';
import { render } from '@testing-library/react';

import { InsertLinkModal } from '../InsertLinkModal';

const mockFormBuilderModalProps = {};

jest.mock('components/FormBuilderModal/FormBuilderModal', () => (props) => {
  Object.assign(mockFormBuilderModalProps, props);
  return <div data-testid="form-builder-modal">Form Builder Modal</div>;
});

jest.mock('containers/InsertLinkModal/fileSchemaModalHandler', () => (component) => component);

function makeProps(obj = {}) {
  return {
    isOpen: false,
    schemaUrl: 'http://example.com/schema',
    onInsert: jest.fn(),
    onClosed: jest.fn(),
    setOverrides: jest.fn(),
    actions: {
      schema: {},
    },
    requireLinkText: false,
    currentPageID: 1,
    ...obj
  };
}

test('InsertLinkModal renders FormBuilderModal when mounted', () => {
  const { getByTestId } = render(<InsertLinkModal {...makeProps()} />);
  const formBuilderModal = getByTestId('form-builder-modal');
  expect(formBuilderModal).not.toBeNull();
});

test('InsertLinkModal calls setOverrides with null when isOpen is false on mount', () => {
  const setOverrides = jest.fn();
  render(<InsertLinkModal {...makeProps({ isOpen: false, setOverrides })} />);
  expect(setOverrides).toHaveBeenCalledWith(null);
});

test('InsertLinkModal does not call setOverrides when isOpen is true on mount', () => {
  const setOverrides = jest.fn();
  render(<InsertLinkModal {...makeProps({ isOpen: true, setOverrides })} />);
  expect(setOverrides).not.toHaveBeenCalled();
});

test('InsertLinkModal calls setOverrides when isOpen changes from false to true', () => {
  const setOverrides = jest.fn();
  const { rerender } = render(<InsertLinkModal {...makeProps({ isOpen: false, setOverrides })} />);
  setOverrides.mockClear();
  const props = makeProps({ isOpen: true, setOverrides });
  rerender(<InsertLinkModal {...props} />);
  expect(setOverrides).toHaveBeenCalledWith(props);
});

test('InsertLinkModal calls setOverrides with null when isOpen changes from true to false', () => {
  const setOverrides = jest.fn();
  const { rerender } = render(<InsertLinkModal {...makeProps({ isOpen: true, setOverrides })} />);
  setOverrides.mockClear();
  rerender(<InsertLinkModal {...makeProps({ isOpen: false, setOverrides })} />);
  expect(setOverrides).toHaveBeenCalledWith(null);
});

test('InsertLinkModal does not update setOverrides when isOpen remains true', () => {
  const setOverrides = jest.fn();
  const { rerender } = render(
    <InsertLinkModal {...makeProps({ isOpen: true, setOverrides })} />
  );
  setOverrides.mockClear();
  rerender(<InsertLinkModal {...makeProps({ isOpen: true, setOverrides })} />);
  expect(setOverrides).not.toHaveBeenCalled();
});

test('InsertLinkModal does not update setOverrides when isOpen remains false', () => {
  const setOverrides = jest.fn();
  const { rerender } = render(
    <InsertLinkModal {...makeProps({ isOpen: false, setOverrides })} />
  );
  setOverrides.mockClear();
  rerender(<InsertLinkModal {...makeProps({ isOpen: false, setOverrides })} />);
  expect(setOverrides).not.toHaveBeenCalled();
});

test('InsertLinkModal passes onClosed to FormBuilderModal', () => {
  const onClosed = jest.fn();
  render(
    <InsertLinkModal {...makeProps({
      onClosed,
      schemaUrl: 'http://example.com/test',
      isOpen: true,
    })}
    />
  );
  expect(mockFormBuilderModalProps.onClosed).toBe(onClosed);
});

test('InsertLinkModal passes schemaUrl to FormBuilderModal', () => {
  const testUrl = 'http://example.com/schema/link';
  render(
    <InsertLinkModal {...makeProps({ schemaUrl: testUrl, isOpen: true })} />
  );
  expect(mockFormBuilderModalProps.schemaUrl).toBe(testUrl);
});

test('InsertLinkModal passes through requireLinkText prop to FormBuilderModal', () => {
  render(
    <InsertLinkModal {...makeProps({ requireLinkText: true, isOpen: true })} />
  );
  expect(mockFormBuilderModalProps.requireLinkText).toBe(true);
});

test('InsertLinkModal passes through currentPageID prop to FormBuilderModal', () => {
  render(
    <InsertLinkModal {...makeProps({ currentPageID: 42, isOpen: true })} />
  );
  expect(mockFormBuilderModalProps.currentPageID).toBe(42);
});

test('InsertLinkModal passes through actions prop to FormBuilderModal', () => {
  const actions = { schema: { test: jest.fn() } };
  render(
    <InsertLinkModal {...makeProps({ actions, isOpen: true })} />
  );
  expect(mockFormBuilderModalProps.actions).toBe(actions);
});

test('InsertLinkModal excludes onInsert from FormBuilderModal props', () => {
  render(
    <InsertLinkModal {...makeProps({ isOpen: true })} />
  );
  expect(mockFormBuilderModalProps).not.toHaveProperty('onInsert');
});

test('InsertLinkModal excludes sectionConfig from FormBuilderModal props', () => {
  render(
    <InsertLinkModal {...makeProps({ isOpen: true, sectionConfig: { test: true } })} />
  );
  expect(mockFormBuilderModalProps).not.toHaveProperty('sectionConfig');
});

test('InsertLinkModal includes autoFocus in FormBuilderModal props', () => {
  render(
    <InsertLinkModal {...makeProps({ isOpen: true })} />
  );
  expect(mockFormBuilderModalProps.autoFocus).toBe(true);
});

test('InsertLinkModal includes showErrorMessage in FormBuilderModal props', () => {
  render(
    <InsertLinkModal {...makeProps({ isOpen: true })} />
  );
  expect(mockFormBuilderModalProps.showErrorMessage).toBe(true);
});
