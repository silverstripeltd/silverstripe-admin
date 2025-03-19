/* global jest, test, expect, window */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as SudoModePasswordField } from '../SudoModePasswordField';

window.ss.config = {
  sections: [
    {
      name: 'SilverStripe\\Admin\\SudoModeController',
      endpoints: {
        activate: 'some/path',
      }
    },
  ]
};

let doResolve;

jest.mock('lib/Backend', () => ({
  createEndpointFetcher: () => () => (
    new Promise((resolve) => {
      doResolve = resolve;
    })
  )
}));

function makeProps(obj = {}) {
  return {
    onSuccess: () => {},
    autocomplete: 'off',
    initiallyCollapsed: false,
    sectionTitle: '',
    ...obj,
  };
}

test('SudoModePasswordField should call onSuccess on success', async () => {
  const onSuccess = jest.fn();
  render(
    <SudoModePasswordField {...makeProps({
      onSuccess
    })}
    />
  );
  const confirmButton = await screen.findByText('Verify to continue');
  fireEvent.click(confirmButton);
  const passwordField = await screen.findByLabelText('Enter your password');
  passwordField.value = 'password';
  const verifyButton = await screen.findByText('Verify');
  fireEvent.click(verifyButton);
  await doResolve({
    result: true,
    message: ''
  });
  expect(onSuccess).toBeCalled();
});

test('SudoModePasswordField should show a message on failure', async () => {
  const onSuccess = jest.fn();
  render(
    <SudoModePasswordField {...makeProps({
      onSuccess
    })}
    />
  );
  const confirmButton = await screen.findByText('Verify to continue');
  fireEvent.click(confirmButton);
  const passwordField = await screen.findByLabelText('Enter your password');
  passwordField.value = 'password';
  const verifyButton = await screen.findByText('Verify');
  fireEvent.click(verifyButton);
  doResolve({
    result: false,
    message: 'A big failure'
  });
  const message = await screen.findByText('A big failure');
  expect(message).not.toBeNull();
  expect(onSuccess).not.toBeCalled();
});

test('SudoModePasswordField when initiallyCollapsed is false', async () => {
  const { container } = render(
    <SudoModePasswordField {...makeProps({
      initiallyCollapsed: false,
    })}
    />
  );
  const action = await screen.findByText('Verify to continue');
  expect(container.querySelector('.sudo-mode-password-field__notice-button')).not.toBeNull();
  expect(container.querySelector('.sudo-mode-password-field__expander')).toBeNull();
  fireEvent.click(action);
  await screen.findByText('Enter your password');
  expect(container.querySelector('.sudo-mode-password-field__verify-button')).not.toBeNull();
});

test('SudoModePasswordField when initiallyCollapsed is true', async () => {
  const { container } = render(
    <SudoModePasswordField {...makeProps({
      initiallyCollapsed: true,
    })}
    />
  );
  const action = await screen.findByText('Verify');
  expect(container.querySelector('.sudo-mode-password-field__notice-button')).toBeNull();
  expect(container.querySelector('.sudo-mode-password-field__expander')).not.toBeNull();
  fireEvent.click(action);
  await screen.findByText('Enter your password');
  expect(container.querySelector('.sudo-mode-password-field__verify-button')).not.toBeNull();
});

test('SudoModePasswordField when sectionTitle is empty', async () => {
  const { container } = render(<SudoModePasswordField {...makeProps()}/>);
  await screen.findByText('Verify to continue');
  const expected = "This section is protected and is in read-only mode. Before editing please verify that it's you first.";
  expect(container.querySelector('.sudo-mode-password-field__notice-message').innerHTML).toBe(expected);
});

test('SudoModePasswordField when sectionTitle is not empty', async () => {
  const { container } = render(<SudoModePasswordField {...makeProps({
    sectionTitle: 'Hello world',
  })}
  />);
  await screen.findByText('Verify to continue');
  const expected = "\"Hello world\" is protected and is in read-only mode. Before editing please verify that it's you first.";
  expect(container.querySelector('.sudo-mode-password-field__notice-message').innerHTML).toBe(expected);
});
