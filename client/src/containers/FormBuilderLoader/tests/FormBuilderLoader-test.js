/* global jest, test, expect, afterEach */

import React from 'react';
import { render } from '@testing-library/react';
import { Component as FormBuilderLoader } from '../FormBuilderLoader';

const mockLoadingProps = {};

jest.mock('components/FormBuilder/FormBuilder', () => ({
  __esModule: true,
  default: (props) => {
    Object.assign(mockLoadingProps, props);
    return <div data-testid="form-builder" />;
  },
  basePropTypes: {},
  // schemaPropType is only used in the real component for prop validation
  // In tests, we don't need to define it since we're mocking the component
}));

const LoadingComponent = () => <div data-testid="loading" />;

function makeProps(obj = {}) {
  return {
    identifier: 'TestForm',
    schemaUrl: '/schema',
    refetchSchemaOnMount: false,
    loadingComponent: LoadingComponent,
    baseFormComponent: () => null,
    baseFieldComponent: () => null,
    actions: {
      schema: {
        setSchema: jest.fn(),
        setSchemaLoading: jest.fn(),
      },
      reduxForm: {
        autofill: jest.fn(),
        initialize: jest.fn(),
      },
    },
    ...obj,
  };
}

afterEach(() => {
  mockLoadingProps.onSubmit = null;
  mockLoadingProps.onAutofill = null;
  mockLoadingProps.form = null;
});

test('FormBuilderLoader renders loading component when schema is missing', () => {
  const { getByTestId } = render(
    <FormBuilderLoader
      {...makeProps({
        schema: {
          schema: null,
        },
        loading: false,
      })}
    />
  );

  expect(getByTestId('loading')).not.toBeNull();
});

test('FormBuilderLoader renders loading component when schema is loading', () => {
  const { getByTestId } = render(
    <FormBuilderLoader
      {...makeProps({
        schema: {
          schema: {},
        },
        loading: true,
      })}
    />
  );

  expect(getByTestId('loading')).not.toBeNull();
});

test('FormBuilderLoader passes identifier-based form name to FormBuilder', () => {
  render(
    <FormBuilderLoader
      {...makeProps({
        identifier: 'Main.Form',
        schema: {
          schema: {
            name: 'Details',
          },
        },
        loading: false,
      })}
    />
  );

  expect(mockLoadingProps.form).toBe('Main.Form.Details');
});

test('FormBuilderLoader passes onSubmit and onAutofill handlers to FormBuilder', () => {
  render(
    <FormBuilderLoader
      {...makeProps({
        schema: {
          schema: {
            name: 'Details',
          },
        },
        loading: false,
      })}
    />
  );

  expect(typeof mockLoadingProps.onSubmit).toBe('function');
  expect(typeof mockLoadingProps.onAutofill).toBe('function');
});

test('FormBuilderLoader passes autoFocus to FormBuilder', () => {
  render(
    <FormBuilderLoader
      {...makeProps({
        autoFocus: true,
        schema: {
          schema: {
            name: 'Details',
          },
        },
        loading: false,
      })}
    />
  );

  expect(mockLoadingProps.autoFocus).toBe(true);
});
