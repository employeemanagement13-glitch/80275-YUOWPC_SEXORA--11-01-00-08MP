"use client"
import React, { useState, useEffect, useRef } from 'react';
import SectionHeader from '../SubComponents/SectionHeader';
import { BENEFITS_DATA } from '@/lib/data';

// --- WhyJoinUsSection (Main Component) ---
const WhyJoinUsSection: React.FC = () => {
  // State to track which benefit item is currently hovered/active. 
  const [activeBenefitId, setActiveBenefitId] = useState<number>(BENEFITS_DATA[0].id);

  // Find the currently active benefit object
  const activeBenefit = BENEFITS_DATA.find(b => b.id === activeBenefitId) || BENEFITS_DATA[0];

  return (
    <section className="max-w-6xl mx-auto py-16 sm:py-24 text-white font-sans px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header Component */}
        <SectionHeader
          title="Why Join Us?"
          className="mb-12 sm:mb-20"
        />

        {/* Two-Column Interactive Grid */}
        <div className="
          grid grid-cols-1 lg:grid-cols-2 
          gap-12 lg:gap-20 
          items-start lg:items-center 
          relative 
          min-h-[400px]
        ">

          {/* Column 1: Interactive List of Benefits */}
          <div className="flex flex-col justify-between h-full space-y-4 lg:space-y-6">
            {BENEFITS_DATA.map((benefit) => {
              const isActive = benefit.id === activeBenefitId;
              return (
                <div
                  key={benefit.id}
                  // Set active benefit on hover
                  onMouseEnter={() => setActiveBenefitId(benefit.id)}
                  // Optional: Set active benefit on click for touch devices
                  onClick={() => setActiveBenefitId(benefit.id)}
                  className={`
                    group 
                    py-2 
                    w-fit
                    cursor-pointer 
                    transition-all duration-200
                  `}
                >
                  <h3 className={`
                    text-xl sm:text-2xl font-normal 
                    transition-all duration-200
                    w-fit relative
                    ${isActive
                      ? 'text-[#454648]/80'
                      : 'text-white'
                    }
                  `}>
                    {benefit.title}
                  </h3>
                  {/* Description removed as requested */}
                </div>
              );
            })}
          </div>

          {/* Column 2: Image that changes based on hover/active state */}
          <div className="
            lg:sticky 
            lg:top-24 
            w-full 
            h-full
            min-h-[300px] lg:min-h-0
          ">
            <div className="
              relative 
              w-full 
              h-full
              aspect-video lg:aspect-auto
              rounded-xl 
              overflow-hidden
              bg-[#f6f6f6] 
              border border-[#f6f6f6]
              shadow-xl
            ">
              <img
                key={activeBenefit.id} // Key forces transition/re-render when image changes
                src={activeBenefit.imagePath}
                alt={activeBenefit.alt}
                // Object-fit cover ensures the image fills the container height
                className="w-full h-full object-cover transition-opacity duration-200 opacity-90"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.onerror = null;
                  img.src = `https://placehold.co/800x600/101010/888888?text=${activeBenefit.title.replace(/\s/g, '+')}`;
                }}
              />
              {/* Overlay for aesthetic consistency */}
              <div className="absolute inset-0 bg-white/30 mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyJoinUsSection;
