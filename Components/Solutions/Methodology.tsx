"use client"
import React, { useState, useMemo } from 'react';
import WhyUsCard from '../SubComponents/Solutions/WhyUsCard';
import Pagination from '../SubComponents/Solutions/Pagination';
import { methodologyData } from '@/lib/data';
import LoadingCardPlaceholder from '../SubComponents/home/LoadingPlaceholder';
import SectionHeader from '../SubComponents/SectionHeader';


// --- MAIN METHODOLOGY SECTION ---
const CARDS_PER_PAGE = 3;
const LOADING_DELAY_MS = 500; // Simulated delay for loading state

const OurMethodology: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalCards = methodologyData.length;
  
  const totalPages = Math.ceil(totalCards / CARDS_PER_PAGE);

  const displayedSteps = useMemo(() => {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    return methodologyData.slice(startIndex, endIndex);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setIsLoading(true);

      // Simulate network delay
      setTimeout(() => {
        setCurrentPage(page);
        setIsLoading(false);
      }, LOADING_DELAY_MS);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <SectionHeader title='Our Methodology' subtitle='' className='text-white pb-10' subtitleClassName=''/>

        {/* Cards Stack */}
        <div className="flex flex-col space-y-8 min-h-fit"> 
          {/* min-h ensures the section height remains stable during loading */}
          
          {isLoading
            ? Array.from({ length: CARDS_PER_PAGE }).map((_, index) => (
                <LoadingCardPlaceholder key={index} type='solution' />
              ))
            : displayedSteps.map((item, index) => (
                <WhyUsCard key={index} data={item} />
              ))}
        </div>

        {/* Pagination */}
        <Pagination 
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

      </div>
    </section>
  );
};

export default OurMethodology;
