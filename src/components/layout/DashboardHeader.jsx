import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useAuth, useSidebarContext } from "shared/contexts";
import logo from "../../assets/images/logos/logo.png";

/**
 * DashboardHeader - Componente reutilizable para el header del dashboard
 * Incluye menú de usuario, logo y título dinámico
 */
const DashboardHeader = React.memo(({ title = "Dashboard", subtitle = "Bienvenido", extraActions = null }) => {
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const { sidebarCollapsed } = useSidebarContext();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      await logout();
      setUserMenuOpen(false);
      history.push('/');
    } catch (e) {
      console.error('Error al cerrar sesión', e);
    }
  }, [history, logout]);

  const handleCopyEmail = useCallback(async () => {
    try {
      if (currentUser?.email) {
        await navigator.clipboard.writeText(currentUser.email);
        setUserMenuOpen(false);
      }
    } catch (e) {
      console.error('No se pudo copiar el correo', e);
    }
  }, [currentUser?.email]);

  const toggleUserMenu = useCallback(() => {
    setUserMenuOpen((v) => !v);
  }, []);

  const marginClass = useMemo(() => sidebarCollapsed ? 'md:ml-20' : 'md:ml-64', [sidebarCollapsed]);

  const userDisplayName = useMemo(() => 
    currentUser?.displayName || currentUser?.email, 
    [currentUser?.displayName, currentUser?.email]
  );

  return (
    <header className={`
      fixed top-0 right-0 left-0 z-40 
      bg-white/95 backdrop-blur-lg 
      shadow-md border-b border-gray-200
      transition-all duration-300
    `}>
      <div className={`
        px-4 md:px-6 
        py-2.5 md:py-3 
        transition-all duration-300 
        ${marginClass}
      `}>
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Sección izquierda: Logo y Título */}
          <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0 ml-12 md:ml-0">
            {/* Logo - ocultar en móvil para dar espacio */}
            <img 
              src={logo}
              alt="Todo por un Alma" 
              className="hidden sm:block h-8 md:h-10 w-8 md:w-10 rounded-lg shadow-sm flex-shrink-0"
            />
            
            {/* Título y Subtitle */}
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg md:text-2xl font-Lato font-bold text-gray-800 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="hidden md:block text-xs md:text-sm font-Poppins text-gray-600 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Sección derecha: Acciones y Usuario */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            {/* Extra Actions - ocultar en móvil/tablet, mostrar en desktop */}
            {extraActions && (
              <div className="hidden lg:flex items-center space-x-3">
                {extraActions}
              </div>
            )}
            
            {/* Perfil de Usuario */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 md:space-x-3 bg-gray-100 rounded-full pl-1.5 md:pl-2 pr-2 md:pr-3 py-1 md:py-1.5 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Usuario"
                      className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center">
                      <i className="fas fa-user text-white text-sm"></i>
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                
                {/* Nombre - ocultar en móvil pequeño */}
                <span className="hidden sm:block text-sm md:text-base font-Poppins font-medium text-gray-700 max-w-[120px] md:max-w-none truncate">
                  {userDisplayName}
                </span>
                
                {/* Chevron - ocultar en móvil pequeño */}
                <i className={`hidden sm:block fas fa-chevron-${userMenuOpen ? 'up' : 'down'} text-gray-500 text-xs`}></i>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 md:w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {/* Header del menú */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500 font-Poppins">Sesión iniciada como</p>
                    <p className="text-sm md:text-base text-gray-800 truncate font-Poppins font-medium mt-0.5">
                      {currentUser?.email}
                    </p>
                  </div>
                  
                  {/* Opciones del menú */}
                  <ul className="py-1">
                    <li>
                      <button 
                        onClick={handleCopyEmail} 
                        className="w-full flex items-center px-4 py-3 text-sm md:text-base text-gray-700 hover:bg-gray-50 font-Poppins transition-colors min-h-[48px]"
                      >
                        <i className="fas fa-copy mr-3 text-gray-500 w-4"></i>
                        Copiar correo
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          history.push('/configuracion');
                          setUserMenuOpen(false);
                        }} 
                        className="w-full flex items-center px-4 py-3 text-sm md:text-base text-gray-700 hover:bg-gray-50 font-Poppins transition-colors min-h-[48px]"
                      >
                        <i className="fas fa-cog mr-3 text-gray-500 w-4"></i>
                        Configuración
                      </button>
                    </li>
                    <li className="border-t border-gray-100">
                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center px-4 py-3 text-sm md:text-base text-red-600 hover:bg-red-50 font-Poppins transition-colors min-h-[48px]"
                      >
                        <i className="fas fa-sign-out-alt mr-3 w-4"></i>
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default DashboardHeader;