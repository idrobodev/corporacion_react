import React from 'react';

const LoadingSkeleton = ({ height = 'h-64', className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${height} ${className}`}>
      <div className="h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
    </div>
  );
};

export default LoadingSkeleton;