import { useState, useEffect, useCallback } from 'react';
import { useIsMobile, useIsTablet, useIsDesktop } from './useMediaQuery';

/**
 * Custom hook para manejar el estado del sidebar a través de toda la aplicación
 * Permite abrir/cerrar y colapsar/expandir el sidebar, guardando el estado en localStorage
 * Incluye lógica responsive para manejar diferentes estados según el dispositivo
 */
const useSidebar = () => {
  // Detectar tipo de dispositivo
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  // Estado para controlar si el sidebar está abierto en móvil
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const v = localStorage.getItem('sidebarOpen');
      return v ? JSON.parse(v) : false;
    } catch (_) {
      return false;
    }
  });

  // Estado para controlar si el sidebar está colapsado en desktop
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const v = localStorage.getItem('sidebarCollapsed');
      return v ? JSON.parse(v) : false;
    } catch (_) {
      return false;
    }
  });

  /**
   * Auto-cerrar sidebar móvil al cambiar a desktop/tablet
   * Auto-expandir sidebar al cambiar de desktop a tablet
   */
  useEffect(() => {
    // Si cambiamos a tablet o desktop, cerrar el sidebar móvil
    if (!isMobile && sidebarOpen) {
      setSidebarOpen(false);
      try {
        localStorage.setItem('sidebarOpen', JSON.stringify(false));
      } catch (_) {}
    }

    // Si cambiamos a móvil o tablet, auto-expandir el sidebar (no colapsado)
    if ((isMobile || isTablet) && sidebarCollapsed) {
      setSidebarCollapsed(false);
      try {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(false));
      } catch (_) {}
    }
  }, [isMobile, isTablet, sidebarOpen, sidebarCollapsed]);

  /**
   * Función para alternar el estado de apertura del sidebar en móvil
   */
  const toggleSidebarOpen = useCallback(() => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    try { 
      localStorage.setItem('sidebarOpen', JSON.stringify(next)); 
    } catch (_) {}
  }, [sidebarOpen]);

  /**
   * Función para alternar el estado de colapso del sidebar en desktop
   */
  const toggleSidebarCollapsed = useCallback(() => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try { 
      localStorage.setItem('sidebarCollapsed', JSON.stringify(next)); 
    } catch (_) {}
  }, [sidebarCollapsed]);

  /**
   * Función para cerrar el sidebar si estamos en móvil
   * Útil para cerrar automáticamente al hacer clic en un item del menú
   */
  const closeIfMobile = useCallback(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
      try {
        localStorage.setItem('sidebarOpen', JSON.stringify(false));
      } catch (_) {}
    }
  }, [isMobile, sidebarOpen]);

  /**
   * Función para abrir el sidebar (solo en móvil)
   */
  const openSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(true);
      try {
        localStorage.setItem('sidebarOpen', JSON.stringify(true));
      } catch (_) {}
    }
  }, [isMobile]);

  /**
   * Función para cerrar el sidebar (solo en móvil)
   */
  const closeSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(false);
      try {
        localStorage.setItem('sidebarOpen', JSON.stringify(false));
      } catch (_) {}
    }
  }, [isMobile]);

  return { 
    // Estados
    sidebarOpen, 
    sidebarCollapsed,
    isMobile,
    isTablet,
    isDesktop,
    
    // Funciones de toggle
    toggleSidebarOpen, 
    toggleSidebarCollapsed,
    
    // Funciones de control
    closeIfMobile,
    openSidebar,
    closeSidebar,
    
    // Estados derivados útiles
    isOverlay: isMobile, // El sidebar es overlay solo en móvil
    canCollapse: isDesktop, // Solo se puede colapsar en desktop
    isVisible: isMobile ? sidebarOpen : true, // En desktop siempre visible, en móvil depende de sidebarOpen
  };
};

export default useSidebar;