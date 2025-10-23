/**
 * Export Utilities
 * Functions for exporting data to different formats (CSV, PDF)
 */

/**
 * Format participant name consistently
 * @param {Object} participante - Participant object
 * @returns {string} Formatted full name
 */
export const formatParticipantName = (participante) => {
  if (!participante) return 'N/A';
  
  if (participante.nombres && participante.apellidos) {
    return `${participante.nombres} ${participante.apellidos}`.trim();
  }
  
  return participante.nombre || 'N/A';
};

/**
 * Format sede information
 * @param {Object|string} sede - Sede object or string
 * @returns {string} Formatted sede name
 */
export const formatSede = (sede) => {
  if (!sede) return 'N/A';
  
  if (typeof sede === 'object' && sede !== null) {
    return sede.direccion || sede.nombre || 'N/A';
  }
  
  return String(sede);
};

/**
 * Normalize status display
 * @param {string} estado - Status value
 * @returns {string} Normalized status
 */
export const normalizeStatus = (estado) => {
  if (!estado) return 'N/A';
  
  const upper = String(estado).toUpperCase();
  if (upper === 'ACTIVO') return 'Activo';
  if (upper === 'INACTIVO') return 'Inactivo';
  if (upper === 'PAGADA') return 'Pagada';
  if (upper === 'PENDIENTE') return 'Pendiente';
  if (upper === 'VENCIDA') return 'Vencida';
  
  return estado;
};

/**
 * Format gender display
 * @param {string} genero - Gender value
 * @returns {string} Formatted gender
 */
export const formatGender = (genero) => {
  if (!genero) return 'N/A';
  
  if (genero === 'MASCULINO') return 'Masculino';
  if (genero === 'FEMENINO') return 'Femenino';
  
  return genero;
};

/**
 * Format document type and number
 * @param {string} tipo - Document type
 * @param {string} numero - Document number
 * @returns {string} Formatted document
 */
export const formatDocument = (tipo, numero) => {
  if (!numero) return 'N/A';
  const tipoDoc = tipo || 'CC';
  return `${tipoDoc}: ${numero}`;
};

/**
 * Convert array of objects to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {Array} headers - Array of header objects {key, label}
 * @returns {string} CSV formatted string
 */
export const arrayToCSV = (data, headers) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return '';
  }

  // Create header row
  const headerRow = headers.map(header => `"${header.label}"`).join(',');

  // Create data rows
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = getNestedValue(row, header.key);
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const stringValue = String(value || '');
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
};

/**
 * Create enhanced CSV with metadata, statistics, and better formatting
 * @param {Object} options - Configuration options
 * @param {string} options.title - Title of the report
 * @param {Array} options.data - Array of data objects
 * @param {Array} options.headers - Array of header objects {key, label}
 * @param {Object} options.metadata - Additional metadata {organization, generatedBy, etc}
 * @param {Object} options.statistics - Statistics to include
 * @param {Object} options.filters - Applied filters
 * @returns {string} Enhanced CSV formatted string
 */
export const createEnhancedCSV = (options) => {
  const {
    title = 'Reporte',
    data = [],
    headers = [],
    metadata = {},
    statistics = {},
    filters = {}
  } = options;

  const sections = [];
  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // ========== SECCIÓN 1: ENCABEZADO Y METADATA ==========
  sections.push(`"${title.toUpperCase()}"`);
  sections.push(`"Corporación Todo por un Alma"`);
  sections.push(`"Fecha de generación:","${currentDate}"`);
  
  if (metadata.generatedBy) {
    sections.push(`"Generado por:","${metadata.generatedBy}"`);
  }
  
  sections.push(''); // Línea en blanco

  // ========== SECCIÓN 2: FILTROS APLICADOS ==========
  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    return value && value !== 'all' && value !== 'Todos' && value !== 'Todas' && value !== '';
  });

  if (activeFilters.length > 0) {
    sections.push(`"FILTROS APLICADOS"`);
    activeFilters.forEach(([key, value]) => {
      const filterLabel = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
      sections.push(`"${filterLabel}:","${value}"`);
    });
    sections.push(''); // Línea en blanco
  }

  // ========== SECCIÓN 3: ESTADÍSTICAS ==========
  const statsEntries = Object.entries(statistics).filter(([_, value]) => value !== undefined);
  
  if (statsEntries.length > 0) {
    sections.push(`"ESTADÍSTICAS"`);
    statsEntries.forEach(([key, value]) => {
      const statLabel = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      sections.push(`"${statLabel}:","${value}"`);
    });
    sections.push(''); // Línea en blanco
  }

  // ========== SECCIÓN 4: DATOS ==========
  sections.push(`"DATOS DEL REPORTE"`);
  sections.push(''); // Línea en blanco

  // Crear encabezados de columnas
  const headerRow = headers.map(h => {
    const label = h.label;
    // Escapar comillas dobles y envolver en comillas si contiene comas, comillas o saltos de línea
    if (label.includes(',') || label.includes('"') || label.includes('\n')) {
      return `"${label.replace(/"/g, '""')}"`;
    }
    return label;
  }).join(',');
  sections.push(headerRow);

  // Crear filas de datos
  if (data.length === 0) {
    sections.push(`"No hay datos disponibles"`);
  } else {
    data.forEach(row => {
      const dataRow = headers.map(header => {
        const value = getNestedValue(row, header.key);
        const stringValue = String(value || '');
        // Escapar comillas dobles y envolver en comillas si contiene comas, comillas o saltos de línea
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue; // No envolver en comillas si no es necesario
      }).join(',');
      sections.push(dataRow);
    });
  }

  sections.push(''); // Línea en blanco

  // ========== SECCIÓN 5: RESUMEN FINAL ==========
  sections.push(`"RESUMEN"`);
  sections.push(`"Total de registros:","${data.length}"`);
  sections.push(`"Reporte generado el:","${currentDate}"`);
  
  return sections.join('\n');
};

/**
 * Format statistics for CSV export
 * @param {Array} data - Data array to analyze
 * @param {string} statusField - Field name containing status
 * @returns {Object} Statistics object
 */
export const generateStatistics = (data, statusField = 'estado') => {
  const total = data.length;
  const stats = {
    'Total de Registros': total
  };

  // Count by status
  const statusCounts = {};
  data.forEach(item => {
    const status = normalizeStatus(item[statusField]);
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  Object.entries(statusCounts).forEach(([status, count]) => {
    stats[status] = `${count} (${((count / total) * 100).toFixed(1)}%)`;
  });

  return stats;
};

/**
 * Download data as CSV file with UTF-8 BOM for proper Excel encoding
 * @param {string} csvContent - CSV content as string
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (csvContent, filename) => {
  // Add UTF-8 BOM for proper Excel encoding of special characters (ñ, á, é, í, ó, ú)
  const BOM = '\uFEFF';

  // Ensure filename has .csv extension
  const csvFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;

  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', csvFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Get nested value from object using dot notation
 * @param {Object} obj - Object to get value from
 * @param {string} path - Path to value (e.g., 'sede.direccion')
 * @returns {any} Value at path or undefined
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Format date for CSV export
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForCSV = (date) => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('es-ES');
  } catch {
    return String(date);
  }
};

/**
 * Format currency for CSV export
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrencyForCSV = (amount) => {
  if (amount === null || amount === undefined) return '';
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  } catch {
    return String(amount);
  }
};

/**
 * Calculate age from birth date
 * @param {string|Date} birthDate - Birth date
 * @returns {string} Age string or empty string
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return '';
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? `${age} años` : '';
  } catch {
    return '';
  }
};