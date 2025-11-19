import React, { memo } from 'react';
import { DropdownItem } from 'reactstrap';
import classnames from 'classnames';
import GridFieldDropdownActionType from './GridFieldDropdownActionType';

const GridFieldDropdownAction = ({
  type,
  title,
  data,
  url,
}) => {
  const className = classnames('action', data.classNames);
  let elementType = null;

  switch (type) {
    case 'submit':
    case 'button':
      elementType = 'button';
      url = undefined;
      break;
    case 'link':
      elementType = 'a';
      break;
    default:
      elementType = undefined;
      break;
  }
  return (
    <DropdownItem
      className={className}
      href={url}
      tag={elementType}
      type={elementType === 'button' ? 'button' : undefined}
      data-url={data['data-url']}
      data-action-state={data['data-action-state']}
      name={data.name}
    >
      {data.icon && <span className={`font-icon-${data.icon}`} aria-hidden="true" />}
      {title}
    </DropdownItem>
  );
};

GridFieldDropdownAction.propTypes = GridFieldDropdownActionType;

// Wrapping export in React.memo() because the old class component extended React.PureComponent
export default memo(GridFieldDropdownAction);
