"use client";
import React from "react";
import SolutionHeader, { SolutionHeaderProps } from "../SubComponents/Solutions/SolutionHeader";
import { SecurityServicesSectionProps } from "@/types/dataType";
const SecurityServicesSection: React.FC<SecurityServicesSectionProps> = ({headerProps}) => {

  return (
    <section className="mt-20 text-white py-16 px-4 sm:px-6 lg:px-8 flex justify-center">
      <SolutionHeader {...headerProps} />
    </section>
  );
};

export default SecurityServicesSection;
