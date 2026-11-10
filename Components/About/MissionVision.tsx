import React from 'react';
import QuoteCard from '../SubComponents/About/QuoteCard';
import { missionContent, visionContent } from '@/lib/data';

// Main section component that uses the QuoteCard twice
// Changed return type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error
export default function MissionVisionSection(): React.ReactElement {

  return (
    <div className="text-[#454648] font-sans py-20 md:py-32">
      {/* Our Mission Section */}
      <QuoteCard
        title="Our Mission"
        content={missionContent}
      />

      {/* Our Vision Section */}
      <QuoteCard
        title="Our Vision"
        content={visionContent}
      />
    </div>
  );
}