"use client";

import React, { useState, useMemo, useEffect } from "react";
import BlogCard from "../SubComponents/home/BlogCard";
import Pagination from "../SubComponents/Solutions/Pagination";
import SectionHeader from "../SubComponents/SectionHeader";
import LoadingCardPlaceholder from "../SubComponents/home/LoadingPlaceholder";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type PublicationItem = {
  id: string;
  title: string;
  summary: string;
  banner_image: string;
  file_path: string;
  created_at: string;
};

interface Props {
  initialPublications: PublicationItem[];
}

const ITEMS_PER_PAGE = 6;

export default function PublicationsListClient({ initialPublications }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [publications, setPublications] = useState<PublicationItem[]>(initialPublications);
  const [isConnected, setIsConnected] = useState(false);

  // Set up real-time subscription and initial fetch
  useEffect(() => {
    let mounted = true;
    let channel: any = null;
    
    const setupRealtime = async () => {
      try {
        // Fetch fresh data on mount
        const { data: initialFreshPubs, error: initialError } = await supabase
          .from("publications")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (!initialError && initialFreshPubs && mounted) {
          const mapped = initialFreshPubs.map(p => ({
            id: p.id,
            title: p.title,
            summary: p.description,
            banner_image: p.banner_image,
            file_path: p.file_path,
            created_at: p.created_at,
          }));
          setPublications(mapped);
        }

        // Subscribe to real-time changes
        channel = supabase
          .channel('publications-realtime')
          .on(
            'postgres_changes',
            {
              event: '*', // Listen to INSERT, UPDATE, DELETE
              schema: 'public',
              table: 'publications'
            },
            async (payload: RealtimePostgresChangesPayload<PublicationItem>) => {
              if (!mounted) return;
              const { data: freshPubs, error } = await supabase
                .from("publications")
                .select("*")
                .order("created_at", { ascending: false });

              if (!error && freshPubs && mounted) {
                const mapped = freshPubs.map(p => ({
                  id: p.id,
                  title: p.title,
                  summary: p.description,
                  banner_image: p.banner_image,
                  file_path: p.file_path,
                  created_at: p.created_at,
                }));
                setPublications(mapped);
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

  const filtered = useMemo(() => {
    return publications.filter(pub => {
      const q = searchTerm.toLowerCase();
      return pub.title.toLowerCase().includes(q) ||
             pub.summary.toLowerCase().includes(q);
    });
  }, [publications, searchTerm]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setLoadingPage(true);
    setTimeout(() => {
      setCurrentPage(page);
      setLoadingPage(false);
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-[80vw] mx-auto mt-20"
    >
      <div className="flex justify-center items-center mb-6">
        <SectionHeader as="h1" title="Publications" className="text-white" subtitle="" subtitleClassName="" />
        
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
      
      {/* Animated Search Bar */}
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
            scale: isSearchFocused ? 1.02 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <Search size={18}  className="text-white" />
        </motion.div>
        <motion.input
          type="text"
          placeholder="Search publications..."
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

      {/* Publication count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-[#454648]/70 mb-4"
      >
        Showing {Math.min(filtered.length, ITEMS_PER_PAGE)} of {filtered.length} publication{filtered.length !== 1 ? 's' : ''}
      </motion.div>

      {/* Listing / loading / empty state with animations */}
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
              className="text-[#454648]/70 text-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              No publications found.
            </motion.p>
            {searchTerm && (
              <motion.p 
                className="text-[#454648]/60 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Try a different search term.
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={`page-${currentPage}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {paginated.map((pub, index) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                layoutId={`pub-${pub.id}`}
              >
                <BlogCard
                  data={{
                    id: pub.id,
                    title: pub.title,
                    summary: pub.summary,
                    imagePath: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/publication-images/${pub.banner_image}`,
                    date: pub.created_at,
                    category: "",
                    blogid: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/publication-files/${pub.file_path}`
                  }}
                  showReadMore={true}
                  readMoreText="View PDF"
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination controls with animation */}
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
