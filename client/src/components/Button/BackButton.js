import React from 'react';
import Button from 'components/Button/Button';
import classnames from 'classnames';
import i18n from 'i18n';

const BackButton = ({
  className,
  noText = true,
  icon = 'left-open-big',
  children = i18n._t('Admin.BACK', 'Back'),
  ...props
}) => (
  <Button
    className={classnames(className, 'back-button')}
    noText={noText}
    icon={icon}
    {...props}
  >{children}</Button>
);

BackButton.propTypes = Button.propTypes;

export default BackButton;
