"use client"
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import TestimonialCard from '../SubComponents/home/TestimonialCard';
import { testimonialCardsData } from '@/lib/data';
import NavigationArrows from '../SubComponents/home/NavigationArrows';
import SectionHeader from '../SubComponents/SectionHeader';

// --- Custom CSS for Animation Keyframes ---
// Changed to slide from right to left
const animationStyles = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      /* Starts 40px to the right */
      transform: translateX(40px); 
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .animate-slideInRight {
    animation: slideInRight 0.5s ease-out forwards;
  }
`;

// --- 4. Main Feedback Section Component ---
const FeedbackSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalItems = testimonialCardsData.length;

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
    };

    return (
        // Outer container with the dark background matching the overall scheme
        <section className="py-16 md:py-24 text-white font-sans">
            {/* Inject custom CSS for animation keyframes */}
            <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

            {/* Main content container. Retained items-center for centering the entire section block relative to the viewport. */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">

                {/* Header Section */}

                <SectionHeader title="Feedbacks" subtitle='We are trusted by numerous companies across diverse industries to meet their needs.' className='mb-16' subtitleClassName='headingpara' />

                {/* Testimonial Slider Content */}
                {/* Changed items-center back to items-start for left alignment of the card/arrows */}
                <div className='flex justify-start w-[70%] max-md:w-full'>
                    <div className="relative flex flex-col items-start max-w-full">
                        <div className="w-full" key={currentIndex}>
                            {/* The new right-to-left animation class is applied here */}
                            <div className="animate-slideInRight">
                                <TestimonialCard data={testimonialCardsData[currentIndex]} />
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        {/* Changed justify-center back to justify-start and added margin-left to align with the card text block */}
                        <NavigationArrows
                            onPrev={handlePrev}
                            onNext={handleNext}
                            PrevIcon={ArrowLeft}
                            NextIcon={ArrowRight}
                            align="start"
                        />

                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeedbackSection;