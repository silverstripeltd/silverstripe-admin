import {
  createElement,
  Children,
  cloneElement,
  isValidElement,
  useState,
  useRef,
  useCallback,
  useEffect
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import PropTypes from 'prop-types';

/**
 * Can be wrapped around a component to detect dimension changes.
 */
const ResizeAware = ({
  children,
  onlyEvent,
  component = 'div',
  onResize,
  widthPropName = 'width',
  heightPropName = 'height',
  ...props
}) => {
  // Consolidate size into a single state object to prevent double re-renders
  const [sizes, setSizes] = useState({ width: undefined, height: undefined });

  // Keep the latest onResize prop in a ref.
  // This allows the Observer callback to access the latest function
  // without needing to restart the observer when the prop changes.
  const onResizeRef = useRef(onResize);

  // Update the ref whenever the prop changes
  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  // Store the observer instance so we can clean it up
  const observerRef = useRef(null);

  // Shared resize handler
  const handleResize = useCallback((newSizes) => {
    setSizes((prevSizes) => {
      if (
        prevSizes.width === newSizes.width &&
        prevSizes.height === newSizes.height
      ) {
        // Bail out if dimensions haven't changed
        return prevSizes;
      }
      return { width: newSizes.width, height: newSizes.height };
    });

    if (onResizeRef.current) {
      onResizeRef.current(newSizes);
    }
  }, []);

  // Use a Callback Ref to manage the node and the observer.
  // This is safer than useEffect because it reacts immediately when the DOM node exists.
  const handleNode = useCallback((node) => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      // Create a new observer
      observerRef.current = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { width, height } = entry.contentRect;
          handleResize({ width, height });
        });
      });

      // Observe the element
      observerRef.current.observe(node);

      // Trigger initial sizing event (mimicking componentDidMount from original)
      const initialSizes = {
        width: node.offsetWidth,
        height: node.offsetHeight,
      };
      handleResize(initialSizes);
    }
  }, [handleResize]);

  // Cleanup on unmount (failsafe)
  useEffect(() => () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);

  const hasCustomComponent = typeof component !== 'string';
  const widthProp = widthPropName;
  const heightProp = heightPropName;

  const childSizes = {
    [widthProp]: sizes.width,
    [heightProp]: sizes.height,
  };

  return createElement(
    component,
    {
      // If it's a custom component, we assume it accepts a prop (getRef)
      // If it's a string ('div'), we use the standard 'ref'
      [hasCustomComponent ? 'getRef' : 'ref']: handleNode,
      ...(hasCustomComponent && childSizes),
      ...props,
    },
    typeof children === 'function'
      ? children({ width: sizes.width, height: sizes.height })
      : Children.map(children, (child) =>
        (isValidElement(child)
          ? cloneElement(child, !onlyEvent ? childSizes : null)
          : child)
      )
  );
};

ResizeAware.propTypes = {
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  onResize: PropTypes.func,
  widthPropName: PropTypes.string,
  heightPropName: PropTypes.string,
};

export default ResizeAware;
