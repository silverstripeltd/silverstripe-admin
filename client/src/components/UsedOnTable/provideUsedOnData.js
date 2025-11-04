import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadUsedOn } from 'state/usedOn/usedOnActions';
import { injectTabContext } from 'hooks/useTabContext';

const provideUsedOnData = (UsedOnTable) => {
  const UsedOnDataProvider = ({
    identifier,
    loading,
    data,
    error,
    usedOn,
    forceFetch,
    tabContext,
    loadUsedOn: loadUsedOnAction,
  }) => {
    const [haveFetchedData, setHaveFetchedData] = useState(false);

    const fetchDataFromEndpoint = () => {
      const { method, url } = (data.readUsageEndpoint || {});
      if (!haveFetchedData || forceFetch) {
        // see client/src/state/usedOn/usedOnActions.js
        loadUsedOnAction(identifier, method, url);
      }
      setHaveFetchedData(true);
    };

    useEffect(() => {
      // Fetch data if on of the following is true:
      // - identifier has changed
      // - component is not in a tab
      // - component is on the currently active tab
      // - forceFetch is true
      if (tabContext && !tabContext.isOnActiveTab && !forceFetch) {
        return;
      }
      fetchDataFromEndpoint();
    }, [identifier, tabContext, forceFetch]);

    return <UsedOnTable
      loading={loading}
      usedOn={usedOn}
      error={error}
    />;
  };

  UsedOnDataProvider.propTypes = {
    identifier: PropTypes.string,
    loading: PropTypes.bool,
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({
        recordClass: PropTypes.string,
        recordId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        readUsageEndpoint: PropTypes.shape({
          url: PropTypes.string,
          method: PropTypes.string,
        }),
      }),
    ]),
    usedOn: PropTypes.array,
    forceFetch: PropTypes.bool,
  };

  const mapStateToProps = (state, props) => {
    const {
      recordClass,
      recordId,
    } = props.data;

    const identifier = (recordClass && recordId) ? `${recordClass}#${recordId}` : '';
    const usedState = state.usedOn;
    const loading = usedState.loading.includes(identifier);
    const usedOn = usedState.usedOn[identifier] || null;
    const error = usedState.errors[identifier] || null;

    return {
      identifier,
      loading,
      usedOn,
      error,
    };
  };

  const ComponentWithTabContext = injectTabContext(UsedOnDataProvider);
  const connectedUsedOnDataProvider = connect(
    mapStateToProps,
    { loadUsedOn }
  )(ComponentWithTabContext);
  connectedUsedOnDataProvider.Component = ComponentWithTabContext;

  return connectedUsedOnDataProvider;
};

export default provideUsedOnData;
