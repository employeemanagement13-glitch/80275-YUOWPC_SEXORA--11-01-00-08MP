"use client"
import React from 'react';
import { certificationCardsData } from '@/lib/data';
import CertificationLogo from '../SubComponents/home/CertificationLogo';
import SectionHeader from '../SubComponents/SectionHeader';

// --- 3. Main Certifications Section Component ---
const CertificationsSection: React.FC = () => {

  return (
    // Outer container with the white background
    <section className="bg-white py-16 md:py-24 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}

        <SectionHeader title="Team's Certifications" subtitle='Our team holds industry-recognised certifications, ensuring the highest standards of expertise and excellence.' className='mb-16' subtitleClassName='brightheadingpara' />

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 max-w-5xl mx-auto justify-items-center">
          {certificationCardsData.map((data, index) => (
            <CertificationLogo key={index} data={data} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;