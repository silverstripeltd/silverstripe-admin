/* global jest, test, describe, beforeEach, it, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as Breadcrumb } from '../Breadcrumb';

test('BreadcrumbsComponent renderBreadcrumbs() should convert the props.crumbs array into jsx to be rendered', () => {
  const { container } = render(
    <Breadcrumb {...{
      crumbs: [
        { text: 'breadcrumb1', href: 'href1' },
        { text: 'breadcrumb2', href: 'href2' },
        { text: 'breadcrumb3',
          href: 'href3',
          icon: {
            className: 'breadcrumb3icon',
            onClick: jest.fn(),
          },
        },
      ]
    }}
    />
  );
  const links = container.querySelectorAll('.breadcrumb__item-title');
  expect(links).toHaveLength(3);
  expect(links[0].textContent).toBe('breadcrumb1');
  expect(links[1].textContent).toBe('breadcrumb2');
  expect(links[2].textContent).toBe('breadcrumb3');
  expect(links[2].parentElement.classList).toContain('breadcrumb__item--last');
  expect(container.querySelectorAll('.breadcrumb3icon')).toHaveLength(1);
});

test('BreadcrumbsComponent renderBreadcrumbs() should convert the props.crumbs array into jsx to be rendered', () => {
  const { container } = render(<Breadcrumb/>);
  expect(container.querySelectorAll('.breadcrumb__item')).toHaveLength(0);
});

test('BreadcrumbsComponent renderBreadcrumbs() can have multiple icons for the last crumb', () => {
  const { container } = render(
    <Breadcrumb {...{
      crumbs: [
        { text: 'breadcrumb1', href: 'href1' },
        { text: 'breadcrumb2',
          href: 'href2',
          icons: [
            { className: 'breadcrumb2iconA', onClick: jest.fn() },
            { className: 'breadcrumb2iconB', onClick: jest.fn() }
          ]
        },
      ]
    }}
    />
  );
  expect(container.querySelectorAll('.breadcrumb2iconA')).toHaveLength(1);
  expect(container.querySelectorAll('.breadcrumb2iconB')).toHaveLength(1);
});

test('Breadcrumb renders container with correct class names', () => {
  const { container } = render(
    <Breadcrumb crumbs={[
      { text: 'home', href: '/' },
      { text: 'current' }
    ]}
    />
  );
  const containerEl = container.querySelector('.breadcrumb__container');
  expect(containerEl).not.toBeNull();
  expect(containerEl.classList.contains('fill-height')).toBe(true);
  expect(containerEl.classList.contains('flexbox-area-grow')).toBe(true);
});

test('Breadcrumb does not render breadcrumb list when only one crumb', () => {
  const { container } = render(
    <Breadcrumb crumbs={[
      { text: 'single-page' }
    ]}
    />
  );
  const listContainer = container.querySelector('.breadcrumb__list-container');
  expect(listContainer).toBeNull();
});

test('Breadcrumb renders breadcrumb list when two or more crumbs', () => {
  const { container } = render(
    <Breadcrumb crumbs={[
      { text: 'home', href: '/' },
      { text: 'current' }
    ]}
    />
  );
  const listContainer = container.querySelector('.breadcrumb__list-container');
  expect(listContainer).not.toBeNull();
  const ol = container.querySelector('.breadcrumb');
  expect(ol).not.toBeNull();
});

test('Breadcrumb renders only the last crumb in the last section', () => {
  const { container } = render(
    <Breadcrumb crumbs={[
      { text: 'breadcrumb1', href: 'href1' },
      { text: 'breadcrumb2', href: 'href2' },
      { text: 'breadcrumb3', href: 'href3' }
    ]}
    />
  );
  const lastCrumbElement = container.querySelector('.breadcrumb__item--last');
  expect(lastCrumbElement).not.toBeNull();
  expect(lastCrumbElement.querySelector('h2').textContent).toBe('breadcrumb3');
});

test('Breadcrumb renders single icon for last crumb with icon prop', () => {
  const { container } = render(
    <Breadcrumb crumbs={[
      { text: 'breadcrumb1', href: 'href1' },
      { text: 'breadcrumb2', href: 'href2', icon: { className: 'icon-class' } }
    ]}
    />
  );
  const lastCrumb = container.querySelector('.breadcrumb__item--last');
  expect(lastCrumb).not.toBeNull();
  expect(lastCrumb.querySelector('.icon-class')).not.toBeNull();
});

test('Breadcrumb renders no list items when crumbs prop is not provided', () => {
  const { container } = render(<Breadcrumb />);
  expect(container.querySelectorAll('.breadcrumb__item')).toHaveLength(0);
  expect(container.querySelector('.breadcrumb__item--last')).toBeNull();
});

test('Breadcrumb renders links with proper href attributes', () => {
  const { container } = render(
    <Breadcrumb crumbs={[
      { text: 'home', href: '/home' },
      { text: 'about', href: '/about' },
      { text: 'current' }
    ]}
    />
  );
  const links = container.querySelectorAll('.breadcrumb__item-title');
  expect(links[0].href).toContain('/home');
  expect(links[1].href).toContain('/about');
});

test('Breadcrumb renders icon as button when onClick is provided and nodeName is not specified', () => {
  const { container } = render(
    <Breadcrumb crumbs={[
      { text: 'breadcrumb1', href: 'href1' },
      { text: 'breadcrumb2', href: 'href2', icon: { className: 'custom-icon', onClick: jest.fn() } }
    ]}
    />
  );
  const button = container.querySelector('.breadcrumb__icon.btn');
  expect(button).not.toBeNull();
  expect(button.tagName.toLowerCase()).toBe('button');
  expect(button.classList.contains('btn-secondary')).toBe(true);
});

test('Breadcrumb renders icon as span when onClick is not provided', () => {
  const { container } = render(
    <Breadcrumb crumbs={[
      { text: 'breadcrumb1', href: 'href1' },
      { text: 'breadcrumb2', href: 'href2', icon: { className: 'breadcrumb__icon font-icon-home' } }
    ]}
    />
  );
  const span = container.querySelector('.breadcrumb__icon');
  expect(span).not.toBeNull();
  expect(span.tagName.toLowerCase()).toBe('span');
});

test('Breadcrumb extracts font-icon classes and renders them separately', () => {
  const { container } = render(
    <Breadcrumb crumbs={[
      { text: 'breadcrumb1', href: 'href1' },
      { text: 'breadcrumb2', href: 'href2', icon: { className: 'breadcrumb__icon font-icon-lock other-class' } }
    ]}
    />
  );
  const icon = container.querySelector('.breadcrumb__icon');
  expect(icon).not.toBeNull();
  expect(icon.classList.contains('font-icon-lock')).toBe(false);
  const fontIconSpan = icon.querySelector('[class*="font-icon-lock"]');
  expect(fontIconSpan).not.toBeNull();
  expect(fontIconSpan.getAttribute('aria-hidden')).toBe('true');
});

test('Breadcrumb renders icon with tabIndex attribute', () => {
  const { container } = render(
    <Breadcrumb crumbs={[
      { text: 'breadcrumb1', href: 'href1' },
      { text: 'breadcrumb2', href: 'href2', icon: { className: 'icon-class' } }
    ]}
    />
  );
  const icon = container.querySelector('.breadcrumb__icon');
  expect(icon.getAttribute('tabIndex')).toBe('0');
});

test('Breadcrumb handles icon onClick callback', () => {
  const onClickMock = jest.fn();
  const { container } = render(
    <Breadcrumb crumbs={[
      { text: 'breadcrumb1', href: 'href1' },
      { text: 'breadcrumb2', href: 'href2', icon: { className: 'clickable-icon', onClick: onClickMock } }
    ]}
    />
  );
  const button = container.querySelector('.breadcrumb__icon');
  fireEvent.click(button);
  expect(onClickMock).toHaveBeenCalled();
});

test('Breadcrumb renders multiple icons with proper keys', () => {
  const { container } = render(
    <Breadcrumb crumbs={[
      { text: 'breadcrumb1', href: 'href1' },
      { text: 'breadcrumb2',
        href: 'href2',
        icons: [
          { className: 'icon-one' },
          { className: 'icon-two' },
          { className: 'icon-three' }
        ] }
    ]}
    />
  );
  const icons = container.querySelectorAll('.breadcrumb__icon');
  expect(icons).toHaveLength(3);
  expect(icons[0].classList.contains('icon-one')).toBe(true);
  expect(icons[1].classList.contains('icon-two')).toBe(true);
  expect(icons[2].classList.contains('icon-three')).toBe(true);
});

test('Breadcrumb renders empty crumbs array without errors', () => {
  const { container } = render(<Breadcrumb crumbs={[]} />);
  expect(container.querySelector('.breadcrumb__container')).not.toBeNull();
  expect(container.querySelectorAll('.breadcrumb__item')).toHaveLength(0);
});
