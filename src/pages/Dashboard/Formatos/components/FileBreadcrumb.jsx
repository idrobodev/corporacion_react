import React from 'react';

const FileBreadcrumb = ({ currentPath, onBreadcrumbClick }) => {
  const pathParts = currentPath ? currentPath.split('/').filter(Boolean) : [];

  return (
    <div className="mb-4 md:mb-2 ">
      <nav className="flex items-center bg-white rounded-lg border border-gray-200 px-2 md:px-4 py-3 shadow-sm overflow-x-auto w-full">
        {/* Dashboard link */}
        <button
          onClick={() => onBreadcrumbClick('')}
          className="flex items-center px-1 md:px-2 py-1 rounded-md text-xs md:text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 whitespace-nowrap"
        >
          <i className="fas fa-home mr-2 text-gray-500"></i>
          Dashboard
        </button>

        {/* Separator */}
        <i className="fas fa-chevron-right mx-1 md:mx-2 text-gray-400 text-xs"></i>

        {/* Root/Formatos */}
        <button
          onClick={() => onBreadcrumbClick('')}
          className="flex items-center px-1 md:px-2 py-1 rounded-md text-xs md:text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 whitespace-nowrap"
        >
          <i className="fas fa-folder mr-2 text-blue-500"></i>
          Raíz
        </button>

        {/* Path segments */}
        {pathParts.map((part, index) => {
          const pathPrefix = pathParts.slice(0, index + 1).join('/');
          const isLast = index === pathParts.length - 1;

          return (
            <React.Fragment key={index}>
              {/* Separator */}
              <i className="fas fa-chevron-right mx-1 md:mx-2 text-gray-400 text-xs"></i>

              {/* Path segment */}
              <button
                onClick={() => onBreadcrumbClick(pathPrefix)}
                className={`flex items-center px-1 md:px-2 py-1 rounded-md text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
                  isLast
                    ? 'font-semibold text-blue-700 bg-blue-50'
                    : 'font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
                disabled={isLast}
              >
                <i className={`fas fa-folder mr-2 ${isLast ? 'text-blue-600' : 'text-gray-500'}`}></i>
                {part}
              </button>
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

export default FileBreadcrumb;
