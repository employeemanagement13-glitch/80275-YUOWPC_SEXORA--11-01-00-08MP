import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from './providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aroxes.com"),
  title: {
    default: "Aroxes | AI Agents & Enterprise Software Development",
    template: "%s | Aroxes",
  },
  description:
    "Aroxes is a globally trusted enterprise software and AI systems engineering partner. Industry leaders and hyper-growth innovators rely on our high-throughput ERPs, Agentic AI workflows, and vertical SaaS platforms to power their mission-critical operations.",
  keywords: [
    "AI agents",
    "enterprise software",
    "SaaS development",
    "retail ERP systems",
    "automation systems",
    "Pakistan software company",
  ],
  authors: [{ name: "Aroxes", url: "https://aroxes.com" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aroxes.com",
    siteName: "Aroxes",
    title: "Aroxes | AI Agents & Enterprise Software Development",
    description:
      "Aroxes builds autonomous AI agents, distribution ERPs, and high-throughput vertical SaaS platforms for enterprises worldwide.",
    images: [
      {
        url: "https://aroxes.com/og-image.png",
        width: 2400,
        height: 1260,
        type: "image/png",
        alt: "Aroxes Group",
      },
      {
        url: "https://aroxes.com/aroxes-icon-square.png",
        width: 512,
        height: 512,
        type: "image/png",
        alt: "Aroxes Logo Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aroxes | AI Agents & Enterprise Software Development",
    description:
      "Aroxes builds autonomous AI agents, distribution ERPs, and high-throughput vertical SaaS platforms for enterprises worldwide.",
    images: ["https://aroxes.com/twitter-image.png"],
  },
  alternates: {
    canonical: "https://aroxes.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Aroxes",
    url: "https://aroxes.com",
    logo: "https://aroxes.com/Aroxes%20Logo.png",
    description:
      "Aroxes is a globally trusted enterprise software and AI systems engineering partner. We build autonomous AI workflows, customized ERPs, and high-throughput SaaS platforms.",
    sameAs: [
      "https://www.linkedin.com/in/muhammad-sheharyar-shahzad-rana-5067a4276",
      "https://www.linkedin.com/in/shahzil-shahzad-563b8031a/",
      "https://facebook.com",
      "https://x.com",
      "https://instagram.com",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+923124342317",
      contactType: "customer service",
      areaServed: ["PK", "US", "GB", "AE"],
      availableLanguage: ["English", "Urdu"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aroxes",
    url: "https://aroxes.com",
    description:
      "Autonomous FinTech, AI Agents & Enterprise Software for maximum throughput.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://aroxes.com/products?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteSchema),
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${poppins.className} antialiased overflow-x-hidden`}
        >
          <Navbar />
          <Providers>{children}</Providers>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
