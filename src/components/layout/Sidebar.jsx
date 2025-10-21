import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "shared/contexts";
import logo from "../../assets/images/logos/logo.png";

const Sidebar = ({ isOpen = false, onToggle = () => {}, isCollapsed = false, onToggleCollapse = () => {} }) => {
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  
  // Get user role from currentUser
  const userRole = currentUser?.rol || currentUser?.role || 'CONSULTA';

  // Check for mobile screen size
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      history.push("/");
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  const allMenuItems = [
    {
      id: 'dashboard',
      icon: 'fas fa-home',
      label: 'Dashboard',
      link: '/dashboard',
      badge: null,
      roles: ['ADMINISTRADOR', 'CONSULTA'] // Available to all roles
    },
    {
      id: 'participantes',
      icon: 'fas fa-users',
      label: 'Participantes',
      link: '/participantes',
      badge: null,
      roles: ['ADMINISTRADOR', 'CONSULTA']
    },
    {
      id: 'acudientes',
      icon: 'fas fa-user-friends',
      label: 'Acudientes',
      link: '/acudientes',
      badge: null,
      roles: ['ADMINISTRADOR', 'CONSULTA']
    },
    {
      id: 'financiero',
      icon: 'fas fa-dollar-sign',
      label: 'Mensualidades',
      link: '/financiero',
      badge: null,
      roles: ['ADMINISTRADOR', 'CONSULTA']
    },
    {
      id: 'usuarios',
      icon: 'fas fa-users-cog',
      label: 'Usuarios',
      link: '/usuarios',
      badge: null,
      roles: ['ADMINISTRADOR'], // Only administrators
      adminOnly: true
    },
    {
      id: 'formatos',
      icon: 'fas fa-file-alt',
      label: 'Formatos',
      link: '/formatos',
      badge: null,
      roles: ['ADMINISTRADOR', 'CONSULTA']
    },
    {
      id: 'sedes',
      icon: 'fas fa-building',
      label: 'Sedes',
      link: '/sedes',
      badge: null,
      roles: ['ADMINISTRADOR', 'CONSULTA']
    },
    {
      id: 'configuracion',
      icon: 'fas fa-cog',
      label: 'Configuración',
      link: '/configuracion',
      badge: null,
      roles: ['ADMINISTRADOR', 'CONSULTA']
    }
  ];
  
  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      
      {/* Toggle Button - Mobile */}
      {isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-4 right-4 z-[70] md:hidden bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 min-w-[48px] min-h-[48px] flex items-center justify-center"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}></i>
        </button>
      )}
      
      
      {/* Sidebar */}
      <aside 
        data-testid="sidebar"
        className={`
          fixed top-0 left-0 h-full text-gray-700 z-50
          transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isMobile 
            ? `w-[280px] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : isCollapsed 
              ? 'w-20 translate-x-0 hover:w-64' 
              : 'w-64 translate-x-0'
          }
        `}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header with Logo */}
        <div className={`
          ${isCollapsed && !isMobile ? 'p-4' : 'p-5 md:p-6'} 
          border-b border-gray-200 
          bg-gradient-to-r from-gray-50 to-gray-100 
          transition-all duration-300 
          relative
        `}>
          {/* Collapse/Expand toggle desktop only */}
          {!isMobile && (
            <button
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            >
              <i className={`fas ${isCollapsed ? 'fa-angle-double-right' : 'fa-angle-double-left'} text-sm text-gray-600`}></i>
            </button>
          )}
          
          <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'}`}>
            {/* Logo responsive */}
            <div className="relative flex-shrink-0">
              <img 
                src={logo} 
                alt="Corporación Logo" 
                className={`
                  ${isCollapsed && !isMobile ? 'w-10 h-10' : 'w-12 h-12 md:w-14 md:h-14'} 
                  rounded-xl object-cover bg-white p-2 shadow-md transition-all duration-300
                `}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            
            {/* Título - ocultar cuando está colapsado en desktop */}
            <div className={`${isCollapsed && !isMobile ? 'hidden' : 'block'} transition-all duration-300`}>
              <h2 className="text-base md:text-lg font-Lato font-bold text-gray-800 leading-tight">
                Corporación
              </h2>
              <p className="text-xs font-Poppins text-gray-600">
                Todo por un Alma
              </p>
            </div>
          </div>
        </div>

        <nav className="p-3 md:p-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.link}
                  className={`
                    flex items-center 
                    ${isCollapsed && !isMobile ? 'justify-center px-3' : 'space-x-3 px-4'} 
                    py-3 md:py-3.5
                    rounded-xl 
                    hover:bg-gray-100 hover:shadow-sm 
                    transition-all duration-200 
                    group relative overflow-hidden
                    min-h-[48px]
                    ${location.pathname.startsWith(item.link) 
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100' 
                      : ''
                    }
                  `}
                  onClick={isMobile ? onToggle : undefined}
                  aria-current={location.pathname.startsWith(item.link) ? 'page' : undefined}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-blue-25/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  
                  {/* Icono más grande en móvil */}
                  <i className={`
                    ${item.icon} 
                    ${isMobile ? 'text-xl' : 'text-lg'}
                    ${location.pathname.startsWith(item.link) ? 'text-blue-700' : 'text-gray-600 group-hover:text-blue-600'} 
                    group-hover:scale-110 transition-all flex-shrink-0 relative z-10
                  `}></i>
                  
                  {/* Label */}
                  <span className={`
                    font-Poppins font-medium 
                    ${isMobile ? 'text-base' : 'text-sm'}
                    ${location.pathname.startsWith(item.link) ? 'text-blue-800' : 'text-gray-700 group-hover:text-gray-900'} 
                    ${isCollapsed && !isMobile ? 'hidden' : 'block'}
                    transition-all duration-300 z-10
                  `}>
                    {item.label}
                  </span>
                  
                  {/* Badge */}
                  {item.badge && !isCollapsed && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Información del Usuario */}
        <div className="p-3 md:p-4 border-t border-gray-200 mt-auto bg-gradient-to-r from-gray-50 to-gray-100">
          {/* Info del usuario */}
          <div className={`
            flex items-center 
            ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} 
            mb-3
          `}>
            <div className="relative flex-shrink-0">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Usuario"
                  className={`
                    rounded-full border-2 border-gray-300 shadow-md 
                    ${isCollapsed && !isMobile ? 'w-10 h-10' : 'w-11 h-11 md:w-12 md:h-12'}
                  `}
                />
              ) : (
                <div className={`
                  rounded-full border-2 border-gray-300 shadow-md 
                  bg-gradient-to-br from-blue-100 to-blue-200 
                  flex items-center justify-center 
                  ${isCollapsed && !isMobile ? 'w-10 h-10' : 'w-11 h-11 md:w-12 md:h-12'}
                `}>
                  <i className={`fas fa-user text-blue-600 ${isMobile ? 'text-lg' : 'text-base'}`}></i>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            
            {/* Nombre y rol - ocultar cuando colapsado en desktop */}
            {(!isCollapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-Poppins font-semibold text-gray-800 truncate">
                  {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-xs font-Poppins text-gray-600">
                    {userRole === 'ADMINISTRADOR' ? 'Administrador' : 'Consulta'}
                  </p>
                  {userRole === 'CONSULTA' && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded" title="Solo lectura">
                      <i className="fas fa-eye text-[10px]"></i>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Botón logout */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center 
              ${isCollapsed && !isMobile ? 'justify-center' : ''} 
              w-full px-4 py-3
              text-sm md:text-base
              text-gray-700 
              rounded-xl 
              hover:bg-red-50 hover:text-red-600 hover:shadow-sm 
              transition-all duration-200 
              font-Poppins font-medium 
              group relative overflow-hidden
              min-h-[48px]
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-red-25/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <i className={`
              fas fa-sign-out-alt 
              ${isMobile ? 'text-lg' : 'text-base'}
              ${isCollapsed && !isMobile ? '' : 'mr-3'} 
              group-hover:scale-110 transition-transform relative z-10
            `}></i>
            {(!isCollapsed || isMobile) && (
              <span className="relative z-10">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
