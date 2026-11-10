import BlogClient, { Blog } from "./BlogClient";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import type { Metadata } from "next";

export const revalidate = 3600;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function fetchBlog(identifier: string): Promise<Blog | null> {
  try {
    const isUuid = UUID_REGEX.test(identifier);
    if (isUuid) {
      const { data, error } = await supabaseAdmin.from("blogs").select("*").eq("id", identifier).single();
      if (!error && data) return data as Blog;
    }

    try {
      const { data, error } = await supabaseAdmin.from("blogs").select("*").eq("slug", identifier).single();
      if (!error && data) return data as Blog;
    } catch {}

    // Fallback lookup by id if not matched
    const { data } = await supabaseAdmin.from("blogs").select("*").eq("id", identifier).single();
    if (data) return data as Blog;

    return null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const { data } = await supabaseAdmin.from("blogs").select("*");
    const params: { id: string }[] = [];
    (data ?? []).forEach((b: any) => {
      if (b.slug) params.push({ id: b.slug });
      if (b.id) params.push({ id: b.id });
    });
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const siteName = "Aroxes";

  try {
    const data = await fetchBlog(id);

    const defaultDescription =
      "Technical insights, engineering deep dives and product updates from Aroxes.";

    if (!data) {
      return {
        title: `${siteName} | Blog`,
        description: defaultDescription,
        openGraph: {
          title: `${siteName} | Blog`,
          description: defaultDescription,
          url: `https://aroxes.com/blogs/${id}`,
        },
        twitter: { card: "summary" },
      };
    }

    const title = `${data.title} | ${siteName}`;
    const description =
      data.description ||
      (Array.isArray(data.content) && data.content[0]?.description?.slice(0, 160)) ||
      defaultDescription;
    const canonicalUrl = `https://aroxes.com/blogs/${data.slug || data.id}`;

    let images: string[] = [];
    if (Array.isArray(data.content)) {
      const firstImage = data.content.find((b: any) => b.referenceImage)?.referenceImage;
      if (firstImage) {
        images = [`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${firstImage}`];
      }
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        images,
        type: "article",
      },
      twitter: {
        card: images.length ? "summary_large_image" : "summary",
        title,
        description,
        images,
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (err) {
    return {
      title: `Aroxes | Blog`,
      description: "Technical insights, engineering deep dives and product updates from Aroxes.",
      openGraph: {
        title: `Aroxes | Blog`,
        description: "Technical insights, engineering deep dives and product updates from Aroxes.",
      },
      alternates: {
        canonical: `https://aroxes.com/blogs/${id}`,
      },
    };
  }
}

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const initialBlog = await fetchBlog(id);

  let blogImage = "https://aroxes.com/home/founder.jpeg";
  if (initialBlog && Array.isArray(initialBlog.content)) {
    const firstImg = initialBlog.content.find((b: any) => b.referenceImage)?.referenceImage;
    if (firstImg) {
      blogImage = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${firstImg}`;
    }
  }

  const articleSchema = initialBlog
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: initialBlog.title,
        description: initialBlog.description,
        image: [blogImage],
        datePublished: initialBlog.created_at || new Date().toISOString(),
        dateModified: initialBlog.updated_at || initialBlog.created_at || new Date().toISOString(),
        author: {
          "@type": "Organization",
          name: "Aroxes",
          url: "https://aroxes.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Aroxes",
          logo: {
            "@type": "ImageObject",
            url: "https://aroxes.com/Aroxes%20Logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://aroxes.com/blogs/${initialBlog.slug || initialBlog.id}`,
        },
      }
    : null;

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      )}
      <BlogClient id={id} initialBlog={initialBlog} />
    </>
  );
}
