"use client";

import React from 'react'
import { LocationCardProps } from '@/types/dataType';
import { motion } from 'framer-motion';

const LocationCard: React.FC<LocationCardProps & { index?: number }> = ({ 
  name, 
  imageUrl, 
  altText, 
  onClick, 
  isSelected,
  index = 0
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.5,
      delay: index * 0.1,
      type: "spring",
      stiffness: 100
    }}
    // whileHover={{ 
    //   scale: 1.05,
    //   transition: { duration: 0.3 }
    // }}
    whileTap={{ scale: 0.95 }}
    className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${isSelected ? 'scale-105' : ''}`}
    onClick={onClick}
  >
    {/* Image Container with rounded corners and overflow hidden */}
    <motion.div
      animate={{ 
        borderColor: isSelected ? 'rgba(255, 255, 255, 1)' : 'rgba(38, 38, 38, 1)',
        // scale: isSelected ? 1.1 : 1
      }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 200
      }}
      className={`
        w-32 h-40 sm:w-36 sm:h-48 md:w-44 md:h-58 lg:w-52 lg:h-64 xl:w-60 xl:h-72
        rounded-xl overflow-hidden 
        shadow-lg 
        transform transition-transform duration-200 
        border-2 ${isSelected ? 'border-white' : 'border-[#f6f6f6]'}
      `}
    >
      <motion.img
        src={imageUrl}
        alt={altText}
        // initial={{ scale: 1 }}
        // whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full object-cover"
        draggable={false}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "https://placehold.co/600x600/1a1a1a/cccccc?text=Location";
          target.style.filter = 'grayscale(100%)';
        }}
      />
    </motion.div>
    
    {/* Location Name */}
    <motion.p 
      animate={{ 
        color: isSelected ? '#ffffff' : '#d4d4d4',
        scale: isSelected ? 1.05 : 1
      }}
      transition={{ duration: 0.3 }}
      className={`text-lg sm:text-xl font-medium mt-4 transition-colors duration-200`}
    >
      {name}
    </motion.p>
  </motion.div>
);

export default LocationCard;
