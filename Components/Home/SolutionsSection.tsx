"use client";
import React, { useState, useEffect } from 'react';
import SolutionCard from './SolutionCard';
import { getSolutionCards } from '@/lib/data';
import SectionHeader from '../SubComponents/SectionHeader';
import type { SolutionCardData } from '@/types/dataType';

// --- 3. Main Section Component ---
const SolutionsSection: React.FC = () => {
  const [solutions, setSolutions] = useState<SolutionCardData[]>([]);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const data = await getSolutionCards();
        setSolutions(data);
      } catch (err) {
        console.error("Failed to fetch solution cards:", err);
      }
    };
    fetchSolutions();
  }, []);

  return (
    // Outer container with the dark background
    <section className="py-16 md:py-24 text-white w-[80vw] max-md:w-full mx-auto">
      <div className="max-w-[80vw] max-md:max-w-full mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <SectionHeader title='Solutions' subtitle='We architect autonomous AI engines, retail ERPs, and high-throughput SaaS platforms to power modern enterprise growth.' className='mb-16' subtitleClassName='headingpara' />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-12">
          {solutions.map((data, index) => (
            <SolutionCard key={index} data={data} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;