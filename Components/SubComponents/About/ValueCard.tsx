"use client";

import React from "react";
import { motion } from "framer-motion";

interface ValueCardProps {
  title: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

const ValueCard: React.FC<ValueCardProps> = ({
  title,
  description,
  className = "",
  style = {},
  index = 0,
}) => {
  const CardContent = () => (
    <div className="flex flex-col h-full">
      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 + (index * 0.1) }}
        className="text-[16px] sm:text-[20px] md:text-[26px] font-semibold text-[#454648] mb-4"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
        className="text-sm sm:text-[16px] text-[#454648]/70"
      >
        {description}
      </motion.p>
    </div>
  );

  // If href is provided, wrap in <a> for clickable card
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
        y: -5,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className={`
        p-6 sm:p-8
        rounded-2xl
        shadow-lg
        border border-[#eaeaea]
        bg-[#f6f6f6]
        transition-all duration-200 ease-in-out
        overflow-hidden
        ${className}
      `}
      style={style}
    >
      <CardContent />
    </motion.div>
  );
};

export default ValueCard;
