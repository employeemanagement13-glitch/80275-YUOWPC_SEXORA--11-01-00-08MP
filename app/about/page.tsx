import type { Metadata } from 'next';
import AboutUsScrollSection from '@/Components/About/AboutHeader';
import CoreValuesSection from '@/Components/About/CoreValues';
import GlobalPartners from '@/Components/About/GlobalPartners';
import GlobalPresenceSection from '@/Components/About/GlobalPresence';
import MissionVisionSection from '@/Components/About/MissionVision';
import LeadershipSection from '@/Components/Home/LeaderShip';
import { coreValues } from "@/lib/data";

export const metadata: Metadata = {
  title: 'About Aroxes | Our Mission, Vision & Engineering Team',
  description:
    'Learn about Aroxes — our mission to engineer autonomous AI systems, high-throughput ERPs, and vertical SaaS platforms, our leadership team, and global enterprise reach.',
  openGraph: {
    title: 'About Aroxes | Our Mission, Vision & Engineering Team',
    description:
      'Learn about Aroxes — our mission to engineer autonomous AI systems, high-throughput ERPs, and vertical SaaS platforms, our leadership team, and global enterprise reach.',
    url: 'https://aroxes.com/about',
  },
  alternates: { canonical: 'https://aroxes.com/about' },
};

const coreValueswithTitle = {
  title: "Core Values",
  para: "The principles that shape our identity and drive our work",
  coreValues: coreValues,
};

const page = () => {
  return (
    <main className='h-fit p-0 m-0 box-border'>
      <AboutUsScrollSection />
      <MissionVisionSection />
      <CoreValuesSection {...coreValueswithTitle} />
      {/* <GlobalPartners /> */}
      {/* <GlobalPresenceSection /> */}
      {/* <LeadershipSection /> */}
    </main>
  );
};

export default page;