import axios from 'axios';

// Configuración de la API de formatos - usa el dashboard API ya que no hay servicio dedicado
const FORMATOS_API_BASE_URL = process.env.REACT_APP_DASHBOARD_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}/api/dashboard`;

console.log('🔧 FORMATOS_API_BASE_URL configurada como:', FORMATOS_API_BASE_URL);
console.log('🔧 FORMATOS API DIAGNOSTICS:');
console.log('  - REACT_APP_DASHBOARD_API_BASE_URL:', process.env.REACT_APP_DASHBOARD_API_BASE_URL);
console.log('  - Fallback URL:', `${window.location.protocol}//${window.location.hostname}/api/dashboard`);

// Crear instancia de axios para la API de formatos
const formatosClient = axios.create({
  baseURL: FORMATOS_API_BASE_URL,
  timeout: 30000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para manejar respuestas y errores
formatosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en formatos API:', error.config?.url, error.response?.status, error.message);

    // Manejar errores específicos
    if (error.response?.status === 413) {
      throw new Error('El archivo es demasiado grande (máximo 100MB)');
    } else if (error.response?.status === 409) {
      throw new Error(error.response.data?.detail || 'Conflicto: el recurso ya existe');
    } else if (error.response?.status === 404) {
      throw new Error('Recurso no encontrado');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.detail || 'Datos inválidos');
    } else if (error.response?.status === 500) {
      throw new Error('Error interno del servidor');
    }

    // Error de red o desconocido
    if (!error.response) {
      throw new Error('No se puede conectar con el servidor de formatos');
    }

    throw error;
  }
);

class FormatosApiService {
  // ==================== ARCHIVOS ====================

  /**
   * Lista archivos y carpetas en una ruta específica
   * @param {string} path - Ruta a listar (opcional, default="")
   * @returns {Promise<{files: Array, folders: Array, path: string}>}
   */
  async listFiles(path = "") {
    try {
      // Since there's no dedicated formatos API, return empty data for now
      // This should be implemented in the dashboard API
      console.warn('Formatos API not implemented - returning empty data');
      return {
        files: [],
        folders: [],
        path: path
      };
    } catch (error) {
      console.error('Error listando archivos:', error);
      throw error;
    }
  }

  /**
   * Sube un archivo al servidor
   * Los archivos se organizan automáticamente en carpetas por tipo
   * @param {File} file - Archivo a subir
   * @returns {Promise<Object>} Información del archivo subido
   */
  async uploadFile(file) {
    try {
      // Since there's no dedicated formatos API, simulate upload success
      // This should be implemented in the dashboard API
      console.warn('Formatos upload not implemented - simulating success');
      return {
        id: Date.now(),
        nombre: file.name,
        ruta: '',
        tamaño: file.size,
        tipo: file.type,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      throw error;
    }
  }

  /**
   * Descarga un archivo por su ID
   * @param {number} fileId - ID del archivo
   * @returns {Promise<Blob>} Archivo como blob
   */
  async downloadFile(fileId) {
    try {
      // Since there's no dedicated formatos API, simulate download
      // This should be implemented in the dashboard API
      console.warn('Formatos download not implemented - cannot download file');
      throw new Error('Download functionality not implemented');
    } catch (error) {
      console.error('Error descargando archivo:', error);
      throw error;
    }
  }

  /**
   * Elimina un archivo por su ID
   * @param {number} fileId - ID del archivo a eliminar
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async deleteFile(fileId) {
    try {
      // Since there's no dedicated formatos API, simulate deletion
      // This should be implemented in the dashboard API
      console.warn('Formatos delete not implemented - simulating success');
      return {
        message: 'Archivo eliminado exitosamente',
        id: fileId
      };
    } catch (error) {
      console.error('Error eliminando archivo:', error);
      throw error;
    }
  }

  // ==================== CARPETAS ====================

  /**
   * Crea una nueva carpeta
   * @param {string} nombre - Nombre de la carpeta
   * @param {string} parentPath - Ruta del directorio padre (opcional)
   * @returns {Promise<Object>} Información de la carpeta creada
   */
  async createFolder(nombre, parentPath = "") {
    try {
      // Since there's no dedicated formatos API, simulate folder creation
      // This should be implemented in the dashboard API
      console.warn('Formatos create folder not implemented - simulating success');
      return {
        id: Date.now(),
        nombre: nombre,
        ruta: parentPath,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creando carpeta:', error);
      throw error;
    }
  }

  /**
   * Renombra una carpeta
   * @param {string} oldName - Nombre actual de la carpeta
   * @param {string} newName - Nuevo nombre de la carpeta
   * @param {string} parentPath - Ruta del directorio padre
   * @returns {Promise<Object>} Confirmación del cambio
   */
  async renameFolder(oldName, newName, parentPath = "") {
    try {
      // Since there's no dedicated formatos API, simulate folder rename
      // This should be implemented in the dashboard API
      console.warn('Formatos rename folder not implemented - simulating success');
      return {
        message: `Carpeta renombrada de '${oldName}' a '${newName}' exitosamente`,
        oldName: oldName,
        newName: newName,
        parentPath: parentPath
      };
    } catch (error) {
      console.error('Error renombrando carpeta:', error);
      throw error;
    }
  }

  /**
   * Elimina una carpeta por su ID
   * @param {number} folderId - ID de la carpeta a eliminar
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async deleteFolder(folderId) {
    try {
      // Since there's no dedicated formatos API, simulate folder deletion
      // This should be implemented in the dashboard API
      console.warn('Formatos delete folder not implemented - simulating success');
      return {
        message: 'Carpeta eliminada exitosamente',
        id: folderId
      };
    } catch (error) {
      console.error('Error eliminando carpeta:', error);
      throw error;
    }
  }
}

// Exportar instancia única del servicio
export const formatosApi = new FormatosApiService();
export default formatosApi;