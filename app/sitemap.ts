import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://aroxes.com";

  let solutions: { slug?: string; updated_at?: string }[] = [];
  let blogs: { id?: string; slug?: string; created_at?: string; updated_at?: string }[] = [];
  let products: { slug?: string; id?: string; updated_at?: string }[] = [];

  try {
    const [solRes, blogRes, prodRes] = await Promise.all([
      supabaseAdmin.from("solutions").select("*"),
      supabaseAdmin.from("blogs").select("*"),
      supabaseAdmin.from("products").select("*"),
    ]);
    solutions = solRes.data ?? [];
    blogs = blogRes.data ?? [];
    products = prodRes.data ?? [];
  } catch (err) {
    console.error("Error generating dynamic sitemap:", err);
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/solutions`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/publications`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/blogs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const solutionUrls: MetadataRoute.Sitemap = solutions
    .filter((s) => Boolean(s.slug))
    .map((s) => ({
      url: `${base}/solutions/${s.slug}`,
      lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  const blogUrls: MetadataRoute.Sitemap = blogs
    .filter((b) => Boolean(b.slug || b.id))
    .map((b) => ({
      url: `${base}/blogs/${b.slug || b.id}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : b.created_at ? new Date(b.created_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    }));

  const productUrls: MetadataRoute.Sitemap = products
    .filter((p) => Boolean(p.slug || p.id))
    .map((p) => ({
      url: `${base}/products/${p.slug || p.id}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  return [...staticPages, ...solutionUrls, ...blogUrls, ...productUrls];
}
