// Servicio API   
import axios from 'axios';

// Configuración base de las APIs
// Solo servicio de autenticación
const AUTH_API_BASE_URL = process.env.REACT_APP_AUTH_API_BASE_URL ||
  'https://todoporunalma.org/api/auth';

console.log('🔧 AUTH_API_BASE_URL configurada como:', AUTH_API_BASE_URL);
console.log('🔧 Full login URL will be:', AUTH_API_BASE_URL + '/auth/login');

// Additional diagnostic logging
console.log('🔧 API CONFIGURATION DIAGNOSTICS:');
console.log('  - REACT_APP_AUTH_API_BASE_URL:', process.env.REACT_APP_AUTH_API_BASE_URL);
console.log('  - REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
console.log('  - REACT_APP_FORMATOS_API_URL:', process.env.REACT_APP_FORMATOS_API_URL);
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - Current hostname:', window.location.hostname);
console.log('  - Current protocol:', window.location.protocol);

// Crear instancia de axios para autenticación
const authClient = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 30000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Función helper para configurar interceptors
const setupInterceptors = (client, serviceName) => {
  // Interceptor para agregar token de autenticación
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error(`Error en ${serviceName} request interceptor:`, error);
      return Promise.reject(error);
    }
  );

  // Interceptor para manejar respuestas y errores
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const errorInfo = generateErrorMessage(error);

      // Solo log crítico de errores
      if (errorInfo.isCorsError) {
        console.error(`CORS ERROR (${serviceName}):`, error.config?.url);
      } else if (errorInfo.isNetworkError) {
        console.error(`Network error (${serviceName}):`, error.message);
      } else if (error.response) {
        console.error(`HTTP ${error.response.status} (${serviceName}):`, error.response.data);
      }

      // Manejar errores de autenticación
      if (error.response?.status === 401 && !errorInfo.isNetworkError) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
      }

      const enhancedError = {
        message: errorInfo.message,
        type: errorInfo.type,
        status: errorInfo.status,
        isCorsError: errorInfo.isCorsError,
        isNetworkError: errorInfo.isNetworkError,
        suggestions: errorInfo.suggestions,
        serverMessage: error.response?.data?.message || null,
        originalError: error,
        response: error.response
      };

      return Promise.reject(enhancedError);
    }
  );
};

// Configurar interceptors para el cliente de autenticación
setupInterceptors(authClient, 'AUTH');

// Definición de roles del sistema
export const ROLES = {
  CONSULTA: 'CONSULTA',
  ADMINISTRADOR: 'ADMINISTRADOR'
};

// ==================== CORS ERROR DETECTION ====================

/**
 * Detecta si un error de axios es causado por CORS
 * @param {Error} error - El objeto de error de axios
 * @returns {boolean} true si es un error de CORS, false en caso contrario
 */
export const detectCorsError = (error) => {
  // CORS errors typically have these characteristics:
  // 1. No response object (preflight or actual request blocked)
  // 2. Network Error message
  // 3. Error code ERR_NETWORK
  // 4. Request was made but no response received

  // Check if there's no response (most common CORS indicator)
  if (!error.response) {
    // Check for network error patterns
    const isNetworkError = error.message === 'Network Error' ||
      error.code === 'ERR_NETWORK';

    // Check if request was configured (means axios tried to send it)
    const hasRequestConfig = !!error.config;

    // CORS errors occur when:
    // - There's a network error
    // - Request was configured and attempted
    // - No response was received (blocked by browser)
    if (isNetworkError && hasRequestConfig) {
      // Additional check: if the URL is cross-origin
      const requestUrl = error.config?.url || '';
      const baseURL = error.config?.baseURL || '';
      const fullUrl = requestUrl.startsWith('http') ? requestUrl : baseURL + requestUrl;

      // If we're making a request to a different origin, it's likely CORS
      if (fullUrl.startsWith('http')) {
        const currentOrigin = `${window.location.protocol}//${window.location.host}`;
        const requestOrigin = new URL(fullUrl).origin;

        // Different origins = likely CORS issue
        if (currentOrigin !== requestOrigin) {
          return true;
        }
      }

      // Even same origin can have CORS issues in some cases
      // If it's a network error with no response, assume CORS
      return true;
    }
  }

  // Check for specific CORS-related error messages
  const errorMessage = error.message?.toLowerCase() || '';
  const corsKeywords = ['cors', 'cross-origin', 'preflight'];

  if (corsKeywords.some(keyword => errorMessage.includes(keyword))) {
    return true;
  }

  // Not a CORS error
  return false;
};

// ==================== ERROR MESSAGE GENERATOR ====================

/**
 * Genera mensajes de error amigables y accionables para diferentes tipos de errores
 * @param {Error} error - El objeto de error original
 * @returns {Object} Objeto con mensaje, sugerencias y tipo de error
 */
export const generateErrorMessage = (error) => {
  const errorInfo = {
    message: '',
    suggestions: [],
    type: 'unknown',
    isNetworkError: false,
    isCorsError: false,
    status: error.response?.status || 0,
    originalError: error
  };

  // Usar la función de detección de CORS
  const isCorsError = detectCorsError(error);

  // Detectar si es un error de red (sin respuesta del servidor)
  const isNetworkError = !error.response && (
    error.message === 'Network Error' ||
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNABORTED' ||
    !error.status
  );

  if (isCorsError) {
    // Error de CORS
    errorInfo.type = 'cors';
    errorInfo.isCorsError = true;
    errorInfo.isNetworkError = true;
    errorInfo.message = 'No se puede conectar con el servidor debido a restricciones de CORS';
    errorInfo.suggestions = [
      '🔧 Verifica que el servidor backend esté ejecutándose en http://localhost:8080',
      '🔧 Asegúrate de que el backend tenga configurado CORS correctamente',
      '🔍 Revisa la consola del navegador para ver detalles específicos del error CORS',
      '⚙️ Si eres desarrollador, verifica la configuración de CORS en el backend (WebMvcConfigurer o SecurityFilterChain)',
      '🔄 Intenta reiniciar tanto el frontend como el backend',
      '📝 Verifica que el backend permita el origen: ' + window.location.origin
    ];
  } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    // Error de timeout
    errorInfo.type = 'timeout';
    errorInfo.isNetworkError = true;
    errorInfo.message = 'La solicitud al servidor tardó demasiado tiempo (timeout después de 30 segundos)';
    errorInfo.suggestions = [
      '🌐 Verifica tu conexión a internet',
      '⏱️ El servidor puede estar experimentando alta carga o procesando una operación pesada',
      '🔄 Intenta nuevamente en unos momentos',
      '📊 Si trabajas con grandes volúmenes de datos, considera filtrar o paginar los resultados',
      '🔧 Si el problema persiste, contacta al administrador del sistema'
    ];
  } else if (isNetworkError) {
    // Error de red general (backend no disponible)
    errorInfo.type = 'network';
    errorInfo.isNetworkError = true;
    errorInfo.message = 'No se puede conectar con el servidor - Backend no disponible';
    errorInfo.suggestions = [
      '🚀 Verifica que el servidor backend esté ejecutándose en ' + (error.config?.baseURL || 'http://localhost:8080'),
      '🌐 Comprueba tu conexión a internet',
      '🔍 Asegúrate de que la URL del servidor sea correcta',
      '🛡️ Verifica que no haya un firewall bloqueando la conexión',
      '🔧 Si eres desarrollador, inicia el backend con: ./mvnw spring-boot:run',
      '📞 Si el problema persiste, contacta al administrador del sistema'
    ];
  } else if (error.response) {
    // Error HTTP con respuesta del servidor
    const status = error.response.status;

    switch (status) {
      case 400:
        errorInfo.type = 'validation';
        errorInfo.message = 'Los datos enviados no son válidos (Error 400)';
        errorInfo.suggestions = [
          '📝 Verifica que todos los campos requeridos estén completos',
          '✅ Asegúrate de que los datos tengan el formato correcto (emails, teléfonos, fechas, etc.)',
          '🔍 Revisa los mensajes de validación específicos del servidor',
          '📋 Verifica que no haya campos con valores inválidos o fuera de rango'
        ];
        break;

      case 401:
        errorInfo.type = 'authentication';
        errorInfo.message = 'No estás autenticado o tu sesión ha expirado (Error 401)';
        errorInfo.suggestions = [
          '🔐 Inicia sesión nuevamente',
          '✅ Verifica que tus credenciales sean correctas',
          '⏱️ Tu sesión puede haber expirado por inactividad',
          '🔄 Intenta cerrar sesión y volver a iniciar sesión'
        ];
        break;

      case 403:
        errorInfo.type = 'authorization';
        errorInfo.message = 'No tienes permisos para realizar esta acción (Error 403)';
        errorInfo.suggestions = [
          '👤 Contacta al administrador para solicitar los permisos necesarios',
          '🔑 Verifica que tu cuenta tenga el rol adecuado',
          '⚙️ Puede que necesites permisos de ADMINISTRADOR para esta operación',
          '📋 Revisa qué acciones están permitidas para tu rol actual'
        ];
        break;

      case 404:
        errorInfo.type = 'notFound';
        errorInfo.message = 'El recurso solicitado no fue encontrado (Error 404)';
        errorInfo.suggestions = [
          '🔍 Verifica que el recurso exista en el sistema',
          '🗑️ Puede que el recurso haya sido eliminado recientemente',
          '🔄 Intenta refrescar la página y volver a intentar',
          '📋 Verifica que el ID o identificador sea correcto'
        ];
        break;

      case 409:
        errorInfo.type = 'conflict';
        errorInfo.message = 'Ya existe un recurso con estos datos (Error 409)';
        errorInfo.suggestions = [
          '🔍 Verifica que no estés duplicando información',
          '📝 Puede que ya exista un registro con el mismo identificador único',
          '✏️ Intenta con datos diferentes o actualiza el registro existente',
          '🔄 Refresca la lista para ver los datos actuales'
        ];
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        errorInfo.type = 'serverError';
        errorInfo.message = `Error interno del servidor (Error ${status})`;
        errorInfo.suggestions = [
          '🔥 El servidor está experimentando problemas técnicos',
          '⏱️ Intenta nuevamente en unos momentos',
          '🔧 Si el problema persiste, contacta al administrador del sistema',
          '📝 Este error ha sido registrado automáticamente para su revisión',
          '💾 Verifica que la base de datos esté disponible (si eres administrador)'
        ];
        break;

      default:
        errorInfo.type = 'http';
        errorInfo.message = `Error del servidor (código ${status})`;
        errorInfo.suggestions = [
          '❌ Ocurrió un error inesperado en el servidor',
          '🔄 Intenta nuevamente',
          '📞 Si el problema persiste, contacta al soporte técnico',
          '🔍 Código de error: ' + status
        ];
    }

    // Agregar mensaje específico del servidor si está disponible
    if (error.response.data?.message) {
      errorInfo.serverMessage = error.response.data.message;
    }
  } else {
    // Error desconocido
    errorInfo.type = 'unknown';
    errorInfo.message = 'Ocurrió un error inesperado';
    errorInfo.suggestions = [
      '🔄 Intenta refrescar la página',
      '🌐 Verifica tu conexión a internet',
      '💾 Limpia la caché del navegador si el problema persiste',
      '🔧 Intenta cerrar y volver a abrir la aplicación',
      '📞 Si el problema persiste, contacta al soporte técnico con detalles del error'
    ];
  }

  return errorInfo;
};

class ApiService {
  // ==================== AUTENTICACIÓN ====================

  async login(email, password) {
    console.log('🔐 Starting login request...');
    console.log('📧 Email:', email);
    console.log('🌐 Auth API URL:', AUTH_API_BASE_URL);
    console.log('🔗 Full login URL:', AUTH_API_BASE_URL + '/login');

    const startTime = Date.now();

    try {
      console.log('📤 Sending login request...');
      const response = await authClient.post('/login', { email, password });
      const responseTime = Date.now() - startTime;
      console.log('✅ Login request completed in', responseTime, 'ms');
      console.log('📊 Response status:', response.status);

      // FastAPI returns data directly in response.data, not nested
      const responseData = response.data;
      console.log('📦 Response data:', responseData);

      // Check for error in FastAPI response format
      if (responseData.error) {
        console.error('❌ Server error in response:', responseData.error);
        throw new Error(responseData.error.message || 'Error en el servidor');
      }

      if (!responseData.data) {
        console.error('❌ Invalid server response: no data field');
        throw new Error('Respuesta del servidor inválida');
      }

      const { token, user } = responseData.data;
      console.log('🔑 Token received:', !!token);
      console.log('👤 User received:', !!user);

      if (!token || !user) {
        console.error('❌ Incomplete server response - missing token or user');
        throw new Error('Respuesta del servidor incompleta');
      }

      console.log('💾 Storing auth data in localStorage...');
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      console.log('🎉 Login successful!');
      return { data: { user, token }, error: null };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('💥 Login failed after', responseTime, 'ms');
      console.error('❌ Error details:', error);

      if (error.response) {
        console.error('📊 HTTP Error Response:');
        console.error('   Status:', error.response.status);
        console.error('   Status Text:', error.response.statusText);
        console.error('   Headers:', error.response.headers);
        console.error('   Data:', error.response.data);

        // Handle FastAPI error format
        const serverMessage = error.response.data?.detail ||
                            error.response.data?.message ||
                            error.response.data?.error?.message;
        throw new Error(serverMessage || 'Error del servidor');
      } else if (error.request) {
        console.error('🌐 Network Error - No response received:');
        console.error('   Request config:', error.config);
        console.error('   Timeout was set to:', error.config?.timeout, 'ms');
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
      } else {
        console.error('⚠️ Unexpected error:', error.message);
        throw error;
      }
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      await authClient.post('/logout');

      // Limpiar localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');

      return { success: true, error: null };
    } catch (error) {
      console.error('Error en logout:', error);
      // Limpiar localStorage aunque falle la petición
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return { success: true, error: null };
    }
  }


  // Restablecer contraseña
  async resetPassword(email) {
    try {
      const response = await authClient.post('/reset-password', { email });
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error en reset password:', error);
      return {
        data: null,
        error: {
          message: error.message || 'Error al restablecer contraseña'
        }
      };
    }
  }

  async getCurrentUser() {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('authToken');

      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);

          if (user && user.email && user.id) {
            return { data: user, error: null };
          } else {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            return { data: null, error: null };
          }
        } catch (parseError) {
          console.error('Error parseando usuario:', parseError);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('authToken');
          return { data: null, error: null };
        }
      }

      return { data: null, error: null };
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return { data: null, error };
    }
  }

  // Actualizar perfil de usuario
  async updateProfile(profileData) {
    try {
      const response = await authClient.put('/profile', profileData);

      // Actualizar usuario en localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return {
        data: null,
        error: {
          message: error.message || 'Error al actualizar perfil'
        }
      };
    }
  }

  // Verificar permisos del usuario
  async hasPermission(requiredRole) {
    try {
      // Consultar endpoint real en backend FastAPI
      const response = await authClient.get('/permission', {
        params: { role: requiredRole }
      });

      return response.data.hasPermission || false;
    } catch (error) {
      console.error('Error verificando permisos:', error);
      // Fallback temporal a verificación local si el endpoint no existe
      try {
        const { data: user } = await this.getCurrentUser();

        if (!user) return false;

        const userRole = user.rol || user.role || ROLES.CONSULTA;

        // Jerarquía de roles: ADMINISTRADOR > CONSULTA
        const roleHierarchy = {
          [ROLES.ADMINISTRADOR]: 2,
          [ROLES.CONSULTA]: 1
        };

        const userLevel = roleHierarchy[userRole] || 1;
        const requiredLevel = roleHierarchy[requiredRole] || 1;

        return userLevel >= requiredLevel;
      } catch (fallbackError) {
        console.error('Fallback también falló:', fallbackError);
        return false;
      }
    }
  }


  // ==================== UTILIDADES ====================
  
  /**
   * Verifica la conexión con el backend de autenticación
   * @returns {Promise<Object>} Objeto con información detallada de la conexión
   */
  async testConnection() {
    const startTime = Date.now();
    const results = {
      auth: null,
      overall: { success: false, message: 'Conexión fallida' }
    };
  
    // Test auth service
    try {
      const authResponse = await authClient.get('/health');
      results.auth = {
        success: true,
        connected: true,
        responseTime: Date.now() - startTime,
        status: authResponse.status,
        baseURL: AUTH_API_BASE_URL,
        data: authResponse.data,
        message: 'Conexión exitosa con auth service'
      };
    } catch (error) {
      const errorInfo = generateErrorMessage(error);
      results.auth = {
        success: false,
        connected: false,
        responseTime: Date.now() - startTime,
        baseURL: AUTH_API_BASE_URL,
        error: error.message || 'Error de conexión',
        errorType: errorInfo.type,
        isCorsError: errorInfo.isCorsError,
        isNetworkError: errorInfo.isNetworkError,
        suggestions: errorInfo.suggestions,
        message: errorInfo.message
      };
    }
  
    // Overall result
    const authSuccess = results.auth.success;
  
    if (authSuccess) {
      results.overall = {
        success: true,
        message: 'Conexión exitosa con el servicio de autenticación'
      };
    } else {
      results.overall = {
        success: false,
        message: 'El servicio de autenticación no está disponible'
      };
    }
  
    return results;
  }
  
  /**
   * Verifica si el backend de autenticación está disponible antes de operaciones críticas
   * @param {number} timeout - Timeout en milisegundos (por defecto 5000ms)
   * @returns {Promise<Object>} Objeto con estado del servicio
   */
  async isBackendReachable(timeout = 5000) {
    const results = { auth: false };
  
    // Check auth service
    try {
      const authCheck = axios.create({
        baseURL: AUTH_API_BASE_URL,
        timeout: timeout,
        headers: { 'Accept': 'application/json' }
      });
      await authCheck.get('/health');
      results.auth = true;
    } catch (error) {
      console.warn('Auth service no disponible:', error.message);
    }
  
    return results;
  }
  
  // ==================== DASHBOARD ====================

  // Obtener datos del dashboard
  async getDashboardData() {
    try {
      const response = await authClient.get('/stats');
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error obteniendo datos del dashboard:', error);
      return {
        data: null,
        error: {
          message: error.message || 'Error al obtener datos del dashboard'
        }
      };
    }
  }

  // ==================== USUARIOS ====================

  // Obtener lista de usuarios
  async getUsuarios() {
    try {
      const response = await authClient.get('/usuarios');
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return {
        data: null,
        error: {
          message: error.message || 'Error al obtener usuarios'
        }
      };
    }
  }

  // ==================== PARTICIPANTES ====================

  // Obtener lista de participantes
  async getParticipantes() {
    try {
      const response = await authClient.get('/participantes');
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error obteniendo participantes:', error);
      return {
        data: null,
        error: {
          message: error.message || 'Error al obtener participantes'
        }
      };
    }
  }

  // ==================== ACUDIENTES ====================

  // Obtener lista de acudientes
  async getAcudientes(filters) {
    try {
      const response = await authClient.get('/dashboard/acudientes', {
        params: filters
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error obteniendo acudientes:', error);
      return {
        data: null,
        error: {
          message: error.message || 'Error al obtener acudientes'
        }
      };
    }
  }

  // Obtener configuración de la API
  getApiConfig() {
    return {
      authBaseURL: AUTH_API_BASE_URL,
      hasToken: !!localStorage.getItem('authToken'),
      environment: process.env.NODE_ENV,
      isConfigured: !!AUTH_API_BASE_URL
    };
  }
}

// Exportar instancia única del servicio
export const api = new ApiService();
export default api;

// Exportar cliente axios para uso directo si es necesario
export { authClient };
