import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Aroxes | Speak with an Enterprise System Developer",
  description:
    "Get in touch with Aroxes to discuss your autonomous AI agents, distribution ERPs, or vertical SaaS project. Our system architects and leadership are ready to assist.",
  openGraph: {
    title: "Contact Aroxes | Speak with an Enterprise System Developer",
    description:
      "Get in touch with Aroxes to discuss your autonomous AI agents, distribution ERPs, or vertical SaaS project. Our system architects and leadership are ready to assist.",
    url: "https://aroxes.com/contact",
  },
  alternates: { canonical: "https://aroxes.com/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}