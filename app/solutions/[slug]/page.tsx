import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SecurityServicesSection from "@/Components/Solutions/SecurityServicesSection";
import WhyUs from "@/Components/Solutions/WhyUs";
import BulletsInSection from "@/Components/Solutions/BulletsInSection";
import CoreValuesSection from "@/Components/About/CoreValues";
import { getSolutionBySlug } from "@/lib/queries";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { SolutionHeaderProps } from "@/Components/SubComponents/Solutions/SolutionHeader";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const { data } = await supabaseAdmin
      .from("solutions")
      .select("slug")
      .not("slug", "is", null);
    return (data ?? []).map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = await getSolutionBySlug(slug);

  if (!solution) {
    return {
      title: "Solution Not Found",
      description: "The requested enterprise solution could not be found.",
    };
  }

  const title = solution.title || solution.headtitle || solution.name || "Enterprise Solution";
  const description =
    solution.description ||
    solution.headerdesc ||
    "Custom enterprise software and Agentic AI solution engineered by Aroxes.";
  const canonicalUrl = `https://aroxes.com/solutions/${slug}`;
  const ogImage = solution.banner_image || "/home/founder.jpeg";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Aroxes`,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Aroxes`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  // 🔥 FETCH SOLUTION FROM DATABASE
  const solution = await getSolutionBySlug(slug);

  if (!solution) return notFound();

  // 🔥 BUILD HEADER PROPS FOR COMPONENT
  const headerProps: SolutionHeaderProps = {
    title: solution.headtitle ?? "",
    description: solution.headerdesc ?? "",
    complianceTitle: "Meets Compliance Framework Regulations",
    logos: [
      { src: "/home/certifications/crest.png", alt: "CREST Certification" },
      { src: "/home/certifications/pentest.png", alt: "Pentest Certification" },
      { src: "/home/certifications/comptia.png", alt: "CompTIA PenTest+" },
    ],
    formHeading: solution.formtitle ?? "",
    formParagraph: solution.formdesc ?? "",
    checkboxtitle: solution.checkboxtitle ?? "",
    checkboxOptions: solution.formcheckboxes ?? [],
    solutionSlug: solution.slug,
    solutionTitle: solution.title || solution.name || solution.headtitle || "",
  };

  const solutionTitle = solution.title || solution.headtitle || solution.name || "Enterprise Solution";
  const solutionDescription =
    solution.description ||
    solution.headerdesc ||
    "Custom enterprise software and Agentic AI solution engineered by Aroxes.";
  const canonicalUrl = `https://aroxes.com/solutions/${slug}`;
  const ogImage = solution.banner_image || "https://aroxes.com/home/founder.jpeg";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: solutionTitle,
    description: solutionDescription,
    provider: {
      "@type": "Organization",
      name: "Aroxes",
      url: "https://aroxes.com",
    },
    serviceType: "Enterprise Software & AI Development",
    areaServed: ["Global", "US", "PK", "GB", "AE"],
    url: canonicalUrl,
    image: ogImage,
  };

  const faqItems = Array.isArray(solution.whydoyouneed)
    ? solution.whydoyouneed
        .filter((item: any) => item && (item.title || item.question) && (item.desc || item.description || item.answer))
        .map((item: any) => ({
          "@type": "Question",
          name: item.title || item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.desc || item.description || item.answer,
          },
        }))
    : [];

  const faqSchema = faqItems.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems,
      }
    : null;

  return (
    <main className="h-fit p-0 m-0 box-border">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 HEADER SECTION */}
      {/* ----------------------------------------- */}
      <SecurityServicesSection headerProps={headerProps} />

      {/* ----------------------------------------- */}
      {/* 🔥 WHY DO YOU NEED */}
      {/* ----------------------------------------- */}
      {solution.whydoyouneed?.length > 0 && (
        <WhyUs title="Why Do You Need" data={solution.whydoyouneed} />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 BENEFITS */}
      {/* ----------------------------------------- */}
      {solution.benefitsofservice?.length > 0 && (
        <BulletsInSection
          title="Benefits of Service"
          para={`Key technical and operational advantages delivered by ${solutionTitle}.`}
          bullets={solution.benefitsofservice}
        />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 METHODOLOGY */}
      {/* ----------------------------------------- */}
      {solution.methodology?.length > 0 && (
        <CoreValuesSection
          title="Methodology"
          para={`Our structured engineering lifecycle and deployment process for ${solutionTitle}.`}
          coreValues={solution.methodology}
        />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 KEY COMPONENTS */}
      {/* ----------------------------------------- */}
      {solution.keycomponents?.length > 0 && (
        <CoreValuesSection
          title="Key Components"
          para={`Core architectural modules and services powering ${solutionTitle}.`}
          coreValues={solution.keycomponents}
        />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 FRAMEWORKS */}
      {/* ----------------------------------------- */}
      {solution.frameworks?.length > 0 && (
        <CoreValuesSection
          title="Frameworks"
          para={`Enterprise compliance standards and security frameworks embedded in ${solutionTitle}.`}
          coreValues={solution.frameworks}
        />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 CAPABILITIES */}
      {/* ----------------------------------------- */}
      {solution.capabilities?.length > 0 && (
        <CoreValuesSection
          title="Capabilities"
          para={`End-to-end technical capabilities and feature sets tailored for your business needs.`}
          coreValues={solution.capabilities}
        />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 TYPES OF SERVICE */}
      {/* ----------------------------------------- */}
      {solution.typesofservice?.length > 0 && (
        <BulletsInSection
          title="Types of Service"
          para={`Flexible service models and deployment options available for ${solutionTitle}.`}
          bullets={solution.typesofservice}
        />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 DELIVERABLES */}
      {/* ----------------------------------------- */}
      {solution.deliverables?.length > 0 && (
        <BulletsInSection
          title="Deliverables"
          para={`Production-ready assets, documentation, and continuous maintenance deliverables provided.`}
          bullets={solution.deliverables}
        />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 WHY US (CORE VALUES VERSION) */}
      {/* ----------------------------------------- */}
      {solution.whyus?.length > 0 && (
        <CoreValuesSection
          title="Why Us?"
          para={`Proven engineering track record, scalable architecture, and dedicated AI and software specialists.`}
          coreValues={solution.whyus}
        />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 WHAT YOU GET */}
      {/* ----------------------------------------- */}
      {solution.whatyouget?.length > 0 && (
        <CoreValuesSection
          title="What You Get?"
          para={`Complete source code ownership, enterprise cloud infrastructure, and 24/7 technical support.`}
          coreValues={solution.whatyouget}
        />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 PROCEDURE */}
      {/* ----------------------------------------- */}
      {solution.procedure?.length > 0 && (
        <CoreValuesSection
          title="Procedure"
          para={`Step-by-step roadmap from initial requirements discovery to production scale.`}
          coreValues={solution.procedure}
        />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 ADDITIONAL WHY US SECTIONS */}
      {/* ----------------------------------------- */}
      {solution.matters?.length > 0 && (
        <WhyUs title="Matter" data={solution.matters} />
      )}

      {solution.differences?.length > 0 && (
        <WhyUs title="Differences" data={solution.differences} />
      )}

      {solution.ourapproach?.length > 0 && (
        <WhyUs title="Our Approach" data={solution.ourapproach} />
      )}

      {/* ----------------------------------------- */}
      {/* 🔥 WHO SHOULD CONSIDER */}
      {/* ----------------------------------------- */}
      {solution.whoconsider?.length > 0 && (
        <BulletsInSection
          title="Who Should Consider"
          para={`Tailored for enterprises, fast-growing innovators, and industry leaders seeking high-performance ${solutionTitle}.`}
          bullets={solution.whoconsider}
        />
      )}

    </main>
  );
}
