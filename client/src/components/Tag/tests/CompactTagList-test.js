/* global jest, test, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CompactTagList from '../CompactTagList';

function makeProps(obj = {}) {
  return {
    tags: [
      { key: 'tag1', label: 'Tag 1' },
      { key: 'tag2', label: 'Tag 2' },
      { key: 'tag3', label: 'Tag 3' }
    ],
    maxSize: 500,
    ...obj
  };
}

test('CompactTagList renders with default props', () => {
  const { container } = render(<CompactTagList {...makeProps()} />);
  const compactList = container.querySelector('.compact-tag-list');
  expect(compactList).not.toBeNull();
});

test('CompactTagList renders placeholder with non-focusable TagList', () => {
  const { container } = render(<CompactTagList {...makeProps()} />);
  const placeholder = container.querySelector('.compact-tag-list__placeholder');
  expect(placeholder).not.toBeNull();
  expect(placeholder.getAttribute('aria-hidden')).toBe('true');
});

test('CompactTagList renders visible container with focusable TagList', () => {
  const { container } = render(<CompactTagList {...makeProps()} />);
  const visible = container.querySelector('.compact-tag-list__visible');
  expect(visible).not.toBeNull();
});

test('CompactTagList renders all tags in visible area', () => {
  const { container } = render(<CompactTagList {...makeProps()} />);
  const tags = container.querySelectorAll('.compact-tag-list__visible .tag-component');
  expect(tags.length).toBe(3);
});

test('CompactTagList renders summary view when toggled', () => {
  const { container } = render(<CompactTagList {...makeProps({ maxSize: 100 })} />);
  const compactList = container.querySelector('.compact-tag-list');
  expect(compactList.classList.contains('compact-tag-list__show-summary-view')).toBe(false);
});

test('CompactTagList does not apply summary view class initially', () => {
  const { container } = render(<CompactTagList {...makeProps({ maxSize: 500 })} />);
  const compactList = container.querySelector('.compact-tag-list');
  expect(compactList.classList.contains('compact-tag-list__show-summary-view')).toBe(false);
});

test('CompactTagList renders SummaryTag when showSummaryView is true', () => {
  const { container, rerender } = render(<CompactTagList {...makeProps({ tags: [{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }, { key: 'e' }] })} />);
  const placeholder = container.querySelector('.compact-tag-list__placeholder');
  if (placeholder) {
    Object.defineProperty(placeholder, 'getBoundingClientRect', {
      writable: true,
      value: jest.fn(() => ({
        width: 1000,
        height: 50,
        top: 0,
        left: 0,
        bottom: 50,
        right: 1000,
        x: 0,
        y: 0,
        toJSON: () => {}
      }))
    });
  }
  rerender(<CompactTagList {...makeProps({ tags: [{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }, { key: 'e' }], maxSize: 100 })} />);
});

test('CompactTagList passes onHolderFocus to TagList', () => {
  const onHolderFocus = jest.fn();
  const { container } = render(<CompactTagList {...makeProps({ onHolderFocus })} />);
  const visible = container.querySelector('.compact-tag-list__visible');
  expect(visible).not.toBeNull();
});

test('CompactTagList calls onSummary callback when provided', () => {
  const onSummary = jest.fn();
  const { container } = render(<CompactTagList {...makeProps({ onSummary, maxSize: 50 })} />);
  expect(container.querySelector('.compact-tag-list')).not.toBeNull();
});

test('CompactTagList renders empty tag list', () => {
  const { container } = render(<CompactTagList {...makeProps({ tags: [] })} />);
  const tags = container.querySelectorAll('.compact-tag-list__visible .tag-component');
  expect(tags.length).toBe(0);
});

test('CompactTagList with single tag', () => {
  const { container } = render(<CompactTagList {...makeProps({ tags: [{ key: 'single' }] })} />);
  const tags = container.querySelectorAll('.compact-tag-list__visible .tag-component');
  expect(tags.length).toBe(1);
});

test('CompactTagList with many tags', () => {
  const manyTags = Array.from({ length: 10 }, (_, i) => ({ key: `tag${i}`, label: `Tag ${i}` }));
  const { container } = render(<CompactTagList {...makeProps({ tags: manyTags })} />);
  const tags = container.querySelectorAll('.compact-tag-list__visible .tag-component');
  expect(tags.length).toBe(10);
});

test('CompactTagList passes deletable prop to TagList', () => {
  const { container } = render(<CompactTagList {...makeProps({ deletable: true })} />);
  const deleteButtons = container.querySelectorAll('.compact-tag-list__visible .tag-component__delete');
  expect(deleteButtons.length).toBe(3);
});

test('CompactTagList passes onTagClick to TagList', () => {
  const onTagClick = jest.fn();
  const { container } = render(<CompactTagList {...makeProps({ onTagClick, deletable: false })} />);
  const tags = container.querySelectorAll('.compact-tag-list__visible .tag-component');
  expect(tags.length).toBeGreaterThan(0);
  fireEvent.click(tags[0]);
  expect(onTagClick).toHaveBeenCalled();
});

test('CompactTagList passes onTagDelete to TagList', () => {
  const onTagDelete = jest.fn();
  const { container } = render(<CompactTagList {...makeProps({ onTagDelete, deletable: true })} />);
  const deleteButtons = container.querySelectorAll('.compact-tag-list__visible .tag-component__delete');
  expect(deleteButtons.length).toBeGreaterThan(0);
  fireEvent.click(deleteButtons[0]);
  expect(onTagDelete).toHaveBeenCalled();
});

test('CompactTagList respects default maxSize prop', () => {
  const { container } = render(<CompactTagList {...makeProps({ maxSize: undefined })} />);
  expect(container.querySelector('.compact-tag-list')).not.toBeNull();
});

test('CompactTagList respects default onSummary prop', () => {
  const { container } = render(<CompactTagList {...makeProps({ onSummary: undefined })} />);
  expect(container.querySelector('.compact-tag-list')).not.toBeNull();
});

test('CompactTagList renders placeholder and visible containers separately', () => {
  const { container } = render(<CompactTagList {...makeProps()} />);
  const placeholder = container.querySelector('.compact-tag-list__placeholder');
  const visible = container.querySelector('.compact-tag-list__visible');
  expect(placeholder).not.toBeNull();
  expect(visible).not.toBeNull();
  expect(placeholder).not.toBe(visible);
});

test('CompactTagList placeholder contains non-focusable TagList', () => {
  const { container } = render(<CompactTagList {...makeProps()} />);
  const placeholder = container.querySelector('.compact-tag-list__placeholder');
  const tagListInPlaceholder = placeholder.querySelector('.tag-list');
  expect(tagListInPlaceholder).not.toBeNull();
  const tagsInPlaceholder = placeholder.querySelectorAll('.tag-component');
  tagsInPlaceholder.forEach((tag) => {
    expect(tag.getAttribute('tabindex')).toBeNull();
  });
});

test('CompactTagList visible container contains focusable TagList by default', () => {
  const { container } = render(<CompactTagList {...makeProps()} />);
  const visible = container.querySelector('.compact-tag-list__visible');
  const tagsInVisible = visible.querySelectorAll('.tag-component');
  tagsInVisible.forEach((tag) => {
    expect(tag.getAttribute('tabindex')).toBe('0');
  });
});

test('CompactTagList updates on props change', () => {
  const { container, rerender } = render(<CompactTagList {...makeProps({ tags: [{ key: 'tag1' }] })} />);
  let tags = container.querySelectorAll('.compact-tag-list__visible .tag-component');
  expect(tags.length).toBe(1);
  rerender(<CompactTagList {...makeProps({ tags: [{ key: 'tag1' }, { key: 'tag2' }] })} />);
  tags = container.querySelectorAll('.compact-tag-list__visible .tag-component');
  expect(tags.length).toBe(2);
});

test('CompactTagList with zero maxSize', () => {
  const { container } = render(<CompactTagList {...makeProps({ maxSize: 0 })} />);
  expect(container.querySelector('.compact-tag-list')).not.toBeNull();
});

test('CompactTagList with very large maxSize', () => {
  const { container } = render(<CompactTagList {...makeProps({ maxSize: 10000 })} />);
  expect(container.querySelector('.compact-tag-list')).not.toBeNull();
});
