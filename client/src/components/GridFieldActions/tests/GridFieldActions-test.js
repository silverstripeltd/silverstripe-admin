/* global jest, test, describe, beforeEach, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import GridFieldActions from '../GridFieldActions';

const button = {
  type: 'submit',
  title: 'Button',
  group: 'My Group',
  data: {},
};

const link = {
  type: 'link',
  title: 'Link',
  url: '/test-url',
  group: 'My Group',
  data: {},
};

test('GridFieldActions.render() should not render, if there are no actions', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: []
    }}
    />
  );
  expect(container.querySelectorAll('.action')).toHaveLength(0);
});

test('GridFieldActions.render() should render a single button, if there is only one action', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [link]
    }}
    />
  );
  expect(container.querySelectorAll('.action')).toHaveLength(1);
});

test('GridFieldActions.render() should render a menu, if there is more than one action', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [button, link]
    }}
    />
  );
  expect(container.querySelector('.action-menu__toggle').getAttribute('aria-label')).toBe('View actions');
});

test('GridFieldActions.renderSingleAction() should render a button', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [button]
    }}
    />
  );
  expect(container.querySelector('button').type).toBe('submit');
});

test('GridFieldActions.renderSingleAction() should render a link', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [link]
    }}
    />
  );
  expect(container.querySelector('a').classList).toContain('action');
});

test('GridFieldActions.renderSingleAction() should render a link when type is null', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [{
        type: null,
        title: 'Link',
        url: '/test-url',
        group: 'My Group',
        data: {},
      }]
    }}
    />
  );
  expect(container.querySelector('a').classList).toContain('action');
});

test('GridFieldActions.renderMultipleActions() should render the correct type of element according to action type', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [button, link]
    }}
    />
  );
  const actions = container.querySelectorAll('.action');
  expect(actions[0].innerHTML).toBe('Button');
  expect(actions[0].tagName).toBe('BUTTON');
  expect(actions[1].innerHTML).toBe('Link');
  expect(actions[1].tagName).toBe('A');
});

test('GridFieldActions.renderMultipleActions() should not render a divider if there is only one defined', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [button, link]
    }}
    />
  );
  expect(container.querySelector('.dropdown-divider')).toBeNull();
});

test('GridFieldActions.renderMultipleActions() should render dividers according to groups provided declared for each actions', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [
        {
          type: 'submit',
          title: 'Button',
          group: 'First Group',
          data: {},
        },
        {
          type: 'link',
          title: 'Link',
          url: '/test-url',
          group: 'Second Group',
          data: {},
        }
      ]
    }}
    />
  );
  const actionMenu = container.querySelector('.action-menu__dropdown').children;
  expect(actionMenu).toHaveLength(3);
  expect(actionMenu[0].className).toContain('action');
  expect(actionMenu[1].className).toContain('dropdown-divider');
  expect(actionMenu[2].className).toContain('action');
});

test('GridFieldActions.renderMultipleActions() ', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [
        {
          type: 'submit',
          title: 'Button',
          group: 'First Group',
          data: {},
        },
        {
          type: 'link',
          title: 'Link',
          url: '/test-url',
          group: 'Second Group',
          data: {},
        },
        {
          type: 'link',
          title: 'Link',
          url: '/test-url',
          group: 'Third Group',
          data: {},
        },
        {
          type: 'submit',
          title: 'Button',
          group: 'First Group',
          data: {},
        },
        {
          type: 'link',
          title: 'Link',
          url: '/test-url',
          group: 'Second Group',
          data: {},
        },
        {
          type: 'link',
          title: 'Link',
          url: '/test-url',
          group: 'Third Group',
          data: {},
        }
      ]
    }}
    />
  );
  const actionMenu = container.querySelector('.action-menu__dropdown').children;
  expect(actionMenu).toHaveLength(8);
  expect(actionMenu[0].className).toContain('action');
  expect(actionMenu[1].className).toContain('action');
  expect(actionMenu[2].className).toContain('dropdown-divider');
  expect(actionMenu[3].className).toContain('action');
  expect(actionMenu[4].className).toContain('action');
  expect(actionMenu[5].className).toContain('dropdown-divider');
  expect(actionMenu[6].className).toContain('action');
  expect(actionMenu[7].className).toContain('action');
});

test('GridFieldActions.renderSingleAction() should render a button with submit type', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [button]
    }}
    />
  );
  const buttonEl = container.querySelector('button');
  expect(buttonEl.type).toBe('submit');
  expect(buttonEl.hasAttribute('href')).toBe(false);
});

test('GridFieldActions.renderSingleAction() should render a link without url attribute on submit button', () => {
  const submitWithUrl = {
    type: 'submit',
    title: 'Submit Button',
    group: 'My Group',
    data: {},
    url: '/some-url'
  };
  const { container } = render(
    <GridFieldActions {...{
      schema: [submitWithUrl]
    }}
    />
  );
  const buttonEl = container.querySelector('button');
  expect(buttonEl.hasAttribute('href')).toBe(false);
});

test('GridFieldActions.renderSingleAction() should render button with data attributes', () => {
  const actionWithData = {
    type: 'submit',
    title: 'Submit',
    group: 'My Group',
    data: {
      'data-url': '/action-url',
      'data-action-state': 'publish',
      name: 'action_publish',
      classNames: 'extra-class'
    }
  };
  const { container } = render(
    <GridFieldActions {...{
      schema: [actionWithData]
    }}
    />
  );
  const buttonEl = container.querySelector('button');
  expect(buttonEl.getAttribute('data-url')).toBe('/action-url');
  expect(buttonEl.getAttribute('data-action-state')).toBe('publish');
  expect(buttonEl.getAttribute('name')).toBe('action_publish');
  expect(buttonEl.classList.contains('extra-class')).toBe(true);
  expect(buttonEl.classList.contains('action')).toBe(true);
});

test('GridFieldActions.renderSingleAction() should render link with data attributes', () => {
  const linkWithData = {
    type: 'link',
    title: 'Edit',
    url: '/edit-url',
    group: 'My Group',
    data: {
      'data-url': '/row-edit-url',
      'data-action-state': 'edit',
      name: 'action_edit',
      classNames: 'btn-link'
    }
  };
  const { container } = render(
    <GridFieldActions {...{
      schema: [linkWithData]
    }}
    />
  );
  const linkEl = container.querySelector('a');
  expect(linkEl.getAttribute('href')).toBe('/edit-url');
  expect(linkEl.getAttribute('data-url')).toBe('/row-edit-url');
  expect(linkEl.getAttribute('data-action-state')).toBe('edit');
  expect(linkEl.getAttribute('name')).toBe('action_edit');
  expect(linkEl.classList.contains('btn-link')).toBe(true);
});

test('GridFieldActions.renderSingleAction() should render button with icon', () => {
  const actionWithIcon = {
    type: 'submit',
    title: 'Delete',
    group: 'My Group',
    data: {
      icon: 'trash'
    }
  };
  const { container } = render(
    <GridFieldActions {...{
      schema: [actionWithIcon]
    }}
    />
  );
  const icon = container.querySelector('.font-icon-trash');
  expect(icon).not.toBeNull();
  expect(icon.getAttribute('aria-hidden')).toBe('true');
});

test('GridFieldActions.renderSingleAction() should render link with icon', () => {
  const linkWithIcon = {
    type: 'link',
    title: 'Export',
    url: '/export',
    group: 'My Group',
    data: {
      icon: 'download'
    }
  };
  const { container } = render(
    <GridFieldActions {...{
      schema: [linkWithIcon]
    }}
    />
  );
  const icon = container.querySelector('.font-icon-download');
  expect(icon).not.toBeNull();
  expect(icon.getAttribute('aria-hidden')).toBe('true');
});

test('GridFieldActions.renderSingleAction() should render button with color secondary', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [button]
    }}
    />
  );
  const buttonEl = container.querySelector('button');
  expect(buttonEl.classList.contains('btn-secondary')).toBe(true);
});

test('GridFieldActions.renderMultipleActions() should render actions without icon', () => {
  const actionNoIcon = {
    type: 'submit',
    title: 'No Icon Action',
    group: 'My Group',
    data: {}
  };
  const { container } = render(
    <GridFieldActions {...{
      schema: [button, actionNoIcon]
    }}
    />
  );
  const actions = container.querySelectorAll('.action');
  expect(actions[1].textContent).toBe('No Icon Action');
  expect(actions[1].querySelector('[class*="font-icon-"]')).toBeNull();
});

test('GridFieldActions.renderMultipleActions() should render actions with multiple icons in same group', () => {
  const action1 = {
    type: 'submit',
    title: 'Save',
    group: 'Save Group',
    data: { icon: 'save' }
  };
  const action2 = {
    type: 'link',
    title: 'Preview',
    url: '/preview',
    group: 'Save Group',
    data: { icon: 'external-link' }
  };
  const { container } = render(
    <GridFieldActions {...{
      schema: [action1, action2]
    }}
    />
  );
  const actionIcons = container.querySelectorAll('.action [class*="font-icon-"]');
  expect(actionIcons).toHaveLength(2);
  expect(actionIcons[0].classList.contains('font-icon-save')).toBe(true);
  expect(actionIcons[1].classList.contains('font-icon-external-link')).toBe(true);
});

test('GridFieldActions.renderMultipleActions() should throw error when action has no group', () => {
  const actionNoGroup = {
    type: 'submit',
    title: 'No Group',
    data: {}
  };
  expect(() => {
    render(
      <GridFieldActions {...{
        schema: [button, actionNoGroup]
      }}
      />
    );
  }).toThrow('Action: "No Group" has no group assigned');
});

test('GridFieldActions should merge custom classNames with action class', () => {
  const actionWithMultipleClasses = {
    type: 'submit',
    title: 'Multi Class',
    group: 'My Group',
    data: {
      classNames: 'class-one class-two'
    }
  };
  const { container } = render(
    <GridFieldActions {...{
      schema: [actionWithMultipleClasses]
    }}
    />
  );
  const buttonEl = container.querySelector('button');
  expect(buttonEl.classList.contains('action')).toBe(true);
  expect(buttonEl.classList.contains('class-one')).toBe(true);
  expect(buttonEl.classList.contains('class-two')).toBe(true);
});

test('GridFieldActions.renderMultipleActions() should render action menu with correct dropdown props', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [button, link]
    }}
    />
  );
  const dropdownMenu = container.querySelector('.action-menu__dropdown');
  expect(dropdownMenu).not.toBeNull();
  expect(dropdownMenu.parentElement.querySelector('.action-menu__toggle')).not.toBeNull();
});

test('GridFieldActions.renderMultipleActions() should group actions by group name correctly', () => {
  const action1 = {
    type: 'submit',
    title: 'First Group Action 1',
    group: 'Group A',
    data: {}
  };
  const action2 = {
    type: 'link',
    title: 'First Group Action 2',
    url: '/url',
    group: 'Group A',
    data: {}
  };
  const action3 = {
    type: 'submit',
    title: 'Second Group Action',
    group: 'Group B',
    data: {}
  };
  const { container } = render(
    <GridFieldActions {...{
      schema: [action1, action2, action3]
    }}
    />
  );
  const actionMenu = container.querySelector('.action-menu__dropdown').children;
  expect(actionMenu).toHaveLength(4);
  expect(actionMenu[0].textContent).toBe('First Group Action 1');
  expect(actionMenu[1].textContent).toBe('First Group Action 2');
  expect(actionMenu[2].className).toContain('dropdown-divider');
  expect(actionMenu[3].textContent).toBe('Second Group Action');
});
