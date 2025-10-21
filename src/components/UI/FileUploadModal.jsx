import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import Modal from './Modal/Modal';
import Button from './Button/Button';

/**
 * FileUploadModal component - Modal for file upload with drag-and-drop and file browser
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onUpload - Function to handle file upload
 * @param {boolean} props.uploading - Whether files are currently uploading
 * @param {number} props.maxSize - Maximum file size in bytes (default: 100MB)
 */
const FileUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  uploading = false,
  maxSize = 100 * 1024 * 1024 // 100MB
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    setDragActive(false);
  }, []);

  // Handle drag events
  const onDragEnter = useCallback(() => setDragActive(true), []);
  const onDragLeave = useCallback(() => setDragActive(false), []);

  // Dropzone configuration
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    accept: "*", // All file types
    maxSize,
    multiple: true,
    noClick: true, // Disable click to open file dialog, we'll use our own button
    noKeyboard: true
  });

  // Remove file from selection
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      await onUpload(selectedFiles);
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Get file type icon
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    const iconMap = {
      pdf: 'fas fa-file-pdf text-red-500',
      doc: 'fas fa-file-word text-blue-500',
      docx: 'fas fa-file-word text-blue-500',
      xls: 'fas fa-file-excel text-green-500',
      xlsx: 'fas fa-file-excel text-green-500',
      jpg: 'fas fa-file-image text-purple-500',
      jpeg: 'fas fa-file-image text-purple-500',
      png: 'fas fa-file-image text-purple-500',
      gif: 'fas fa-file-image text-purple-500',
      mp4: 'fas fa-file-video text-red-600',
      zip: 'fas fa-file-archive text-yellow-600',
      rar: 'fas fa-file-archive text-yellow-600',
      js: 'fas fa-file-code text-yellow-500',
      html: 'fas fa-file-code text-orange-600',
      css: 'fas fa-file-code text-blue-600',
      json: 'fas fa-file-code text-green-600'
    };

    return iconMap[extension] || 'fas fa-file text-gray-400';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Subir Archivos"
      size="lg"
    >
      <div className="space-y-6">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
          <p className="text-lg font-medium mb-2">
            {dragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            O usa el botón para seleccionar archivos
          </p>
          <Button
            onClick={open}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <i className="fas fa-folder-open mr-2"></i>
            Seleccionar Archivos
          </Button>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">
              Archivos seleccionados ({selectedFiles.length})
            </h4>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <i className={`${getFileIcon(file.name)} text-lg`}></i>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    disabled={uploading}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Info */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>• Los archivos se organizarán automáticamente en carpetas por tipo</p>
          <p>• Tamaño máximo por archivo: {formatFileSize(maxSize)}</p>
          <p>• Tipos de archivo permitidos: Todos</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedFiles([]);
              onClose();
            }}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
            loading={uploading}
          >
            {uploading ? 'Subiendo...' : `Subir ${selectedFiles.length} archivo${selectedFiles.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

FileUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  uploading: PropTypes.bool,
  maxSize: PropTypes.number
};

export default FileUploadModal;