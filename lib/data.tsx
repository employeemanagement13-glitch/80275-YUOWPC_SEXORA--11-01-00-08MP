import { BlogCardData } from "@/Components/SubComponents/home/BlogCard";
import { SolutionCardData, AchievementCardData, WhyUsItem, SolutionData, LogoData, LogoGroup, LeaderData, CertificationData, TestimonialData, BlogData, NavColumn, MethodologyItem, FAQItemData, CoreValue, LocationData, Benefit } from "@/types/dataType";
import { supabase } from '@/utils/supabaseClient';

export async function getSolutionCards(): Promise<SolutionCardData[]> {
  const { data, error } = await supabase.from("solutions").select("*");
  const safeData = data ?? [];
  return safeData.slice(0, 6).map((sol) => ({
    title: sol.title,
    description: sol.description,
    href: `solutions/${sol.slug}`,
    visualIcon: sol.banner_image,
  }));
}

export async function getAllSolutions(): Promise<SolutionData[]> {
  const { data, error } = await supabase.from("solutions").select("*");
  const safeData = data ?? [];
  return safeData.map(sol => ({
    title: sol.title,
    summary: sol.description,
    category: sol.category,
    date: sol.created_at,
    blogid: `solutions/${sol.slug}`,
    imagePath: sol.banner_image,
  }));
}

export async function getBlogPosts(): Promise<BlogData[]> {
  const { data: blogs, error } = await supabase.from("blogs").select("*");
  const currentblogs = blogs ?? [];
  return currentblogs.map((blog, index) => ({
    title: blog.title,
    blogid: `blogs/${blog.slug || blog.id}`,
    summary: blog.description,
    imagePath: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${blog.banner_image}`,
    category: blog.type,
    date: blog.created_at,
    id: index
  }));
}

export async function getSolutionLinks() {
  const { data, error } = await supabase.from("solutions").select("name, slug");
  const safeData = data ?? [];
  return safeData.map(sol => ({
    name: sol.name,
    href: `/solutions/${sol.slug}`,
  }));
}



// Exporting async functions instead to handle dynamic fetching


// Data array for the cards, now including the offset class for staggering
export const AchievementsCards: AchievementCardData[] = [
  {
    value: "60+",
    description: "+12.3% clients from last year",
    // Card 1: Elevated (no offset)
    offsetClass: "lg:mt-0",
  },
  {
    value: "75%",
    description: "+1.3% recurring clients from last year",
    // Card 2: Lowered by a specific amount (md:mt-12)
    offsetClass: "lg:mt-12",
  },
  {
    value: "100+",
    description: "Companies protected by our services",
    // Card 3: Elevated (no offset)
    offsetClass: "lg:mt-0",
  },
  {
    value: "30+",
    description: "Countries we served",
    // Card 4: Lowered by a specific amount (md:mt-12)
    offsetClass: "lg:mt-12",
  },
];


// Data for the "Featured By" section (Media Logos)
// Switched to placeholder images for the "Featured By" section
export const featuredByLogos: LogoData[] = [
  { id: 1, name: "BUSINESS INSIDER", imagePath: "/home/businessinsider.webp" },
  { id: 2, name: "New York Weekly", imagePath: "/home/newyorkweekly.webp" },
  { id: 3, name: "Khaleej Times", imagePath: "/home/khaleejtimes.webp" },
  { id: 4, name: "YAHOO! Finance", imagePath: "/home/yahoofinance.webp" },
  { id: 5, name: "Forbes", imagePath: "/home/forbes.png" },
  { id: 6, name: "Travelers UNITED", imagePath: "/home/hasedout.png" },
  { id: 7, name: "BLOCKGEEKS", imagePath: "/home/blockgeeks.webp" },
  { id: 8, name: "iPlocation", imagePath: "/home/iplocation.png" },
];





// Data for the "Trusted Clients" section (Text-based Logos)
export const trustedClientsData: LogoGroup = {
  title: "Trusted Clients",
  subtitle: "Our commitment to provide top-notch enterprise system has earned us the trust of leading companies worldwide. Here are some of our esteemed clients who rely on our expertise to automate their workflows.",
  pathway: false,
  logos: [
    { id: 10, name: "Ittehad Traders", imagePath: "/home/ittehad.png" },
    { id: 11, name: "Sandeez", imagePath: "/home/sandeez.png" },
    { id: 12, name: "Nonilion", imagePath: "/home/nonilion.png" },
  ],
};



// Data array for the leadership team
export const leaderCardsData: LeaderData[] = [
  {
    name: "Sheharyar Shahzad",
    title: "Founder, CEO",
    imagePath: "/home/founder.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/muhammad-sheharyar-shahzad-rana-5067a4276",
  },
  {
    name: "Shahzil Shahzad",
    title: "Co-Founder",
    imagePath: "/home/shahzil.png",
    linkedinUrl: "https://www.linkedin.com/in/shahzil-shahzad-563b8031a/",
  }
];


// Data array for the certification logos (using placeholder images to match the visual style)
export const certificationCardsData: CertificationData[] = [
  // Row 1
  { alt: "OSCP Certification", imagePath: "/home/certifications/oscp.png" },
  { alt: "OSWE Certification", imagePath: "/home/certifications/oswe.png" },
  { alt: "OSEP Certification", imagePath: "/home/certifications/osep.png" },
  { alt: "OSED Certification", imagePath: "/home/certifications/osed.png" },
  { alt: "CISSP Certification", imagePath: "/home/certifications/cissp.png" },

  // Row 2
  { alt: "eCPPTv2 Certification", imagePath: "/home/certifications/ecppt.png" },
  { alt: "CompTIA PenTest+ Certification", imagePath: "/home/certifications/comptia.png" },
  { alt: "SSCP Certification", imagePath: "/home/certifications/sscp.png" },
  { alt: "CREST Certification", imagePath: "/home/certifications/crest.png" },
  { alt: "PEN TEST Certification", imagePath: "/home/certifications/pentest.png" },
];


// --- 2. Data Array for Testimonials ---
export const testimonialCardsData: TestimonialData[] = [
  {
    name: "Imran Ali",
    company: "Ittehad Traders",
    feedback: "Distroline transformed our entire Distribution level workflows. Now, I always track Income, Expenses, Stock, Empties, On-Credit Vendor Purchases, Overdue Invoices, Employee Loans or their current payslips. Plus, with it I can easily share tax reports (either Sales, WH or Advance Invoice Tax) with FBR. So along these feature, I strongly recommend it for CCBPL Distributions. ",
  },
  {
    name: "Waseem Yousaf",
    company: "CEO: Lord Grammar School",
    feedback: "Aroxes elevated LGS's market reach and operational efficiency. Their digital platforms scaled our brand presence and drove measurable sales growth, alongside their automated AMS handles our enterprise workflows effortlessly.",
  },
  // {
  //   name: "Ali Sarfraz",
  //   company: "Executive Leadership of Sandeez",
  //   feedback: "Aroxes helped us grow our online sales with a smart, AI-powered e-commerce platform. They made it easy for customers to find what they wanted and checkout quickly. A top partner for retail growth.",
  // },
];

// BlogPosts now fetched directly from getBlogPosts()
// export const blogPosts: BlogData[] = allblogs;

export const gothackedlinks = [
  {
    link: "/contact",
    title: "Get Immediate Help"
  },
  {
    link: "/blogs",
    title: "Find Answer in Blog"
  },
]

export const socials = [
  { link: "https://facebook.com", image: "/home/Socials/facebook11.png" },
  { link: "https://x.com", image: "/home/Socials/x.png" },
  { link: "https://instagram.com", image: "/home/Socials/instagram.webp" },
  { link: "https://linkedin.com", image: "/home/Socials/linkedin.png" },
];


export async function getNavData(): Promise<NavColumn[]> {
  const solutionLinks = await getSolutionLinks();

  return [
    {
      title: "Company",
      links: [
        { name: "Blogs", href: "/blogs" },
        { name: "Products", href: "/products" },
        { name: "About", href: "/about" },
      ],
    },
    {
      title: "Solutions",
      links: solutionLinks,
    },
    {
      title: "Help Center",
      links: [
        { name: "Contact", href: "/contact" },
        { name: "Workflow Issue?", href: "/#gothacked" },
        { name: "Privacy", href: "/privacy" },
      ],
    },
  ];
}

export async function getNavLinks() {
  const solutionLinks = await getSolutionLinks();

  return [
    {
      name: "Solutions",
      href: "/solutions",
      links: solutionLinks,
    },
    { name: "About us", href: "/about" },
    { name: "Blogs", href: "/blogs" },
    { name: "Publications", href: "/publications" },
    { name: "Career", href: "/pathway" },
  ];
}

// Solutions page 
// export const mockSolutions: SolutionData[] = allsols;




export const whyUsData: WhyUsItem[] = [
  {
    title: 'Domain-Driven Engineering',
    description: "Unlike rigid off-the-shelf software, our senior engineers build custom ERP engines, Agentic AI workflows, and SaaS platforms tailored directly to your complex business logic.",
  },
  {
    title: 'Production-Ready Blueprints',
    description: "We deliver clean, high-throughput architectures backed by modular API contracts, zero-latency performance benchmarks, and measurable ROI.",
  },
  {
    title: 'Milestone-Driven Scoping',
    description: "Transparent roadmaps, dedicated engineering channels, and phased delivery ensure rapid deployment without technical debt or scope creep.",
  }
];


// --- MOCK DATA FOR METHODOLOGY ---
export const methodologyData: MethodologyItem[] = [
  {
    title: 'Discovery & Architectural Scoping',
    bullets: [
      "Define enterprise objectives, technical constraints, and throughput goals.",
      "Establish data schema boundaries, security standards, and integration touchpoints.",
      "Map core workflows across retail, banking, education, or booking channels.",
    ],
  },
  {
    title: 'Domain Modeling & AI Pipeline Design',
    bullets: [
      "Draft custom ERP architectures, inventory sync engines, and database structures.",
      "Design Agentic AI workflows, LLM orchestration layers, and prompt pipelines.",
      "Establish zero-latency API endpoints and real-time data streaming contracts.",
    ],
  },
  {
    title: 'Composable Engineering & Development',
    bullets: [
      "Build modular vertical SaaS components and custom administrative dashboards.",
      "Implement autonomous AI agents for zero-touch workflow automation.",
      "Integrate enterprise payment rails, booking systems, and inventory networks.",
    ],
  },
  {
    title: 'Load Optimization & Stress Testing',
    bullets: [
      "Conduct high-concurrency load testing to verify system stability under peak traffic.",
      "Optimize query performance and refine model response times for sub-second latency.",
      "Eliminate memory leaks, edge-case failure points, and workflow bottlenecks.",
    ],
  },
  {
    title: 'Continuous Deployment & Hyper-Care',
    bullets: [
      "Orchestrate zero-downtime cloud deployments (AWS, Azure, GCP).",
      "Provide real-time telemetry, model monitoring, and automated failover handling.",
      "Deliver comprehensive technical documentation and executive handoff.",
    ],
  }
];


// --- MOCK DATA FOR FAQ ---
export const faqData: FAQItemData[] = [
  {
    id: 1,
    question: 'What domain-specific enterprise solutions does Aroxes engineer?',
    answer: "Aroxes specializes in customized distribution ERPs (like Distroline), Agentic AI engines, Gen AI workflows, and high-throughput SaaS platforms across the retail, banking, education, and booking sectors.",
  },
  {
    id: 2,
    question: 'How long does a typical custom software or ERP deployment take?',
    answer: "Timeline depends on operational complexity. A focused vertical SaaS MVP or AI module typically ships within 4 to 6 weeks, while a full-scale customized retail ERP takes 2 to 4 months through phased, milestone-based releases.",
  },
  {
    id: 3,
    question: 'Can Aroxes modernize our legacy IT infrastructure into an AI-driven platform?',
    answer: "Yes. We refactor monolithic software into modular, cloud-native microservices, integrating Agentic AI and enterprise automation without disrupting ongoing daily operations.",
  },
  {
    id: 4,
    question: 'How do you ensure code quality and system performance?',
    answer: "Our team consists of veteran enterprise architects adhering to strict engineering standards. Every platform undergoes rigorous CI/CD validation, automated load testing, and sub-second latency optimization before production release.",
  },
  {
    id: 5,
    question: 'Do you offer post-launch maintenance, SLAs, and continuous support?',
    answer: "Absolutely. We offer continuous hyper-care and SLA-driven support packages to manage cloud infrastructure, optimize AI agent performance, and scale software capacity as your business grows.",
  }
];

// Content taken directly from the "Our mission.png" image
export const missionContent = "Empowering enterprises with Agentic AI, tailored ERPs, and vertical SaaS to drive continuous operational scale.";
export const visionContent = "Architecting autonomous digital infrastructure that powers the global future of enterprise automation.";


// Use the CoreValue interface for the coreValues array
export const coreValues: CoreValue[] = [
  {
    title: "Scalability-First Mindset",
    description: "We engineer fault-tolerant, high-throughput architecture into every product. Our commitment is delivering zero-latency SaaS platforms, resilient ERPs, and Agentic AI systems that scale effortlessly.",
  },
  {
    title: "Agentic Innovation",
    description: "We harness Gen AI and autonomous workflows to eliminate operational friction. We continuously pioneer modular, enterprise-grade platforms that redefine market capability.",
  },
  {
    title: "Enterprise Synergy",
    description: "We integrate deeply with client ecosystems to co-engineer custom software. By aligning domain expertise with strategic goals, we resolve complex operational bottlenecks together.",
  },
  {
    title: "Composable Agility",
    description: "We build modular, adapt-ready systems that evolve alongside shifting market demands. Our flexible SaaS and ERP frameworks allow enterprises to pivot without accumulating technical debt.",
  },
  {
    title: "Mission-Critical Excellence",
    description: "We enforce uncompromising engineering standards across every deployment. From sub-second latency to zero-touch automation, we deliver high-yield software that exceeds benchmarks.",
  },
  {
    title: "Outcome-Centricity",
    description: "We design software around measurable ROI. We tailor our retail ERPs, booking engines, and AI workflow agents to solve domain-specific challenges and accelerate business growth.",
  },
];


// Data for the "Trusted Clients" section (Text-based Logos)
export const globalPartnersData: LogoGroup = {
  title: "Global Partners",
  pathway: false,
  logos: [
    { id: 0, name: "BYKEA", imagePath: "/home/bykea.png" },
    { id: 1, name: "ZettaMight", imagePath: "/about/Zettamigh.png" },
    { id: 2, name: "Work Generators", imagePath: "/about/workgen.png" },
  ],
};


export const locations: LocationData[] = [
  {
    name: "Pakistan",
    imageUrl: "/about/pakistan.webp",
    altText: "Skyscrapers in Pakistan at sunset",
    city: "Islamabad",
    state: "ICT",
    addressLine: "Street 10, Sector I-10/2, Islamabad, 44000",
    phone: "+92 51 123 4567",
  },
  {
    name: "United States",
    imageUrl: "/about/usa.webp",
    altText: "New York City skyline",
    city: "New York",
    state: "NY",
    addressLine: "123 Wall Street, Suite 500, New York, 10005",
    phone: "+1 212 555 0100",
  },
  {
    name: "United Kingdom",
    imageUrl: "/about/ukk.webp",
    altText: "London's Tower Bridge at dusk",
    city: "London",
    state: "Greater London",
    addressLine: "20 Fenchurch Street, EC3M 3BD, London",
    phone: "+44 20 7946 0123",
  },
  {
    name: "United Arab Emirates",
    imageUrl: "/about/uae.webp",
    altText: "Dubai skyline with Burj Khalifa",
    city: "Dubai",
    state: "Dubai Emirate",
    addressLine: "Emaar Square, Building 4, Office 101, Dubai",
    phone: "+971 4 123 4567",
  },
];


// Data for the "Trusted Clients" section (Text-based Logos)
export const folllowpathway: LogoGroup = {
  title: "Pathway",
  subtitle: "To be a part of us, follow this simple & efficient pathway",
  pathway: true,
  logos: [
    { id: 1, name: "applicationsubmit", imagePath: "/pathway/applicationsubmit.png" },
    { id: 2, name: "expertevaluation", imagePath: "/pathway/expertevaluation.png" },
    { id: 3, name: "interview", imagePath: "/pathway/interview.png" },
    { id: 4, name: "hire", imagePath: "/pathway/hire.png" },
  ],
};

// Data for the "Featured By" section (Media Logos)
// Switched to placeholder images for the "Featured By" section
export const cultureImages: LogoData[] = [
  { id: 1, name: "culture6", imagePath: "/pathway/culture6.avif" },
  { id: 2, name: "culture7", imagePath: "/pathway/culture7.avif" },
  { id: 3, name: "culture8", imagePath: "/pathway/culture8.avif" },
  { id: 4, name: "group", imagePath: "/pathway/group.jpg" },
  { id: 5, name: "team1", imagePath: "/pathway/team1.jpg" },
  { id: 6, name: "team2", imagePath: "/pathway/team2.jpg" },
  { id: 7, name: "team3", imagePath: "/pathway/team3.jpg" },
  { id: 8, name: "office", imagePath: "/pathway/office.jpg" },
];


export const BENEFITS_DATA: Benefit[] = [
  {
    id: 1,
    title: "Fuel Allowance",
    imagePath: "/pathway/fuel.jpg",
    alt: "A close-up of a fuel pump nozzle, symbolizing fuel allowance.",
  },
  {
    id: 2,
    title: "Health and Wellness Programs",
    imagePath: "/pathway/health.webp",
    alt: "A person doing yoga, symbolizing health and wellness.",
  },
  {
    id: 3,
    title: "Performance Bonuses",
    imagePath: "/pathway/bonuses.webp",
    alt: "A stack of gold coins or a trophy, symbolizing performance rewards.",
  },
  {
    id: 4,
    title: "Outpatient (OPD) & Inpatient (IPD) Benefits",
    imagePath: "/pathway/opd.webp",
    alt: "A medical doctor consulting a patient, symbolizing OPD/IPD benefits.",
  },
  {
    id: 5,
    title: "World Class Gyms",
    imagePath: "/pathway/gyms.webp",
    alt: "Modern gym equipment, symbolizing world-class gyms.",
  },
  {
    id: 6,
    title: "Work from Home Options",
    imagePath: "/pathway/workfromhome.webp",
    alt: "A comfortable home office setup, symbolizing work from home.",
  },
  {
    id: 7,
    title: "Tech Allowances",
    imagePath: "/pathway/techallowance.webp",
    alt: "A laptop and monitor setup, symbolizing tech allowances.",
  },
];



export const bullets = [
  "Define success criteria Set ground rules",
  "Define success criteria Set ground rules",
  "Set ground rules Define success criteria",
  "Define success criteria Set ground rules",
  "Set ground rules Define success criteria",
  "Define success criteria Set ground rules",
  "Set ground rules Define success criteria",
  "Define success criteria Set ground rules",
  "Set ground rules Set ground rule sSet ground rules",
];

export const headerProps = {
  // LEFT SIDE TEXT
  title: "Enterprise Software & Agentic AI Solutions | Aroxes",
  description:
    "Deploy enterprise-grade AI agents, custom retail ERPs, and vertical SaaS platforms with Aroxes. Transform complex operations with high-throughput automation.",
  // complianceTitle: "Meets Compliance Framework Regulations",

  logos: [
    { src: "/home/certifications/crest.png", alt: "CREST Certification" },
    { src: "/home/certifications/pentest.png", alt: "Pentest Certification" },
    { src: "/home/certifications/comptia.png", alt: "CompTIA PenTest+" },
  ],

  // RIGHT SIDE — FORM TEXT
  formHeading: "Request Your Service",
  formParagraph:
    "Provide your details below and select the service type you need. Our team will reach out shortly.",

  checkboxtitle: "What type of testing do you need?",
  checkboxOptions: [],
};


// --- 4. BeAPartSection (Main Component) ---
// Data structure updated to use 'summary' instead of 'description'
export const jobData: BlogCardData[] = [
  {
    id: 1,
    title: "SOC analyst Level 1/Level 2",
    summary: "We are looking for SOC analyst Level 1/Level 2 proficient in Wazuh customization and/or Microsoft Sentinel.",
    imagePath: "/pathway/soc.png",
    blogid: "https://linkedin.com"
  },
  {
    id: 2,
    title: "Cybersecurity Researcher",
    summary: "Build and manage attack-simulation labs and automation environments, researching threat-actor techniques, zero-day exploits.",
    imagePath: "/pathway/cyber.png",
    blogid: "https://linkedin.com"
  },
  {
    id: 3,
    title: "Project Manager",
    summary: "Manage cloud, endpoint, identity, and compliance security projects from planning to delivery with full coordination and reporting.",
    imagePath: "/pathway/project.png",
    blogid: "https://linkedin.com"
  },
];