// components/common/ImageContainer.js
import React, { useState } from 'react';

const ImageContainer = ({ 
  src, 
  alt, 
  className = "", 
  containerClass = "",
  fallbackSrc = "/api/placeholder/300/225",
  aspectRatio = "4/3" 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e) => {
    setImageError(true);
    if (e.target.src !== fallbackSrc) {
      e.target.src = fallbackSrc;
    }
  };

  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 ${containerClass}`}
      style={{ aspectRatio }}
    >
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      {/* Main image */}
      <img
        src={src || fallbackSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-300 ${className} ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          imageRendering: 'crisp-edges',
          filter: 'contrast(1.1) brightness(1.05) saturate(1.1)',
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      
      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

export default ImageContainer;