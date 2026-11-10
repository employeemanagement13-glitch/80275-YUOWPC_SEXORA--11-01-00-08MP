"use client";

import React from "react";
import PrivacySubItem, {PrivacyItem} from "./PrivacySubItem";

interface PrivacySubComponentProps {
  title: string;
  description?: string;
  data: PrivacyItem[];
}

const PrivacySubComponent: React.FC<PrivacySubComponentProps> = ({
  title,
  description,
  data,
}) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[90vw] mx-auto">

        {/* Section Header */}
        <h2 className="heading text-center pb-4">{title}</h2>

        {description && (
          <p className="headingpara text-center pb-12">{description}</p>
        )}

        {/* Cards Stack */}
        <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
          {data.map((item, index) => (
            <PrivacySubItem key={index} data={item} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PrivacySubComponent;
