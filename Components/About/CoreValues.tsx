"use client";

import React from "react";
import ValueCard from "../SubComponents/About/ValueCard";
import { CoreValue } from "@/types/dataType";
import SectionHeader from "../SubComponents/SectionHeader";

interface CorevaluesInterface {
  title: string;
  para: string;
  coreValues: CoreValue[];
}

const CoreValuesSection: React.FC<CorevaluesInterface> = ({
  title,
  para,
  coreValues,
}) => {
  return (
    <section className="py-16 sm:py-24 text-[#454648] mx-auto font-sans px-4 w-full max-w-6xl">
      <div className="w-full">

        {/* Header Section */}
        <SectionHeader title={title} subtitle={para} className='mb-12 sm:mb-16' subtitleClassName='headingpara mx-auto' />

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {coreValues.map((value, index) => (
            <ValueCard
              key={index}
              title={value.title}
              description={value?.desc || value.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
