import type { Metadata } from "next";
import { supabase } from "@/utils/supabaseClient";
import PublicationsListClient from "@/Components/publications/PublicationsListClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Publications & Whitepapers | Aroxes Research",
  description:
    "Explore engineering whitepapers, research publications, and technical documentation on autonomous AI architectures, high-throughput ERPs, and cloud security from Aroxes.",
  openGraph: {
    title: "Publications & Whitepapers | Aroxes Research",
    description:
      "Explore engineering whitepapers, research publications, and technical documentation on autonomous AI architectures, high-throughput ERPs, and cloud security from Aroxes.",
    url: "https://aroxes.com/publications",
  },
  alternates: { canonical: "https://aroxes.com/publications" },
};

export default async function PublicationsPage() {
  const { data: pubs, error } = await supabase
    .from("publications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching publications:", error);
    return <div className="text-white p-8 text-center">Error loading publications.</div>;
  }

  const mapped = (pubs ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    summary: p.description,
    banner_image: p.banner_image,
    file_path: p.file_path,
    created_at: p.created_at,
  }));

  return (
    <div className="px-4 py-8">
      <PublicationsListClient initialPublications={mapped} />
    </div>
  );
}
