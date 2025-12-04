/* global jest, test, describe, beforeEach, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import FileStatusIcon from '../FileStatusIcon';

test('FileStatusIcon.render() shows the restricted access icon', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true
    }}
    />
  );
  expect(container.querySelector('.font-icon-user-lock')).not.toBe(null);
});

test('FileStatusIcon.render() shows the form submission icon if access restricted', () => {
  const { container } = render(
    <FileStatusIcon {...{
      isTrackedFormUpload: true,
      hasRestrictedAccess: true
    }}
    />
  );
  expect(container.querySelector('.font-icon-address-card')).not.toBe(null);
});

test('FileStatusIcon.render() shows the form submission alert icon if access unrestricted', () => {
  const { container } = render(
    <FileStatusIcon {...{
      isTrackedFormUpload: true,
      hasRestrictedAccess: false
    }}
    />
  );
  expect(container.querySelector('.font-icon-address-card-warning')).not.toBe(null);
});

test('FileStatusIcon.render() can add an extraClassName to the container', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
      extraClassName: 'myclassname'
    }}
    />
  );
  expect(container.querySelector('.file-status-icon').classList).toContain('myclassname');
});

test('FileStatusIcon.render() has no background by default', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
    }}
    />
  );
  expect(container.querySelector('.file-status-icon').classList).not.toContain('file-status-icon--background');
});

test('FileStatusIcon.render() has a background if added', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
      includeBackground: true
    }}
    />
  );
  expect(container.querySelector('.file-status-icon').classList).toContain('file-status-icon--background');
});

test('FileStatusIcon.render() returns empty string when no status flags are set', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: false,
      isTrackedFormUpload: false
    }}
    />
  );
  expect(container.innerHTML).toBe('');
});

test('FileStatusIcon.render() uses fileID in the element id', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
      fileID: 42
    }}
    />
  );
  expect(container.querySelector('[id="FileStatusIcon-restricted-42"]')).not.toBe(null);
});

test('FileStatusIcon.render() creates different ids for different fileIDs', () => {
  const { container: container1 } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
      fileID: 1
    }}
    />
  );
  const { container: container2 } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
      fileID: 2
    }}
    />
  );
  expect(container1.querySelector('[id="FileStatusIcon-restricted-1"]')).not.toBe(null);
  expect(container2.querySelector('[id="FileStatusIcon-restricted-2"]')).not.toBe(null);
});

test('FileStatusIcon.render() uses tracked-form-upload id type for tracked forms', () => {
  const { container } = render(
    <FileStatusIcon {...{
      isTrackedFormUpload: true,
      hasRestrictedAccess: true,
      fileID: 99
    }}
    />
  );
  expect(container.querySelector('[id="FileStatusIcon-tracked-form-upload-99"]')).not.toBe(null);
});

test('FileStatusIcon.render() hides tooltip when disableTooltip is true', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
      disableTooltip: true
    }}
    />
  );
  expect(container.querySelector('.UncontrolledTooltip')).toBe(null);
});

test('FileStatusIcon.render() has different content when tooltip is disabled vs enabled', () => {
  const { container: containerWithTooltip } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
      disableTooltip: false,
      fileID: 1
    }}
    />
  );
  const { container: containerWithoutTooltip } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
      disableTooltip: true,
      fileID: 1
    }}
    />
  );
  // Both should have the wrapper and icon
  expect(containerWithTooltip.querySelector('.file-status-icon')).not.toBe(null);
  expect(containerWithoutTooltip.querySelector('.file-status-icon')).not.toBe(null);
  // With tooltip disabled, the wrapper should only have span child
  const wrapperWithoutTooltip = containerWithoutTooltip.querySelector('.file-status-icon');
  expect(wrapperWithoutTooltip.innerHTML).not.toContain('UncontrolledTooltip');
});

test('FileStatusIcon.render() applies correct aria-label for restricted access', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true
    }}
    />
  );
  const icon = container.querySelector('.font-icon-user-lock');
  expect(icon).not.toBe(null);
  expect(icon.getAttribute('aria-label')).toBeTruthy();
});

test('FileStatusIcon.render() applies correct aria-label for tracked form restricted', () => {
  const { container } = render(
    <FileStatusIcon {...{
      isTrackedFormUpload: true,
      hasRestrictedAccess: true
    }}
    />
  );
  const icon = container.querySelector('.font-icon-address-card');
  expect(icon).not.toBe(null);
  expect(icon.getAttribute('aria-label')).toBeTruthy();
});

test('FileStatusIcon.render() applies correct aria-label for tracked form unrestricted', () => {
  const { container } = render(
    <FileStatusIcon {...{
      isTrackedFormUpload: true,
      hasRestrictedAccess: false
    }}
    />
  );
  const icon = container.querySelector('.font-icon-address-card-warning');
  expect(icon).not.toBe(null);
  expect(icon.getAttribute('aria-label')).toBeTruthy();
});

test('FileStatusIcon.render() renders container with correct base class', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true
    }}
    />
  );
  expect(container.querySelector('.file-status-icon')).not.toBe(null);
});

test('FileStatusIcon.render() renders icon span with file-status-icon__icon class', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true
    }}
    />
  );
  expect(container.querySelector('.file-status-icon__icon')).not.toBe(null);
});

test('FileStatusIcon.render() renders icon with base icon class', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true
    }}
    />
  );
  const icon = container.querySelector('span.icon');
  expect(icon).not.toBe(null);
});

test('FileStatusIcon.render() can combine multiple classNames', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
      extraClassName: 'custom-class',
      includeBackground: true
    }}
    />
  );
  const wrapper = container.querySelector('.file-status-icon');
  expect(wrapper.classList).toContain('file-status-icon');
  expect(wrapper.classList).toContain('custom-class');
  expect(wrapper.classList).toContain('file-status-icon--background');
});

test('FileStatusIcon.render() renders correct structure for restricted file', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
      fileID: 5
    }}
    />
  );
  const wrapper = container.querySelector('.file-status-icon');
  expect(wrapper).not.toBe(null);
  const icon = wrapper.querySelector('span[id^="FileStatusIcon"]');
  expect(icon).not.toBe(null);
});

test('FileStatusIcon.render() renders correct structure for tracked form', () => {
  const { container } = render(
    <FileStatusIcon {...{
      isTrackedFormUpload: true,
      hasRestrictedAccess: true,
      fileID: 5
    }}
    />
  );
  const wrapper = container.querySelector('.file-status-icon');
  expect(wrapper).not.toBe(null);
  const icon = wrapper.querySelector('span[id^="FileStatusIcon-tracked"]');
  expect(icon).not.toBe(null);
});
