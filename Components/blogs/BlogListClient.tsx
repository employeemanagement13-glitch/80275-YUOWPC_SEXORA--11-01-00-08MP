"use client";
import React, { useState, useMemo, useEffect } from "react";
import BlogCard from "../SubComponents/home/BlogCard";
import SectionHeader from "../SubComponents/SectionHeader";
import Pagination from "../SubComponents/Solutions/Pagination";
import LoadingCardPlaceholder from "../SubComponents/home/LoadingPlaceholder";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type BlogItem = {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  banner_image: string;
  content: any[];
  type?: string;
  created_at: string;
  updated_at?: string;
};

const ITEMS_PER_PAGE = 6;

export default function BlogListClient({ initialBlogs }: { initialBlogs: BlogItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [blogs, setBlogs] = useState<BlogItem[]>(initialBlogs);
  const [isConnected, setIsConnected] = useState(false);

  // Set up real-time subscription and initial fresh fetch
  useEffect(() => {
    let mounted = true;
    let channel: any = null;

    const setupRealtime = async () => {
      try {
        // First, fetch fresh data on mount to ensure we aren't displaying stale SSR data
        const { data: freshBlogs, error } = await supabase
          .from("blogs")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && freshBlogs && freshBlogs.length > 0 && mounted) {
          const mapped = freshBlogs.map(b => ({
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
          setBlogs(mapped);
        }

        // Then, subscribe to real-time changes
        channel = supabase
          .channel('blogs-realtime')
          .on(
            'postgres_changes',
            {
              event: '*', // Listen to INSERT, UPDATE, DELETE
              schema: 'public',
              table: 'blogs'
            },
            async (payload: RealtimePostgresChangesPayload<BlogItem>) => {
              if (!mounted) return;
              const { data: updatedBlogs, error: updateError } = await supabase
                .from("blogs")
                .select("*")
                .order("created_at", { ascending: false });

              if (!updateError && updatedBlogs && mounted) {
                const mapped = updatedBlogs.map((b: any) => ({
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
                setBlogs(mapped);
              }
            }
          )
          .subscribe((status) => {
            if (mounted) {
              setIsConnected(status === 'SUBSCRIBED');
            }
          });
      } catch (error) {
        console.error('Error setting up real-time:', error);
      }
    };

    setupRealtime();

    // Cleanup function
    return () => {
      mounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const allTypes = useMemo(() => {
    const types = Array.from(new Set(blogs.map(b => b.type).filter(Boolean) as string[]));
    return ["All", ...types];
  }, [blogs]);

  const filtered = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = activeType === "All" || blog.type === activeType;
      return matchesSearch && matchesType;
    });
  }, [blogs, searchTerm, activeType]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setLoadingPage(true);
    setTimeout(() => {
      setCurrentPage(page);
      setLoadingPage(false);
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-[80vw] max-md:w-full mx-auto mt-20"
    >
      <div className="flex justify-center items-center mb-6">
        <SectionHeader as="h1" title="Blogs" className="text-[#454648]" subtitle="" subtitleClassName="" />

        {/* Real-time connection indicator */}
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs text-[#454648]/70">
            {isConnected ? 'Live updates enabled' : 'Connecting...'}
          </span>
        </motion.div> */}
      </div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
        className="searchparent mb-4 min-w-full"
      >
        <motion.div
          animate={{
            rotate: isSearchFocused ? 5 : 0,
            scale: isSearchFocused ? 1.1 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <Search size={18} className="text-[#225e4d]" />
        </motion.div>
        <motion.input
          type="text"
          placeholder="Search blogs..."
          className="search"
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileFocus={{ scale: 1.006 }}
        />
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-wrap justify-start gap-3 mb-8"
      >
        {allTypes.map((t, index) => (
          <motion.button
            key={t}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveType(t); setCurrentPage(1); }}
            className={`
              px-5 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer
              ${activeType === t
                ? 'bg-[#225e4d] text-white'
                : 'border border-[#dfe3e8] text-[#454648]/80 hover:bg-[#f6f6f6] hover:text-[#225e4d]'
              }
            `}
          >
            {t}
          </motion.button>
        ))}
      </motion.div>

      {/* Blog count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-[#454648]/70 mb-4"
      >
        Showing {Math.min(filtered.length, ITEMS_PER_PAGE)} of {filtered.length} blog{filtered.length !== 1 ? 's' : ''}
      </motion.div>

      {/* Blog Cards grid or loading placeholder */}
      <AnimatePresence mode="wait">
        {loadingPage ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <LoadingCardPlaceholder key={i} type="blog" />
              </motion.div>
            ))}
          </motion.div>
        ) : paginated.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <motion.p
              className="text-[#454648] text-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              No blogs found.
            </motion.p>
            {(searchTerm || activeType !== "All") && (
              <motion.p
                className="text-[#454648]/70 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Try a different search term or filter.
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={`page-${currentPage}-${activeType}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {paginated.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                layoutId={`blog-${blog.id}`}
              >
                <BlogCard
                  data={{
                    id: blog.id,
                    title: blog.title,
                    summary: blog.summary,
                    blogid: `blogs/${blog.slug || blog.id}`,
                    imagePath: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${blog.banner_image}`,
                    date: blog.created_at,
                    category: blog.type,
                  }}
                  href={`/blogs/${encodeURIComponent(blog.slug || blog.id)}`}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10"
        >
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
