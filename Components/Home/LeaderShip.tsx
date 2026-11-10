"use client";
import React, { useRef } from "react";
import LeaderCard from "../SubComponents/home/LeaderCard";
import { leaderCardsData } from "@/lib/data";
import SectionHeader from "../SubComponents/SectionHeader";

// --- Custom CSS for Hiding Scrollbar ---
const scrollbarHideStyles = `
  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
      display: none;
  }
  /* Hide scrollbar for IE and Edge */
  .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }
`;

const LeadershipSection: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 md:py-24 text-white font-sans">
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyles }} />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader title="Global Leadership" />

        {/* Horizontal Scroll (NO DRAG) */}
        <div
          ref={scrollerRef}
          dir="ltr"
          className="flex overflow-x-auto no-scrollbar pl-[40%] whitespace-nowrap py-4 w-full"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Small left padding block */}
          <div className="shrink-0 w-8 md:w-16"></div>

          {/* Cards */}
          {leaderCardsData.map((data, index) => (
            <LeaderCard key={index} data={data} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
