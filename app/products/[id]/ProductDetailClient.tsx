'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { SafeIcon } from '@/Components/SafeIcon';
import Link from 'next/link';

export type Stat = { label: string; value: string };
export type Feature = { icon: string; title: string; description: string; screenshot: string };
export type HowItWorks = { step: number; title: string; description: string; icon: string };
export type UseCase = { industry: string; scenario: string; thumbnail: string };
export type Integration = { name: string; logo: string };
export type Testimonial = { quote: string; author: string; company: string; result: string };

export type Product = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  status: string;
  industries: string[];
  logo_url: string;
  hero_media_type: string;
  hero_media_url: string;
  problem: string;
  solution: string;
  stats: Stat[];
  features: Feature[];
  how_it_works: HowItWorks[];
  use_cases: UseCase[];
  integrations: Integration[];
  testimonials: Testimonial[];
  cta_text: string;
  seo_meta_title?: string;
  seo_meta_description?: string;
  seo_og_image?: string;
};

export default function ProductDetailClient({ initialProduct }: { initialProduct: Product }) {
  const [product, setProduct] = useState<Product>(initialProduct);

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    if (!initialProduct?.id) return;

    const channel = supabase
      .channel(`product-${initialProduct.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products', filter: `id=eq.${initialProduct.id}` },
        (payload: RealtimePostgresChangesPayload<Product>) => {
          if (payload.new) {
            setProduct(payload.new as Product);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialProduct.id]);

  return (
    <article className="max-w-6xl mx-auto px-4 py-8 mt-20 text-[#454648]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-4 mb-6">
          {product.logo_url && (
            <img
              src={product.logo_url}
              alt={product.name}
              className="w-16 h-16 object-contain rounded-xl bg-[#f6f6f6] p-2"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div>
            <div className="flex items-center gap-3 mb-1">
              {product.category && (
                <span className="text-xs text-[#225e4d] uppercase tracking-wider font-medium">
                  {product.category.replace(/_/g, ' ')}
                </span>
              )}
              {product.status && product.status !== 'live' && (
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${product.status === 'beta' ? 'bg-yellow-100 text-yellow-700' :
                  product.status === 'coming_soon' ? 'bg-emerald-100 text-[#225e4d]' : 'bg-[#eaeaea] text-[#454648]'
                  }`}>
                  {product.status.replace(/_/g, ' ')}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#454648]">{product.name}</h1>
          </div>
        </div>

        {product.tagline && (
          <p className="text-xl text-[#454648]/80 mb-8 max-w-3xl">{product.tagline}</p>
        )}
      </motion.div>

      {product.hero_media_url && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 rounded-2xl overflow-hidden bg-[#f6f6f6]"
        >
          {product.hero_media_type === 'video' ? (
            <video src={product.hero_media_url} className="w-full max-h-[500px] object-cover" controls autoPlay muted loop playsInline />
          ) : (
            <img
              src={product.hero_media_url}
              alt={product.name}
              className="w-full max-h-[500px] object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/1200x600/181818/ffffff?text=' + encodeURIComponent(product.name);
              }}
            />
          )}
        </motion.div>
      )}

      {(product.stats || []).length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {product.stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center p-6 bg-[#f6f6f6] rounded-xl border border-[#f6f6f6]"
              >
                <div className="text-3xl font-bold text-[#454648] mb-1">{s.value}</div>
                <div className="text-sm text-[#454648]/70">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {(product.problem || product.solution) && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 grid md:grid-cols-2 gap-8"
        >
          {product.problem && (
            <div className="p-8 bg-[#f6f6f6] rounded-xl border border-[#f6f6f6]">
              <h2 className="text-2xl font-medium mb-4 text-[#225e4d]">The Problem</h2>
              <p className="text-[#454648]/80 leading-relaxed">{product.problem}</p>
            </div>
          )}
          {product.solution && (
            <div className="p-8 bg-[#f6f6f6] rounded-xl border border-[#f6f6f6]">
              <h2 className="text-2xl font-medium mb-4 text-[#225e4d]">Our Solution</h2>
              <p className="text-[#454648]/80 leading-relaxed">{product.solution}</p>
            </div>
          )}
        </motion.section>
      )}

      {(product.features || []).length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="heading3 mb-8">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 bg-[#f6f6f6] rounded-xl border border-[#f6f6f6] flex flex-col gap-3"
              >
                {f.icon && (
                  <div className="w-10 h-10 flex items-center justify-center bg-[#eaf3ff] rounded-lg">
                    <SafeIcon name={f.icon} size={20} className="text-[#225e4d]" />
                  </div>
                )}
                <h3 className="text-[#454648] font-medium">{f.title}</h3>
                {f.description && <p className="text-[#454648]/75 text-sm leading-relaxed">{f.description}</p>}
                {f.screenshot && (
                  <img
                    src={f.screenshot}
                    alt={f.title}
                    className="w-full h-32 object-cover rounded-lg mt-2"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {(product.how_it_works || []).length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="heading3 mb-8">How It Works</h2>
          <div className="space-y-6">
            {product.how_it_works.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-6 items-start p-6 bg-[#f6f6f6] rounded-xl border border-[#f6f6f6]"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#225e4d]/10 rounded-xl flex items-center justify-center">
                  {step.icon ? (
                    <SafeIcon name={step.icon} size={20} className="text-[#225e4d]" />
                  ) : (
                    <span className="text-[#225e4d] font-bold text-lg">{step.step}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-[#454648] font-medium mb-2">{step.title}</h3>
                  {step.description && <p className="text-[#454648]/70 text-sm leading-relaxed">{step.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {(product.use_cases || []).length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="heading3 mb-8">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {product.use_cases.map((uc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-[#f6f6f6] rounded-xl overflow-hidden border border-[#f6f6f6]"
              >
                {uc.thumbnail && (
                  <img
                    src={uc.thumbnail}
                    alt={uc.industry}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="p-6">
                  <span className="text-xs text-[#225e4d] uppercase tracking-wider font-bold">{uc.industry}</span>
                  <p className="text-[#454648]/80 mt-2 text-sm leading-relaxed">{uc.scenario}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {(product.integrations || []).length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="heading3 mb-8">Integrations</h2>
          <div className="flex flex-wrap gap-4">
            {product.integrations.map((int, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-3 bg-[#f6f6f6] border border-[#f6f6f6] rounded-xl px-4 py-3"
              >
                {int.logo && (
                  <img
                    src={int.logo}
                    alt={int.name}
                    className="w-6 h-6 object-contain"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <span className="text-[#454648] text-sm font-medium">{int.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {(product.testimonials || []).length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="heading3 mb-8">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {product.testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 bg-[#f6f6f6] rounded-xl border border-[#f6f6f6]"
              >
                <p className="text-[#454648]/80 text-sm leading-relaxed mb-4 ">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex flex-col items-start justify-between">
                  <div>
                    <div className="text-[#454648] font-medium text-sm">{t.author}</div>
                    <div className="text-[#454648]/60 text-xs">{t.company}</div>
                  </div>
                  {t.result && (
                    <span className="text-[#454648]/70 text-xs font-medium py-1 rounded-full">
                      {t.result}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {product.industries && product.industries.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="heading3 mb-4">Industries Served</h2>
          <div className="flex flex-wrap gap-3">
            {product.industries.map((ind, i) => (
              <span key={i} className="px-4 py-2 border border-[#eaeaea] rounded-lg text-sm text-[#454648]/80">
                {ind}
              </span>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 bg-[#f6f6f6] rounded-2xl border border-[#f6f6f6]"
      >
        <h2 className="text-3xl font-medium mb-4">Ready to get started?</h2>
        <p className="text-[#454648]/70 mb-8">Experience the power of {product.name} for your business.</p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 bg-[#225e4d] hover:bg-[#1b4d3f] text-white rounded-xl font-medium transition-colors duration-200"
        >
          {product.cta_text || 'Book a free demo'}
        </Link>
      </motion.section>

      <div className="mt-8 pt-8 border-t border-[#f6f6f6]">
        <Link href="/products" className="text-[#454648]/70 hover:text-[#225e4d] transition-colors flex items-center gap-2">
          ← Back to Products
        </Link>
      </div>
    </article>
  );
}
