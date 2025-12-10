import React, { useState, useEffect, useRef } from 'react';
import TagList from 'components/Tag/TagList';
import ResizeAware from 'components/ResizeAware/ResizeAware';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import SummaryTag from './SummaryTag';

/**
 * Extension of TagList that is aware of its size and switch to a summary view if greater than a
 * specific width.
 */
const CompactTagList = ({
  maxSize = 0,
  onSummary = () => {},
  ...listProps
}) => {
  const [showSummaryView, setShowSummaryView] = useState(false);
  const nodeRef = useRef(null);

  /**
    * Measure the width of the root node. This will tell us what the maximum size our tag list can
    * be.
    * @returns {number}
    */
  const getPlaceholderSize = () => {
    const node = nodeRef.current;
    if (!node) {
      return 0;
    }

    const placeholder = node.querySelector('.compact-tag-list__placeholder');

    if (placeholder) {
      return placeholder.getBoundingClientRect().width;
    }

    return 0;
  };

  /**
    * Compare placeholderWidth to the max width and decide if we should the showSummaryView state.
    * @param placeholderWidth
    */
  const refreshShowSummaryView = (placeholderWidth) => {
    const newShowSummaryView = maxSize < placeholderWidth;

    if (showSummaryView !== newShowSummaryView) {
      setShowSummaryView(newShowSummaryView);
    }
  };

  /**
    * Detect resizing of the TagList placeholder and compare it to the max width our component can
    * occupy. If it's bigger, the summary view is triggered.
    * @param tagListDimension
    */
  const onResize = (tagListDimension) => {
    refreshShowSummaryView(tagListDimension.width);
  };

  useEffect(() => {
    const placeholderWidth = getPlaceholderSize();
    refreshShowSummaryView(placeholderWidth);
  });

  const count = listProps.tags.length;
  const classes = classnames(
    'compact-tag-list',
    { 'compact-tag-list__show-summary-view': showSummaryView }
  );

  return (
    <div className={classes} ref={nodeRef}>
      <ResizeAware onResize={onResize} className="compact-tag-list__placeholder" aria-hidden>
        <TagList {...listProps} focusable={false} />
      </ResizeAware>
      <div className="compact-tag-list__visible">
        { showSummaryView ?
          <SummaryTag count={count} onClick={onSummary} onNext={listProps.onHolderFocus} /> :
          <TagList {...listProps} />
      }
      </div>
    </div>
  );
};

CompactTagList.propTypes = Object.assign({}, TagList.propTypes, {
  maxSize: PropTypes.number,
  onSummary: PropTypes.func
});

export default CompactTagList;
