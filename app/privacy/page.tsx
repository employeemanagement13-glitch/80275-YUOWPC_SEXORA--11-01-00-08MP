import PrivacySubComponent from "@/Components/privacy/PrivacySubComponent";
import { PrivacyItem } from "@/Components/privacy/PrivacySubItem";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Aroxes",
  description:
    "Aroxes' enterprise privacy policy: what data we collect, how it's used and retained, and your rights as a business contact.",
  openGraph: {
    title: "Privacy Policy | Aroxes",
    description:
      "Aroxes' enterprise privacy policy: what data we collect, how it's used and retained, and your rights as a business contact.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Aroxes",
    description:
      "Aroxes' enterprise privacy policy: what data we collect, how it's used and retained, and your rights as a business contact.",
  },
};

export default function PrivacyPage() {
  const data: PrivacyItem[] = [
    {
      variant: "list",
      title: "Personal Data We Collect About You",
      bullets: [
        "Identity & contact details: full name, professional email address, phone number, company name, and job title.",
        "Project & proposal details: technical specifications, workflow bottlenecks, and project requirements shared via our 'Get a Quote' or contact forms.",
        "Consultation data: meeting details and technical context captured when scheduling architecture reviews or product demos via Calendly.",
        "Usage & interaction data: page visits, device telemetry, referral paths, and feature interactions captured via essential web technologies and analytics.",
        "Public business info: publicly available enterprise details used strictly to contextualize your inquiry before our initial consultation."
      ],
    },
    {
      variant: "highlight",
      title: "Important Note",
      subtitle: "Children's Privacy",
      content: "Our services and platforms are designed exclusively for business enterprises. We do not knowingly collect personal data from individuals under 16 years of age. If you believe a minor has submitted personal information through our site, please notify us immediately so we can remove it.",
    },
    {
      variant: "list",
      title: "Scope of This Policy",
      bullets: [
        "Applies exclusively to Aroxes' corporate website and public digital touchpoints.",
        "Client platform deployments, custom SaaS environments, and ERP integrations are governed by dedicated Master Services Agreements (MSA) and Data Processing Agreements (DPA).",
        "Third-party tools (e.g., embedded demo links or Calendly booking flows) operate under their respective corporate privacy policies.",
      ],
    },
    {
      variant: "table",
      title: "How and Why We Process Your Data",
      subtitle: "We process personal data transparently and solely for defined business objectives.",
      rows: [
        {
          left: "Architectural Consultation & Scoping",
          right: "Legitimate interest — to evaluate project requirements, build custom technical proposals, and deliver requested consultations.",
        },
        {
          left: "SaaS & ERP Contract Delivery",
          right: "Contractual necessity — to provision accounts, fulfill service commitments, and provide ongoing technical support.",
        },
        {
          left: "Platform Optimization & Security",
          right: "Legitimate interest — to protect our digital infrastructure, diagnose performance bottlenecks, and refine website usability.",
        },
      ],
    },
    {
      variant: "highlight",
      title: "Enterprise Communications & Updates",
      subtitle: "Direct, high-value insights tailored to your industry.",
      content: "We may send tech briefings, Agentic AI benchmarks, or product updates under our <strong>legitimate interest</strong> to help your business scale. You can opt out at any time using the unsubscribe link in any email.",
    },
    {
      variant: "list",
      title: "Data Distribution & Third Parties",
      bullets: [
        "Enterprise infrastructure partners (e.g., AWS, Azure, GCP) supporting our cloud deployments.",
        "Essential operational integrations (e.g., CRM systems, Calendly, direct communication tools).",
        "Legal counsel, auditors, and professional advisors bound by strict confidentiality.",
        "Regulatory bodies or law enforcement authorities when strictly required by applicable law.",
      ],
    },
    {
      variant: "table",
      title: "Data Retention Schedule",
      subtitle: "We store data only for as long as necessary to fulfill its original operational purpose.",
      rows: [
        {
          left: "Proposal Requests & Inquiries",
          right: "Up to 24 months from last interaction | Maintained to contextualize repeat consultations and pipeline reviews."
        },
        {
          left: "Consultation Bookings (Calendly)",
          right: "Up to 24 months from appointment date | Maintained for scheduling history, follow-up notes, and project continuity."
        },
        {
          left: "Client Agreements & Financial Records",
          right: "Up to 7 years following contract completion | Required for accounting, tax compliance, and legal limitation periods."
        },
        {
          left: "Suppression / Opt-Out Records",
          right: "Indefinitely (minimal dataset) | Retained solely to ensure your marketing opt-out preferences are permanently respected."
        }
      ],
    },
    {
      variant: "highlight",
      title: "International Data Transfers",
      subtitle: "Global data protection standards across all operations.",
      content: "To support global enterprise operations, your data may be processed in region-specific cloud infrastructure. We ensure all cross-border data transfers comply with statutory regulations through Standard Contractual Clauses (SCCs), UK/EU adequacy decisions, or equivalent legally recognized safeguards.",
    },
    {
      variant: "list",
      title: "Cookies & Performance Tracking",
      bullets: [
        "Essential cookies: mandatory for site navigation, session security, and basic platform features.",
        "Performance cookies: help us measure traffic patterns, detect sub-second performance delays, and improve usability.",
        "Consent management: non-essential cookies require explicit consent via our banner and can be adjusted at any time.",
        // "Refer to our full Cookie Policy for detailed breakdown of cookie categories, providers, and expiration terms."
      ],
    },
    {
      variant: "highlight",
      title: "Data Protection & Security Infrastructure",
      subtitle: "Enterprise-Grade Controls",
      content: "We enforce robust administrative, physical, and technical safeguards—including TLS encryption in transit, AES encryption at rest, strict access hierarchies, environment hardening, and continuous monitoring. While no digital system can offer absolute immunity, we continually stress-test our defenses to mitigate operational risk. In the event of a verified data incident, we will inform affected users and supervisory bodies in full accordance with statutory timelines.",
    },
    {
      variant: "list",
      title: "Your Rights & Regulatory Recourse",
      bullets: [
        "You hold the right to access, rectify, port, or request erasure of your personal data at any time.",
        "To exercise your privacy rights or discuss our data governance practices, contact our Privacy Team directly at privacy@aroxes.com.",
      ],
    },
    {
      variant: "highlight",
      title: "Policy Updates",
      subtitle: "Continuous Governance",
      content: "We periodically review this policy to reflect evolving legal standards and software capabilities. Significant updates will be highlighted directly on this page and, where appropriate, communicated to primary client contacts.",
    },
  ] as const;


  return (
    <PrivacySubComponent
      title=""
      description=""
      data={data}
    />
  );
}
