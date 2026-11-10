'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabaseClient';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import Link from 'next/link';
import SectionHeader from '../SubComponents/SectionHeader';
import Pagination from '../SubComponents/Solutions/Pagination';
import LoadingCardPlaceholder from '../SubComponents/home/LoadingPlaceholder';

export type ProductItem = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  status: string;
  logo_url: string;
  hero_media_url: string;
  hero_media_type: string;
  created_at: string;
};

const ITEMS_PER_PAGE = 6;

function ProductCard({ product, index }: { product: ProductItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      layoutId={`product-${product.id}`}
    >
      <Link
        href={`/products/${encodeURIComponent(product.slug || product.id)}`}
        className="group block px-5 py-5 h-fit transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-[#225e4d]/10 rounded-xl overflow-hidden bg-[#f6f6f6] border border-[#f6f6f6] hover:bg-white"
      >
        <div className="flex flex-col h-full">
          <motion.div
            className="h-48 overflow-hidden shrink-0 rounded-xl bg-[#f6f6f6] flex items-center justify-center"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {product.hero_media_url ? (
              product.hero_media_type === 'video' ? (
                <video
                  src={product.hero_media_url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={product.hero_media_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1e293b/ffffff?text=Product';
                  }}
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#f6f6f6]">
                {product.logo_url ? (
                  <img
                    src={product.logo_url}
                    alt={product.name}
                    className="w-24 h-24 object-contain opacity-60"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-neutral-600 text-4xl font-bold">{product.name?.[0]}</span>
                )}
              </div>
            )}
          </motion.div>

          <div className="py-8 grow flex flex-col">
            <motion.p
              className="text-sm text-[#454648]/70 mb-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            >
              {product.category && <span>{product.category.replace(/_/g, ' ')}</span>}
              {product.status && product.status !== 'live' && (
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                  product.status === 'beta' ? 'bg-yellow-100 text-yellow-700' :
                  product.status === 'coming_soon' ? 'bg-emerald-100 text-[#225e4d]' :
                  'bg-[#eaeaea] text-[#454648]'
                }`}>
                  {product.status.replace(/_/g, ' ')}
                </span>
              )}
            </motion.p>

            <motion.h3
              className="text-[23px] font-medium text-[#454648] mb-4 line-clamp-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              {product.name}
            </motion.h3>

            {product.tagline && (
              <motion.p
                className="text-[16px] text-[#454648]/75 line-clamp-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                {product.tagline}
              </motion.p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProductListClient({ initialProducts }: { initialProducts: ProductItem[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    let mounted = true;
    let channel: any = null;

    const setupRealtime = () => {
      try {
        channel = supabase
          .channel('products-list')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'products' },
            async (payload: RealtimePostgresChangesPayload<ProductItem>) => {
              if (!mounted) return;
              const { data: updated, error: updateError } = await supabase
                .from('products')
                .select('id, name, slug, tagline, category, status, logo_url, hero_media_url, hero_media_type, created_at')
                .order('created_at', { ascending: false });
              if (!updateError && updated && mounted) {
                setProducts(updated as ProductItem[]);
              }
            }
          )
          .subscribe();
      } catch {}
    };

    setupRealtime();
    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const allCategories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[]));
    return ['All', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tagline?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, activeCategory]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setLoadingPage(true);
    setTimeout(() => { setCurrentPage(page); setLoadingPage(false); }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-[80vw] max-md:w-full mx-auto mt-20"
    >
      <div className="flex justify-center items-center mb-6">
        <SectionHeader as="h1" title="Products" className="text-[#454648]" subtitle="" subtitleClassName="" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
        className="searchparent mb-4 min-w-full"
      >
        <motion.div
          animate={{ rotate: isSearchFocused ? 5 : 0, scale: isSearchFocused ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Search size={18} className="text-[#225e4d]" />
        </motion.div>
        <motion.input
          type="text"
          placeholder="Search products..."
          className="search"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileFocus={{ scale: 1.006 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-wrap justify-start gap-3 mb-8"
      >
        {allCategories.map((cat, index) => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
            className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#225e4d] text-white'
                : 'border border-[#dfe3e8] text-[#454648]/70 hover:bg-[#f6f6f6] hover:text-[#225e4d]'
            }`}
          >
            {cat === 'All' ? cat : cat.replace(/_/g, ' ')}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-[#454648]/70 mb-4"
      >
        Showing {Math.min(filtered.length, ITEMS_PER_PAGE)} of {filtered.length} product{filtered.length !== 1 ? 's' : ''}
      </motion.div>

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
                <LoadingCardPlaceholder type="blog" />
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
              transition={{ type: 'spring', stiffness: 200 }}
            >
              No products found.
            </motion.p>
            {(searchTerm || activeCategory !== 'All') && (
              <motion.p
                className="text-[#454648]/60 text-sm mt-2"
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
            key={`page-${currentPage}-${activeCategory}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {paginated.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10"
        >
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </motion.div>
      )}
    </motion.div>
  );
}
