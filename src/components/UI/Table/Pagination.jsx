import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import { useIsMobile } from 'shared/hooks';

/**
 * Pagination component - Page navigation controls
 * Responsive: compact view on mobile, full view on desktop
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current page number (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Page change handler
 * @param {number} props.itemsPerPage - Items per page
 * @param {number} props.totalItems - Total number of items
 * @param {boolean} props.showInfo - Show items range info
 * @param {number} props.maxPageButtons - Maximum page buttons to show
 * @param {string} props.className - Additional CSS classes
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  showInfo = true,
  maxPageButtons = 5,
  className = ''
}) => {
  const isMobile = useIsMobile();
  
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Calculate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const containerClasses = `
    bg-white
    rounded-2xl
    shadow-lg
    border
    border-gray-100
    p-3
    md:p-4
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Mobile compact view
  if (isMobile) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            {showInfo && (
              <span className="text-xs text-gray-500">
                {startIndex}-{endIndex} de {totalItems}
              </span>
            )}
          </div>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    );
  }

  // Desktop full view
  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        {showInfo && (
          <div className="text-sm text-gray-700">
            Mostrando {startIndex} a {endIndex} de {totalItems} resultados
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            icon="fas fa-chevron-left"
          >
            Anterior
          </Button>

          <div className="flex space-x-2">
            {pageNumbers.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-1 text-gray-500"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`
                    px-3
                    py-1
                    text-sm
                    font-medium
                    rounded-md
                    transition-colors
                    ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            icon="fas fa-chevron-right"
            iconPosition="right"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  showInfo: PropTypes.bool,
  maxPageButtons: PropTypes.number,
  className: PropTypes.string
};

export default Pagination;
