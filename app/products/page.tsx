import type { Metadata } from 'next';
import { supabaseAdmin } from '@/utils/supabaseAdmin';
import ProductListClient from '@/Components/products/ProductListClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Products | AI Agents, ERPs & Vertical SaaS Platforms',
  description:
    'Explore Aroxes enterprise-grade products — autonomous AI agents, multi-branch distribution ERPs, high-throughput SaaS engines, and automation tools.',
  openGraph: {
    title: 'Enterprise Products | AI Agents, ERPs & Vertical SaaS Platforms | Aroxes',
    description:
      'Explore Aroxes enterprise-grade products — autonomous AI agents, multi-branch distribution ERPs, high-throughput SaaS engines, and automation tools.',
    url: 'https://aroxes.com/products',
  },
  alternates: { canonical: 'https://aroxes.com/products' },
};

export default async function ProductsPage() {
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, name, slug, tagline, category, status, logo_url, hero_media_url, hero_media_type, created_at')
    .in('status', ['live', 'beta', 'coming_soon'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return <div className="text-[#454648] p-8 text-center">Error loading products.</div>;
  }

  return (
    <div className="px-4 py-8">
      <ProductListClient initialProducts={products ?? []} />
    </div>
  );
}
