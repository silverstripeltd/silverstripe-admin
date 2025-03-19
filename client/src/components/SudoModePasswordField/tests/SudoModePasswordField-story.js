import React from 'react';
import { Component as SudoModePasswordField } from '../SudoModePasswordField';

window.ss.config = {
  SecurityID: '12345',
  sections: [
    {
      name: 'SilverStripe\\Admin\\SudoModeController',
      endpoints: {
        // Setting the endpoint to null will prevent an XHR request from being made
        activate: null,
      }
    },
  ],
};

export default {
  title: 'Admin/SudoModePasswordField',
  component: SudoModePasswordField,
  decorators: [],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'The SudoModePasswordField component. Enter "password" to simulate a successful request.'
      },
      canvas: {
        sourceState: 'shown',
      },
    }
  },
  argTypes: {
    sectionTitle: {
      description: 'The title of the section that is being protected.',
      control: 'text',
      type: {
        required: false
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'My special data' },
      },
    },
    collapsed: {
      description: 'Whether the password field should be collapsed by default.',
      control: 'boolean',
      type: {
        required: true
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    autocomplete: {
      description: 'The autocomplete attribute for the password field.',
      control: 'text',
      type: {
        required: true
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'off' },
      },
    },
  }
};

export const _SudoModePasswordField = (props) => {
  const newProps = {
    ...props,
    onSuccess: () => {},
    autocomplete: props.autocomplete || 'off',
    collapsed: props.hasOwnProperty('collapsed') ? props.collapsed : false,
    sectionTitle: props.sectionTitle || 'My special data',
  };
  return <SudoModePasswordField {...newProps}/>;
};
