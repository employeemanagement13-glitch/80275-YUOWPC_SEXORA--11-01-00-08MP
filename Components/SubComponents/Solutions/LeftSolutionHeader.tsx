"use client";

import React from "react";
import { motion } from "framer-motion";

interface LogoItem {
  src: string;
  alt: string;
}

interface LeftSolutionHeaderProps {
  title: string;
  description: string;
  complianceTitle?: string;
  logos?: LogoItem[];
}

const LeftSolutionHeader: React.FC<LeftSolutionHeaderProps> = ({
  title,
  description,
  complianceTitle,
  logos,
}) => {
  return (
    <div className="flex flex-col justify-center w-full">
      {/* Title with fade-up animation */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6 text-[#454648]"
      >
        {title}
      </motion.h1>

      {/* Description with fade-up animation */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="text-sm sm:text-base md:text-lg text-[#454648]/80 mb-10 w-fit"
      >
        {description}
      </motion.p>

      {/* Compliance title with fade-up animation */}
      {complianceTitle && (
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-lg sm:text-xl font-normal text-white mb-6"
        >
          {complianceTitle}
        </motion.h3>
      )}

      {/* Logos container with staggered children (render only if logos provided) */}
      {/* {Array.isArray((logos as any) ?? null) && (logos as any).length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex flex-wrap items-center gap-5 bg-white w-fit p-4 rounded-[15px] shadow"
        >
          {(logos ?? []).map((logo, index) => (
            <motion.img
              key={index}
              src={logo.src}
              alt={logo.alt}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.1, rotate: 2 }}
              className="h-12 sm:h-14 object-contain transition-transform duration-200 hover:scale-105"
            />
          ))}
        </motion.div>
      )} */}
    </div>
  );
};

export default LeftSolutionHeader;