import React, { useState } from "react";
import { useAuth } from "shared/contexts";
import { api } from "shared/services";
import DashboardLayout from "components/layout/DashboardLayout";

const ConfiguracionComponent = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const tabs = [
    { id: "perfil", label: "Perfil", icon: "fas fa-user" },
    { id: "preferencias", label: "Preferencias", icon: "fas fa-sliders-h" },
    { id: "notificaciones", label: "Notificaciones", icon: "fas fa-bell" },
    { id: "seguridad", label: "Seguridad", icon: "fas fa-shield-alt" },
  ];

  const handleProfileUpdate = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const nombreInput = document.getElementById('nombre');
      const nombre = nombreInput?.value.trim();
      if (nombre && nombre !== currentUser.nombre) {
        // Update user profile via API
        const { error } = await api.updateProfile({ nombre });
        if (error) throw new Error(error.message);

        setSuccess('Perfil actualizado correctamente');
      } else {
        setSuccess('No hay cambios para guardar');
      }
    } catch (err) {
      setError('Error al actualizar el perfil: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Configuración" subtitle="Administra tu perfil y preferencias de la plataforma">
      <div className="w-full overflow-x-hidden">
        <section className="px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-6xl mx-auto w-full">
          {/* Tabs - Responsive with horizontal scroll on mobile */}
          <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-sm p-1.5 md:p-2 flex overflow-x-auto gap-1.5 md:gap-2 mb-4 md:mb-6 scrollbar-hide -mx-1 md:mx-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`
                  flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 rounded-lg whitespace-nowrap flex-shrink-0 min-h-[44px] transition-all text-sm font-medium
                  ${activeTab === t.id 
                    ? 'bg-blue-500 text-white shadow-md scale-105' 
                    : 'text-gray-600 hover:bg-gray-50 active:bg-gray-100'
                  }
                `}
              >
                <i className={`${t.icon} text-base`}></i>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
          
          <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Content */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 space-y-4 md:space-y-6 order-2 lg:order-1">
              {activeTab === "perfil" && (
                <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
                    <i className="fas fa-user text-blue-500 text-sm md:text-base"></i>
                    <span>Datos de perfil</span>
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
                        </label>
                        <input
                          id="nombre"
                          type="text"
                          defaultValue={currentUser?.user_metadata?.full_name || currentUser?.nombre || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Correo
                        </label>
                        <input
                          type="email"
                          value={currentUser?.email || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rol
                        </label>
                        <input
                          type="text"
                          value={currentUser?.rol || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sede
                        </label>
                        <input
                          type="text"
                          value={currentUser?.sede_nombre || 'No asignada'}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <button
                      onClick={handleProfileUpdate}
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-save"></i>
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    {error && <p className="text-red-500 text-sm w-full sm:w-auto">{error}</p>}
                    {success && <p className="text-green-500 text-sm w-full sm:w-auto">{success}</p>}
                  </div>
                </div>
              )}

              {activeTab === "preferencias" && (
                <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
                    <i className="fas fa-sliders-h text-blue-500 text-sm md:text-base"></i>
                    <span>Preferencias</span>
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer min-h-[56px]">
                      <span className="text-sm font-medium text-gray-700 flex-1">Modo compacto de tablas</span>
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0" />
                    </label>
                    <label className="flex items-center justify-between gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer min-h-[56px]">
                      <span className="text-sm font-medium text-gray-700 flex-1">Mostrar ayudas contextuales</span>
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0" />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "notificaciones" && (
                <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
                    <i className="fas fa-bell text-blue-500 text-sm md:text-base"></i>
                    <span>Notificaciones</span>
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer min-h-[56px]">
                      <span className="text-sm font-medium text-gray-700 flex-1">Recordatorios de mensualidades</span>
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0" />
                    </label>
                    <label className="flex items-center justify-between gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer min-h-[56px]">
                      <span className="text-sm font-medium text-gray-700 flex-1">Notificaciones por email</span>
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0" />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "seguridad" && (
                <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
                    <i className="fas fa-shield-alt text-blue-500 text-sm md:text-base"></i>
                    <span>Seguridad</span>
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña actual
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                        placeholder="Ingresa tu contraseña actual"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nueva contraseña
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                          placeholder="Nueva contraseña"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirmar nueva contraseña
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                          placeholder="Confirmar contraseña"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-h-[44px] flex items-center justify-center gap-2">
                      <i className="fas fa-lock"></i>
                      Actualizar contraseña
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Optimized for mobile */}
            <aside className="space-y-3 md:space-y-4 order-1 lg:order-2">
              <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-sm p-3 md:p-4">
                <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3 flex items-center gap-2">
                  <i className="fas fa-lightbulb text-yellow-500 text-sm md:text-base"></i>
                  <span>Consejos de seguridad</span>
                </h3>
                <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-green-500 mt-0.5 flex-shrink-0 text-xs"></i>
                    <span>Usa contraseñas fuertes y únicas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-green-500 mt-0.5 flex-shrink-0 text-xs"></i>
                    <span>Activa la verificación en dos pasos si está disponible.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check text-green-500 mt-0.5 flex-shrink-0 text-xs"></i>
                    <span>Revisa periódicamente tus dispositivos activos.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg md:rounded-xl p-3 md:p-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <i className="fas fa-info-circle text-blue-600 text-base md:text-lg mt-0.5 flex-shrink-0"></i>
                  <div>
                    <h4 className="text-xs md:text-sm font-semibold text-blue-900 mb-1">¿Necesitas ayuda?</h4>
                    <p className="text-xs md:text-sm text-blue-800">
                      Contacta al equipo de soporte para asistencia personalizada.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      </div>
    </DashboardLayout>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
// Component will only re-render when props change
const Configuracion = React.memo(ConfiguracionComponent);

export default Configuracion;