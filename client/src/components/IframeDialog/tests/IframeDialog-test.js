/* global jest, test, expect, afterEach */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IframeDialog from '../IframeDialog';

jest.mock('reactstrap', () => ({
  Modal: ({ isOpen, className, modalClassName, children }) => (
    <div
      data-testid="modal"
      data-is-open={isOpen}
      className={className}
      data-modal-class={modalClassName}
    >
      {children}
    </div>
  ),
  ModalHeader: ({ toggle, children }) => (
    <div
      data-testid="modal-header"
      className="modal-header"
      onClick={toggle}
    >
      {children}
    </div>
  ),
  ModalBody: ({ className, children }) => (
    <div
      data-testid="modal-body"
      className={className}
    >
      {children}
    </div>
  ),
}));

afterEach(() => {
  jest.clearAllMocks();
});

function makeProps(obj = {}) {
  return {
    url: 'https://example.com',
    isOpen: true,
    title: 'Test Dialog',
    ...obj
  };
}

test('IframeDialog renders with required props', () => {
  const { container } = render(<IframeDialog {...makeProps()} />);
  const iframe = container.querySelector('iframe');
  expect(iframe).not.toBeNull();
  expect(iframe.getAttribute('src')).toBe('https://example.com');
});

test('IframeDialog renders with isOpen true', () => {
  render(<IframeDialog {...makeProps({ isOpen: true })} />);
  const modal = screen.getByTestId('modal');
  expect(modal.getAttribute('data-is-open')).toBe('true');
});

test('IframeDialog renders with isOpen false', () => {
  render(<IframeDialog {...makeProps({ isOpen: false })} />);
  const modal = screen.getByTestId('modal');
  expect(modal.getAttribute('data-is-open')).toBe('false');
});

test('IframeDialog renders header with title', () => {
  render(<IframeDialog {...makeProps()} />);
  const header = screen.getByTestId('modal-header');
  expect(header.textContent).toBe('Test Dialog');
});

test('IframeDialog does not render header when title is null', () => {
  render(<IframeDialog {...makeProps({ title: null })} />);
  expect(screen.queryByTestId('modal-header')).toBeNull();
});

test('IframeDialog does not render header when title is false', () => {
  render(<IframeDialog {...makeProps({ title: false })} />);
  expect(screen.queryByTestId('modal-header')).toBeNull();
});

test('IframeDialog applies custom className to modal', () => {
  render(
    <IframeDialog {...makeProps({ className: 'custom-modal-class' })} />
  );
  const modal = screen.getByTestId('modal');
  expect(modal.classList.contains('custom-modal-class')).toBe(true);
});

test('IframeDialog applies iframe-dialog className to modal', () => {
  render(<IframeDialog {...makeProps()} />);
  const modal = screen.getByTestId('modal');
  expect(modal.classList.contains('iframe-dialog')).toBe(true);
});

test('IframeDialog applies custom iframeClassName', () => {
  const { container } = render(
    <IframeDialog {...makeProps({ iframeClassName: 'custom-iframe-class' })} />
  );
  const iframe = container.querySelector('iframe.custom-iframe-class');
  expect(iframe).not.toBeNull();
});

test('IframeDialog applies iframe-dialog__iframe className to iframe', () => {
  const { container } = render(<IframeDialog {...makeProps()} />);
  const iframe = container.querySelector('iframe.iframe-dialog__iframe');
  expect(iframe).not.toBeNull();
});

test('IframeDialog applies modalClassName', () => {
  render(
    <IframeDialog {...makeProps({ modalClassName: 'custom-modal-class' })} />
  );
  const modal = screen.getByTestId('modal');
  expect(modal.getAttribute('data-modal-class')).toBe('custom-modal-class');
});

test('IframeDialog applies bodyClassName', () => {
  render(
    <IframeDialog {...makeProps({ bodyClassName: 'custom-body-class' })} />
  );
  const modalBody = screen.getByTestId('modal-body');
  expect(modalBody.classList.contains('custom-body-class')).toBe(true);
});

test('IframeDialog sets iframe id', () => {
  const { container } = render(
    <IframeDialog {...makeProps({ iframeId: 'test-iframe' })} />
  );
  const iframe = container.querySelector('#test-iframe');
  expect(iframe).not.toBeNull();
});

test('IframeDialog calls onClosed when modal header is clicked', () => {
  const onClosed = jest.fn();
  render(<IframeDialog {...makeProps({ onClosed })} />);
  const header = screen.getByTestId('modal-header');
  fireEvent.click(header);
  expect(onClosed).toHaveBeenCalled();
});

test('IframeDialog handles undefined onClosed prop without error', () => {
  render(<IframeDialog {...makeProps({ onClosed: undefined })} />);
  const header = screen.getByTestId('modal-header');
  expect(() => {
    fireEvent.click(header);
  }).not.toThrow();
});

test('IframeDialog renders with no title', () => {
  render(<IframeDialog {...makeProps({ title: undefined })} />);
  expect(screen.queryByTestId('modal-header')).toBeNull();
});

test('IframeDialog iframe has frameBorder 0', () => {
  const { container } = render(<IframeDialog {...makeProps()} />);
  const iframe = container.querySelector('iframe');
  expect(iframe.getAttribute('frameBorder')).toBe('0');
});

test('IframeDialog renders with multiple custom classes', () => {
  const { container } = render(
    <IframeDialog
      {...makeProps({
        className: 'class1 class2',
        iframeClassName: 'iframe-class1 iframe-class2',
      })}
    />
  );
  const modal = screen.getByTestId('modal');
  expect(modal.classList.contains('class1')).toBe(true);
  expect(modal.classList.contains('class2')).toBe(true);
  const iframe = container.querySelector('iframe.iframe-class1.iframe-class2');
  expect(iframe).not.toBeNull();
});

test('IframeDialog with empty string title does not render header', () => {
  render(<IframeDialog {...makeProps({ title: '' })} />);
  expect(screen.queryByTestId('modal-header')).toBeNull();
});

test('IframeDialog respects isOpen prop changes', () => {
  const { rerender } = render(
    <IframeDialog {...makeProps({ isOpen: true })} />
  );
  let modal = screen.getByTestId('modal');
  expect(modal.getAttribute('data-is-open')).toBe('true');
  rerender(<IframeDialog {...makeProps({ isOpen: false })} />);
  modal = screen.getByTestId('modal');
  expect(modal.getAttribute('data-is-open')).toBe('false');
});

test('IframeDialog renders ModalBody with iframe inside', () => {
  render(<IframeDialog {...makeProps()} />);
  const modalBody = screen.getByTestId('modal-body');
  expect(modalBody).not.toBeNull();
  const iframe = modalBody.querySelector('iframe');
  expect(iframe).not.toBeNull();
});

test('IframeDialog with title and custom classes renders all attributes', () => {
  const { container } = render(
    <IframeDialog
      {...makeProps({
        url: 'https://test.com/page',
        title: 'Test Page',
        iframeId: 'test-frame',
        className: 'outer-class',
        modalClassName: 'modal-class',
        iframeClassName: 'frame-class',
        bodyClassName: 'body-class',
      })}
    />
  );
  expect(screen.getByText('Test Page')).not.toBeNull();
  expect(screen.getByTestId('modal').classList.contains('outer-class')).toBe(true);
  expect(screen.getByTestId('modal').getAttribute('data-modal-class')).toBe('modal-class');
  expect(container.querySelector('#test-frame')).not.toBeNull();
  expect(container.querySelector('iframe.frame-class')).not.toBeNull();
  expect(screen.getByTestId('modal-body').classList.contains('body-class')).toBe(true);
  const iframe = container.querySelector('iframe');
  expect(iframe.getAttribute('src')).toBe('https://test.com/page');
});

test('IframeDialog onClosed not called if prop is null', () => {
  render(
    <IframeDialog {...makeProps({ onClosed: null })} />
  );
  const header = screen.getByTestId('modal-header');
  expect(() => {
    fireEvent.click(header);
  }).not.toThrow();
});

test('IframeDialog changes URL when prop updates', () => {
  const { container, rerender } = render(
    <IframeDialog {...makeProps({ url: 'https://first.com' })} />
  );
  let iframe = container.querySelector('iframe');
  expect(iframe.getAttribute('src')).toBe('https://first.com');
  rerender(<IframeDialog {...makeProps({ url: 'https://second.com' })} />);
  iframe = container.querySelector('iframe');
  expect(iframe.getAttribute('src')).toBe('https://second.com');
});

test('IframeDialog updates title when prop changes', () => {
  const { rerender } = render(
    <IframeDialog {...makeProps({ title: 'Original Title' })} />
  );
  expect(screen.getByText('Original Title')).not.toBeNull();
  rerender(<IframeDialog {...makeProps({ title: 'Updated Title' })} />);
  expect(screen.getByText('Updated Title')).not.toBeNull();
  expect(screen.queryByText('Original Title')).toBeNull();
});
