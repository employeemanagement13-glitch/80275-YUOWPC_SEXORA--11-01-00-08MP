"use client";

import React, { useState } from "react";
// Removed unused lucide icons
import { faqData } from "@/lib/data";
import FAQItem from "../SubComponents/Solutions/Faqitem";
import SectionHeader from "../SubComponents/SectionHeader";

// --- MAIN FAQ SECTION ---
const FAQSection: React.FC = () => {
  // Keep the first item open by default (guard for empty array)
  const defaultOpenId = faqData?.[0]?.id ?? null;
  const [openId, setOpenId] = useState<number | null>(defaultOpenId);

  const handleToggle = (id: number) => {
    // If the clicked item is already open, close it (set to null), otherwise open the new one
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <SectionHeader title="FAQ's" className="text-[#454648] pb-8 sm:pb-10" subtitleClassName='brightheadingpara' />

        {/* FAQ List */}
        <div className="mt-6 sm:mt-8">
          {faqData.map((item) => (
            <FAQItem
              key={item.id}
              data={item}
              isOpen={openId === item.id}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
