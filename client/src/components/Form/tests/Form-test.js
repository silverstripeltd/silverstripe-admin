/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as Form } from '../Form';

function makeProps(obj = {}) {
  return {
    valid: true,
    attributes: {
      action: 'foo',
      method: 'GET',
    },
    fields: [],
    mapFieldsToComponents: () => <div>my fields</div>,
    mapActionsToComponents: () => {},
    FormAlertComponent: (message) => <div data-testid="test-form-alert">{message.message}</div>,
    ...obj
  };
}

test('Form renderMessages returns form messages as alerts', async () => {
  render(
    <Form {...makeProps({
      messages: [
        { message: 'Looks good to me' },
        { message: 'You could try this' },
      ]
    })}
    />
  );
  const alerts = await screen.findAllByTestId('test-form-alert');
  expect(alerts.length).toBe(2);
  expect(alerts[0].textContent).toBe('Looks good to me');
  expect(alerts[1].textContent).toBe('You could try this');
});

test('Form render() adds an invalid class when valid is false', async () => {
  render(
    <Form {...makeProps({
      valid: false
    })}
    />
  );
  const form = await screen.findByRole('form');
  expect(form.classList).toContain('form--invalid');
});

test('Form render() adds custom classes to the form container', async () => {
  render(
    <Form {...makeProps({
      attributes: {
        ...makeProps().attributes,
        className: 'foobar'
      }
    })}
    />
  );
  const form = await screen.findByRole('form');
  expect(form.classList).toContain('foobar');
});

test('Form renderMessages returns null when messages is empty', async () => {
  const { container } = render(
    <Form {...makeProps({
      messages: []
    })}
    />
  );
  const alerts = container.querySelectorAll('[data-testid="test-form-alert"]');
  expect(alerts.length).toBe(0);
});

test('Form renderMessages returns null when messages is not an array', async () => {
  const { container } = render(
    <Form {...makeProps({
      messages: undefined
    })}
    />
  );
  const alerts = container.querySelectorAll('[data-testid="test-form-alert"]');
  expect(alerts.length).toBe(0);
});

test('Form adds message-box--panel-top class to first message only', async () => {
  const { container } = render(
    <Form {...makeProps({
      FormAlertComponent: (message) => (
        <div
          data-testid="test-form-alert"
          className={message.className}
        >
          {message.message}
        </div>
      ),
      messages: [
        { message: 'First' },
        { message: 'Second' },
        { message: 'Third' },
      ]
    })}
    />
  );
  const alerts = container.querySelectorAll('[data-testid="test-form-alert"]');
  expect(alerts[0].classList).toContain('message-box--panel-top');
  expect(alerts[1].classList).not.toContain('message-box--panel-top');
  expect(alerts[2].classList).not.toContain('message-box--panel-top');
});

test('Form calls handleSubmit prop on form submission', async () => {
  const handleSubmit = jest.fn();
  render(
    <Form {...makeProps({
      handleSubmit
    })}
    />
  );
  const form = await screen.findByRole('form');
  fireEvent.submit(form);
  expect(handleSubmit).toHaveBeenCalled();
});

test('Form handleSubmit stops event propagation', async () => {
  const handleSubmit = jest.fn();
  render(
    <Form {...makeProps({
      handleSubmit
    })}
    />
  );
  const form = await screen.findByRole('form');
  const event = new Event('submit', { bubbles: true, cancelable: true });
  event.stopPropagation = jest.fn();
  fireEvent(form, event);
  expect(event.stopPropagation).toHaveBeenCalled();
});

test('Form calls setDOM with form element', async () => {
  const setDOM = jest.fn();
  render(
    <Form {...makeProps({
      setDOM
    })}
    />
  );
  const form = await screen.findByRole('form');
  expect(setDOM).toHaveBeenCalledWith(form);
});

test('Form renders fieldset with fieldHolder attributes', async () => {
  const { container } = render(
    <Form {...makeProps({
      fieldHolder: {
        className: 'custom-fieldset-class'
      }
    })}
    />
  );
  const fieldset = container.querySelector('fieldset');
  expect(fieldset).not.toBeNull();
  expect(fieldset.classList).toContain('custom-fieldset-class');
});

test('Form renders actions with actionHolder attributes', async () => {
  const { container } = render(
    <Form {...makeProps({
      actions: ['action1', 'action2'],
      mapActionsToComponents: () => [
        <button key="1" data-testid="action-1">Action 1</button>,
        <button key="2" data-testid="action-2">Action 2</button>,
      ]
    })}
    />
  );
  const actionDiv = container.querySelector('.btn-toolbar');
  expect(actionDiv).not.toBeNull();
  const buttons = screen.getAllByTestId(/^action-/);
  expect(buttons.length).toBe(2);
});

test('Form does not render actionHolder div when actions is empty', async () => {
  const { container } = render(
    <Form {...makeProps({
      actions: [],
      mapActionsToComponents: () => []
    })}
    />
  );
  const actionDiv = container.querySelector('.btn-toolbar');
  expect(actionDiv).toBeNull();
});

test('Form renders custom form tag instead of default form element', async () => {
  const { container } = render(
    <Form {...makeProps({
      formTag: 'div'
    })}
    />
  );
  const formDiv = container.querySelector('div[role="form"]');
  expect(formDiv).not.toBeNull();
  const formElement = container.querySelector('form');
  expect(formElement).toBeNull();
});

test('Form calls mapFieldsToComponents with fields prop', async () => {
  const mapFieldsToComponents = jest.fn(() => <div>mapped fields</div>);
  render(
    <Form {...makeProps({
      fields: ['field1', 'field2'],
      mapFieldsToComponents
    })}
    />
  );
  expect(mapFieldsToComponents).toHaveBeenCalledWith(['field1', 'field2']);
});

test('Form calls mapActionsToComponents with actions prop', async () => {
  const mapActionsToComponents = jest.fn(() => [
    <button key="1">Action</button>
  ]);
  render(
    <Form {...makeProps({
      actions: ['action1'],
      mapActionsToComponents
    })}
    />
  );
  expect(mapActionsToComponents).toHaveBeenCalledWith(['action1']);
});

test('Form does not render fieldset when fields is empty', async () => {
  const { container } = render(
    <Form {...makeProps({
      fields: [],
      mapFieldsToComponents: () => null
    })}
    />
  );
  const fieldset = container.querySelector('fieldset');
  expect(fieldset).toBeNull();
});

test('Form renders afterMessages content in fieldset', async () => {
  render(
    <Form {...makeProps({
      afterMessages: <div data-testid="after-messages-content">After Messages</div>
    })}
    />
  );
  const afterMessages = screen.getByTestId('after-messages-content');
  expect(afterMessages).not.toBeNull();
  expect(afterMessages.textContent).toBe('After Messages');
});

test('Form preserves all attribute props on form element', async () => {
  const { container } = render(
    <Form {...makeProps({
      attributes: {
        action: 'custom-action',
        method: 'POST',
        encType: 'multipart/form-data',
        id: 'custom-form-id',
        className: 'my-class',
        'data-custom': 'custom-value'
      }
    })}
    />
  );
  const form = container.querySelector('form');
  expect(form.getAttribute('action')).toBe('custom-action');
  expect(form.getAttribute('method')).toBe('POST');
  expect(form.getAttribute('encType')).toBe('multipart/form-data');
  expect(form.getAttribute('id')).toBe('custom-form-id');
  expect(form.getAttribute('data-custom')).toBe('custom-value');
});

test('Form respects valid prop when true', async () => {
  const { container } = render(
    <Form {...makeProps({
      valid: true
    })}
    />
  );
  const form = container.querySelector('form');
  expect(form.classList).not.toContain('form--invalid');
});

test('Form handles form message with extra class', async () => {
  render(
    <Form {...makeProps({
      FormAlertComponent: (message) => (
        <div
          data-testid="test-form-alert"
          className={message.extraClass}
        >
          {message.message}
        </div>
      ),
      messages: [
        { message: 'Error occurred', extraClass: 'alert-danger' }
      ]
    })}
    />
  );
  const alert = screen.getByTestId('test-form-alert');
  expect(alert.classList).toContain('alert-danger');
});

test('Form combines form class with invalid class when valid is false', async () => {
  const { container } = render(
    <Form {...makeProps({
      valid: false
    })}
    />
  );
  const form = container.querySelector('form');
  expect(form.classList).toContain('form');
  expect(form.classList).toContain('form--invalid');
});

test('Form has role form attribute', async () => {
  const { container } = render(
    <Form {...makeProps()}/>
  );
  const form = container.querySelector('[role="form"]');
  expect(form).not.toBeNull();
});

test('Form handleSubmit receives event and additional arguments', async () => {
  const handleSubmit = jest.fn();
  render(
    <Form {...makeProps({
      handleSubmit
    })}
    />
  );
  const form = await screen.findByRole('form');
  fireEvent.submit(form);
  expect(handleSubmit).toHaveBeenCalledTimes(1);
  const callArgs = handleSubmit.mock.calls[0];
  expect(callArgs).toHaveLength(1);
  expect(callArgs[0]).toHaveProperty('type', 'submit');
});

test('Form renders with default actionHolder className when not specified', async () => {
  const { container } = render(
    <Form {...makeProps({
      actions: ['action1'],
      mapActionsToComponents: () => [
        <button key="1">Action</button>
      ]
    })}
    />
  );
  const actionDiv = container.querySelector('.btn-toolbar');
  expect(actionDiv).not.toBeNull();
});

test('Form renders all message properties to FormAlertComponent', async () => {
  const mockComponent = jest.fn(() => <div>mock</div>);
  render(
    <Form {...makeProps({
      FormAlertComponent: mockComponent,
      messages: [
        { message: 'Test', type: 'info', extraClass: 'custom' }
      ]
    })}
    />
  );
  expect(mockComponent).toHaveBeenCalled();
  const passedProps = mockComponent.mock.calls[0][0];
  expect(passedProps.message).toBe('Test');
  expect(passedProps.type).toBe('info');
  expect(passedProps.extraClass).toBe('custom');
  expect(passedProps.className).toBe('message-box--panel-top');
});
