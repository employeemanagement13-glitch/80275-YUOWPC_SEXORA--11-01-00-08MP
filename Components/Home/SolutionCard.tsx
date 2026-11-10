// components/Home/SolutionCard.tsx - ADD THIS AT THE TOP
'use client';

import React from 'react'
import { SolutionCardProps } from '@/types/dataType';
import Link from 'next/link';
import { motion } from 'framer-motion';

const SolutionCard: React.FC<SolutionCardProps> = ({ data, index = 0 }) => {
  const { title, href, description, visualIcon } = data;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1
      }}
      className="group flex flex-col justify-between rounded-xl overflow-hidden shadow-lg transition-all duration-200 ease-in-out bg-[#f6f6f6] border border-[#f6f6f6] hover:bg-white transform hover:-translate-y-1"
    >
      <Link 
        href={`${href || '#'}`} 
        className="flex flex-col justify-between h-full w-full"
      >
        {/* Text Content Area */}
        <div className="p-6 sm:p-8 grow flex flex-col">
          <h3 className="text-xl sm:text-2xl font-medium text-[#454648] mb-3 sm:mb-4">
            {title}
          </h3>
          <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#454648]/80">
            {description}
          </p>
        </div>

        {/* Visual / Image Area */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 mt-auto w-full">
          <div className="relative w-full h-52 sm:h-60 md:h-64 overflow-hidden rounded-xl bg-[#f6f6f6]">
            {visualIcon ? (
              <img
                src={visualIcon}
                alt={title}
                className="w-full h-full object-cover object-center rounded-xl transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-[#f6f6f6]">
                <span>{title}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default SolutionCard;
