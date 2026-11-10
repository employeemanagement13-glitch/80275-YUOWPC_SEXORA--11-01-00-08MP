"use client"
import React from 'react';
import { featuredByLogos, trustedClientsData } from '@/lib/data';
import TrustedClients from './TrustedClients';
import ImageSlider from '../SubComponents/ImageSlider';

// --- Custom CSS for Infinite Scroller ---
const infiniteScrollStyles = `
  /* Keyframes for Leftward Scroll */
  @keyframes scrollLeft {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  /* Keyframes for Rightward Scroll */
  @keyframes scrollRight {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }

  /* Base classes for the scrolling container */
  .scroller-left {
    animation: scrollLeft 40s linear infinite;
  }
  .scroller-right {
    animation: scrollRight 40s linear infinite;
  }
`;

// --- 4. Main Component for the Two Sections ---
const CompanyLogoSection: React.FC = () => {

  return (
    // Outer container with the dark background
    <section className="bg-white py-16 md:py-24 text-white font-sans">
      {/* Inject custom CSS for keyframes */}
      <style dangerouslySetInnerHTML={{ __html: infiniteScrollStyles }} />

      {/* --- Section 1: Featured By (Infinite Scroller) --- */}
      {/* <ImageSlider title='Featured By' des="As leaders in penetration testing, we're often featured as cybersecurity experts by top media outlets. Below are just a few of these articles, prominently featuring our pentesting security research." group={featuredByLogos}
        dark={false}
        /> */}
      {/* --- Section 2: Trusted Clients (Static Grid) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustedClients group={trustedClientsData} />
      </div>
    </section>
  );
};


export default CompanyLogoSection;