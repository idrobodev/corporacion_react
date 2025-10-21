import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "components/layout/DashboardLayout";
import { dbService, ROLES } from "shared/services";
import { FilterBar } from "components/UI/Filter";
import { StatsGrid } from "components/UI/Card";
import { DataTable } from "components/UI/Table";
import { ViewDetailsModal, EditFormModal, CreateFormModal } from "components/common/CRUDModals";
import { useFilters, useModal } from "shared/hooks";
import { validateEmail } from "shared/utils/validationUtils";

const UsuariosComponent = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  // Use custom hooks
  const { filters: filtros, setFilter, clearFilters } = useFilters({
    rol: "Todos",
    busqueda: ""
  });

  const verModal = useModal();
  const editarModal = useModal();
  const crearModal = useModal();

  // Función para cargar usuarios
  const loadUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando usuarios...');

      const result = await dbService.getUsuarios();
      console.log('📊 Resultado usuarios:', result);

      if (result.error) {
        throw new Error(result.error.message || 'Error al cargar usuarios');
      }

      // La respuesta puede ser {data: [...], error: null} o {data: {data: [...]}, error: null}
      let usuariosData = [];
      if (Array.isArray(result.data)) {
        usuariosData = result.data;
      } else if (Array.isArray(result.data?.data)) {
        usuariosData = result.data.data;
      } else {
        usuariosData = [];
      }

      setUsuarios(usuariosData);
      console.log('✅ Usuarios cargados:', usuariosData.length);
    } catch (err) {
      console.error('❌ Error cargando usuarios:', err);
      setError(err.message || 'Error desconocido al cargar usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Exponer funciones globalmente para el menú desplegable
  useEffect(() => {
    window.verModal = verModal;
    window.editarModal = editarModal;
    window.deleteUser = async (userId) => {
      try {
        const result = await dbService.deleteUsuario(userId);
        if (result.error) {
          alert('Error al eliminar usuario: ' + result.error.message);
        } else {
          alert('Usuario eliminado exitosamente');
          await loadUsuarios();
        }
      } catch (error) {
        alert('Error al eliminar usuario: ' + error.message);
      }
    };

    return () => {
      delete window.verModal;
      delete window.editarModal;
      delete window.deleteUser;
    };
  }, [verModal, editarModal, loadUsuarios]);

  // Cargar usuario actual y verificar permisos
   useEffect(() => {
     const loadCurrentUser = async () => {
       try {
         console.log('🔐 Verificando permisos de administrador...');
         // Verificar si tiene permisos de administrador
         const hasPermission = await dbService.hasPermission(ROLES.ADMINISTRADOR);
         console.log('✅ Permisos de administrador obtenidos:', hasPermission);
         setCanEdit(hasPermission);
         console.log('🎯 canEdit establecido como:', hasPermission);
       } catch (err) {
         console.error('❌ Error cargando permisos:', err);
         setCanEdit(false);
       }
     };

     loadCurrentUser();
     loadUsuarios();
   }, [loadUsuarios]);

  // Filtrar usuarios
  const filteredUsuarios = useMemo(() => {
    const safeUsuarios = Array.isArray(usuarios) ? usuarios : [];
    let filtered = safeUsuarios;

    if (filtros.rol !== "Todos") {
      filtered = filtered.filter(u => (u.rol || u.role) === filtros.rol);
    }
    if (filtros.busqueda) {
      filtered = filtered.filter(u =>
        (u.email || '').toLowerCase().includes(filtros.busqueda.toLowerCase())
      );
    }
    return filtered;
  }, [usuarios, filtros]);

  // Estadísticas
  const statsData = useMemo(() => [
    {
      title: "Total Usuarios",
      value: filteredUsuarios.length,
      icon: "fas fa-users",
      color: "blue"
    }
  ], [filteredUsuarios]);

  if (loading) {
    return (
      <DashboardLayout title="Usuarios" subtitle="Gestión de usuarios" loading={true} loadingText="Cargando usuarios..." />
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Usuarios" subtitle="Error al cargar datos" loading={false}>
        <div className="flex items-center justify-center h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error loading usuarios del sistema: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Verificar permisos de acceso a la página
  if (!canEdit) {
    return (
      <DashboardLayout title="Usuarios" subtitle="Acceso denegado">
        <div className="flex items-center justify-center h-screen">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center max-w-md">
            <i className="fas fa-lock text-yellow-600 text-5xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Acceso Denegado</h3>
            <p className="text-gray-600">No tienes permisos para acceder a esta página. Solo los administradores pueden gestionar usuarios.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const filterConfig = [
    {
      type: 'select',
      name: 'rol',
      label: 'Rol',
      options: [
        { value: 'Todos', label: 'Todos los Roles' },
        { value: ROLES.ADMINISTRADOR, label: 'Administrador' },
        { value: ROLES.CONSULTA, label: 'Consulta' }
      ]
    },
    {
      type: 'search',
      name: 'busqueda',
      label: 'Búsqueda',
      placeholder: 'Buscar por email...'
    }
  ];

  return (
    <DashboardLayout
      title="Gestión de Usuarios del sistema"
      subtitle="Administra los usuarios del sistema"
      extraActions={
        canEdit && (
          <button
            onClick={() => crearModal.openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Nuevo Usuario
          </button>
        )
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

        {/* Tabla de Usuarios */}
        <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Lista de Usuarios del sistema</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Gestiona los usuarios del sistema
                </p>
              </div>
              {canEdit ? (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <i className="fas fa-user-shield mr-2"></i>
                  Modo Administrador
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <i className="fas fa-eye mr-2"></i>
                  Modo Solo Lectura
                </span>
              )}
            </div>
          </div>

          {filteredUsuarios.length === 0 ? (
            <div className="p-12 text-center">
              <i className="fas fa-users text-gray-300 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios del sistema</h3>
              <p className="text-gray-500">No hay usuarios que coincidan con los filtros aplicados.</p>
            </div>
          ) : (
            <DataTable
              columns={[
                {
                  key: 'email',
                  header: 'Email',
                  render: (usuario) => (
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-user text-blue-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{usuario.email}</p>
                        <p className="text-sm text-gray-500">ID: {usuario.id_usuario || usuario.id}</p>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'rol',
                  header: 'Rol',
                  render: (usuario) => {
                    const userRole = usuario.rol || usuario.role;
                    return (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        userRole === ROLES.ADMINISTRADOR || userRole === 'ADMINISTRADOR'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        <i className={`fas ${
                          userRole === ROLES.ADMINISTRADOR || userRole === 'ADMINISTRADOR' ? 'fa-user-shield' : 'fa-user'
                        } mr-2`}></i>
                        {userRole === ROLES.ADMINISTRADOR || userRole === 'ADMINISTRADOR' ? 'Administrador' : 'Consulta'}
                      </span>
                    );
                  }
                },
                {
                  key: 'acciones',
                  header: 'Acciones',
                  render: (usuario) => {
                    console.log('🔍 Renderizando acciones para usuario:', usuario.email, 'canEdit:', canEdit);

                    if (canEdit) {
                      console.log('🎯 Renderizando ActionDropdown para:', usuario.email);
                      const userRole = usuario.rol || usuario.role;
                      const isAdmin = userRole === ROLES.ADMINISTRADOR || userRole === 'ADMINISTRADOR';

                      return (
                        <div className="flex items-center space-x-2">
                          {!isAdmin && (
                            <button
                              onClick={() => {
                                console.log('✏️ Editar usuario:', usuario.email);
                                editarModal.openModal('edit', usuario);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Editar usuario"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                          {!isAdmin && (
                            <button
                              onClick={() => {
                                console.log('🗑️ Eliminar usuario:', usuario.email);
                                if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                                  window.deleteUser && window.deleteUser(usuario.id_usuario || usuario.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Eliminar usuario"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                          {isAdmin && (
                            <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded">
                              <i className="fas fa-shield-alt mr-1"></i>
                              Protegido
                            </span>
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              console.log('👁️ Abriendo modal de solo lectura para:', usuario.email);
                              verModal.openModal('view', usuario);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <i className="fas fa-eye mr-1"></i>
                            Ver Detalles
                          </button>
                          <span className="text-xs text-yellow-600 font-medium">
                            <i className="fas fa-lock mr-1"></i>
                            Solo Lectura
                          </span>
                        </div>
                      );
                    }
                  }
                }
              ]}
              data={filteredUsuarios}
              keyExtractor={(usuario) => usuario.id_usuario || usuario.id}
              loading={loading}
            />
          )}
        </div>
        </div>
      </section>

      {/* Modales */}
      <ViewDetailsModal
        isOpen={verModal.isOpen}
        onClose={verModal.closeModal}
        title="Detalles del Usuario del sistema"
        data={verModal.modalData ? [
          { label: 'ID', value: verModal.modalData.id_usuario || verModal.modalData.id },
          { label: 'Email', value: verModal.modalData.email },
          {
            label: 'Contraseña',
            value: '••••••••',
            helperText: 'La contraseña está oculta por seguridad'
          },
          {
            label: 'Rol',
            value: (() => {
              const rol = verModal.modalData.rol || verModal.modalData.role;
              // Comparación más robusta
              if (rol === ROLES.ADMINISTRADOR || rol === 'ADMINISTRADOR') {
                return 'Administrador';
              }
              return 'Consulta';
            })()
          },
          {
            label: 'Fecha de creación',
            value: new Date(verModal.modalData.created_at).toLocaleString('es-ES')
          },
          {
            label: 'Última actualización',
            value: new Date(verModal.modalData.updated_at).toLocaleString('es-ES')
          }
        ] : []}
      />

      <EditFormModal
        isOpen={editarModal.isOpen}
        onClose={editarModal.closeModal}
        title="Editar Usuario del sistema"
        onSubmit={async (formData) => {
          // Validar email
          const emailValidation = validateEmail(formData.email);
          if (!emailValidation.isValid) {
            throw new Error(emailValidation.error);
          }

          // Validar rol
          if (!formData.rol || (formData.rol !== ROLES.ADMINISTRADOR && formData.rol !== ROLES.CONSULTA && formData.rol !== 'ADMINISTRADOR' && formData.rol !== 'CONSULTA')) {
            throw new Error('Rol inválido');
          }

          // Si no se proporciona password, no lo incluimos en la actualización
          const updateData = {
            email: formData.email,
            role: formData.rol // El backend espera 'role', no 'rol'
          };

          if (formData.password && formData.password.trim()) {
            if (formData.password.length < 8) {
              throw new Error('La contraseña debe tener al menos 8 caracteres');
            }
            updateData.password = formData.password;
          }

          const result = await dbService.updateUsuario(editarModal.modalData.id_usuario || editarModal.modalData.id, updateData);
          if (result.error) {
            throw new Error(result.error.message || 'Error al actualizar usuario');
          }
          await loadUsuarios();
        }}
        initialData={editarModal.modalData ? {
          email: editarModal.modalData.email,
          password: '',
          rol: editarModal.modalData.rol || editarModal.modalData.role
        } : {
          email: '',
          password: '',
          rol: ROLES.CONSULTA
        }}
        fields={[
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: 'usuario@ejemplo.com'
          },
          {
            name: 'currentPassword',
            label: 'Contraseña Actual (solo lectura)',
            type: 'password',
            readOnly: true,
            placeholder: 'Contraseña actual del usuario',
            value: '••••••••', // Mostrar puntos por seguridad
            helperText: 'La contraseña actual no se puede ver por seguridad'
          },
          {
            name: 'password',
            label: 'Nueva Contraseña (opcional)',
            type: 'password',
            placeholder: 'Dejar en blanco para mantener la actual',
            helperText: 'Mínimo 8 caracteres. Si se deja en blanco, mantiene la contraseña actual.'
          },
          {
            name: 'rol',
            label: 'Rol',
            type: 'select',
            required: true,
            options: [
              { value: ROLES.CONSULTA, label: 'Consulta' }
            ]
          }
        ]}
      />

      <CreateFormModal
        isOpen={crearModal.isOpen}
        onClose={crearModal.closeModal}
        title="Nuevo Usuario del sistema"
        onSubmit={async (formData) => {
          // Validar email
          const emailValidation = validateEmail(formData.email);
          if (!emailValidation.isValid) {
            throw new Error(emailValidation.error);
          }

          // Validar password
          if (!formData.password || formData.password.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres');
          }

          // Validar rol
          if (!formData.rol || (formData.rol !== ROLES.ADMINISTRADOR && formData.rol !== ROLES.CONSULTA && formData.rol !== 'ADMINISTRADOR' && formData.rol !== 'CONSULTA')) {
            throw new Error('Rol inválido');
          }

          // Convertir 'rol' a 'role' para el backend
          const userData = {
            email: formData.email,
            password: formData.password,
            role: formData.rol
          };

          const result = await dbService.createUsuario(userData);
          if (result.error) {
            throw new Error(result.error.message || 'Error al crear usuario');
          }
          await loadUsuarios();
        }}
        initialData={{
          email: '',
          password: '',
          rol: ROLES.CONSULTA
        }}
        fields={[
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: 'usuario@ejemplo.com'
          },
          {
            name: 'password',
            label: 'Contraseña',
            type: 'password',
            required: true,
            placeholder: 'Mínimo 8 caracteres',
            helperText: 'Mínimo 8 caracteres. La contraseña debe ser segura.'
          },
          {
            name: 'rol',
            label: 'Rol',
            type: 'select',
            required: true,
            options: [
              { value: ROLES.ADMINISTRADOR, label: 'Administrador' },
              { value: ROLES.CONSULTA, label: 'Consulta' }
            ]
          }
        ]}
      />
    </DashboardLayout>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
const Usuarios = React.memo(UsuariosComponent);

export default Usuarios;
