import { ROLES } from './api';
import { dbService } from './database';

const STORAGE_BASE_URL = process.env.REACT_APP_STORAGE_BASE_URL;

class StorageService {
  async isAdmin() {
    return await dbService.hasPermission(ROLES.ADMINISTRADOR);
  }

  async upload(file, path = '') {
    if (!(await this.isAdmin())) {
      throw new Error('Permission denied: Admin access required');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Storage service no longer available - return error
    throw new Error('Storage service is not available. Dashboard backend connection removed.');
  }

  async deleteFile(fullPath) {
    if (!(await this.isAdmin())) {
      throw new Error('Permission denied: Admin access required');
    }

    // Storage service no longer available - return error
    throw new Error('Storage service is not available. Dashboard backend connection removed.');
  }

  async listFiles(path = '') {
    // Storage service no longer available - return empty result
    return {
      files: [],
      folders: []
    };
  }

  async deleteFolder(path) {
    if (!(await this.isAdmin())) {
      throw new Error('Permission denied: Admin access required');
    }

    // Storage service no longer available - return error
    throw new Error('Storage service is not available. Dashboard backend connection removed.');
  }

  async createFolder(folderName, parentPath = '') {
    if (!(await this.isAdmin())) {
      throw new Error('Permission denied: Admin access required');
    }

    // Storage service no longer available - return error
    throw new Error('Storage service is not available. Dashboard backend connection removed.');
  }

  async renameFolder(oldName, newName, parentPath = '') {
    if (!(await this.isAdmin())) {
      throw new Error('Permission denied: Admin access required');
    }

    // Storage service no longer available - return error
    throw new Error('Storage service is not available. Dashboard backend connection removed.');
  }

  async getDownloadUrl(path) {
    // Return public URL
    return STORAGE_BASE_URL + '/' + path;
  }
}

export const storage = new StorageService();
export default storage;