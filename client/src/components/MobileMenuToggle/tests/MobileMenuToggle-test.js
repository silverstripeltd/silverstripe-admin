/* global jest, test, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MobileMenuToggle from '../MobileMenuToggle';

function makeProps(obj = {}) {
  return {
    isOpen: false,
    onClick: jest.fn(),
    controls: 'toggle-menu',
    ...obj
  };
}

test('MobileMenuToggle render() renders', () => {
  const { container } = render(
    <MobileMenuToggle {...makeProps()} />
  );
  expect(container.querySelectorAll('button.cms-mobile-menu-toggle')).toHaveLength(1);
  expect(container.querySelectorAll('button.cms-mobile-menu-toggle--open')).toHaveLength(0);
});

test('MobileMenuToggle render() renders open', () => {
  const { container } = render(
    <MobileMenuToggle {...makeProps({
      isOpen: true,
    })}
    />
  );
  expect(container.querySelectorAll('button.cms-mobile-menu-toggle')).toHaveLength(1);
  expect(container.querySelectorAll('button.cms-mobile-menu-toggle--open')).toHaveLength(1);
});

test('MobileMenuToggle renders button with correct type', () => {
  const { container } = render(
    <MobileMenuToggle {...makeProps()} />
  );
  const button = container.querySelector('button');
  expect(button.getAttribute('type')).toBe('button');
});

test('MobileMenuToggle renders four span elements', () => {
  const { container } = render(
    <MobileMenuToggle {...makeProps()} />
  );
  const button = container.querySelector('button.cms-mobile-menu-toggle');
  const spans = button.querySelectorAll('span');
  expect(spans).toHaveLength(4);
});

test('MobileMenuToggle sets aria-controls attribute', () => {
  const { container } = render(
    <MobileMenuToggle {...makeProps({
      controls: 'menu-id-123',
    })}
    />
  );
  const button = container.querySelector('button');
  expect(button.getAttribute('aria-controls')).toBe('menu-id-123');
});

test('MobileMenuToggle sets aria-expanded to false when closed', () => {
  const { container } = render(
    <MobileMenuToggle {...makeProps({
      isOpen: false,
    })}
    />
  );
  const button = container.querySelector('button');
  expect(button.getAttribute('aria-expanded')).toBe('false');
});

test('MobileMenuToggle sets aria-expanded to true when open', () => {
  const { container } = render(
    <MobileMenuToggle {...makeProps({
      isOpen: true,
    })}
    />
  );
  const button = container.querySelector('button');
  expect(button.getAttribute('aria-expanded')).toBe('true');
});

test('MobileMenuToggle calls onClick callback when clicked', () => {
  const onClick = jest.fn();
  const { container } = render(
    <MobileMenuToggle {...makeProps({
      onClick,
    })}
    />
  );
  const button = container.querySelector('button');
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onClick.mock.calls[0][0]).toHaveProperty('type', 'click');
});

test('MobileMenuToggle prevents default on click', () => {
  const onClick = jest.fn();
  const { container } = render(
    <MobileMenuToggle {...makeProps({
      onClick,
    })}
    />
  );
  const button = container.querySelector('button');
  const event = new MouseEvent('click', { bubbles: true });
  event.preventDefault = jest.fn();
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalled();
});

test('MobileMenuToggle handles missing controls prop with default value', () => {
  const { container } = render(
    <MobileMenuToggle {...makeProps({
      controls: undefined,
    })}
    />
  );
  const button = container.querySelector('button');
  expect(button.getAttribute('aria-controls')).toBe('');
});

test('MobileMenuToggle updates classes when isOpen changes', () => {
  const { container, rerender } = render(
    <MobileMenuToggle {...makeProps({
      isOpen: false,
    })}
    />
  );
  expect(container.querySelector('button.cms-mobile-menu-toggle--open')).toBeNull();
  rerender(
    <MobileMenuToggle {...makeProps({
      isOpen: true,
    })}
    />
  );
  expect(container.querySelector('button.cms-mobile-menu-toggle--open')).not.toBeNull();
});

test('MobileMenuToggle renders href attribute', () => {
  const { container } = render(
    <MobileMenuToggle {...makeProps()} />
  );
  const button = container.querySelector('button');
  expect(button.getAttribute('href')).toBe('#toggle-mobile-menu');
});

test('MobileMenuToggle click event receives event object', () => {
  const onClick = jest.fn();
  const { container } = render(
    <MobileMenuToggle {...makeProps({
      onClick,
    })}
    />
  );
  const button = container.querySelector('button');
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledWith(expect.objectContaining({
    type: 'click',
  }));
});

test('MobileMenuToggle updates aria-expanded when isOpen prop changes', () => {
  const { container, rerender } = render(
    <MobileMenuToggle {...makeProps({
      isOpen: false,
    })}
    />
  );
  const button = container.querySelector('button');
  expect(button.getAttribute('aria-expanded')).toBe('false');
  rerender(
    <MobileMenuToggle {...makeProps({
      isOpen: true,
    })}
    />
  );
  expect(button.getAttribute('aria-expanded')).toBe('true');
});
