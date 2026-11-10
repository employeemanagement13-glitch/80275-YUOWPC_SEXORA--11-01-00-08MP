"use client";

import React from "react";
import { WhyUsCardProps } from "@/types/dataType";
import { motion } from "framer-motion";

const WhyUsCard: React.FC<WhyUsCardProps & { index?: number }> = ({ data, index = 0 }) => {
  const { title, description, bullets, desc } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      // hover:shadow-lg hover:shadow-blue-500/5
      className="
        w-full
        p-6 sm:p-8 md:p-10
        cardBackground
        rounded-xl
        transition-shadow duration-200
      "
    >
      {/* Title with fade animation */}
      <motion.h3 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
        className="text-lg sm:text-[22px] md:text-[28px] font-semibold text-[#454648] mb-4"
      >
        {title}
      </motion.h3>

      {/* Content: Conditional rendering based on the 'bullets' prop */}
      {bullets && bullets.length > 0 ? (
        // Renders bullets with staggered animation
        <motion.ul 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          className="list-disc ml-5 space-y-2 text-[#454648]/75 text-sm sm:text-[16px]"
        >
          {bullets.map((bullet, bulletIndex) => (
            <motion.li 
              key={bulletIndex} 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.3,
                delay: 0.4 + (index * 0.1) + (bulletIndex * 0.1),
                ease: "easeOut"
              }}
              className="wrap-break-word"
            >
              {bullet}
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        // Renders description text with fade animation
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          className="text-sm sm:text-[16px] text-[#454648]/75"
        >
          {description || desc}
        </motion.p>
      )}
    </motion.div>
  );
};

export default WhyUsCard;
