// app/(home)/layout.tsx

import AchievementsSection from "@/Components/Home/AchievementsSection";
import BlogsSection from "@/Components/Home/BlogsSection";
import CompanyLogoSection from "@/Components/Home/FeaturedByTrustedClients";
import FeedbackSection from "@/Components/Home/Feedbacks";
import ContactSection from "@/Components/Home/FooterAbove";
import CallToActionSection from "@/Components/Home/Gothacked";
import LeadershipSection from "@/Components/Home/LeaderShip";
import SolutionsSection from "@/Components/Home/SolutionsSection";
import CertificationsSection from "@/Components/Home/TeamCertifications";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {children}

      {/* This section will appear below all (home) pages */}
      <SolutionsSection />
      {/* <AchievementsSection /> */}
      {/* <CompanyLogoSection /> */}
      {/* <LeadershipSection /> */}
      {/* <CertificationsSection /> */}
      <FeedbackSection />
      <BlogsSection />
      <CallToActionSection />
      <ContactSection />
    </div>
  );
}
