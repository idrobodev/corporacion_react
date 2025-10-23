/**
 * Export Themes
 * Define color schemes and branding for different modules
 */

export const EXPORT_THEMES = {
  participantes: {
    primary: '#2563eb',      // Blue
    primaryDark: '#1e40af',
    light: '#eff6ff',
    lightGradient: '#dbeafe',
    name: 'Participantes'
  },
  acudientes: {
    primary: '#7c3aed',      // Purple
    primaryDark: '#6d28d9',
    light: '#faf5ff',
    lightGradient: '#ede9fe',
    name: 'Acudientes'
  },
  mensualidades: {
    primary: '#059669',      // Green
    primaryDark: '#047857',
    light: '#f0fdf4',
    lightGradient: '#dcfce7',
    name: 'Mensualidades'
  }
};

/**
 * Get theme for a specific module
 * @param {string} module - Module name (participantes, acudientes, mensualidades)
 * @returns {Object} Theme object
 */
export const getTheme = (module) => {
  return EXPORT_THEMES[module] || EXPORT_THEMES.participantes;
};

/**
 * Corporate branding information
 */
export const CORPORATE_INFO = {
  name: 'Corporación Todo por un Alma',
  phone: '+57 XXX XXX XXXX',
  email: 'info@corporacion.com',
  website: 'www.corporacion.com',
  copyright: '© 2024 Corporación Todo por un Alma - Todos los derechos reservados'
};