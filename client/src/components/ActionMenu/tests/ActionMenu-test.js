/* global jest, test, expect, afterEach, beforeEach */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DropdownItem } from 'reactstrap';
import ActionMenu from '../ActionMenu';

test('ActionMenu applies custom className', () => {
  const { container } = render(
    <ActionMenu className="custom-class">
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const dropdown = container.querySelector('.action-menu');
  expect(dropdown.classList.contains('custom-class')).toBe(true);
});

test('ActionMenu renders toggle button with default title', () => {
  const { container } = render(
    <ActionMenu>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const toggleButton = container.querySelector('button[title="View actions"]');
  expect(toggleButton).not.toBeNull();
  expect(toggleButton.getAttribute('aria-label')).toBe('View actions');
});

test('ActionMenu renders toggle button with default icon', () => {
  const { container } = render(
    <ActionMenu>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const icon = container.querySelector('.font-icon-dot-3');
  expect(icon).not.toBeNull();
  expect(icon.getAttribute('aria-hidden')).toBe('true');
});

test('ActionMenu applies default toggle button classNames', () => {
  const { container } = render(
    <ActionMenu>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const toggleButton = container.querySelector('.action-menu__toggle');
  expect(toggleButton).not.toBeNull();
  expect(toggleButton.classList.contains('btn')).toBe(true);
  expect(toggleButton.classList.contains('btn--no-text')).toBe(true);
  expect(toggleButton.classList.contains('btn--icon-xl')).toBe(true);
});

test('ActionMenu applies custom dropdownToggleClassNames', () => {
  const { container } = render(
    <ActionMenu dropdownToggleClassNames={['custom-toggle', 'extra-class']}>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const toggleButton = container.querySelector('button[title="View actions"]');
  expect(toggleButton.classList.contains('custom-toggle')).toBe(true);
  expect(toggleButton.classList.contains('extra-class')).toBe(true);
});

test('ActionMenu applies custom dropdownToggleChildren', () => {
  const { container } = render(
    <ActionMenu dropdownToggleChildren={<span className="custom-icon">⚙️</span>}>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const customIcon = container.querySelector('.custom-icon');
  expect(customIcon).not.toBeNull();
  expect(customIcon.textContent).toBe('⚙️');
});

test('ActionMenu applies custom dropdownToggleProps', () => {
  const { container } = render(
    <ActionMenu dropdownToggleProps={{ 'data-testid': 'custom-toggle', title: 'Custom Title' }}>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const toggleButton = container.querySelector('[data-testid="custom-toggle"]');
  expect(toggleButton).not.toBeNull();
  expect(toggleButton.getAttribute('title')).toBe('Custom Title');
});

test('ActionMenu applies custom dropdownMenuProps', () => {
  const { container } = render(
    <ActionMenu dropdownMenuProps={{ 'data-testid': 'custom-menu', className: 'custom-menu-class' }}>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const menu = container.querySelector('[data-testid="custom-menu"]');
  expect(menu).not.toBeNull();
  expect(menu.classList.contains('custom-menu-class')).toBe(true);
});

test('ActionMenu renders children items', () => {
  render(
    <ActionMenu>
      <DropdownItem>Item One</DropdownItem>
      <DropdownItem>Item Two</DropdownItem>
      <DropdownItem>Item Three</DropdownItem>
    </ActionMenu>
  );
  expect(screen.getByText('Item One')).not.toBeNull();
  expect(screen.getByText('Item Two')).not.toBeNull();
  expect(screen.getByText('Item Three')).not.toBeNull();
});

test('ActionMenu dropdown is closed initially', () => {
  const { container } = render(
    <ActionMenu>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const dropdown = container.querySelector('.action-menu');
  expect(dropdown.classList.contains('show')).toBe(false);
});

test('ActionMenu opens dropdown when toggle button is clicked', async () => {
  const { container } = render(
    <ActionMenu>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const toggleButton = container.querySelector('button[title="View actions"]');
  fireEvent.click(toggleButton);
  await waitFor(() => {
    expect(container.querySelector('.action-menu').classList.contains('show')).toBe(true);
  });
});

test('ActionMenu closes dropdown when toggle button is clicked again', async () => {
  const { container } = render(
    <ActionMenu>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const toggleButton = container.querySelector('button[title="View actions"]');
  fireEvent.click(toggleButton);
  await waitFor(() => {
    expect(container.querySelector('.action-menu').classList.contains('show')).toBe(true);
  });
  fireEvent.click(toggleButton);
  await waitFor(() => {
    expect(container.querySelector('.action-menu').classList.contains('show')).toBe(false);
  });
});

test('ActionMenu calls toggleCallback when toggle is clicked', async () => {
  const toggleCallback = jest.fn();
  const { container } = render(
    <ActionMenu toggleCallback={toggleCallback}>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const toggleButton = container.querySelector('button[title="View actions"]');
  fireEvent.click(toggleButton);
  await waitFor(() => {
    expect(toggleCallback).toHaveBeenCalled();
  });
});

test('ActionMenu passes through rest props to Dropdown', () => {
  const { container } = render(
    <ActionMenu data-testid="action-menu-dropdown" direction="right">
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const dropdown = container.querySelector('[data-testid="action-menu-dropdown"]');
  expect(dropdown).not.toBeNull();
});

test('ActionMenu with multiple child nodes renders all children', () => {
  render(
    <ActionMenu>
      <DropdownItem>First</DropdownItem>
      <DropdownItem>Second</DropdownItem>
      <DropdownItem divider />
      <DropdownItem>Third</DropdownItem>
    </ActionMenu>
  );
  expect(screen.getByText('First')).not.toBeNull();
  expect(screen.getByText('Second')).not.toBeNull();
  expect(screen.getByText('Third')).not.toBeNull();
});

test('ActionMenu toggleCallback receives event object', async () => {
  const toggleCallback = jest.fn();
  const { container } = render(
    <ActionMenu toggleCallback={toggleCallback}>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const toggleButton = container.querySelector('button[title="View actions"]');
  fireEvent.click(toggleButton);
  await waitFor(() => {
    expect(toggleCallback).toHaveBeenCalledWith(expect.any(Object));
  });
});

test('ActionMenu menu has correct dropdown classNames', () => {
  const { container } = render(
    <ActionMenu>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const menu = container.querySelector('.action-menu__dropdown');
  expect(menu).not.toBeNull();
});

test('ActionMenu without toggleCallback does not error when toggled', async () => {
  const { container } = render(
    <ActionMenu>
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const toggleButton = container.querySelector('button[title="View actions"]');
  expect(() => {
    fireEvent.click(toggleButton);
  }).not.toThrow();
});

test('ActionMenu applies dropdownToggleProps className with custom classNames', () => {
  const { container } = render(
    <ActionMenu
      dropdownToggleProps={{ className: 'extra-toggle-class' }}
      dropdownToggleClassNames={['custom-toggle']}
    >
      <DropdownItem>Item One</DropdownItem>
    </ActionMenu>
  );
  const toggleButton = container.querySelector('button[title="View actions"]');
  expect(toggleButton.classList.contains('extra-toggle-class')).toBe(true);
});
