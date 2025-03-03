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
let doReject;

beforeEach(() => {
  doResolve = undefined;
  doReject = undefined;
});

function createJsonError(message) {
  return {
    response: {
      json: () => ({
        result: false,
        message
      }),
    },
  };
}

jest.mock('lib/Backend', () => ({
  createEndpointFetcher: () => () => (
    new Promise((resolve, reject) => {
      doResolve = resolve;
      doReject = reject;
    })
  )
}));

function makeProps(obj = {}) {
  return {
    onSuccess: () => {},
    autocomplete: 'off',
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
  await doReject(createJsonError('A big failure'));
  const message = await screen.findByText('A big failure');
  expect(message).not.toBeNull();
  expect(onSuccess).not.toBeCalled();
});
