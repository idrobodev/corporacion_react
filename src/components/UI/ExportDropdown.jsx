import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ExportDropdown component - Dropdown menu for export options (PDF/CSV)
 *
 * @param {Object} props
 * @param {Function} props.onExportPDF - Function to handle PDF export
 * @param {Function} props.onExportCSV - Function to handle CSV export
 * @param {string} props.className - Additional CSS classes
 */
const ExportDropdown = ({
  onExportPDF,
  onExportCSV,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExportClick = (exportType) => {
    if (exportType === 'pdf' && onExportPDF) {
      onExportPDF();
    } else if (exportType === 'csv' && onExportCSV) {
      onExportCSV();
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative dropdown-container ${className}`}>
      <button
        type="button"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label="Opciones de exportación"
        aria-expanded={isOpen}
      >
        <i className="fas fa-download"></i>
        <span>Exportar</span>
        <i className={`fas fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fadeIn overflow-hidden">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleExportClick('pdf');
            }}
            className="w-full text-left px-4 py-3 text-sm transition-colors cursor-pointer hover:bg-gray-50 flex items-center"
          >
            <i className="fas fa-file-pdf mr-3 text-red-600"></i>
            Exportar como PDF
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleExportClick('csv');
            }}
            className="w-full text-left px-4 py-3 text-sm transition-colors cursor-pointer hover:bg-gray-50 flex items-center border-t border-gray-100"
          >
            <i className="fas fa-file-csv mr-3 text-green-600"></i>
            Exportar como CSV
          </button>
        </div>
      )}
    </div>
  );
};

ExportDropdown.propTypes = {
  onExportPDF: PropTypes.func,
  onExportCSV: PropTypes.func,
  className: PropTypes.string
};

export default ExportDropdown;