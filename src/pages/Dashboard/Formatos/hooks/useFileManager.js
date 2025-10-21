import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { formatosApi } from 'shared/services/formatosApi';
import { dbService, ROLES } from 'shared/services';
import { useDebouncedSearch } from 'shared/hooks';

const useFileManager = () => {
  // Basic state
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Ref to prevent double loading in strict mode
  const hasLoadedRef = useRef(false);

  // Additional state for enhanced functionality
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedSearch(searchTerm, 300);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolder, setRenamingFolder] = useState(null); // {folderName, newName}


  // Simple notification helper
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  }, []);

  // Load files and folders
  const loadFiles = useCallback(async (path = '') => {
    setLoading(true);
    try {
      const result = await formatosApi.listFiles(path);

      const { files: loadedFiles, folders: loadedFolders } = result;
      setFiles(loadedFiles || []);
      setFolders(loadedFolders || []);
      setCurrentPath(path);
    } catch (error) {
      addNotification(`Error loading files: ${error.message}`, 'error');
      setFiles([]);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Check admin permission on mount
  const checkAdmin = useCallback(async () => {
    try {
      const admin = await dbService.hasPermission(ROLES.ADMINISTRADOR);
      setIsAdmin(admin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load files on mount
  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      const savedPath = localStorage.getItem('lastFileManagerPath') || '';
      loadFiles(savedPath);
    }
  }, [loadFiles]);

  // Save current path to cache
  useEffect(() => {
    localStorage.setItem('lastFileManagerPath', currentPath);
  }, [currentPath]);

  // Navigation functions
  const navigateToPath = (targetPath) => {
    loadFiles(targetPath);
  };

  const navigateToFolder = (folderName) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    loadFiles(newPath);
  };

  const handleBreadcrumbClick = (pathPrefix) => {
    navigateToPath(pathPrefix);
  };

  // Folder CRUD functions
  const handleCreateFolder = async () => {
    if (!isAdmin || !newFolderName.trim()) return;
    try {
      await formatosApi.createFolder(newFolderName.trim(), currentPath);
      addNotification('Folder created successfully', 'success');
      setNewFolderName('');
      loadFiles(currentPath);
    } catch (error) {
      addNotification(`Error creating folder: ${error.message}`, 'error');
    }
  };

  const handleRenameFolder = async (oldName) => {
    if (!isAdmin || !renamingFolder || !renamingFolder.newName.trim()) return;
    try {
      await formatosApi.renameFolder(oldName, renamingFolder.newName.trim(), currentPath);
      addNotification('Folder renamed successfully', 'success');
      setRenamingFolder(null);
      loadFiles(currentPath);
    } catch (error) {
      addNotification(`Error renaming folder: ${error.message}`, 'error');
      setRenamingFolder(null);
    }
  };

  const startRename = (folder) => {
    setRenamingFolder({ folderName: folder, newName: folder });
  };

  const cancelRename = () => {
    setRenamingFolder(null);
  };

  const updateRenameName = (newName) => {
    setRenamingFolder(prev => ({ ...prev, newName }));
  };

  const handleDeleteFolder = async (folderName) => {
    if (!isAdmin || !window.confirm(`Delete folder '${folderName}' and all contents?`)) return;
    try {
      // Find the folder ID
      const folder = folders.find(f => f.nombre === folderName);
      if (!folder) {
        addNotification('Folder not found', 'error');
        return;
      }
      await formatosApi.deleteFolder(folder.id);
      addNotification('Folder deleted successfully', 'success');
      loadFiles(currentPath);
    } catch (error) {
      addNotification(`Error deleting folder: ${error.message}`, 'error');
    }
  };

  // File CRUD functions
  const handleDeleteFile = async (fileName) => {
    if (!isAdmin || !window.confirm(`Delete file '${fileName}'?`)) return;
    try {
      // Find the file ID
      const file = files.find(f => f.nombre === fileName);
      if (!file) {
        addNotification('File not found', 'error');
        return;
      }
      await formatosApi.deleteFile(file.id);
      addNotification('File deleted successfully', 'success');
      loadFiles(currentPath);
    } catch (error) {
      addNotification(`Error deleting file: ${error.message}`, 'error');
    }
  };

  const handleDownload = async (fileName) => {
    try {
      // Find the file ID
      const file = files.find(f => f.nombre === fileName);
      if (!file) {
        addNotification('File not found', 'error');
        return;
      }
      const blob = await formatosApi.downloadFile(file.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      addNotification(`Error downloading file: ${error.message}`, 'error');
    }
  };

  // Upload files
  const onDrop = async (acceptedFiles) => {
    console.log('onDrop called with files:', acceptedFiles);
    if (!isAdmin) {
      console.log('onDrop: User is not admin');
      addNotification('Permission denied: Admin access required for uploads', 'error');
      return;
    }

    setUploading(true);
    try {
      console.log('onDrop: Starting upload for', acceptedFiles.length, 'files');
      for (const file of acceptedFiles) {
        await formatosApi.uploadFile(file);
      }
      addNotification(`${acceptedFiles.length} files uploaded successfully`, 'success');
      loadFiles(currentPath);
    } catch (error) {
      console.error('onDrop: Upload error:', error);
      addNotification(`Upload error: ${error.message}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  // Filtered files (only by search term)
  const filteredAndSortedFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return matchesSearch;
    }).sort((a, b) => {
      // Sort by creation date (newest first)
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [files, debouncedSearchTerm]);

  return {
    // State
    currentPath,
    files,
    folders,
    loading,
    error,
    uploading,
    isAdmin,
    notifications,
    searchTerm,
    debouncedSearchTerm,
    newFolderName,
    renamingFolder,
    filteredAndSortedFiles,

    // Setters
    setSearchTerm,
    setNewFolderName,
    setRenamingFolder,
    setUploading,
    setError,

    // Functions
    loadFiles,
    addNotification,
    checkAdmin,
    navigateToPath,
    navigateToFolder,
    handleBreadcrumbClick,
    handleCreateFolder,
    handleRenameFolder,
    startRename,
    cancelRename,
    updateRenameName,
    handleDeleteFolder,
    handleDeleteFile,
    handleDownload,
    onDrop,
  };
};

export default useFileManager;