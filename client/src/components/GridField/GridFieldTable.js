import React from 'react';
import PropTypes from 'prop-types';

const GridFieldTable = ({
  header,
  rows,
}) => {
  /**
   * Generates the header component.
   *
   * Uses the header component passed via the `header` prop if it exists.
   * Otherwise generates a header from the `data` prop.
   *
   * @return object|null
   */
  const generateHeader = () => {
    if (typeof header !== 'undefined') {
      return header;
    }

    return null;
  };

  /**
   * Generates the table rows.
   *
   * Uses the components passed via the `rows` props if it exists.
   * Otherwise generates rows from the `data` prop.
   *
   * @return object|null
   */
  const generateRows = () => {
    if (typeof rows !== 'undefined') {
      return rows;
    }

    return null;
  };

  return (
    <div className="grid-field">
      <table className="table table-hover grid-field__table">
        <thead>{generateHeader()}</thead>
        <tbody>{generateRows()}</tbody>
      </table>
    </div>
  );
};

GridFieldTable.propTypes = {
  header: PropTypes.object,
  rows: PropTypes.array,
};

export default GridFieldTable;
