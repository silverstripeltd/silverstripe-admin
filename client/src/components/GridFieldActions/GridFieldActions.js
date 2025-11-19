import React, { memo } from 'react';
import { Button, DropdownItem } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import GridFieldDropdownAction from './GridFieldDropdownAction';
import ActionMenu from '../ActionMenu/ActionMenu';
import GridFieldDropdownActionType from './GridFieldDropdownActionType';

const GridFieldActions = ({
  schema
}) => {
  const renderMultipleActions = (schemaInput) => {
    const groupedActions = schemaInput.reduce((groups, action) => {
      const groupsList = groups;
      const groupName = action.group;

      if (!groupName) { throw new Error(`Action: \"${action.title}\" has no group assigned`); }

      if (!groupsList[groupName]) {
        groupsList[groupName] = [];
      }

      groupsList[groupName].push(action);

      return groupsList;
    }, []);

    const dropdownMenuProps = { end: true };
    const dropdownToggleClassNames = [
      'action-menu__toggle',
      'btn',
      'btn--no-text',
      'btn-sm',
    ];

    return (
      <ActionMenu
        dropdownMenuProps={dropdownMenuProps}
        dropdownToggleClassNames={dropdownToggleClassNames}
      >
        {Object.keys(groupedActions).map(
          (group, groupIndex) => [
            groupIndex !== 0 && <DropdownItem divider key={group} />,
            groupedActions[group].map((action, actionIndex) =>
              (<GridFieldDropdownAction
                data={action.data}
                title={action.title}
                type={action.type}
                url={action.url}
                key={actionIndex} // eslint-disable-line react/no-array-index-key
              />)
            )
          ]
        )}
      </ActionMenu>
    );
  };

  const renderSingleAction = (action) => {
    const { type, title, data } = action;
    let { url } = action;
    let buttonType;
    if (type === 'submit') {
      buttonType = 'submit';
      url = undefined; // If url is defined reactstrap forces it to render as a link
    }
    const className = classnames('action', data.classNames);
    return (
      <Button
        className={className}
        type={buttonType}
        href={url}
        data-url={data['data-url']}
        data-action-state={data['data-action-state']}
        name={data.name}
        color="secondary"
      >
        {data.icon && <span className={`font-icon-${data.icon}`} aria-hidden="true" />}
        {title}
      </Button>
    );
  };

  if (schema.length > 1) {
    return renderMultipleActions(schema);
  } else if (schema.length === 1) {
    return renderSingleAction(schema[0]);
  }
  return null;
};

const actionShape = GridFieldDropdownActionType;
actionShape.group = PropTypes.string;

GridFieldActions.propTypes = PropTypes.arrayOf(
  PropTypes.shape(actionShape)
).isRequired;

// Wrapping export in React.memo() because the old class component extended React.PureComponent
export default memo(GridFieldActions);
