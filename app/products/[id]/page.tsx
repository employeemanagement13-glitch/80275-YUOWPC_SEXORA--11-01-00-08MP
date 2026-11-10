import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { supabaseAdmin } from '@/utils/supabaseAdmin';
import ProductDetailClient, { Product } from './ProductDetailClient';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const fetchProduct = cache(async (productId: string): Promise<Product | null> => {
  try {
    const cleanId = decodeURIComponent(productId).trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

    // Primary lookup
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq(isUuid ? 'id' : 'slug', cleanId)
      .maybeSingle();

    if (!error && data) return data as Product;

    // Fallback lookup if not found by primary identifier
    const { data: fallback } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq(isUuid ? 'slug' : 'id', cleanId)
      .maybeSingle();

    return (fallback as Product) || null;
  } catch {
    return null;
  }
});

export async function generateStaticParams() {
  try {
    const { data } = await supabaseAdmin
      .from('products')
      .select('slug, id')
      .in('status', ['live', 'beta', 'coming_soon']);

    const params: { id: string }[] = [];
    (data ?? []).forEach((p) => {
      if (p.slug) params.push({ id: p.slug });
      if (p.id) params.push({ id: p.id });
    });

    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested enterprise software product could not be found.',
    };
  }

  const title = product.seo_meta_title || product.name;
  const description =
    product.seo_meta_description ||
    product.tagline ||
    `Discover ${product.name} — autonomous AI software and enterprise systems by Aroxes.`;
  const canonicalUrl = `https://aroxes.com/products/${product.slug || id}`;
  const ogImage = product.seo_og_image || product.hero_media_url || product.logo_url || '/home/founder.jpeg';

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Aroxes`,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Aroxes`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id: productId } = await params;
  const product = await fetchProduct(productId);

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-white mt-28 text-center">
        <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
        <Link href="/products" className="text-[#225e4d] hover:underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const productName = product.name;
  const productDescription =
    product.seo_meta_description ||
    product.tagline ||
    product.solution ||
    `Enterprise software application ${product.name} by Aroxes.`;
  const canonicalUrl = `https://aroxes.com/products/${product.slug || productId}`;
  const productImage =
    product.seo_og_image ||
    product.hero_media_url ||
    product.logo_url ||
    "https://aroxes.com/home/founder.jpeg";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: productName,
    description: productDescription,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud",
    url: canonicalUrl,
    image: [productImage],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@type": "Organization",
      name: "Aroxes",
      url: "https://aroxes.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
