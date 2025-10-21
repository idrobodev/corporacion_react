import React from 'react';
import { getFileType, formatFileSize, formatDate } from 'shared/utils/fileUtils';
import { useIsMobile } from 'shared/hooks';

const FileListView = ({ filteredAndSortedFiles, searchTerm, onDownload, onDeleteFile, isAdmin }) => {
  const isMobile = useIsMobile();

  // Function to highlight search term in text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  // Mobile card layout
  if (isMobile) {
    return (
      <div className="space-y-3">
        {filteredAndSortedFiles.map((file) => {
          const fileType = getFileType(file.nombre);

          return (
            <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <i className={`${fileType.icon} ${fileType.color} text-xl mt-1 flex-shrink-0`}></i>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate" title={file.nombre}>
                      {highlightText(file.nombre, searchTerm)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {file.nombre.split('.').pop()?.toUpperCase()} • {fileType.category}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        fileType.category === 'document' ? 'bg-blue-100 text-blue-800' :
                        fileType.category === 'image' ? 'bg-purple-100 text-purple-800' :
                        fileType.category === 'video' ? 'bg-red-100 text-red-800' :
                        fileType.category === 'audio' ? 'bg-indigo-100 text-indigo-800' :
                        fileType.category === 'archive' ? 'bg-yellow-100 text-yellow-800' :
                        fileType.category === 'code' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {fileType.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {file.tamaño ? formatFileSize(file.tamaño) : 'Desconocido'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {file.createdAt ? formatDate(file.createdAt) : 'Desconocido'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => onDownload(file.nombre)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    title="Descargar"
                  >
                    <i className="fas fa-download text-sm"></i>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onDeleteFile(file.nombre)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop table layout
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredAndSortedFiles.map((file) => {
            const fileType = getFileType(file.nombre);

            return (
              <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <i className={`${fileType.icon} ${fileType.color} mr-3 text-lg`}></i>
                    <div>
                      <div className="font-medium text-gray-900 max-w-xs truncate" title={file.nombre}>
                        {highlightText(file.nombre, searchTerm)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {file.nombre.split('.').pop()?.toUpperCase()} • {fileType.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    fileType.category === 'document' ? 'bg-blue-100 text-blue-800' :
                    fileType.category === 'image' ? 'bg-purple-100 text-purple-800' :
                    fileType.category === 'video' ? 'bg-red-100 text-red-800' :
                    fileType.category === 'audio' ? 'bg-indigo-100 text-indigo-800' :
                    fileType.category === 'archive' ? 'bg-yellow-100 text-yellow-800' :
                    fileType.category === 'code' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {fileType.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {file.tamaño ? formatFileSize(file.tamaño) : 'Desconocido'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    {file.createdAt ? formatDate(file.createdAt) : 'Desconocido'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {file.createdAt ? new Date(file.createdAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onDownload(file.nombre)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                      title="Descargar"
                    >
                      <i className="fas fa-download"></i>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => onDeleteFile(file.nombre)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                        title="Eliminar"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FileListView;