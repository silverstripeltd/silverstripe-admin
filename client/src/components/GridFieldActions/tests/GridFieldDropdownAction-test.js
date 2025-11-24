/* global jest, test, expect */

import React from 'react';
import { render } from '@testing-library/react';
import GridFieldDropdownAction from '../GridFieldDropdownAction';

const baseProps = {
  title: 'Test Action',
  type: 'link',
  url: '/test-url',
  data: {},
};

test('GridFieldDropdownAction renders a link element when type is link', () => {
  const { container } = render(
    <GridFieldDropdownAction {...baseProps} />
  );
  const link = container.querySelector('a');
  expect(link).not.toBeNull();
  expect(link.getAttribute('href')).toBe('/test-url');
});

test('GridFieldDropdownAction renders button without tag attribute when type is not specified', () => {
  const { container } = render(
    <GridFieldDropdownAction {...baseProps} type={null} />
  );
  const dropdownItem = container.querySelector('[role="menuitem"]');
  expect(dropdownItem).not.toBeNull();
});

test('GridFieldDropdownAction renders a button element when type is submit', () => {
  const { container } = render(
    <GridFieldDropdownAction {...baseProps} type="submit" />
  );
  const button = container.querySelector('button');
  expect(button).not.toBeNull();
  expect(button.getAttribute('type')).toBe('button');
});

test('GridFieldDropdownAction does not render href on submit button', () => {
  const { container } = render(
    <GridFieldDropdownAction {...baseProps} type="submit" url="/some-url" />
  );
  const button = container.querySelector('button');
  expect(button.hasAttribute('href')).toBe(false);
});

test('GridFieldDropdownAction renders title text', () => {
  const { container } = render(
    <GridFieldDropdownAction {...baseProps} title="Edit Item" />
  );
  expect(container.textContent).toContain('Edit Item');
});

test('GridFieldDropdownAction applies action class', () => {
  const { container } = render(
    <GridFieldDropdownAction {...baseProps} />
  );
  const element = container.querySelector('.action');
  expect(element).not.toBeNull();
});

test('GridFieldDropdownAction applies custom class names from data', () => {
  const { container } = render(
    <GridFieldDropdownAction
      {...baseProps}
      data={{ classNames: 'custom-class another-class' }}
    />
  );
  const element = container.querySelector('.action');
  expect(element.classList.contains('custom-class')).toBe(true);
  expect(element.classList.contains('another-class')).toBe(true);
});

test('GridFieldDropdownAction renders icon when provided in data', () => {
  const { container } = render(
    <GridFieldDropdownAction
      {...baseProps}
      data={{ icon: 'trash' }}
    />
  );
  const icon = container.querySelector('.font-icon-trash');
  expect(icon).not.toBeNull();
  expect(icon.getAttribute('aria-hidden')).toBe('true');
});

test('GridFieldDropdownAction does not render icon when not provided', () => {
  const { container } = render(
    <GridFieldDropdownAction {...baseProps} data={{}} />
  );
  const icon = container.querySelector('[class*="font-icon-"]');
  expect(icon).toBeNull();
});

test('GridFieldDropdownAction renders data attributes correctly', () => {
  const { container } = render(
    <GridFieldDropdownAction
      {...baseProps}
      data={{
        'data-url': '/action-endpoint',
        'data-action-state': 'publish',
        name: 'action_publish',
      }}
    />
  );
  const element = container.querySelector('a');
  expect(element.getAttribute('data-url')).toBe('/action-endpoint');
  expect(element.getAttribute('data-action-state')).toBe('publish');
  expect(element.getAttribute('name')).toBe('action_publish');
});

test('GridFieldDropdownAction renders link with all attributes', () => {
  const { container } = render(
    <GridFieldDropdownAction
      {...baseProps}
      type="link"
      title="Download"
      url="/download"
      data={{
        icon: 'download',
        'data-url': '/api/download',
        'data-action-state': 'download',
        name: 'action_download',
        classNames: 'btn-secondary',
      }}
    />
  );
  const link = container.querySelector('a');
  expect(link.getAttribute('href')).toBe('/download');
  expect(link.textContent).toContain('Download');
  expect(link.classList.contains('action')).toBe(true);
  expect(link.classList.contains('btn-secondary')).toBe(true);
  expect(link.getAttribute('data-url')).toBe('/api/download');
  expect(link.getAttribute('data-action-state')).toBe('download');
  expect(link.getAttribute('name')).toBe('action_download');
  expect(link.querySelector('.font-icon-download')).not.toBeNull();
});

test('GridFieldDropdownAction renders button with all attributes', () => {
  const { container } = render(
    <GridFieldDropdownAction
      {...baseProps}
      type="submit"
      title="Delete"
      data={{
        icon: 'trash',
        'data-url': '/api/delete',
        'data-action-state': 'delete',
        name: 'action_delete',
        classNames: 'btn-danger',
      }}
    />
  );
  const button = container.querySelector('button');
  expect(button.textContent).toContain('Delete');
  expect(button.classList.contains('action')).toBe(true);
  expect(button.classList.contains('btn-danger')).toBe(true);
  expect(button.getAttribute('data-url')).toBe('/api/delete');
  expect(button.getAttribute('data-action-state')).toBe('delete');
  expect(button.getAttribute('name')).toBe('action_delete');
  expect(button.querySelector('.font-icon-trash')).not.toBeNull();
  expect(button.getAttribute('type')).toBe('button');
});

test('GridFieldDropdownAction renders as DropdownItem', () => {
  const { container } = render(
    <GridFieldDropdownAction {...baseProps} />
  );
  const dropdownItem = container.querySelector('[class*="dropdown"]');
  expect(dropdownItem).not.toBeNull();
});

test('GridFieldDropdownAction handles undefined type', () => {
  const { container } = render(
    <GridFieldDropdownAction
      {...baseProps}
      type={undefined}
    />
  );
  const element = container.querySelector('[class*="action"]');
  expect(element).not.toBeNull();
});

test('GridFieldDropdownAction handles empty data object', () => {
  const { container } = render(
    <GridFieldDropdownAction
      {...baseProps}
      data={{}}
    />
  );
  const link = container.querySelector('a');
  expect(link).not.toBeNull();
  expect(link.textContent).toContain('Test Action');
});

test('GridFieldDropdownAction renders with multiple custom classes and action class combined', () => {
  const { container } = render(
    <GridFieldDropdownAction
      {...baseProps}
      data={{ classNames: 'btn-primary btn-large' }}
    />
  );
  const element = container.querySelector('a');
  expect(element.classList.contains('action')).toBe(true);
  expect(element.classList.contains('btn-primary')).toBe(true);
  expect(element.classList.contains('btn-large')).toBe(true);
});

test('GridFieldDropdownAction renders different icon types correctly', () => {
  const iconTypes = ['edit', 'save', 'delete', 'export', 'import'];
  iconTypes.forEach(iconType => {
    const { container } = render(
      <GridFieldDropdownAction
        {...baseProps}
        data={{ icon: iconType }}
      />
    );
    const icon = container.querySelector(`.font-icon-${iconType}`);
    expect(icon).not.toBeNull();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });
});
