/**
 * PDF Export Template
 * Reusable HTML template for PDF exports with corporate branding
 */

import { getTheme, CORPORATE_INFO } from '../utils/exportThemes';

/**
 * Generate PDF HTML template
 * @param {Object} options - Template options
 * @param {string} options.title - Report title
 * @param {string} options.module - Module name (participantes, acudientes, mensualidades)
 * @param {string} options.filtersHTML - HTML for filters section
 * @param {string} options.tableHTML - HTML for data table
 * @param {string} options.statsHTML - HTML for statistics section
 * @param {string} options.currentDate - Current date string
 * @param {string} options.currentUser - Current user name (optional)
 * @returns {string} Complete HTML template
 */
export const generatePDFTemplate = ({
  title,
  module = 'participantes',
  filtersHTML = '',
  tableHTML = '',
  statsHTML = '',
  currentDate,
  currentUser = 'Sistema'
}) => {
  const theme = getTheme(module);

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${title} - ${CORPORATE_INFO.name}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1f2937;
          line-height: 1.6;
          font-size: 10pt;
        }
        
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid ${theme.primary};
          padding-bottom: 20px;
          margin-bottom: 25px;
        }
        
        .logo-section {
          flex: 1;
        }
        
        .logo {
          width: 150px;
          height: 60px;
          background: ${theme.primary};
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12pt;
        }
        
        .title-section {
          flex: 2;
          text-align: center;
        }
        
        .title-section h1 {
          color: ${theme.primary};
          font-size: 24pt;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .title-section .subtitle {
          color: #6b7280;
          font-size: 11pt;
          font-weight: 500;
        }
        
        .info-section {
          flex: 1;
          text-align: right;
          font-size: 9pt;
          color: #6b7280;
        }
        
        .info-section .date {
          font-weight: 600;
          color: #374151;
          margin-bottom: 3px;
        }
        
        .info-section .user {
          font-size: 8pt;
        }
        
        .filters-box {
          background: linear-gradient(135deg, ${theme.light} 0%, ${theme.lightGradient} 100%);
          border-left: 4px solid ${theme.primary};
          padding: 15px 20px;
          margin-bottom: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .filters-box h3 {
          color: ${theme.primaryDark};
          font-size: 11pt;
          margin-bottom: 10px;
          font-weight: 600;
        }
        
        .filter-item {
          display: inline-block;
          margin-right: 20px;
          margin-bottom: 5px;
          font-size: 9pt;
        }
        
        .filter-item strong {
          color: #374151;
          font-weight: 600;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          background: white;
        }
        
        thead {
          background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%);
        }
        
        th {
          color: white;
          font-weight: 600;
          padding: 12px 10px;
          text-align: left;
          font-size: 9pt;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        td {
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 9pt;
        }
        
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        tr:hover {
          background-color: #f3f4f6;
        }
        
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 25px;
          page-break-inside: avoid;
        }
        
        .stat-card {
          background: linear-gradient(135deg, ${theme.light} 0%, ${theme.lightGradient} 100%);
          border-left: 4px solid ${theme.primary};
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .stat-card h4 {
          color: ${theme.primaryDark};
          font-size: 9pt;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stat-card .value {
          color: #1f2937;
          font-size: 18pt;
          font-weight: 700;
        }
        
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          font-size: 8pt;
          color: #6b7280;
          page-break-inside: avoid;
        }
        
        .footer .contact {
          margin-top: 10px;
        }
        
        .footer .contact a {
          color: ${theme.primary};
          text-decoration: none;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 8pt;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-activo, .status-pagada {
          background-color: #d1fae5;
          color: #065f46;
        }
        
        .status-inactivo, .status-vencida {
          background-color: #fee2e2;
          color: #991b1b;
        }
        
        .status-pendiente {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
          
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
          
          tfoot {
            display: table-footer-group;
          }
        }
      </style>
    </head>
    <body>
      <div class="header-container">
        <div class="logo-section">
          <div class="logo">LOGO</div>
        </div>
        <div class="title-section">
          <h1>${title}</h1>
          <div class="subtitle">${CORPORATE_INFO.name}</div>
        </div>
        <div class="info-section">
          <div class="date">${currentDate}</div>
          <div class="user">Generado por: ${currentUser}</div>
        </div>
      </div>
      
      ${filtersHTML ? `
      <div class="filters-box">
        <h3>Filtros Aplicados</h3>
        ${filtersHTML}
      </div>
      ` : ''}
      
      ${tableHTML}
      
      ${statsHTML ? `
      <div class="stats-container">
        ${statsHTML}
      </div>
      ` : ''}
      
      <div class="footer">
        <div>${CORPORATE_INFO.copyright}</div>
        <div class="contact">
          <span>📞 ${CORPORATE_INFO.phone}</span> | 
          <span>📧 <a href="mailto:${CORPORATE_INFO.email}">${CORPORATE_INFO.email}</a></span> | 
          <span>🌐 <a href="https://${CORPORATE_INFO.website}">${CORPORATE_INFO.website}</a></span>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() {
            window.close();
          }, 1000);
        }
      </script>
    </body>
    </html>
  `;
};

/**
 * Generate filters HTML section
 * @param {Array} filters - Array of filter objects {label, value}
 * @returns {string} HTML for filters
 */
export const generateFiltersHTML = (filters) => {
  return filters
    .filter(f => f.value && f.value !== 'Todos' && f.value !== 'TODOS')
    .map(filter => `
      <div class="filter-item">
        <strong>${filter.label}:</strong> ${filter.value}
      </div>
    `)
    .join('');
};

/**
 * Generate statistics HTML section
 * @param {Array} stats - Array of stat objects {label, value}
 * @returns {string} HTML for statistics
 */
export const generateStatsHTML = (stats) => {
  return stats
    .map(stat => `
      <div class="stat-card">
        <h4>${stat.label}</h4>
        <div class="value">${stat.value}</div>
      </div>
    `)
    .join('');
};