import type { Metadata } from "next";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import BlogListClient from "@/Components/blogs/BlogListClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blogs | AI, ERP & High-Throughput SaaS Insights",
  description:
    "Technical deep-dives, architectural blueprints, and engineering insights on AI agents, distribution ERPs, and cloud systems from the Aroxes team.",
  openGraph: {
    title: "Engineering Blog | AI, ERP & High-Throughput SaaS Insights | Aroxes",
    description:
      "Technical deep-dives, architectural blueprints, and engineering insights on AI agents, distribution ERPs, and cloud systems from the Aroxes team.",
    url: "https://aroxes.com/blogs",
  },
  alternates: { canonical: "https://aroxes.com/blogs" },
};

export default async function BlogsPage() {
  const { data: blogs, error } = await supabaseAdmin
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching blogs:", error);
    return <div className="text-[#454648] p-8 text-center">Error loading blogs.</div>;
  }

  const mapped = (blogs ?? []).map((b) => ({
    id: b.id,
    slug: b.slug,
    title: b.title,
    summary: b.description,
    banner_image: b.banner_image,
    content: b.content,
    type: b.type,
    created_at: b.created_at,
    updated_at: b.updated_at,
  }));

  return (
    <div className="px-4 py-8">
      <BlogListClient initialBlogs={mapped} />
    </div>
  );
}
