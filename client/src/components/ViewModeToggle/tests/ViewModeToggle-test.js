/* eslint-disable import/no-extraneous-dependencies */
/* global jest, test, describe, beforeEach, it, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as ViewModeToggle } from '../ViewModeToggle';

test('ViewModeToggle simulate click events in split mode', () => {
  const mockOnEditSelect = jest.fn();
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-preview-nb',
      activeState: 'split',
      area: 'preview',
      splitAvailable: true,
      onEditSelect: mockOnEditSelect,
    }}
    />
  );
  expect(container.querySelector('.viewmode-toggle__chosen-view-title').innerHTML).toBe('Split mode');
  fireEvent.click(container.querySelectorAll('.font-icon-edit-write')[0].parentElement);
  expect(mockOnEditSelect).toHaveBeenCalled();
});

test('ViewModeToggle should call the preview button onClick function', () => {
  const mockOnPreviewSelect = jest.fn();
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-preview-nb',
      activeState: 'split',
      area: 'preview',
      splitAvailable: true,
      onPreviewSelect: mockOnPreviewSelect,
    }}
    />
  );
  expect(container.querySelector('.viewmode-toggle__chosen-view-title').innerHTML).toBe('Split mode');
  fireEvent.click(container.querySelectorAll('.font-icon-eye')[0].parentElement);
  expect(mockOnPreviewSelect).toHaveBeenCalled();
});

test('ViewModeToggle simulate click events in edit mode should call the split button onClick function', () => {
  const mockOnSplitSelect = jest.fn();
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-edit-nb',
      activeState: 'edit',
      area: 'edit',
      splitAvailable: false,
      onSplitSelect: mockOnSplitSelect,
    }}
    />
  );
  expect(container.querySelector('.viewmode-toggle__chosen-view-title').innerHTML).toBe('Edit mode');
  fireEvent.click(container.querySelectorAll('.font-icon-columns')[0].parentElement);
  expect(mockOnSplitSelect).not.toHaveBeenCalled();
});

test('ViewModeToggle simulate click events in edit mode should call the preview button onClick function', () => {
  const mockOnPreviewSelect = jest.fn();
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-edit-nb',
      activeState: 'edit',
      area: 'edit',
      splitAvailable: false,
      onPreviewSelect: mockOnPreviewSelect,
    }}
    />
  );
  expect(container.querySelector('.viewmode-toggle__chosen-view-title').innerHTML).toBe('Edit mode');
  fireEvent.click(container.querySelectorAll('.font-icon-eye')[0].parentElement);
  expect(mockOnPreviewSelect).toHaveBeenCalled();
});

test('ViewModeToggle should not render in the edit context if the activeState is split', () => {
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-edit-nb',
      activeState: 'split',
      area: 'edit',
      splitAvailable: true,
    }}
    />
  );
  expect(container.querySelectorAll('.viewmode-toggle')).toHaveLength(0);
});

test('ViewModeToggle should render in the edit context if the activeState is preview', () => {
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-edit-nb',
      activeState: 'preview',
      area: 'edit',
      splitAvailable: true,
    }}
    />
  );
  expect(container.querySelectorAll('.viewmode-toggle')).toHaveLength(1);
});

test('ViewModeToggle should render in the edit context if the activeState is edit', () => {
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-edit-nb',
      activeState: 'edit',
      area: 'edit',
      splitAvailable: false,
    }}
    />
  );
  expect(container.querySelectorAll('.viewmode-toggle')).toHaveLength(1);
});

test('ViewModeToggle classes', () => {
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-preview-nb',
      activeState: 'split',
      area: 'preview',
      splitAvailable: true,
    }}
    />
  );
  expect(container.querySelectorAll('.font-icon-columns')).toHaveLength(2);
  expect(container.querySelectorAll('.font-icon-edit-write')).toHaveLength(1);
  expect(container.querySelectorAll('.font-icon-eye')).toHaveLength(1);
  const splitButton = container.querySelectorAll('.font-icon-columns')[1].parentElement;
  const editButton = container.querySelectorAll('.font-icon-edit-write')[0].parentElement;
  const previewButton = container.querySelectorAll('.font-icon-eye')[0].parentElement;
  expect(splitButton.classList.contains('viewmode-toggle--selected')).toBe(true);
  expect(editButton.classList.contains('viewmode-toggle--selected')).toBe(false);
  expect(previewButton.classList.contains('viewmode-toggle--selected')).toBe(false);
  expect(splitButton.getAttribute('id')).toEqual('splitModeButton');
  expect(splitButton.getAttribute('value')).toEqual('split');
  expect(editButton.getAttribute('value')).toEqual('content');
  expect(previewButton.getAttribute('value')).toEqual('preview');
});

test('ViewModeToggle dropdown contains correct button structure', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'split',
      area: 'preview',
      splitAvailable: true,
    }}
    />
  );
  const dropdown = container.querySelector('.viewmode-toggle');
  expect(dropdown).not.toBeNull();
  const toggleButton = container.querySelector('.viewmode-toggle__dropdown');
  expect(toggleButton).not.toBeNull();
  expect(toggleButton.classList.contains('btn')).toBe(true);
  const dropdownItems = container.querySelectorAll('.dropdown-item');
  expect(dropdownItems.length).toBe(3);
});

test('ViewModeToggle displays correct title for edit mode', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'edit',
      area: 'edit',
      splitAvailable: true,
    }}
    />
  );
  expect(container.querySelector('.viewmode-toggle__chosen-view-title').innerHTML).toBe('Edit mode');
});

test('ViewModeToggle displays correct title for preview mode', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'preview',
      area: 'preview',
      splitAvailable: true,
    }}
    />
  );
  expect(container.querySelector('.viewmode-toggle__chosen-view-title').innerHTML).toBe('Preview mode');
});

test('ViewModeToggle displays disabled tooltip when splitAvailable is false', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'edit',
      area: 'edit',
      splitAvailable: false,
    }}
    />
  );
  const disabledTooltip = container.querySelector('.disabled-tooltip');
  expect(disabledTooltip).not.toBeNull();
  expect(disabledTooltip.querySelector('.disabled-tooltip-span').innerHTML).toBe('Screen size too small');
});

test('ViewModeToggle does not display disabled tooltip when splitAvailable is true', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'edit',
      area: 'edit',
      splitAvailable: true,
    }}
    />
  );
  const disabledTooltip = container.querySelector('.disabled-tooltip');
  expect(disabledTooltip).toBeNull();
});

test('ViewModeToggle split button is disabled when splitAvailable is false', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'edit',
      area: 'edit',
      splitAvailable: false,
    }}
    />
  );
  const splitButton = container.querySelector('#splitModeButton');
  expect(splitButton.hasAttribute('disabled')).toBe(true);
  expect(splitButton.classList.contains('disabled')).toBe(true);
});

test('ViewModeToggle split button is enabled when splitAvailable is true', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'edit',
      area: 'edit',
      splitAvailable: true,
    }}
    />
  );
  const splitButton = container.querySelector('#splitModeButton');
  expect(splitButton.hasAttribute('disabled')).toBe(false);
  expect(splitButton.classList.contains('disabled')).toBe(false);
});

test('ViewModeToggle renders custom icon classes', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'edit',
      area: 'preview',
      splitAvailable: true,
      editIconClass: 'custom-edit-icon',
      previewIconClass: 'custom-preview-icon',
      splitIconClass: 'custom-split-icon',
    }}
    />
  );
  expect(container.querySelectorAll('.custom-edit-icon').length).toBeGreaterThanOrEqual(1);
  expect(container.querySelectorAll('.custom-preview-icon').length).toBeGreaterThanOrEqual(1);
  expect(container.querySelectorAll('.custom-split-icon').length).toBeGreaterThanOrEqual(1);
});

test('ViewModeToggle toggle button applies custom className from dropdownToggleProps', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'edit',
      area: 'preview',
      splitAvailable: true,
      dropdownToggleProps: {
        classname: 'custom-toggle-class'
      }
    }}
    />
  );
  const toggleButton = container.querySelector('.viewmode-toggle__dropdown');
  expect(toggleButton.classList.contains('custom-toggle-class')).toBe(true);
});

test('ViewModeToggle renders all dropdown items', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'edit',
      area: 'preview',
      splitAvailable: true,
    }}
    />
  );
  const dropdownItems = container.querySelectorAll('.dropdown-item');
  expect(dropdownItems.length).toBeGreaterThanOrEqual(3);
  expect(dropdownItems[0].textContent).toContain('Split mode');
  expect(dropdownItems[1].textContent).toContain('Edit mode');
  expect(dropdownItems[2].textContent).toContain('Preview mode');
});

test('ViewModeToggle highlights correct button when activeState is preview', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'preview',
      area: 'preview',
      splitAvailable: true,
    }}
    />
  );
  const allButtons = container.querySelectorAll('.viewmode-toggle__button');
  let splitButton; let editButton; let
    previewButton;
  allButtons.forEach(btn => {
    if (btn.querySelector('.font-icon-columns')) {
      splitButton = btn;
    } else if (btn.querySelector('.font-icon-edit-write')) {
      editButton = btn;
    } else if (btn.querySelector('.font-icon-eye')) {
      previewButton = btn;
    }
  });
  expect(splitButton.classList.contains('viewmode-toggle--selected')).toBe(false);
  expect(editButton.classList.contains('viewmode-toggle--selected')).toBe(false);
  expect(previewButton.classList.contains('viewmode-toggle--selected')).toBe(true);
});

test('ViewModeToggle highlights correct button when activeState is edit', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'edit',
      area: 'preview',
      splitAvailable: true,
    }}
    />
  );
  const allButtons = container.querySelectorAll('.viewmode-toggle__button');
  let splitButton; let editButton; let
    previewButton;
  allButtons.forEach(btn => {
    if (btn.querySelector('.font-icon-columns')) {
      splitButton = btn;
    } else if (btn.querySelector('.font-icon-edit-write')) {
      editButton = btn;
    } else if (btn.querySelector('.font-icon-eye')) {
      previewButton = btn;
    }
  });
  expect(splitButton.classList.contains('viewmode-toggle--selected')).toBe(false);
  expect(editButton.classList.contains('viewmode-toggle--selected')).toBe(true);
  expect(previewButton.classList.contains('viewmode-toggle--selected')).toBe(false);
});

test('ViewModeToggle calls onSplitSelect when split button is clicked and available', () => {
  const mockOnSplitSelect = jest.fn();
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'edit',
      area: 'preview',
      splitAvailable: true,
      onSplitSelect: mockOnSplitSelect,
    }}
    />
  );
  const splitButton = container.querySelector('#splitModeButton');
  fireEvent.click(splitButton);
  expect(mockOnSplitSelect).toHaveBeenCalled();
});

test('ViewModeToggle displays icon with aria-hidden attribute', () => {
  const { container } = render(
    <ViewModeToggle {...{
      activeState: 'edit',
      area: 'preview',
      splitAvailable: true,
    }}
    />
  );
  const icons = container.querySelectorAll('[aria-hidden="true"]');
  expect(icons.length).toBeGreaterThan(0);
});
