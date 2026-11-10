import React from 'react'

import { LogoData } from '@/types/dataType';
import Image from 'next/image';

interface LogoParams {
  logo: LogoData;
  pathway?: boolean;
  isMuted: boolean; // Flag to handle the grayscale effect for "Featured By"
  dark?: boolean | undefined;
}
const LogoComponent: React.FC<LogoParams> = ({ logo, pathway, isMuted, dark }) => {
  if (logo.imagePath) {
    // If imagePath is provided (for Featured By)
    return (
      <div className="flex items-center justify-center p-4 h-full shrink-0 w-36 sm:w-48 md:w-56">
        <Image
          src={logo.imagePath}
          alt={logo.name}
          height={100}
          width={100}
          // The filter classes mimic the grayscale and muted effect
          className={`
            h-auto w-full object-contain ${pathway ? "max-h-40" : "max-h-12"}  
            ${isMuted ? 'filter opacity-70 hover:opacity-100 transition-opacity duration-200' : ''}
            ${dark ? "max-h-72 max-w-80" : ""}
            `}
          // Fallback image in case placeholder link fails
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = `https://placehold.co/150x50/000000/FFFFFF?text=${logo.name}`;
          }}
        />
      </div>
    );
  } else {
    // Fallback to text-based logo for Trusted Clients
    return (
      <div
        className="flex items-center justify-center p-4 h-full"
        title={logo.name}
      >
        <span className={`text-xl md:text-2xl font-semibold ${logo.styleClass}`}>
          {logo.name}
        </span>
      </div>
    );
  }
};

export default LogoComponent