import React from 'react'
import { LeaderCardProps } from '@/types/dataType';
import Image from 'next/image';
const LeaderCard: React.FC<LeaderCardProps> = ({ data }) => {
  const { name, title, imagePath, linkedinUrl } = data;

  return (
    // Set card width explicitly and add right margin for spacing
    <div className="flex flex-col items-start text-center p-4 shrink-0 w-40 sm:w-60 md:w-80 lg:w-96 mr-4">
      {/* Image Container: Aspect ratio 1:1, cropped and rounded */}
      <div className="w-[280px] h-[350px] max-md:w-[200px] max-md:h-[250px] max-sm:w-[150px] max-sm:h-[200px] aspect-square overflow-hidden rounded-xl shadow-xl border border-white/5 mb-6">
        <img
          src={imagePath}
          alt={`Portrait of ${name}`}
          className="w-full h-full object-cover transform transition-transform duration-200 hover:scale-[1.03]"
          // Placeholder Fallback Image
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null; 
            (e.target as HTMLImageElement).src = `https://placehold.co/500x500/1e293b/ffffff?text=${name.replace(' ', '+')}`;
          }}
        />
      </div>

      <h3 className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-white mb-1">
        {name}
      </h3>
      <p className="text-lg max-md:text-base max-sm:text-sm text-[#454648]/70 mb-3">
        {title}
      </p>

      {/* LinkedIn Link */}
      <a 
        href={linkedinUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-500 hover:text-blue-400 transition-colors duration-200"
        aria-label={`LinkedIn profile for ${name}`}
      >
        <Image src={`/home/linkedin.png`} alt='Linkedin' height={30} width={30} className='rounded-[3px]' />
      </a>
    </div>
  );
};

export default LeaderCard
