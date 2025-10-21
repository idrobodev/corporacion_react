import React, { useState } from 'react';
import DashboardLayout from 'components/layout/DashboardLayout';
import { LoadingSpinner, FileUploadModal } from 'components/UI';
import useFileManager from './Formatos/hooks/useFileManager';
import FileBreadcrumb from './Formatos/components/FileBreadcrumb';
import FolderList from './Formatos/components/FolderList';
import FileDisplay from './Formatos/components/FileDisplay';

const Formatos = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const {
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
    setSearchTerm,
    setNewFolderName,
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
  } = useFileManager();

  if (loading) {
    return (
      <DashboardLayout
        title="Formatos"
        subtitle="Cargando archivos..."
        loading={true}
        loadingText="Cargando formatos y carpetas..."
      >
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        title="Formatos"
        subtitle="Error al cargar datos"
        loading={false}
      >
        <div className="flex items-center justify-center h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error loading formats: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin && loading === false) {
    return (
      <DashboardLayout
        title="Formatos"
        subtitle="Acceso Restringido"
        loading={false}
      >
        <div className="flex items-center justify-center h-screen">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <i className="fas fa-lock text-yellow-500 text-3xl mb-4"></i>
            <h3 className="text-lg font-bold text-yellow-800 mb-2">Acceso Restringido</h3>
            <p className="text-yellow-700">Solo administradores pueden gestionar archivos.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Formatos"
      subtitle="Gestión de Archivos y Carpetas"
    >
      
      {/* Enhanced Toast Notifications */}
      <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50 space-y-3 max-w-sm md:max-w-md mx-auto md:mx-0">
        {notifications.map(({ id, message, type }) => {
          const getIcon = () => {
            switch (type) {
              case 'success': return 'fas fa-check-circle';
              case 'error': return 'fas fa-exclamation-circle';
              case 'warning': return 'fas fa-exclamation-triangle';
              case 'info': default: return 'fas fa-info-circle';
            }
          };

          const getColors = () => {
            switch (type) {
              case 'success': return 'bg-gradient-to-r from-green-500 to-green-600 border-green-400';
              case 'error': return 'bg-gradient-to-r from-red-500 to-red-600 border-red-400';
              case 'warning': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400';
              case 'info': default: return 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400';
            }
          };

          return (
            <div
              key={id}
              className={`flex items-center p-4 rounded-lg shadow-xl border-l-4 text-white transform transition-all duration-300 ease-out animate-slideInRight ${getColors()}`}
              style={{
                animation: 'slideInRight 0.5s ease-out forwards',
              }}
            >
              <i className={`${getIcon()} mr-3 text-lg flex-shrink-0`}></i>
              <span className="flex-1 text-sm font-medium">{message}</span>
              <button
                onClick={() => {
                  // Remove notification - this would need to be implemented in useFileManager
                  // For now, we'll just hide it
                  const element = document.getElementById(`toast-${id}`);
                  if (element) {
                    element.style.animation = 'slideOutRight 0.3s ease-in forwards';
                    setTimeout(() => {
                      // This should call a removeNotification function from the hook
                    }, 300);
                  }
                }}
                className="ml-3 p-1 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors duration-200 flex-shrink-0"
                id={`toast-${id}`}
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
        }
      `}</style>

      <div className="px-4 md:px-6 pb-2 md:pb-3 mt-6">
        <FileBreadcrumb
          currentPath={currentPath}
          onBreadcrumbClick={handleBreadcrumbClick}
        />
      </div>

      <div className="px-4 md:px-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-2 md:mt-3">
          <FolderList
            folders={folders}
            isAdmin={isAdmin}
            newFolderName={newFolderName}
            setNewFolderName={setNewFolderName}
            onCreateFolder={handleCreateFolder}
            renamingFolder={renamingFolder}
            onUpdateRenameName={updateRenameName}
            onStartRename={startRename}
            onCancelRename={cancelRename}
            onRenameFolder={handleRenameFolder}
            onDeleteFolder={handleDeleteFolder}
            onNavigateToFolder={navigateToFolder}
          />

          <div className="lg:col-span-2">
            {/* Search input */}
            <div className="mb-4 md:mb-6">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Búsqueda
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar archivos por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Button */}
            {isAdmin && (
              <div className="mb-4 md:mb-6">
                <button
                  onClick={() => setUploadModalOpen(true)}
                  disabled={uploading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed text-sm md:text-base"
                >
                  <i className="fas fa-cloud-upload-alt mr-2 md:mr-3"></i>
                  Subir Archivos
                </button>
              </div>
            )}

            <FileDisplay
              loading={loading}
              filteredAndSortedFiles={filteredAndSortedFiles}
              files={files}
              viewMode="list"
              searchTerm={debouncedSearchTerm}
              onDownload={handleDownload}
              onDeleteFile={handleDeleteFile}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={async (files) => {
          // Use the existing onDrop function from useFileManager
          await onDrop(files);
        }}
        uploading={uploading}
      />
    </DashboardLayout>
  );
};

export default Formatos;