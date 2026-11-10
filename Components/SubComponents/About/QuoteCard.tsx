"use client";

import React from 'react'
import { QuoteCardProps } from '@/types/dataType';
import { motion } from 'framer-motion';

const QuoteCard: React.FC<QuoteCardProps> = ({ title, content }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className="py-12 px-6 sm:px-10 max-w-4xl mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-5xl font-medium tracking-tight mb-8"
      >
        {title}
      </motion.h2>

      {/* Quote Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          ease: "easeOut"
        }}
        // whileHover={{
        //   scale: 1.02,
        //   transition: { duration: 0.3 }
        // }}
        className="
          group
          relative
          px-[15px] py-[25px] bg-[#f6f6f6] border border-[#f6f6f6]
          rounded-xl shadow-lg
        "
      >
        {/* Quote Content 
        
        hover:shadow-xl hover:shadow-black/20
          transition-shadow duration-200
          */}
        <motion.p
          className=""
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Start Quote Symbol */}

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="pl-6 block text-[18px] text-[#454648]/80"
          >
            " {content} "
          </motion.span>

        </motion.p>
      </motion.div>
    </motion.section>
  );
};

export default QuoteCard;
