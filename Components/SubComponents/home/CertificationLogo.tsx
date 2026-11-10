import React from 'react'
import { CertificationLogoProps } from '@/types/dataType';

const CertificationLogo: React.FC<CertificationLogoProps> = ({ data }) => {
  const { alt, imagePath } = data;

  return (
    // Logo Container
    <div className="flex justify-center items-center p-4">
      {/* Image: fixed size for consistency, transition for hover effect */}
      <img
        src={imagePath}
        alt={alt}
        className="w-28 h-28 sm:w-32 sm:h-32 object-contain transition-transform duration-200 hover:scale-[1.05]"
        // Placeholder Fallback (though using placeholders for the main images here)
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null; 
          (e.target as HTMLImageElement).src = `https://placehold.co/128x128/94a3b8/ffffff?text=${alt.substring(0, 4)}`;
        }}
      />
    </div>
  );
};

export default CertificationLogo
