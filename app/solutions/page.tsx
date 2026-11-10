import type { Metadata } from 'next';
import FAQSection from '@/Components/Solutions/FAQs';
import OurMethodology from '@/Components/Solutions/Methodology';
import OurSolutions from '@/Components/Solutions/OurSolutions';
import SecurityServicesSection from '@/Components/Solutions/SecurityServicesSection';
import WhyUs from '@/Components/Solutions/WhyUs';

import { headerProps, whyUsData } from "@/lib/data";

export const metadata: Metadata = {
  title: 'Solutions | Autonomous AI, ERP & Vertical SaaS',
  description:
    'Explore Aroxes domain-specific enterprise solutions across autonomous AI workflows, customized distribution ERPs, high-throughput SaaS platforms, and secure infrastructure.',
  openGraph: {
    title: 'Enterprise Solutions | Autonomous AI, ERP & Vertical SaaS | Aroxes',
    description:
      'Explore Aroxes domain-specific enterprise solutions across autonomous AI workflows, customized distribution ERPs, high-throughput SaaS platforms, and secure infrastructure.',
    url: 'https://aroxes.com/solutions',
  },
  alternates: { canonical: 'https://aroxes.com/solutions' },
};

const page = () => {
  return (
    <main className="h-fit p-0 m-0 box-border">
      <SecurityServicesSection headerProps={headerProps} />
      <OurSolutions />

      {/* WHY US - NOW FULLY DYNAMIC */}
      <WhyUs
        title="Why Us?"
        data={whyUsData}
      />

      <OurMethodology />
      <FAQSection />
    </main>
  );
};

export default page;
