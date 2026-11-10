"use client";

import React from 'react'
import { PaginationProps } from '@/types/dataType';
import { motion } from 'framer-motion';

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center space-x-3 mt-12"
    >
      {pageNumbers.map((number, index) => (
        <motion.button
          key={number}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.3,
            delay: index * 0.05,
            type: "spring",
            stiffness: 200
          }}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPageChange(number)}
          className={`
            w-10 h-10 rounded-lg font-medium text-lg transition-colors duration-200 cursor-pointer
            ${number === currentPage 
              ? 'bg-[#225e4d] text-white shadow-lg shadow-[#225e4d]/30' 
              : 'bg-[#f6f6f6] text-[#454648]/70 hover:bg-[#eaeaea] hover:text-[#225e4d]'
            }
          `}
        >
          {number}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default Pagination;