"use client";

import React from "react";
import WhyUsCard from "../SubComponents/Solutions/WhyUsCard";
import SectionHeader from "../SubComponents/SectionHeader";

interface WhyUsProps {
  title: string;
  description?: string;
  data: any[]; // Replace `any` with your own type if needed
}

const WhyUs: React.FC<WhyUsProps> = ({ title, description, data }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">

        {/* Section Header */}
        <SectionHeader title={title} className="text-[#454648] pb-10" subtitle={description} subtitleClassName='brightheadingpara' />

        {/* Cards Container:
            - uses flex (row) with wrap
            - each card is full width (w-full) so they appear as single column rows
            - gap/y spacing preserved and responsive using gap utilities
         */}
        <div className="flex flex-wrap gap-y-8 gap-x-6 w-full max-w-4xl mx-auto">
          {data.map((item, index) => (
            <div key={index} className="w-full">
              <WhyUsCard data={item} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyUs;
