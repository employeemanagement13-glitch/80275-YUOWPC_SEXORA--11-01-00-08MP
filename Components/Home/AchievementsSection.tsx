'use client';

import React from 'react';
import { AchievementCardProps } from '@/types/dataType';
import { AchievementsCards } from '@/lib/data';
import SectionHeader from '../SubComponents/SectionHeader';
import { motion } from 'framer-motion';

const AchievementCard: React.FC<AchievementCardProps & { index?: number }> = ({ data, index = 0 }) => {
  const { value, description, offsetClass } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1
      }}
      className={`rounded-xl py-8 px-6 sm:px-8 sm:py-12 border border-[#f6f6f6] transition-colors duration-200 group ${offsetClass}`}
    >
      <motion.h3 
        className="text-5xl font-medium text-white mb-2"
        initial={{ opacity: 0.8 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
      >
        {value}
      </motion.h3>
      <motion.p 
        className="text-xl font-light text-[#ededed]"
        initial={{ opacity: 0.8 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

// --- 3. Main Achievements Section Component ---
const AchievementsSection: React.FC = () => {

  return (
    // Outer container with the dark background
    <section className="w-[80vw] mx-auto py-16 md:py-24 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionHeader 
            title='Achievements' 
            subtitle='We secure, monitor, and fortify your digital world, with full transparency and intelligence in every layer.' 
            className='mb-16' 
            subtitleClassName='headingpara' 
          />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:items-start">
          {AchievementsCards.map((data, index) => (
            <AchievementCard 
              key={index} 
              data={data} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
