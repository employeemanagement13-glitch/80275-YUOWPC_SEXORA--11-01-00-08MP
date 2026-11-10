// --- 1. Interface for Card Data ---
export interface SolutionCardData {
  title: string;
  description: string;
  href?:string;
  visualIcon: string; // Icon for the main visual area
  visualStyle?: string; // Tailwind class for the icon color/style
}

// --- 2. Reusable SolutionCard Component (DRY) ---

export interface SolutionCardProps {
  data: SolutionCardData;
  index?: number; // Add this line - makes index optional
}

// --- 1. Interface for Card Data ---
export interface AchievementCardData {
  value: string; // The large number/percentage (e.g., "60+", "75%")
  description: string; // The smaller descriptive text
  offsetClass: string; // Tailwind class for staggering the layout
}

// --- 2. Reusable AchievementCard Component (DRY) ---
export interface AchievementCardProps {
  data: AchievementCardData;
}

// --- 1. Interfaces ---
export interface LogoData {
  id: number;
  name: string;
  imagePath: string; // Path to the logo image (using placeholder URL)
  styleClass?: string; // Used only for Trusted Clients (text-based)
}


// --- 2. Reusable Logo Component ---
export interface LogoProps {
  logo: LogoData;
  pathway?: boolean;
  isMuted: boolean; // Flag to handle the grayscale effect for "Featured By"
}

export interface LogoGroup {
    title: string;
    subtitle?: string;
    pathway: boolean;
    logos: LogoData[];
}

// --- 3. Logo Scroller Component for Infinite Animation ---
export interface LogoScrollerProps {
    logos: LogoData[];
    direction: 'left' | 'right';
}

// Reusable Logo Group Component (for Trusted Clients)
export interface LogoGroupSectionProps {
    group: LogoGroup;
}

// --- 1. Interface for Card Data ---
export interface LeaderData {
  name: string;
  title: string;
  imagePath: string;
  linkedinUrl: string;
}

// --- 2. Reusable Leader Card Component (DRY) ---
export interface LeaderCardProps {
  data: LeaderData;
}


// --- 1. Interface for Logo Data ---
export interface CertificationData {
  alt: string;
  imagePath: string;
}

// --- 2. Reusable Logo Component (DRY) ---
export interface CertificationLogoProps {
  data: CertificationData;
}

// --- 1. Interface for Testimonial Data ---
export interface TestimonialData {
    name: string;
    company: string;
    feedback: string;
}

// --- 3. Reusable Testimonial Card Component (DRY) ---
export interface TestimonialCardProps {
    data: TestimonialData;
}

// --- 1. Interface for Blog Card Data ---
export interface BlogData {
  id: number;
  date: string;
  blogid?:string;
  category: string;
  title: string;
  summary: string;
  imagePath: string;
}

// --- 3. Reusable Blog Card Component (DRY) ---
export interface BlogCardProps {
  data: BlogData;
  className?: string; 
  style?: React.CSSProperties;
}



// Define the structure for navigation links
export interface NavLink {
  name: string;
  href: string;
}

// Define the structure for the navigation columns
export interface NavColumn {
  title: string;
  links: NavLink[];
}




// Solutions Page 

// --- MOCK DATA ---
export interface SolutionData {
  date: string;
  category: string;
  blogid?: string;
  title: string;
  summary: string;
  imagePath: string;
}

// --- PAGINATION COMPONENT ---
export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// --- MOCK DATA ---
export interface WhyUsItem {
  title: string;
  description?: string;
  desc?: string;
  bullets?: string[];
}

// --- REUSABLE CARD COMPONENT ---
export interface WhyUsCardProps {
  data: WhyUsItem;
}

// --- TYPE DEFINITIONS ---
export interface MethodologyItem {
  title: string;
  description?: string;
  bullets?: string[];
}


// --- TYPE DEFINITIONS ---
export interface FAQItemData {
  id: number;
  question: string;
  answer: string;
}

export interface FAQItemProps {
  data: FAQItemData;
  isOpen: boolean;
  onToggle: (id: number) => void;
}

// Reusable component for the styled quote boxes (Mission and Vision)
export interface QuoteCardProps {
  title: string;
  content: string;
}

// Define the interface for a single core value object
export interface CoreValue {
  title: string;
  description?: string;
  desc?: string;
}



// Interface for a single location's data, now including address details
export interface LocationData {
  name: string;
  imageUrl: string;
  altText: string;
  city: string;
  state: string;
  addressLine: string;
  phone: string;
}

// Component for a single location card
export interface LocationCardProps extends LocationData {
  onClick: () => void;
  isSelected: boolean;
}


      
// --- Data for Benefits and corresponding Images ---
export interface Benefit {
  id: number;
  title: string;
  imagePath: string;
  alt: string;
}




export interface SecurityServicesSectionProps {
  headerProps: {
    title: string;
    description: string;
    // complianceTitle: string;
    // logos: { src: string; alt: string }[];

    checkboxtitle: string;
    formHeading: string;
    formParagraph: string;
    checkboxOptions: string[];
  };
}