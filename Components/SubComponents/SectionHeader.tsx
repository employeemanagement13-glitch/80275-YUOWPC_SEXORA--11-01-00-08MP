'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  subtitleClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  className = "", 
  subtitleClassName = "",
  as = 'h2'
}) => {
  const HeadingTag = as === 'h1' ? motion.h1 : as === 'h3' ? motion.h3 : motion.h2;

  return (
    <div className={`text-center ${className}`}>
      <HeadingTag
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
        className="heading tracking-tight"
      >
        {title}
      </HeadingTag>
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className={subtitleClassName}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeader;