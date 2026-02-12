import React from 'react';

/**
 * Table Component - Reusable table with consistent styling
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions: [{ header, accessor, render }]
 * @param {Array} props.data - Array of data objects
 * @param {boolean} props.striped - Enable striped rows
 * @param {boolean} props.hoverable - Enable row hover effect
 */
export const Table = ({ 
  columns = [], 
  data = [], 
  striped = false,
  hoverable = true,
  className = '',
  ...props 
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200" {...props}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`bg-white divide-y divide-gray-200`}>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                ${hoverable ? 'hover:bg-gray-100 transition-colors' : ''}
              `}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render 
                    ? column.render(row[column.accessor], row, rowIndex)
                    : row[column.accessor]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};

export default Table;
