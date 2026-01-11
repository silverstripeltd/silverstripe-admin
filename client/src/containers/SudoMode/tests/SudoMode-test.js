/* global jest, test, describe, it, expect, afterEach */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import withSudoMode from '../SudoMode';

const sectionConfigKey = 'SilverStripe\\Admin\\SudoModeController';
const TestComponent = ({ title, onAction, data }) => (
  <div className="test-component">
    {title && <span className="test-title">{title}</span>}
    {onAction && <button onClick={onAction} className="test-action-button">Action</button>}
    {data && <span className="test-data">{data}</span>}
  </div>
);
const ComponentWithSudoMode = withSudoMode(TestComponent);

function resetWindowConfig(options) {
  const defaultOptions = {
    sudoModeActive: false,
    helpLink: null,
  };
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };
  window.ss.config = {
    SecurityID: 1234567890,
    sections: [
      {
        name: sectionConfigKey,
        url: 'admin/sudomode',
        sudoModeActive: mergedOptions.sudoModeActive,
        endpoints: {
          activate: 'admin/sudomode/activate',
        },
        helpLink: mergedOptions.helpLink
      },
    ],
  };
}

test('SudoMode renders the wrapped component when sudo mode is active', () => {
  resetWindowConfig({ sudoModeActive: true });
  const { container } = render(<ComponentWithSudoMode />);
  expect(container.querySelector('.test-component')).not.toBeNull();
  expect(container.querySelector('.sudo-mode-password-field')).toBeNull();
});

test('SudoMode renders a sudo mode verification screen when sudo mode is inactive', () => {
  resetWindowConfig({ sudoModeActive: false });
  const { container } = render(<ComponentWithSudoMode />);
  expect(container.querySelector('.test-component')).toBeNull();
  expect(container.querySelector('.sudo-mode-password-field')).not.toBeNull();
});

test('SudoMode renders a notice', () => {
  resetWindowConfig({ sudoModeActive: false });
  const { container } = render(<ComponentWithSudoMode />);
  expect(container.querySelector('.sudo-mode-password-field__notice-message').textContent).toBe('Verify it\'s you first.');
});

test('SudoMode renders a help link when one is provided', () => {
  resetWindowConfig({ sudoModeActive: false, helpLink: 'http://google.com' });
  const { container } = render(<ComponentWithSudoMode />);
  expect(container.querySelector('.sudo-mode-password-field__notice-help').href).toBe('http://google.com/');
});

test('SudoMode forwards all props to wrapped component when active', () => {
  resetWindowConfig({ sudoModeActive: true });
  const { container } = render(
    <ComponentWithSudoMode title="Test Title" data="Test Data" />
  );
  expect(container.querySelector('.test-title').textContent).toBe('Test Title');
  expect(container.querySelector('.test-data').textContent).toBe('Test Data');
});

test('SudoMode forwards callback props to wrapped component when active', () => {
  resetWindowConfig({ sudoModeActive: true });
  const onAction = jest.fn();
  render(
    <ComponentWithSudoMode onAction={onAction} />
  );
  const button = screen.getByRole('button', { name: 'Action' });
  fireEvent.click(button);
  expect(onAction).toHaveBeenCalled();
});

test('SudoMode respects initial sudoModeActive from config', () => {
  resetWindowConfig({ sudoModeActive: true });
  const { container } = render(<ComponentWithSudoMode title="My Component" />);
  expect(container.querySelector('.test-component')).not.toBeNull();
  expect(container.querySelector('.sudo-mode-password-field')).toBeNull();
  expect(container.querySelector('.test-title').textContent).toBe('My Component');
});

test('SudoMode works with different wrapped components', () => {
  const AnotherComponent = () => <div className="another-component">Another</div>;
  const AnotherComponentWithSudoMode = withSudoMode(AnotherComponent);

  resetWindowConfig({ sudoModeActive: true });
  const { container } = render(<AnotherComponentWithSudoMode />);
  expect(container.querySelector('.another-component')).not.toBeNull();
  expect(container.querySelector('.sudo-mode-password-field')).toBeNull();
});

test('SudoMode does not render wrapped component when sudo mode is not active', () => {
  resetWindowConfig({ sudoModeActive: false });
  const { container } = render(<ComponentWithSudoMode />);
  expect(container.querySelector('.test-component')).toBeNull();
});

test('SudoMode shows verification button when sudo mode is inactive', () => {
  resetWindowConfig({ sudoModeActive: false });
  render(<ComponentWithSudoMode />);
  const verifyButton = screen.getByRole('button', { name: /Verify to continue/i });
  expect(verifyButton).not.toBeNull();
});

test('SudoMode preserves props through state initialization', () => {
  resetWindowConfig({ sudoModeActive: true });
  const { container, rerender } = render(
    <ComponentWithSudoMode title="Initial Title" data="Initial Data" />
  );
  expect(container.querySelector('.test-title').textContent).toBe('Initial Title');
  expect(container.querySelector('.test-data').textContent).toBe('Initial Data');

  rerender(
    <ComponentWithSudoMode title="Updated Title" data="Updated Data" />
  );
  expect(container.querySelector('.test-title').textContent).toBe('Updated Title');
  expect(container.querySelector('.test-data').textContent).toBe('Updated Data');
});
