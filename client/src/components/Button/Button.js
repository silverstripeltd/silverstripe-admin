import React from 'react';
import { Button as BaseButton } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import IconHOC from './IconHOC';

const Button = ({
  className,
  noText = false,
  children,
  ...props
}) =>
  (<BaseButton
    className={classnames(className, { 'btn--no-text': noText })}
    aria-label={noText ? children : undefined}
    {...props}
  >{noText ? undefined : children}</BaseButton>);

Button.propTypes = {
  ...BaseButton.propTypes,
  noText: PropTypes.bool
};

export default IconHOC(Button);
