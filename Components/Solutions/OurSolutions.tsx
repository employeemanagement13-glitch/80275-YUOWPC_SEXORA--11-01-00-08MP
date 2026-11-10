"use client"
import React, { useState, useMemo, useEffect } from 'react';
import BlogCard from '../SubComponents/home/BlogCard';
import LoadingCardPlaceholder from '../SubComponents/home/LoadingPlaceholder';
import { getAllSolutions } from '@/lib/data';
import Pagination from '../SubComponents/Solutions/Pagination';
import SectionHeader from '../SubComponents/SectionHeader';
import type { SolutionData } from '@/types/dataType';


// --- MAIN SOLUTIONS SECTION ---
const CARDS_PER_PAGE = 6;
const LOADING_DELAY_MS = 500; // Simulate network latency

const OurSolutions: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [solutions, setSolutions] = useState<SolutionData[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const data = await getAllSolutions();
        setSolutions(data);
      } catch (error) {
        console.error("Failed to fetch solutions", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchSolutions();
  }, []);

  const totalCards = solutions.length;
  
  // Calculate total pages dynamically
  const totalPages = Math.ceil(totalCards / CARDS_PER_PAGE);

  // Determine which solutions to display based on the current page
  const displayedSolutions = useMemo(() => {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    return solutions.slice(startIndex, endIndex);
  }, [currentPage, solutions]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setIsLoading(true);
      
      // Simulate network delay before updating content
      setTimeout(() => {
        setCurrentPage(page);
        setIsLoading(false);
      }, LOADING_DELAY_MS);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Title */}
        <SectionHeader title='Our Solutions' className='text-white pb-10' subtitleClassName='' />

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-fit"> 
          {/* min-h added to prevent layout shift during loading */}
          
          {(isLoading || initialLoading)
            ? Array.from({ length: CARDS_PER_PAGE }).map((_, index) => (
                <LoadingCardPlaceholder key={index} type='blog' />
              ))
            : displayedSolutions.map((solution, index) => (
                <BlogCard 
                  key={index} 
                  data={solution} 
                  showReadMore={true}
                />
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

export default OurSolutions;
