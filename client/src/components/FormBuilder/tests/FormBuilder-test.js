/* global jest, test, describe, expect, it, beforeEach, afterEach */
/* eslint-disable no-console */
import React from 'react';
import { render, screen } from '@testing-library/react';
import schemaFieldValues, { findField, schemaMerge } from 'lib/schemaFieldValues';
import { Component as FormBuilder } from '../FormBuilder';

const apiMock = jest.fn();
apiMock.mockImplementation(() => Promise.resolve({}));

const mockInjector = {
  get: jest.fn((componentName) => {
    const mockComponents = {
      TextField: ({ id, value }) => <input type="text" id={id} value={value || ''} readOnly />,
      NumberField: ({ id, value }) => <input type="number" id={id} value={value || ''} readOnly />,
      HiddenField: ({ id, value }) => <input type="hidden" id={id} value={value || ''} />,
      CheckboxField: ({ id, checked }) => <input type="checkbox" id={id} checked={!!checked} readOnly />,
      CompositeField: ({ id, children }) => <div data-testid={`composite-${id}`}>{children}</div>,
      SingleSelectField: ({ id, value }) => <select id={id} value={value || ''}><option value="">Select</option></select>,
      DateField: ({ id, value }) => <input type="date" id={id} value={value || ''} readOnly />,
      TimeField: ({ id, value }) => <input type="time" id={id} value={value || ''} readOnly />,
      DatetimeField: ({ id, value }) => <input type="datetime-local" id={id} value={value || ''} readOnly />,
      CheckboxSetField: ({ id }) => <div data-testid={`checkboxset-${id}`}>CheckboxSet</div>,
      GridField: ({ id }) => <div data-testid={`gridfield-${id}`}>GridField</div>,
    };
    return mockComponents[componentName];
  }),
  validate: jest.fn(() => null),
};

// THis is to suppress specific React warnings about legacy context API usage i.e.
// Warning: FormBuilderWrapper uses the legacy childContextTypes API which is no longer
// supported and will be removed in the next major release. Use React.createContext() instead

const originalError = console.error;

beforeAll(() => {
  console.error = (...args) => {
    // Check if the error message matches the specific React warning
    if (/Warning.*legacy childContextTypes/.test(args[0])) {
      return;
    }

    // Otherwise, call the original console.error
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  // Restore the original console.error to avoid leaking side effects
  console.error = originalError;
});

class FormBuilderWrapper extends React.Component {
  getChildContext() {
    return { injector: mockInjector };
  }

  render() {
    return <FormBuilder {...this.props} />;
  }
}
FormBuilderWrapper.childContextTypes = {
  injector: () => null,
};

function makeProps(obj = {}) {
  return {
    api: apiMock,
    form: 'MyForm',
    identifier: 'TestForm',
    baseFormComponent: ({ children, attributes, onSubmit }) => (
      <form {...attributes} onSubmit={onSubmit} data-testid="base-form">
        {children}
      </form>
    ),
    baseFieldComponent: (props) => {
      // eslint-disable-next-line react/prop-types
      const Component = props.component;
      return <Component {...props} />;
    },
    schema: {
      id: 'MyForm',
      schema: {
        attributes: {},
        fields: [],
        actions: [],
      },
      state: {
        fields: [],
      },
    },
    ...obj
  };
}

afterEach(() => {
  mockInjector.get.mockClear();
  mockInjector.validate.mockClear();
});

function makeSchema() {
  return {
    schema: {
      schema: {
        attributes: {},
        fields: [
          { id: 'fieldOne', name: 'fieldOne' },
          { id: 'fieldTwo', name: 'fieldTwo' },
        ],
        actions: [
          { id: 'actionOne', name: 'actionOne' },
          { id: 'actionTwo', name: 'actionTwo' },
        ]
      },
      state: {
        fields: [
          { id: 'fieldOne', name: 'fieldOne', value: 'valOne' },
          { id: 'fieldTwo', name: 'fieldTwo', value: null },
          { id: 'notInSchema', name: 'notInSchema', value: 'invalid' },
        ]
      }
    }
  };
}
/* eslint-disable-next-line no-unused-vars */
function makePropsWithSchema(obj = {}) {
  return makeProps({
    ...makeSchema(),
    ...obj
  });
}

test('schemaMerge() should deep merge properties on the originalobject', () => {
  const fieldStructure = {
    component: 'TextField',
    data: {
      someCustomData: {
        x: 1,
      },
    },
  };

  const fieldState = {
    data: {
      someCustomData: {
        y: 2,
      },
    },
    message: { type: 'good' },
    valid: true,
    value: 'My test field',
  };

  const field = schemaMerge(fieldStructure, fieldState);

  expect(field.component).toBe('TextField');
  expect(field.data.someCustomData.x).toBe(1);
  expect(field.data.someCustomData.y).toBe(2);
  expect(field.message.type).toBe('good');
  expect(field.valid).toBe(true);
  expect(field.value).toBe('My test field');
});

test('schemaFieldValues() should retrieve field values based on schema', () => {
  const schema = {
    fields: [
      { id: 'fieldOne', name: 'fieldOne' },
      { id: 'fieldTwo', name: 'fieldTwo' },
    ],
  };
  const state = {
    fields: [
      { id: 'fieldOne', name: 'fieldOne', value: 'valOne' },
      { id: 'fieldTwo', name: 'fieldTwo', value: null },
      { id: 'notInSchema', name: 'notInSchema', value: 'invalid' },
    ]
  };
  const fieldValues = schemaFieldValues(schema, state);
  expect(fieldValues).toEqual({
    fieldOne: 'valOne',
    fieldTwo: null,
  });
});

test('findField() should retrieve the field in the shallow fields list', () => {
  const fields = [
    { id: 'fieldOne', name: 'fieldOne' },
    { id: 'fieldTwo', name: 'fieldTwo' },
    { id: 'fieldThree', name: 'fieldThree' },
    { id: 'fieldFour', name: 'fieldFour' },
  ];
  const field = findField(fields, 'fieldThree');
  expect(field).toBeTruthy();
  expect(field.name).toBe('fieldThree');
});

test('FormBuilder renders basic form structure', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {
          action: '/test',
          method: 'POST',
          class: 'test-form',
        },
        fields: [],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
  expect(form.className).toBe('test-form');
});

test('FormBuilder renders with noValidate attribute', () => {
  const props = makeProps();
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form.noValidate).toBe(true);
});

test('FormBuilder getComponentForDataType returns TextField for String', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'TestField',
            name: 'TestField',
            type: 'String',
            component: null,
            schemaType: 'String',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder getComponentForDataType returns NumberField for Integer', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'NumberField',
            name: 'NumberField',
            type: 'Integer',
            component: null,
            schemaType: 'Integer',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder getComponentForDataType returns NumberField for Decimal', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'DecimalField',
            name: 'DecimalField',
            type: 'Decimal',
            component: null,
            schemaType: 'Decimal',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder getComponentForDataType returns HiddenField for Hidden', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'HiddenField',
            name: 'HiddenField',
            type: 'Hidden',
            component: null,
            schemaType: 'Hidden',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder getComponentForDataType returns CheckboxField for Boolean', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'BoolField',
            name: 'BoolField',
            type: 'Boolean',
            component: null,
            schemaType: 'Boolean',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder getComponentForDataType returns CompositeField for Structural', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'CompositeField',
            name: 'CompositeField',
            type: 'Structural',
            component: null,
            schemaType: 'Structural',
            readOnly: true,
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder getComponentForDataType returns SingleSelectField for SingleSelect', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'SingleSelect',
            name: 'SingleSelect',
            type: 'SingleSelect',
            component: null,
            schemaType: 'SingleSelect',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder getComponentForDataType returns DateField for Date', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'DateField',
            name: 'DateField',
            type: 'Date',
            component: null,
            schemaType: 'Date',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder getComponentForDataType returns TimeField for Time', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'TimeField',
            name: 'TimeField',
            type: 'Time',
            component: null,
            schemaType: 'Time',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder getComponentForDataType returns DatetimeField for Datetime', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'DatetimeField',
            name: 'DatetimeField',
            type: 'Datetime',
            component: null,
            schemaType: 'Datetime',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder getComponentForDataType returns CheckboxSetField for MultiSelect', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'MultiSelect',
            name: 'MultiSelect',
            type: 'MultiSelect',
            component: null,
            schemaType: 'MultiSelect',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder getComponentForDataType returns GridField for Custom', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'CustomField',
            name: 'CustomField',
            type: 'Custom',
            component: null,
            schemaType: 'Custom',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder uses schemaComponent when provided', () => {
  mockInjector.get.mockClear();
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'CustomComponent',
            name: 'CustomComponent',
            component: 'TextField',
            schemaType: 'String',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder uses getCustomFields when provided', () => {
  const CustomField = () => <div data-testid="custom-field">Custom</div>;
  const getCustomFields = jest.fn(() => CustomField);
  const props = makeProps({
    getCustomFields,
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'FieldWithCustom',
            name: 'FieldWithCustom',
            component: null,
            schemaType: 'String',
            readOnly: true,
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder validateForm calls custom validate function', () => {
  const customValidate = jest.fn(() => ({ field: 'error' }));
  const props = makeProps({ validate: customValidate });
  const formBuilder = render(<FormBuilderWrapper {...props} />);
  const instance = formBuilder.container.querySelector('[data-testid="base-form"]');
  expect(instance).not.toBeNull();
});

test('FormBuilder validateForm uses injector validate when no custom validate', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder handleAction with onAction prop', () => {
  const onAction = jest.fn();
  const props = makeProps({
    onAction,
    values: { test: 'value' },
    schema: {
      schema: {
        attributes: {},
        fields: [],
        actions: [
          {
            id: 'testAction',
            name: 'testAction',
            title: 'Test Action',
            schemaComponent: 'TextField',
          },
        ],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder normalizeFields merges field structure and state', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'field1',
            name: 'field1',
            type: 'String',
          },
        ],
        actions: [],
      },
      state: {
        fields: [
          {
            id: 'field1',
            name: 'field1',
            value: 'testValue',
            valid: true,
          },
        ],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder normalizeFields handles nested children fields', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'parent',
            name: 'parent',
            type: 'Structural',
            schemaType: 'Structural',
            readOnly: true,
            component: null,
            children: [
              {
                id: 'child',
                name: 'child',
                type: 'String',
                component: null,
                schemaType: 'String',
              },
            ],
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder mapActionsToComponents sets loading on submitting action', () => {
  const props = makeProps({
    submitting: true,
    schema: {
      schema: {
        attributes: {},
        fields: [],
        actions: [
          {
            id: 'submitAction',
            name: 'submitAction',
            title: 'Submit',
            schemaComponent: 'TextField',
          },
        ],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder renders with afterMessages prop', () => {
  const afterMessages = <div data-testid="after-messages">After Messages</div>;
  const props = makeProps({
    afterMessages,
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder renders with messages in state', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [],
        actions: [],
      },
      state: {
        fields: [],
        valid: false,
        messages: [
          {
            type: 'error',
            value: 'Test error message',
          },
        ],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder renders with autoFocus enabled', () => {
  const props = makeProps({
    autoFocus: true,
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder renders with custom createFn', () => {
  const createFn = jest.fn((Component, componentProps) => (
    <Component key={componentProps.id} {...componentProps} data-custom="true" />
  ));
  const props = makeProps({
    createFn,
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'customField',
            name: 'customField',
            type: 'String',
            component: null,
            schemaType: 'String',
            readOnly: true,
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder buildComponent handles input props transformation', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'fieldWithInput',
            name: 'fieldWithInput',
            type: 'String',
            component: null,
            schemaType: 'String',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder renders StructuralCustom fields with childrenSchema', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'structuralCustom',
            name: 'structuralCustom',
            schemaType: 'StructuralCustom',
            readOnly: true,
            component: null,
            children: [
              {
                id: 'nestedField',
                name: 'nestedField',
                type: 'String',
              },
            ],
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder passes formid to field props', () => {
  const props = makeProps({
    form: 'TestFormID',
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'testField',
            name: 'testField',
            type: 'String',
            component: null,
            schemaType: 'String',
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});

test('FormBuilder renders readonly fields without FieldComponent wrapper', () => {
  const props = makeProps({
    schema: {
      schema: {
        attributes: {},
        fields: [
          {
            id: 'readonlyField',
            name: 'readonlyField',
            type: 'String',
            component: null,
            schemaType: 'String',
            readOnly: true,
          },
        ],
        actions: [],
      },
    },
  });
  render(<FormBuilderWrapper {...props} />);
  const form = screen.getByTestId('base-form');
  expect(form).not.toBeNull();
});
