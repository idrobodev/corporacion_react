# Plan de Mejora de Funcionalidad de Exportación

## Resumen Ejecutivo

Este plan detalla las mejoras integrales para la funcionalidad de exportación (PDF y CSV) en las páginas de Participantes, Acudientes y Mensualidades del dashboard de Corporación Todo por un Alma.

---

## 1. CORRECCIÓN DE BUGS CRÍTICOS

### 1.1 Participantes - Mapeo de Datos PDF

**Problema:** Los datos no se muestran correctamente en el PDF exportado.

**Solución:**
- Usar [`calculateAge()`](src/shared/utils/exportUtils.js:104) de exportUtils en lugar de cálculo inline
- Mapear correctamente `nombres + apellidos` en lugar de `nombre`
- Extraer `sede.direccion` en lugar del objeto completo
- Normalizar estados ACTIVO/Activo e INACTIVO/Inactivo

### 1.2 Todos los Módulos - Funciones de Formato

**Crear utilidades reutilizables:**
```javascript
// En src/shared/utils/exportUtils.js

/**
 * Format participant name consistently
 */
export const formatParticipantName = (participante) => {
  if (participante.nombres && participante.apellidos) {
    return `${participante.nombres} ${participante.apellidos}`;
  }
  return participante.nombre || 'N/A';
};

/**
 * Format sede information
 */
export const formatSede = (sede) => {
  if (typeof sede === 'object' && sede !== null) {
    return sede.direccion || sede.nombre || 'N/A';
  }
  return sede || 'N/A';
};

/**
 * Normalize status display
 */
export const normalizeStatus = (estado) => {
  const upper = String(estado).toUpperCase();
  if (upper === 'ACTIVO') return 'Activo';
  if (upper === 'INACTIVO') return 'Inactivo';
  if (upper === 'PAGADA') return 'Pagada';
  if (upper === 'PENDIENTE') return 'Pendiente';
  if (upper === 'VENCIDA') return 'Vencida';
  return estado || 'N/A';
};

/**
 * Format gender display
 */
export const formatGender = (genero) => {
  if (genero === 'MASCULINO') return 'Masculino';
  if (genero === 'FEMENINO') return 'Femenino';
  return genero || 'N/A';
};
```

---

## 2. MEJORAS DE DISEÑO PDF

### 2.1 Template Base Mejorado

**Crear template HTML base con branding corporativo:**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>{{TITLE}} - Corporación Todo por un Alma</title>
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
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    
    .logo-section {
      flex: 1;
    }
    
    .logo {
      max-width: 150px;
      height: auto;
    }
    
    .title-section {
      flex: 2;
      text-align: center;
    }
    
    .title-section h1 {
      color: #2563eb;
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
    }
    
    .filters-box {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-left: 4px solid #2563eb;
      padding: 15px 20px;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .filters-box h3 {
      color: #1e40af;
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
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
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
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-left: 4px solid #2563eb;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .stat-card h4 {
      color: #1e40af;
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
      color: #2563eb;
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
      <!-- Logo aquí -->
      <div style="width: 150px; height: 60px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">LOGO</div>
    </div>
    <div class="title-section">
      <h1>{{TITLE}}</h1>
      <div class="subtitle">Corporación Todo por un Alma</div>
    </div>
    <div class="info-section">
      <div class="date">{{DATE}}</div>
      <div>Generado por: {{USER}}</div>
      <div>Página 1 de {{PAGES}}</div>
    </div>
  </div>
  
  <!-- Contenido dinámico aquí -->
  {{CONTENT}}
  
  <div class="footer">
    <div>© 2024 Corporación Todo por un Alma - Todos los derechos reservados</div>
    <div class="contact">
      <span>📞 Contacto: +57 XXX XXX XXXX</span> | 
      <span>📧 Email: <a href="mailto:info@corporacion.com">info@corporacion.com</a></span> | 
      <span>🌐 Web: <a href="https://corporacion.com">www.corporacion.com</a></span>
    </div>
  </div>
</body>
</html>
```

### 2.2 Colores Consistentes por Módulo

**Definir esquema de colores:**

```javascript
// src/shared/utils/exportThemes.js
export const EXPORT_THEMES = {
  participantes: {
    primary: '#2563eb',      // Blue
    secondary: '#1e40af',
    light: '#eff6ff',
    lightGradient: '#dbeafe'
  },
  acudientes: {
    primary: '#7c3aed',      // Purple
    secondary: '#6d28d9',
    light: '#faf5ff',
    lightGradient: '#ede9fe'
  },
  mensualidades: {
    primary: '#059669',      // Green
    secondary: '#047857',
    light: '#f0fdf4',
    lightGradient: '#dcfce7'
  }
};
```

---

## 3. MEJORAS CSV

### 3.1 Campos Adicionales

**Participantes:**
```javascript
const participantesCSVHeaders = [
  { key: 'id', label: 'ID' },
  { key: 'tipo_documento', label: 'Tipo Documento' },
  { key: 'numero_documento', label: 'Número Documento' },
  { key: 'nombres', label: 'Nombres' },
  { key: 'apellidos', label: 'Apellidos' },
  { key: 'nombre_completo', label: 'Nombre Completo' },
  { key: 'fecha_nacimiento', label: 'Fecha Nacimiento' },
  { key: 'edad', label: 'Edad' },
  { key: 'genero', label: 'Género' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Email' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'sede', label: 'Sede' },
  { key: 'fecha_ingreso', label: 'Fecha Ingreso' },
  { key: 'estado', label: 'Estado' },
  { key: 'programa', label: 'Programa' },
  { key: 'fecha_creacion', label: 'Fecha Registro' }
];
```

**Acudientes:**
```javascript
const acudientesCSVHeaders = [
  { key: 'id', label: 'ID' },
  { key: 'tipo_documento', label: 'Tipo Documento' },
  { key: 'numero_documento', label: 'Número Documento' },
  { key: 'nombres', label: 'Nombres' },
  { key: 'apellidos', label: 'Apellidos' },
  { key: 'nombre_completo', label: 'Nombre Completo' },
  { key: 'parentesco', label: 'Parentesco' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Email' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'participante_id', label: 'ID Participante' },
  { key: 'participante_nombre', label: 'Nombre Participante' },
  { key: 'participante_documento', label: 'Documento Participante' },
  { key: 'fecha_creacion', label: 'Fecha Registro' }
];
```

**Mensualidades:**
```javascript
const mensualidadesCSVHeaders = [
  { key: 'id', label: 'ID' },
  { key: 'participante_id', label: 'ID Participante' },
  { key: 'participante_nombre', label: 'Participante' },
  { key: 'participante_documento', label: 'Documento' },
  { key: 'mes', label: 'Mes' },
  { key: 'anio', label: 'Año' },
  { key: 'monto', label: 'Monto' },
  { key: 'monto_formateado', label: 'Monto (Formateado)' },
  { key: 'fecha_vencimiento', label: 'Fecha Vencimiento' },
  { key: 'fecha_pago', label: 'Fecha Pago' },
  { key: 'dias_vencidos', label: 'Días Vencidos' },
  { key: 'estado', label: 'Estado' },
  { key: 'metodo_pago', label: 'Método de Pago' },
  { key: 'comprobante', label: 'Comprobante' },
  { key: 'observaciones', label: 'Observaciones' },
  { key: 'sede', label: 'Sede' },
  { key: 'fecha_creacion', label: 'Fecha Registro' }
];
```

### 3.2 Formato UTF-8 con BOM

**Mejorar [`downloadCSV()`](src/shared/utils/exportUtils.js:41) para soportar caracteres especiales:**

```javascript
export const downloadCSV = (csvContent, filename) => {
  // Add UTF-8 BOM for proper Excel encoding
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
```

---

## 4. EXPORTACIÓN A EXCEL

### 4.1 Librería Recomendada

**Usar `xlsx` (SheetJS):**
```bash
npm install xlsx
```

### 4.2 Implementación Base

```javascript
// src/shared/utils/excelExport.js
import * as XLSX from 'xlsx';

/**
 * Export data to Excel with formatting
 */
export const exportToExcel = (data, headers, filename, options = {}) => {
  const {
    sheetName = 'Datos',
    includeFilters = true,
    includeStats = true,
    theme = 'blue'
  } = options;

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Prepare data
  const wsData = [
    // Header row
    headers.map(h => h.label),
    // Data rows
    ...data.map(row => headers.map(h => {
      const value = getNestedValue(row, h.key);
      return value !== null && value !== undefined ? value : '';
    }))
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = headers.map(h => ({
    wch: Math.max(h.label.length + 5, 15)
  }));
  ws['!cols'] = colWidths;

  // Apply header styling
  const headerRange = XLSX.utils.decode_range(ws['!ref']);
  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!ws[cellAddress]) continue;
    
    ws[cellAddress].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: theme === 'blue' ? '2563EB' : '7C3AED' } },
      alignment: { vertical: 'center', horizontal: 'left' }
    };
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Add metadata sheet
  if (includeStats) {
    const metaData = [
      ['Reporte Generado', new Date().toLocaleString('es-ES')],
      ['Total de Registros', data.length],
      ['Corporación', 'Todo por un Alma']
    ];
    const wsMeta = XLSX.utils.aoa_to_sheet(metaData);
    XLSX.utils.book_append_sheet(wb, wsMeta, 'Información');
  }

  // Write file
  XLSX.writeFile(wb, filename);
};

/**
 * Helper to get nested values
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};
```

### 4.3 Integración en Componentes

```javascript
// En cada página
import { exportToExcel } from 'shared/utils/excelExport';

const handleExportExcel = useCallback(() => {
  const excelData = filteredData.map(item => ({
    // Map data appropriately
    ...item,
    // Add computed fields
  }));

  exportToExcel(
    excelData,
    headers,
    `${moduleName}_${new Date().toISOString().split('T')[0]}.xlsx`,
    {
      sheetName: moduleName,
      includeStats: true,
      theme: 'blue' // or 'purple' based on module
    }
  );
}, [filteredData]);
```

---

## 5. UI DE CONFIGURACIÓN DE EXPORTACIÓN

### 5.1 Componente ExportConfigModal

```jsx
// src/components/UI/ExportConfigModal.jsx
import React, { useState } from 'react';

const ExportConfigModal = ({ 
  isOpen, 
  onClose, 
  columns, 
  onExport,
  exportFormats = ['pdf', 'csv', 'excel']
}) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedColumns, setSelectedColumns] = useState(
    columns.map(col => col.key)
  );
  const [exportOptions, setExportOptions] = useState({
    includeFilters: true,
    includeStats: true,
    includeHeader: true,
    orientation: 'portrait',
    pageSize: 'A4'
  });

  const toggleColumn = (columnKey) => {
    setSelectedColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(k => k !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleExport = () => {
    const selectedCols = columns.filter(col =>
      selectedColumns.includes(col.key)
    );
    
    onExport({
      format: selectedFormat,
      columns: selectedCols,
      options: exportOptions
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Configurar Exportación
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Formato de Exportación
            </label>
            <div className="grid grid-cols-3 gap-3">
              {exportFormats.includes('pdf') && (
                <button
                  onClick={() => setSelectedFormat('pdf')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    selectedFormat === 'pdf'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <i className="fas fa-file-pdf text-2xl text-red-600 mb-2"></i>
                  <div className="text-sm font-medium">PDF</div>
                </button>
              )}
              {exportFormats.includes('csv') && (
                <button
                  onClick={() => setSelectedFormat('csv')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    selectedFormat === 'csv'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <i className="fas fa-file-csv text-2xl text-green-600 mb-2"></i>
                  <div className="text-sm font-medium">CSV</div>
                </button>
              )}
              {exportFormats.includes('excel') && (
                <button
                  onClick={() => setSelectedFormat('excel')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    selectedFormat === 'excel'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <i className="fas fa-file-excel text-2xl text-blue-600 mb-2"></i>
                  <div className="text-sm font-medium">Excel</div>
                </button>
              )}
            </div>
          </div>

          {/* Column Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Columnas a Exportar
              </label>
              <div className="space-x-2">
                <button
                  onClick={() => setSelectedColumns(columns.map(c => c.key))}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Seleccionar Todas
                </button>
                <button
                  onClick={() => setSelectedColumns([])}
                  className="text-xs text-gray-600 hover:text-gray-700"
                >
                  Deseleccionar Todas
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {columns.map(col => (
                <label
                  key={col.key}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{col.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Opciones
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeHeader}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    includeHeader: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Incluir encabezado corporativo</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeFilters}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    includeFilters: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Incluir filtros aplicados</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeStats}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    includeStats: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Incluir estadísticas</span>
              </label>
            </div>
          </div>

          {/* PDF Specific Options */}
          {selectedFormat === 'pdf' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orientación
                </label>
                <select
                  value={exportOptions.orientation}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    orientation: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="portrait">Vertical</option>
                  <option value="landscape">Horizontal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño de Página
                </label>
                <select
                  value={exportOptions.pageSize}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    pageSize: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="A4">A4</option>
                  <option value="Letter">Carta</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={selectedColumns.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-download mr-2"></i>
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportConfigModal;
```

### 5.2 Actualizar ExportDropdown

```jsx
// src/components/UI/ExportDropdown.jsx - Enhanced version
import React, { useState } from 'react';
import ExportConfigModal from './ExportConfigModal';

const ExportDropdown = ({
  onExportPDF,
  onExportCSV,
  onExportExcel,
  columns = [],
  enableAdvancedConfig = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const handleQuickExport = (format) => {
    if (format === 'pdf' && onExportPDF) onExportPDF();
    if (format === 'csv' && onExportCSV) onExportCSV();
    if (format === 'excel' && onExportExcel) onExportExcel();
    setIsOpen(false);
  };

  const handleConfiguredExport = (config) => {
    if (config.format === 'pdf' && onExportPDF) {
      onExportPDF(config);
    } else if (config.format === 'csv' && onExportCSV) {
      onExportCSV(config);
    } else if (config.format === 'excel' && onExportExcel) {
      onExportExcel(config);
    }
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <i className="fas fa-download"></i>
          <span>Exportar</span>
          <i className={`fas fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {enableAdvancedConfig && (
              <>
                <button
                  onClick={() => {
                    setShowConfigModal(true);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center border-b border-gray-100"
                >
                  <i className="fas fa-cog mr-3 text-blue-600"></i>
                  Exportación Avanzada
                </button>
                <div className="border-t border-gray-100 my-1"></div>
              </>
            )}
            
            <button
              onClick={() => handleQuickExport('pdf')}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center"
            >
              <i className="fas fa-file-pdf mr-3 text-red-600"></i>
              Exportar como PDF
            </button>
            
            <button
              onClick={() => handleQuickExport('csv')}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center"
            >
              <i className="fas fa-file-csv mr-3 text-green-600"></i>
              Exportar como CSV
            </button>
            
            {onExportExcel && (
              <button
                onClick={() => handleQuickExport('excel')}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center"
              >
                <i className="fas fa-file-excel mr-3 text-blue-600"></i>
                Exportar como Excel
              </button>
            )}
          </div>
        )}
      </div>

      {enableAdvancedConfig && (
        <ExportConfigModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          columns={columns}
          onExport={handleConfiguredExport}
          exportFormats={['pdf', 'csv', onExportExcel ? 'excel' : null].filter(Boolean)}
        />
      )}
    </>
  );
};

export default ExportDropdown;
```

---

## 6. ROADMAP DE IMPLEMENTACIÓN

### Fase 1: Corrección de Bugs Críticos (Alta Prioridad)
**Tiempo estimado: 1-2 días**

1. ✅ Crear funciones de utilidad en [`exportUtils.js`](src/shared/utils/exportUtils.js)
   - `formatParticipantName()`
   - `formatSede()`
   - `normalizeStatus()`
   - `formatGender()`

2. ✅ Corregir PDF exports en las 3 páginas
   - [`Participantes.jsx`](src/pages/Dashboard/Participantes.jsx:140) - handleExportPDF
   - [`Acudientes.jsx`](src/pages/Dashboard/Acudientes.jsx:119) - handleExportPDF
   - [`PaymentsList.jsx`](src/pages/Payments/PaymentsList.jsx:40) - handleExportPDF

3. ✅ Mejorar CSV exports con UTF-8 BOM
   - Actualizar [`downloadCSV()`](src/shared/utils/exportUtils.js:41)

### Fase 2: Mejoras de Diseño PDF (Media Prioridad)
**Tiempo estimado: 2-3 días**

1. ✅ Crear template HTML base mejorado
   - Archivo: `src/shared/templates/pdfTemplate.js`

2. ✅ Implementar temas por módulo
   - Archivo: `src/shared/utils/exportThemes.js`

3. ✅ Aplicar nuevo template a las 3 páginas

4. ✅ Agregar logo corporativo (requiere imagen)

### Fase 3: CSV Mejorado (Media Prioridad)
**Tiempo estimado: 1-2 días**

1. ✅ Expandir headers CSV con más campos
   - Participantes: agregar email, dirección, programa
   - Acudientes: agregar datos del participante
   - Mensualidades: agregar detalles completos

2. ✅ Actualizar funciones handleExportCSV en las 3 páginas

### Fase 4: Exportación a Excel (Alta Prioridad)
**Tiempo estimado: 2-3 días**

1. ✅ Instalar y configurar `xlsx`
2. ✅ Crear `src/shared/utils/excelExport.js`
3. ✅ Implementar `exportToExcel()` con formato
4. ✅ Integrar en las 3 páginas
5. ✅ Agregar opción en ExportDropdown

### Fase 5: UI de Configuración (Baja Prioridad)
**Tiempo estimado: 3-4 días**

1. ✅ Crear [`ExportConfigModal.jsx`](src/components/UI/ExportConfigModal.jsx)
2. ✅ Actualizar [`ExportDropdown.jsx`](src/components/UI/ExportDropdown.jsx)
3. ✅ Integrar en las 3 páginas
4. ✅ Testing de todas las opciones

### Fase 6: Testing y Optimización (Alta Prioridad)
**Tiempo estimado: 1-2 días**

1. ✅ Pruebas con datasets grandes
2. ✅ Verificar encodings (UTF-8, caracteres especiales)
3. ✅ Pruebas de impresión PDF
4. ✅ Validar Excel en diferentes versiones
5. ✅ Optimizar rendimiento

---

## 7. CONSIDERACIONES TÉCNICAS

### 7.1 Performance

**Para datasets grandes (>1000 registros):**
- Implementar paginación en exportación
- Mostrar progress indicator
- Usar Web Workers para procesamiento pesado

```javascript
// Ejemplo de export con progreso
const handleExportLarge = async () => {
  const chunkSize = 500;
  const chunks = Math.ceil(filteredData.length / chunkSize);
  
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunk = filteredData.slice(start, end);
    
    // Process chunk
    await processChunk(chunk);
    
    // Update progress
    const progress = ((i + 1) / chunks) * 100;
    setExportProgress(progress);
  }
};
```

### 7.2 Seguridad

- Sanitizar datos antes de exportar (prevenir XSS en PDFs)
- Validar permisos de exportación por rol
- Log de exportaciones para auditoría

### 7.3 Compatibilidad

- PDF: Probar en Chrome, Firefox, Safari, Edge
- CSV: Validar con Excel, Google Sheets, LibreOffice
- Excel: Probar en Excel 2016+, Excel Online, Google Sheets

---

## 8. MÉTRICAS DE ÉXITO

### KPIs

1. **Reducción de errores de exportación**: 0 errores en producción
2. **Tiempo de exportación**: < 3 segundos para datasets de 100 registros
3. **Satisfacción del usuario**: Feedback positivo en uso
4. **Adopción de formatos**: Tracking de uso PDF vs CSV vs Excel

### Testing Checklist

- [ ] Exportación funciona con datos vacíos
- [ ] Exportación funciona con 1 registro
- [ ] Exportación funciona con 100+ registros
- [ ] Caracteres especiales se exportan correctamente (ñ, á, é, í, ó, ú)
- [ ] Filtros aplicados se reflejan en el export
- [ ] Estadísticas son precisas
- [ ] PDF se imprime correctamente
- [ ] CSV se abre correctamente en Excel
- [ ] Excel mantiene formato al abrir
- [ ] Todos los campos esperados están presentes

---

## 9. ARCHIVOS A MODIFICAR/CREAR

### Archivos a Crear
1. `src/shared/utils/excelExport.js` - Funcionalidad Excel
2. `src/shared/utils/exportThemes.js` - Temas de exportación
3. `src/shared/templates/pdfTemplate.js` - Template PDF base
4. `src/components/UI/ExportConfigModal.jsx` - Modal de configuración

### Archivos a Modificar
1. [`src/shared/utils/exportUtils.js`](src/shared/utils/exportUtils.js) - Agregar utilidades
2. [`src/components/UI/ExportDropdown.jsx`](src/components/UI/ExportDropdown.jsx) - Mejorar dropdown
3. [`src/pages/Dashboard/Participantes.jsx`](src/pages/Dashboard/Participantes.jsx) - Corregir exports
4. [`src/pages/Dashboard/Acudientes.jsx`](src/pages/Dashboard/Acudientes.jsx) - Corregir exports
5. [`src/pages/Payments/PaymentsList.jsx`](src/pages/Payments/PaymentsList.jsx) - Corregir exports
6. `package.json` - Agregar dependencia xlsx

---

## 10. PRÓXIMOS PASOS

¿Deseas que proceda con la implementación? Puedo comenzar con:

1. **Fase 1 completa** - Corrección de todos los bugs críticos
2. **Fases 1 + 2** - Bugs + Diseño mejorado de PDFs
3. **Fases 1 + 4** - Bugs + Exportación a Excel
4. **Implementación completa** - Todas las fases

Por favor indica qué enfoque prefieres y procederé a cambiar al modo Code para la implementación.