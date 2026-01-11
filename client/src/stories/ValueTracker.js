import React, { useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

const triggerAction = action('change');

const ValueTracker = ({
  children,
  value = null,
  name,
}) => {
  // fallback to using a value the child was given
  let val = value;
  if (val === null) {
    React.Children.forEach(children, (child) => {
      if (val === null || typeof val === 'undefined') {
        val = child.props.value;
      }
    });
  }
  const [stateValue, setStateValue] = useState(val);

  const handleChange = (event, { value: changeValue } = {}) => {
    const state = (typeof changeValue === 'undefined')
      ? event
      : changeValue;
    // eslint-disable-next-line no-console
    if (typeof changeValue === 'undefined' && console.warn) {
      // eslint-disable-next-line no-console
      console.warn(`Only value was given, good idea to give event and id as well: "${name}"`);
    }
    if (typeof state !== 'object') {
      triggerAction(state);
    } else {
      triggerAction(JSON.stringify(state));
    }
    setStateValue(state);
  };

  // render
  const mappedChildren = React.Children.map(children, (child) => (
    React.cloneElement(child, {
      value: stateValue,
      onChange: (...args) => {
        if (child.props.onChange) {
          child.props.onChange(...args);
        }
        handleChange(...args);
      },
    })
  ));
  return <div>{mappedChildren}</div>;
};

ValueTracker.propTypes = {
  children: PropTypes.any,
  value: PropTypes.any,
};

export default ValueTracker;
