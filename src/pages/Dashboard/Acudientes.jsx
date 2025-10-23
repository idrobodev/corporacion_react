import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "components/layout/DashboardLayout";
import { dbService } from "shared/services";
import { FilterBar, ExportDropdown } from "components/UI";
import { StatsGrid } from "components/UI/Card";
import { DataTable, ActionDropdown } from "components/UI/Table";
import { ViewDetailsModal, EditFormModal, CreateFormModal } from "components/common/CRUDModals";
import { useFilters, useModal } from "shared/hooks";
import {
  validateAcudienteDocumentoUnico,
  validateEmail,
  validateParticipanteExists
} from "shared/utils/validationUtils";
import {
  createEnhancedCSV,
  downloadCSV,
  formatParticipantName,
  formatDocument
} from "shared/utils/exportUtils";

const AcudientesComponent = () => {
  const [acudientes, setAcudientes] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use custom hooks
  const { filters: filtros, setFilter, clearFilters } = useFilters({
    participante: "Todos",
    busqueda: ""
  });
  
  const verModal = useModal();
  const editarModal = useModal();
  const crearModal = useModal();


  // Función para cargar acudientes
  const loadAcudientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando acudientes...');

      const result = await dbService.getAcudientes();
      console.log('📊 Resultado acudientes:', result);

      if (result.error) {
        throw new Error(result.error.message || 'Error al cargar acudientes');
      }

      const acudientesData = Array.isArray(result.data?.data) ? result.data.data : [];
      setAcudientes(acudientesData);
      console.log('✅ Acudientes cargados:', acudientesData.length);
    } catch (err) {
      console.error('❌ Error cargando acudientes:', err);
      setError(err.message || 'Error desconocido al cargar acudientes');
      setAcudientes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para cargar participantes
  const loadParticipantes = useCallback(async () => {
    try {
      console.log('🔄 Cargando participantes...');
      const result = await dbService.getParticipantes();

      if (result.error) {
        console.error('Error cargando participantes:', result.error);
        setParticipantes([]);
        return;
      }

      const participantesData = Array.isArray(result.data?.data) ? result.data.data : [];
      setParticipantes(participantesData);
      console.log('✅ Participantes cargados:', participantesData.length);
    } catch (err) {
      console.error('❌ Error cargando participantes:', err);
      setParticipantes([]);
    }
  }, []);

  useEffect(() => {
    loadAcudientes();
    loadParticipantes();
  }, [loadAcudientes, loadParticipantes]);

  // Filtrar acudientes por nombre, documento y participante
  const filteredAcudientes = useMemo(() => {
    const safeAcudientes = Array.isArray(acudientes) ? acudientes : [];
    let filtered = safeAcudientes;

    // Filtrar por participante
    if (filtros.participante !== "Todos") {
      filtered = filtered.filter(a => {
        const participanteId = a.id_participante || a.participante?.id_participante;
        return participanteId && participanteId.toString() === filtros.participante;
      });
    }

    // Filtrar por búsqueda (solo documento)
    if (filtros.busqueda) {
      filtered = filtered.filter(a =>
        (a.numero_documento || '').includes(filtros.busqueda)
      );
    }

    return filtered;
  }, [acudientes, filtros]);

  // Estadísticas
  const statsData = useMemo(() => [
    {
      title: "Total Acudientes",
      value: filteredAcudientes.length,
      icon: "fas fa-user-friends",
      color: "blue"
    }
  ], [filteredAcudientes]);

  // Función para exportar a PDF
  const handleExportPDF = useCallback(() => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('es-ES');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lista de Acudientes - ${currentDate}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #7c3aed;
              margin: 0;
              font-size: 24px;
            }
            .filters {
              margin-bottom: 20px;
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
            }
            .filters h3 {
              margin: 0 0 10px 0;
              color: #495057;
            }
            .filters p {
              margin: 5px 0;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px 12px;
              text-align: left;
            }
            th {
              background-color: #f8f9fa;
              font-weight: bold;
              color: #495057;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .stats {
              margin-top: 30px;
              background: #ede9fe;
              padding: 15px;
              border-radius: 5px;
            }
            .stats h3 {
              margin: 0 0 10px 0;
              color: #7c3aed;
            }
            .stats p {
              margin: 5px 0;
              font-size: 14px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Lista de Acudientes</h1>
            <p>Corporación Todo por un Alma</p>
            <p>Fecha de generación: ${currentDate}</p>
          </div>

          <div class="filters">
            <h3>Filtros aplicados:</h3>
            <p><strong>Participante:</strong> ${filtros.participante === 'Todos' ? 'Todos los participantes' : (() => {
              const p = participantes.find(part => (part.id_participante || part.id).toString() === filtros.participante);
              return p?.nombre || `${p?.nombres || ''} ${p?.apellidos || ''}`.trim() || 'N/A';
            })()}</p>
            ${filtros.busqueda ? `<p><strong>Búsqueda:</strong> "${filtros.busqueda}"</p>` : ''}
          </div>

          <table>
            <thead>
              <tr>
                <th>Acudiente</th>
                <th>Documento</th>
                <th>Participante</th>
                <th>Parentesco</th>
                <th>Teléfono</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAcudientes.map(acudiente => {
                const participante = participantes.find(p =>
                  (p.id_participante || p.id) === acudiente.id_participante
                );
                const acudienteNombre = `${acudiente.nombres || ''} ${acudiente.apellidos || ''}`.trim() || 'N/A';
                const acudienteDoc = formatDocument(acudiente.tipo_documento, acudiente.numero_documento);
                const participanteNombre = formatParticipantName(participante);
                
                return `
                  <tr>
                    <td>${acudienteNombre}</td>
                    <td>${acudienteDoc}</td>
                    <td>${participanteNombre}</td>
                    <td>${acudiente.parentesco || 'N/A'}</td>
                    <td>${acudiente.telefono || 'N/A'}</td>
                    <td>${acudiente.email || 'N/A'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="stats">
            <h3>Estadísticas:</h3>
            <p><strong>Total de acudientes:</strong> ${filteredAcudientes.length}</p>
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

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }, [filtros, filteredAcudientes, participantes]);

  const handleExportCSV = useCallback(() => {
    const headers = [
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
      { key: 'participante_documento', label: 'Documento Participante' }
    ];

    const csvData = filteredAcudientes.map(acudiente => {
      const participante = participantes.find(p =>
        (p.id_participante || p.id) === acudiente.id_participante
      );

      return {
        tipo_documento: acudiente.tipo_documento || 'N/A',
        numero_documento: acudiente.numero_documento || 'N/A',
        nombres: acudiente.nombres || 'N/A',
        apellidos: acudiente.apellidos || 'N/A',
        nombre_completo: `${acudiente.nombres || ''} ${acudiente.apellidos || ''}`.trim() || 'N/A',
        parentesco: acudiente.parentesco || 'N/A',
        telefono: acudiente.telefono || 'N/A',
        email: acudiente.email || 'N/A',
        direccion: acudiente.direccion || 'N/A',
        participante_id: acudiente.id_participante || 'N/A',
        participante_nombre: formatParticipantName(participante),
        participante_documento: participante?.numero_documento || 'N/A'
      };
    });

    // Contar parentescos
    const parentescoCounts = {};
    filteredAcudientes.forEach(acudiente => {
      const parentesco = acudiente.parentesco || 'Sin especificar';
      parentescoCounts[parentesco] = (parentescoCounts[parentesco] || 0) + 1;
    });

    // Generar estadísticas
    const statistics = {
      'Total de Acudientes': filteredAcudientes.length,
      'Acudientes con Email': filteredAcudientes.filter(a => a.email).length,
      'Acudientes con Teléfono': filteredAcudientes.filter(a => a.telefono).length
    };

    // Agregar distribución de parentescos (top 5)
    const topParentescos = Object.entries(parentescoCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    topParentescos.forEach(([parentesco, count]) => {
      statistics[`Parentesco ${parentesco}`] = `${count} (${((count / filteredAcudientes.length) * 100).toFixed(1)}%)`;
    });

    // Preparar filtros aplicados
    const appliedFilters = {};
    
    if (filtros.participante !== 'Todos') {
      const participante = participantes.find(p =>
        (p.id_participante || p.id).toString() === filtros.participante
      );
      appliedFilters.participante = participante?.nombre ||
        `${participante?.nombres || ''} ${participante?.apellidos || ''}`.trim() ||
        'N/A';
    }
    
    if (filtros.busqueda) {
      appliedFilters.búsqueda = filtros.busqueda;
    }

    const csvContent = createEnhancedCSV({
      title: 'Reporte de Acudientes',
      data: csvData,
      headers,
      metadata: {
        generatedBy: 'Sistema de Gestión'
      },
      statistics,
      filters: appliedFilters
    });

    const filename = `acudientes_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  }, [filteredAcudientes, participantes, filtros]);

  if (loading) {
    return (
      <DashboardLayout title="Acudientes" subtitle="Gestión de acudientes" loading={true} loadingText="Cargando acudientes..." />
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Acudientes" subtitle="Error al cargar datos" loading={false}>
        <div className="flex items-center justify-center h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error loading acudientes: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Configuración de filtros
  const filterConfig = [
    {
      type: 'select',
      name: 'participante',
      label: 'Participante',
      options: [
        { value: 'Todos', label: 'Todos los Participantes' },
        ...participantes.map(p => ({
          value: (p.id_participante || p.id).toString(),
          label: p.nombre || `${p.nombres} ${p.apellidos}` || 'Sin nombre'
        }))
      ]
    },
    {
      type: 'search',
      name: 'busqueda',
      label: 'Búsqueda por Documento',
      placeholder: 'Número de documento...'
    }
  ];

  return (
    <DashboardLayout
      title="Gestión de Acudientes"
      subtitle="Administra los acudientes de los participantes"
      extraActions={
        <div className="flex space-x-3">
          <ExportDropdown
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
          />
          <button
            onClick={() => crearModal.openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Nuevo Acudiente
          </button>
        </div>
      }
    >
      <section className="px-4 md:px-6 py-4 md:py-6">
        <FilterBar
          filters={filterConfig}
          values={filtros}
          onChange={setFilter}
          onClear={clearFilters}
          showClearButton={true}
        />

        {/* Estadísticas Rápidas */}
        <div className="mt-6">
          <StatsGrid
            stats={statsData}
            columns={3}
            gap="md"
          />
        </div>

        {/* Tabla de Acudientes */}
        <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Lista de Acudientes</h3>
          </div>

          {filteredAcudientes.length === 0 ? (
            <div className="p-12 text-center">
              <i className="fas fa-user-friends text-gray-300 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron acudientes</h3>
              <p className="text-gray-500">No hay acudientes que coincidan con los filtros aplicados.</p>
            </div>
          ) : (
            <DataTable
              keyExtractor={(row) => row.id_acudiente || row.id}
              columns={[
                {
                  key: 'acudiente',
                  header: 'Acudiente',
                  render: (acudiente) => (
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-user-friends text-purple-600"></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">
                          {`${acudiente.nombres || ''} ${acudiente.apellidos || ''}`.trim() || 'Sin nombre'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {acudiente.tipo_documento || 'CC'}: {acudiente.numero_documento || 'N/A'}
                        </p>
                        {/* Mobile-only contact info */}
                        <div className="md:hidden mt-1 space-y-1">
                          <p className="text-xs text-gray-600 flex items-center">
                            <i className="fas fa-phone text-gray-400 mr-1 text-xs"></i>
                            {acudiente.telefono || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-600 flex items-center">
                            <i className="fas fa-envelope text-gray-400 mr-1 text-xs"></i>
                            {acudiente.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'participante',
                  header: 'Participante',
                  render: (acudiente) => {
                    // Buscar el participante asociado
                    const participante = participantes.find(p =>
                      (p.id_participante || p.id) === acudiente.id_participante
                    );
                    return (
                      <div className="min-w-0">
                        <p className="text-gray-900 truncate">
                          {participante?.nombre || `${participante?.nombres || ''} ${participante?.apellidos || ''}`.trim() || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {acudiente.parentesco || 'Sin parentesco'}
                        </p>
                      </div>
                    );
                  }
                },
                {
                  key: 'contacto',
                  header: 'Contacto',
                  hideInMobile: true,
                  render: (acudiente) => (
                    <div className="min-w-0">
                      <p className="text-gray-900 flex items-center">
                        <i className="fas fa-phone text-gray-400 mr-2"></i>
                        <span className="truncate">{acudiente.telefono || 'N/A'}</span>
                      </p>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <i className="fas fa-envelope text-gray-400 mr-2"></i>
                        <span className="truncate">{acudiente.email || 'N/A'}</span>
                      </p>
                    </div>
                  )
                },
                {
                  key: 'acciones',
                  header: 'Acciones',
                  render: (acudiente) => (
                    <ActionDropdown
                      actions={[
                        {
                          label: 'Ver detalles',
                          icon: 'fas fa-eye',
                          onClick: () => {
                            verModal.setData(acudiente);
                            verModal.open();
                          }
                        },
                        {
                          label: 'Editar',
                          icon: 'fas fa-edit',
                          onClick: () => {
                            editarModal.setData(acudiente);
                            editarModal.open();
                          }
                        }
                      ]}
                    />
                  )
                }
              ]}
              data={filteredAcudientes}
            />
          )}
        </div>
        </div>
      </section>

      {/* Modales */}
      <ViewDetailsModal
        isOpen={verModal.isOpen}
        onClose={verModal.closeModal}
        title="Detalles del Acudiente"
        data={verModal.data ? [
          { label: 'ID', value: verModal.data.id_acudiente || verModal.data.id },
          { 
            label: 'Nombre Completo', 
            value: `${verModal.data.nombres || ''} ${verModal.data.apellidos || ''}`.trim() 
          },
          { 
            label: 'Documento', 
            value: `${verModal.data.tipo_documento || 'CC'}: ${verModal.data.numero_documento || 'N/A'}` 
          },
          { label: 'Parentesco', value: verModal.data.parentesco || 'N/A' },
          { label: 'Teléfono', value: verModal.data.telefono || 'N/A' },
          { label: 'Email', value: verModal.data.email || 'N/A' },
          { label: 'Dirección', value: verModal.data.direccion || 'N/A' },
          { 
            label: 'Participante', 
            value: (() => {
              const participante = participantes.find(p => 
                (p.id_participante || p.id) === verModal.data.id_participante
              );
              return participante?.nombre || `${participante?.nombres || ''} ${participante?.apellidos || ''}`.trim() || 'N/A';
            })()
          }
        ] : []}
      />

      <EditFormModal
        isOpen={editarModal.isOpen}
        onClose={editarModal.closeModal}
        title="Editar Acudiente"
        onSubmit={async (formData) => {
          // Validar documento único
          const acudienteId = editarModal.data.id_acudiente || editarModal.data.id;
          const documentoValidation = await validateAcudienteDocumentoUnico(formData.numero_documento, acudienteId);
          if (!documentoValidation.isValid) {
            throw new Error(documentoValidation.error);
          }

          // Validar email
          const emailValidation = validateEmail(formData.email);
          if (!emailValidation.isValid) {
            throw new Error(emailValidation.error);
          }

          const result = await dbService.updateAcudiente(
            editarModal.data.id_acudiente || editarModal.data.id, 
            formData
          );
          if (result.error) {
            throw new Error(result.error.message || 'Error al actualizar acudiente');
          }
          await loadAcudientes();
        }}
        initialData={editarModal.data}
        fields={[
          { 
            name: 'tipo_documento', 
            label: 'Tipo de Documento', 
            type: 'select',
            required: true,
            options: [
              { value: 'CC', label: 'Cédula de Ciudadanía' },
              { value: 'TI', label: 'Tarjeta de Identidad' },
              { value: 'CE', label: 'Cédula de Extranjería' },
              { value: 'PASAPORTE', label: 'Pasaporte' }
            ]
          },
          { 
            name: 'numero_documento', 
            label: 'Número de Documento', 
            type: 'text', 
            required: true,
            placeholder: 'Número de documento'
          },
          { 
            name: 'nombres', 
            label: 'Nombres', 
            type: 'text', 
            required: true,
            placeholder: 'Nombres del acudiente'
          },
          { 
            name: 'apellidos', 
            label: 'Apellidos', 
            type: 'text', 
            required: true,
            placeholder: 'Apellidos del acudiente'
          },
          { 
            name: 'parentesco', 
            label: 'Parentesco', 
            type: 'text', 
            required: true,
            placeholder: 'Ej: Madre, Padre, Hermano/a'
          },
          { 
            name: 'telefono', 
            label: 'Teléfono', 
            type: 'tel', 
            required: true,
            placeholder: 'Número de teléfono'
          },
          { 
            name: 'email', 
            label: 'Email', 
            type: 'email', 
            required: true,
            placeholder: 'correo@ejemplo.com'
          },
          { 
            name: 'direccion', 
            label: 'Dirección', 
            type: 'textarea', 
            required: true,
            placeholder: 'Dirección completa'
          }
        ]}
      />

      <CreateFormModal
        isOpen={crearModal.isOpen}
        onClose={crearModal.closeModal}
        title="Nuevo Acudiente"
        onSubmit={async (formData) => {
          // Validar documento único
          const documentoValidation = await validateAcudienteDocumentoUnico(formData.numero_documento);
          if (!documentoValidation.isValid) {
            throw new Error(documentoValidation.error);
          }

          // Validar email
          const emailValidation = validateEmail(formData.email);
          if (!emailValidation.isValid) {
            throw new Error(emailValidation.error);
          }

          // Validar que el participante exista
          const participanteValidation = await validateParticipanteExists(formData.id_participante);
          if (!participanteValidation.isValid) {
            throw new Error(participanteValidation.error);
          }

          const result = await dbService.createAcudiente(formData);
          if (result.error) {
            throw new Error(result.error.message || 'Error al crear acudiente');
          }
          await loadAcudientes();
        }}
        initialData={{
          id_participante: '',
          tipo_documento: 'CC',
          numero_documento: '',
          nombres: '',
          apellidos: '',
          parentesco: '',
          telefono: '',
          email: '',
          direccion: ''
        }}
        fields={[
          { 
            name: 'id_participante', 
            label: 'Participante', 
            type: 'select',
            required: true,
            options: [
              { value: '', label: 'Seleccione un participante' },
              ...participantes.map(p => ({
                value: (p.id_participante || p.id).toString(),
                label: p.nombre || `${p.nombres || ''} ${p.apellidos || ''}`.trim() || 'Sin nombre'
              }))
            ]
          },
          { 
            name: 'tipo_documento', 
            label: 'Tipo de Documento', 
            type: 'select',
            required: true,
            options: [
              { value: 'CC', label: 'Cédula de Ciudadanía' },
              { value: 'TI', label: 'Tarjeta de Identidad' },
              { value: 'CE', label: 'Cédula de Extranjería' },
              { value: 'PASAPORTE', label: 'Pasaporte' }
            ]
          },
          { 
            name: 'numero_documento', 
            label: 'Número de Documento', 
            type: 'text', 
            required: true,
            placeholder: 'Número de documento'
          },
          { 
            name: 'nombres', 
            label: 'Nombres', 
            type: 'text', 
            required: true,
            placeholder: 'Nombres del acudiente'
          },
          { 
            name: 'apellidos', 
            label: 'Apellidos', 
            type: 'text', 
            required: true,
            placeholder: 'Apellidos del acudiente'
          },
          { 
            name: 'parentesco', 
            label: 'Parentesco', 
            type: 'text', 
            required: true,
            placeholder: 'Ej: Madre, Padre, Hermano/a'
          },
          { 
            name: 'telefono', 
            label: 'Teléfono', 
            type: 'tel', 
            required: true,
            placeholder: 'Número de teléfono'
          },
          { 
            name: 'email', 
            label: 'Email', 
            type: 'email', 
            required: true,
            placeholder: 'correo@ejemplo.com'
          },
          { 
            name: 'direccion', 
            label: 'Dirección', 
            type: 'textarea', 
            required: true,
            placeholder: 'Dirección completa'
          }
        ]}
      />
    </DashboardLayout>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
const Acudientes = React.memo(AcudientesComponent);

export default Acudientes;
