"use client"
import React, { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import BlogCard from '../SubComponents/home/BlogCard';
import { getBlogPosts } from '@/lib/data';
import NavigationArrows from '../SubComponents/home/NavigationArrows';
import type { BlogData } from '@/types/dataType';
import LoadingCardPlaceholder from '../SubComponents/home/LoadingPlaceholder';
import SectionHeader from '../SubComponents/SectionHeader';

// --- Custom CSS for Staggered Fade-in Animation ---
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-staggered-fade {
    animation: fadeInUp 0.5s ease-out forwards;
  }
  
  /* Skeleton Loading Animation */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .animate-pulse-slow {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;


// --- 5. Main Blogs Section Component ---
const BlogsSection: React.FC = () => {
    const CARDS_PER_PAGE = 2;

    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [blogPosts, setBlogPosts] = useState<BlogData[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);

    React.useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await getBlogPosts();
                setBlogPosts(data);
            } catch (error) {
                console.error("Failed to fetch blog posts", error);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const TOTAL_PAGES = Math.ceil(blogPosts.length / CARDS_PER_PAGE);

    // Calculate the slice of posts to display
    const currentPosts = blogPosts.slice(
        currentPage * CARDS_PER_PAGE,
        (currentPage + 1) * CARDS_PER_PAGE
    );

    // Simulated data fetching function
    const scroll = useCallback((direction: 'next' | 'prev') => {
        let newPage = currentPage;

        if (direction === 'next' && currentPage < TOTAL_PAGES - 1) {
            newPage = currentPage + 1;
        } else if (direction === 'prev' && currentPage > 0) {
            newPage = currentPage - 1;
        } else {
            return; // Boundary reached
        }

        // 1. Start loading animation
        setIsLoading(true);

        // 2. Simulate network delay
        setTimeout(() => {
            // 3. Update page index
            setCurrentPage(newPage);
            // 4. End loading animation
            setIsLoading(false);
        }, 700); // 700ms delay for fetching simulation

    }, [currentPage, TOTAL_PAGES]);

    return (
        // Outer container with the dark background
        <section className="py-16 md:py-24 text-white font-sans w-[80vw] max-sm:w-full max-md:w-[90vw] mx-auto">
            {/* Inject custom CSS for animation keyframes */}
            <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

            {/* Max width adjusted to comfortably fit 2 cards on desktop */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <SectionHeader title="Blogs" subtitle='Explore enterprise software insights, Agentic AI benchmarks, and real-world SaaS case studies. Stay ahead with deep dives into retail ERP automation, Gen AI orchestration, and high-throughput architecture.' className='mb-16' subtitleClassName='headingpara' />

                {/* Slider/Grid Container: Force two cards to show, hide overflow */}
                <div className="relative max-w-5xl mx-auto">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-12">

                        {/* Conditional Rendering: Show Loading or Cards */}
                        {(isLoading || initialLoading) ? (
                            <>
                                <LoadingCardPlaceholder />
                                <LoadingCardPlaceholder />
                            </>
                        ) : (
                            currentPosts.map((data, index) => (
                                <BlogCard
                                    key={data.id}
                                    data={data}
                                    // Apply fade-in effect only after loading completes
                                    className="opacity-0 animate-staggered-fade"
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                />
                            ))
                        )}
                    </div>

                    <NavigationArrows
                        onPrev={() => scroll("prev")}
                        onNext={() => scroll("next")}
                        PrevIcon={ArrowLeft}
                        NextIcon={ArrowRight}
                        prevDisabled={currentPage === 0 || isLoading}
                        nextDisabled={currentPage >= TOTAL_PAGES - 1 || isLoading}
                        showSeparator={true}
                        align="end"
                    />

                </div>
            </div>
        </section>
    );
};

export default BlogsSection;