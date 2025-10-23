import React from 'react';
import PropTypes from 'prop-types';
import EmptyState from '../State/EmptyState';
import Skeleton from '../State/Skeleton';

/**
 * MobileCardView component - Card-based view for mobile devices
 * Transforms table data into vertical cards for better mobile UX
 * 
 * @param {Object} props
 * @param {Array} props.data - Array of data objects
 * @param {Array} props.columns - Column configuration
 * @param {Function} props.keyExtractor - Function to extract unique key from row
 * @param {boolean} props.loading - Loading state
 * @param {React.ReactNode} props.emptyState - Custom empty state component
 * @param {Function} props.onRowClick - Row click handler
 * @param {string} props.className - Additional CSS classes
 */
const MobileCardView = ({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyState,
  onRowClick,
  className = ''
}) => {
  const renderCell = (column, row) => {
    if (column.render) {
      return column.render(row);
    }
    return row[column.key];
  };

  // Loading state
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="space-y-3">
              {columns.slice(0, 4).map((_, index) => (
                <div key={index} className="flex justify-between items-start">
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="text" width="50%" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        {emptyState || (
          <EmptyState
            icon="fas fa-inbox"
            title="No hay datos"
            message="No se encontraron resultados"
          />
        )}
      </div>
    );
  }

  // Mobile card view
  return (
    <div className={`space-y-4 px-0 overflow-hidden ${className}`}>
      {data.map((row) => (
        <div
          key={keyExtractor(row)}
          className={`
            bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 overflow-hidden
            ${onRowClick ? 'cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200' : ''}
          `}
          onClick={() => onRowClick && onRowClick(row)}
        >
          <div className="space-y-2 sm:space-y-3 overflow-hidden">
            {columns.map((column, index) => {
              // Skip columns that are explicitly marked as hidden in mobile
              if (column.hideInMobile) {
                return null;
              }

              const cellContent = renderCell(column, row);
              
              // Skip empty cells
              if (cellContent === null || cellContent === undefined || cellContent === '') {
                return null;
              }

              // Check if this is an action column
              const isActionColumn = column.key === 'acciones' || column.header === 'Acciones';

              return (
                <div
                  key={index}
                  className={`
                    ${isActionColumn
                      ? 'flex flex-col gap-2 pt-2 border-t border-gray-100 overflow-hidden'
                      : 'flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 pb-2 sm:pb-3 border-b border-gray-100 overflow-hidden'
                    }
                  `}
                >
                  <span className="text-xs sm:text-sm font-medium text-gray-600 flex-shrink-0 truncate">
                    {column.header}
                  </span>
                  <div className={`
                    text-xs sm:text-sm text-gray-900 break-words overflow-hidden
                    ${isActionColumn ? 'w-full flex justify-end' : 'sm:text-right sm:flex-1 min-w-0'}
                  `}>
                    {cellContent}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

MobileCardView.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      render: PropTypes.func,
      hideInMobile: PropTypes.bool,
    })
  ).isRequired,
  keyExtractor: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  emptyState: PropTypes.node,
  onRowClick: PropTypes.func,
  className: PropTypes.string
};

export default MobileCardView;
