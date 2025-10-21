import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FilterSelect from './FilterSelect';
import SearchInput from './SearchInput';
import Button from '../Button/Button';
import { useIsMobile } from 'shared/hooks';

/**
 * FilterBar component - Responsive filter bar with multiple filter types
 * Collapsible on mobile devices for better UX
 * 
 * @param {Object} props
 * @param {Array} props.filters - Array of filter configurations
 * @param {Object} props.values - Current filter values
 * @param {Function} props.onChange - Change handler (name, value)
 * @param {Function} props.onClear - Clear all filters handler
 * @param {boolean} props.showClearButton - Show clear button
 * @param {string} props.className - Additional CSS classes
 */
const FilterBar = ({
  filters,
  values,
  onChange,
  onClear,
  showClearButton = true,
  className = ''
}) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(true);
  
  const nonSearchFilters = filters.filter(f => f.type !== 'search');
  const hasActiveFilters = Object.values(values).some(value =>
    value !== '' && value !== 'all' && value !== 'Todos' && value !== 'Todas'
  );

  const activeFiltersCount = Object.values(values).filter(value =>
    value !== '' && value !== 'all' && value !== 'Todos' && value !== 'Todas'
  ).length;

  const renderFilter = (filter) => {
    const value = values[filter.name] || '';

    switch (filter.type) {
      case 'select':
        return (
          <FilterSelect
            key={filter.name}
            label={filter.label}
            value={value}
            onChange={(newValue) => onChange(filter.name, newValue)}
            options={filter.options || []}
            placeholder={filter.placeholder}
          />
        );

      case 'search':
        return (
          <SearchInput
            key={filter.name}
            value={value}
            onChange={(newValue) => onChange(filter.name, newValue)}
            placeholder={filter.placeholder || 'Buscar...'}
            debounceMs={filter.debounceMs}
            label={filter.label}
          />
        );

      case 'date':
        return (
          <div key={filter.name} className="w-full">
            {filter.label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {filter.label}
              </label>
            )}
            <input
              type="date"
              value={value}
              onChange={(e) => onChange(filter.name, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'custom':
        return filter.component ? (
          <div key={filter.name}>
            {React.createElement(filter.component, {
              value,
              onChange: (newValue) => onChange(filter.name, newValue),
              ...filter.props
            })}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const barClasses = `
    bg-white
    shadow-sm
    border-b
    border-gray-200
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={barClasses}>
      {/* Desktop: Botón para colapsar/expandir filtros */}
      {!isMobile && nonSearchFilters.length > 0 && (
        <div className="px-4 md:px-6 py-3 flex items-center justify-between border-b border-gray-100">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center space-x-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
          >
            <i className="fas fa-filter text-sm"></i>
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {activeFiltersCount}
              </span>
            )}
            <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'down'} text-xs ml-1 transition-transform`}></i>
          </button>
          {showClearButton && onClear && hasActiveFilters && (
            <button
              onClick={onClear}
              className="text-sm text-blue-600 font-medium hover:text-blue-700"
            >
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* Mobile: Botón para expandir/colapsar filtros (solo si hay más de un filtro no-search) */}
      {isMobile && nonSearchFilters.length > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-gray-700 font-medium min-h-[44px]"
          >
            <i className="fas fa-filter text-sm"></i>
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {activeFiltersCount}
              </span>
            )}
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-xs ml-1`}></i>
          </button>
          {showClearButton && onClear && hasActiveFilters && (
            <button
              onClick={onClear}
              className="text-sm text-blue-600 font-medium hover:text-blue-700 min-h-[44px] px-3"
            >
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* Buscador separado - si hay filtros de búsqueda */}
      {filters.some(f => f.type === 'search') && (
        <>
          {/* Desktop: Botón para colapsar/expandir buscador */}
          {!isMobile && (
            <div className="px-4 md:px-6 py-3 border-b border-gray-100">
              <button
                onClick={() => setIsSearchCollapsed(!isSearchCollapsed)}
                className="flex items-center space-x-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
              >
                <i className="fas fa-search text-sm"></i>
                <span>Búsqueda</span>
                <i className={`fas fa-chevron-${isSearchCollapsed ? 'right' : 'down'} text-xs ml-1 transition-transform`}></i>
              </button>
            </div>
          )}

          {/* Contenido del buscador */}
          <div className={`
            ${!isMobile && isSearchCollapsed ? 'hidden' : 'block'}
            px-4 md:px-6 py-4 border-b border-gray-100
          `}>
            <div className="max-w-md">
              {filters.filter(f => f.type === 'search').map(renderFilter)}
            </div>
          </div>
        </>
      )}

      {/* Filtros - colapsables en móvil y desktop */}
      <div className={`
        ${isMobile && nonSearchFilters.length > 1 ? (isExpanded ? 'block' : 'hidden') :
          !isMobile && isCollapsed ? 'hidden' : 'block'}
        px-4 md:px-6 py-4
      `}>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filters.filter(f => f.type !== 'search').map(renderFilter)}

          {/* Botón limpiar al mismo nivel */}
          {showClearButton && onClear && (
            <div className="flex items-end md:col-span-2 lg:col-span-1">
              <Button
                variant="ghost"
                icon="fas fa-times"
                onClick={onClear}
                disabled={!hasActiveFilters}
                fullWidth
              >
                Limpiar
              </Button>
            </div>
          )}
        </div>

        {/* Indicador de filtros activos */}
        {hasActiveFilters && (
          <div className="mt-3 flex items-center text-sm text-gray-600 md:col-span-2 lg:col-span-3 xl:col-span-4">
            <i className="fas fa-filter mr-2"></i>
            <span>Filtros activos: {activeFiltersCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

FilterBar.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['select', 'search', 'date', 'custom']).isRequired,
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      options: PropTypes.array,
      placeholder: PropTypes.string,
      debounceMs: PropTypes.number,
      component: PropTypes.elementType,
      props: PropTypes.object
    })
  ).isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  showClearButton: PropTypes.bool,
  className: PropTypes.string
};

export default FilterBar;
