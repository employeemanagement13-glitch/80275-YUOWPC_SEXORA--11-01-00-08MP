"use client";

import { supabase } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";

export type ContentBlock = {
  title?: string;
  description: string;
  referenceImage?: string;
};

export type Blog = {
  id: string;
  slug?: string;
  title: string;
  description: string;
  content: ContentBlock[];
  created_at: string;
  updated_at?: string;
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function BlogClient({ id, initialBlog }: { id: string; initialBlog?: Blog | null }) {
  const [blog, setBlog] = useState<Blog | null>(initialBlog || null);
  const [loading, setLoading] = useState(!initialBlog);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    let channel: any = null;

    const fetchBlogAndSubscribe = async () => {
      let currentBlog = initialBlog;

      if (!currentBlog) {
        const isUuid = UUID_REGEX.test(id);
        const query = supabase.from("blogs").select("*");
        const { data, error: fetchError } = await (isUuid
          ? query.eq("id", id)
          : query.eq("slug", id)
        ).single();

        if (!mounted) return;

        if (fetchError || !data) {
          setError("Blog not found");
          setLoading(false);
          return;
        }

        currentBlog = data as Blog;
        setBlog(currentBlog);
        setLoading(false);
      }

      if (currentBlog?.id) {
        channel = supabase
          .channel(`blog-${currentBlog.id}-changes`)
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "blogs",
              filter: `id=eq.${currentBlog.id}`,
            },
            (payload: any) => {
              if (mounted && payload.new) {
                setBlog(payload.new as Blog);
              }
            }
          )
          .subscribe();
      }
    };

    fetchBlogAndSubscribe();

    return () => {
      mounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [id, initialBlog]);

  if (loading) {
    return <div className="p-6 text-[#454648] mt-28 text-center">Loading blog...</div>;
  }

  if (error || !blog) {
    return <div className="p-6 text-[#454648] mt-28 text-center">Blog not found</div>;
  }

  const anyImage = Array.isArray(blog.content) && blog.content.some((b) => !!b.referenceImage);

  return (
    <article className="max-w-5xl mx-auto p-6 text-[#454648] mt-28">
      <h1 className="text-4xl font-bold mb-4 text-[#454648]">{blog.title}</h1>
      <p className="text-lg mb-6 text-[#454648]/80">{blog.description}</p>

      {Array.isArray(blog.content) &&
        blog.content.map((block: ContentBlock, idx: number) => {
          const isEven = idx % 2 === 0;
          const imgSrc = block.referenceImage
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${block.referenceImage}`
            : null;

          const showImage = !!imgSrc && anyImage;

          return (
            <section key={idx} className="mb-12 flex flex-col md:flex-row items-center gap-6">
              {isEven ? (
                <div className="max-md:flex max-md:flex-col-reverse md:flex gap-4 md:items-center w-full">
                  <div className={`${showImage ? "md:w-1/2" : "w-full"}`}>
                    {block.title && <h2 className="text-2xl font-semibold mb-2 text-[#454648]">{block.title}</h2>}
                    <p className="text-base mb-2 text-[#454648]/80 leading-relaxed">{block.description}</p>
                  </div>

                  {showImage && (
                    <div className="md:w-1/2 rounded-xl overflow-hidden bg-[#f6f6f6]">
                      <img
                        src={imgSrc!}
                        alt={block.title || `block-${idx}`}
                        className="w-full h-auto rounded-xl object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {showImage && (
                    <div className="md:w-1/2 rounded-xl overflow-hidden bg-[#f6f6f6]">
                      <img
                        src={imgSrc!}
                        alt={block.title || `block-${idx}`}
                        className="w-full h-auto rounded-xl object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className={`${showImage ? "md:w-1/2" : "w-full"}`}>
                    {block.title && <h2 className="text-2xl font-semibold mb-2 text-[#454648]">{block.title}</h2>}
                    <p className="text-base mb-2 text-[#454648]/80 leading-relaxed">{block.description}</p>
                  </div>
                </>
              )}
            </section>
          );
        })}
    </article>
  );
}
