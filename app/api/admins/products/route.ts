import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabaseAdmin';

export const runtime = 'nodejs';

const BUCKET = 'product-images';

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  let candidate = slug;
  let i = 0;
  while (true) {
    let q = supabaseAdmin.from('products').select('id').eq('slug', candidate).limit(1);
    if (excludeId) q = q.neq('id', excludeId);
    const { data } = await q;
    if (!data || data.length === 0) return candidate;
    i++;
    candidate = `${slug}-${Date.now().toString(36).slice(-4)}-${i}`;
  }
}

async function uploadFile(file: File, path: string): Promise<string> {
  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, file as any, {
    contentType: file.type,
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function parseJSON(val: FormDataEntryValue | null) {
  if (!val || typeof val !== 'string' || val === 'null') return null;
  try { return JSON.parse(val); } catch { return null; }
}

export async function POST(req: Request) {
  try {
    const fd = await req.formData();

    const name = (fd.get('name') as string)?.trim();
    if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });

    const rawSlug = (fd.get('slug') as string)?.trim() || makeSlug(name);
    const slug = await ensureUniqueSlug(rawSlug);

    let logo_url: string | null = null;
    const logoFile = fd.get('logo_file') as File | null;
    if (logoFile && logoFile.size > 0) {
      logo_url = await uploadFile(logoFile, `${slug}/logo.${logoFile.name.split('.').pop()}`);
    }

    let hero_media_url: string | null = null;
    const heroFile = fd.get('hero_file') as File | null;
    if (heroFile && heroFile.size > 0) {
      hero_media_url = await uploadFile(heroFile, `${slug}/hero.${heroFile.name.split('.').pop()}`);
    }

    const featuresRaw = parseJSON(fd.get('features')) as any[] | null;
    const features = await processFeaturesScreenshots(fd, featuresRaw, slug);

    const useCasesRaw = parseJSON(fd.get('use_cases')) as any[] | null;
    const use_cases = await processUseCaseThumbnails(fd, useCasesRaw, slug);

    const integrationsRaw = parseJSON(fd.get('integrations')) as any[] | null;
    const integrations = await processIntegrationLogos(fd, integrationsRaw, slug);

    const payload: any = {
      name,
      slug,
      tagline: fd.get('tagline') || null,
      category: fd.get('category') || null,
      status: fd.get('status') || 'draft',
      industries: parseJSON(fd.get('industries')) || [],
      logo_url: logo_url || (fd.get('logo_url') as string) || null,
      hero_media_type: fd.get('hero_media_type') || 'image',
      hero_media_url: hero_media_url || (fd.get('hero_media_url') as string) || null,
      problem: fd.get('problem') || null,
      solution: fd.get('solution') || null,
      stats: parseJSON(fd.get('stats')) || [],
      features: features || [],
      how_it_works: parseJSON(fd.get('how_it_works')) || [],
      use_cases: use_cases || [],
      integrations: integrations || [],
      testimonials: parseJSON(fd.get('testimonials')) || [],
      related_product_ids: parseJSON(fd.get('related_product_ids')) || null,
      cta_text: (fd.get('cta_text') as string) || 'Book a free demo',
      seo_meta_title: fd.get('seo_meta_title') || null,
      seo_meta_description: fd.get('seo_meta_description') || null,
      seo_og_image: fd.get('seo_og_image') || null,
    };

    const { data, error } = await supabaseAdmin.from('products').insert(payload).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/admins/products error:', err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const fd = await req.formData();
    const id = (fd.get('id') as string)?.trim();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const name = (fd.get('name') as string)?.trim();
    const rawSlug = (fd.get('slug') as string)?.trim() || (name ? makeSlug(name) : '');
    const slug = rawSlug ? await ensureUniqueSlug(rawSlug, id) : rawSlug;

    let logo_url: string | null = (fd.get('logo_url_old') as string) || null;
    const logoFile = fd.get('logo_file') as File | null;
    if (logoFile && logoFile.size > 0) {
      logo_url = await uploadFile(logoFile, `${slug}/logo.${logoFile.name.split('.').pop()}`);
    }

    let hero_media_url: string | null = (fd.get('hero_media_url_old') as string) || null;
    const heroFile = fd.get('hero_file') as File | null;
    if (heroFile && heroFile.size > 0) {
      hero_media_url = await uploadFile(heroFile, `${slug}/hero.${heroFile.name.split('.').pop()}`);
    }

    const featuresRaw = parseJSON(fd.get('features')) as any[] | null;
    const features = await processFeaturesScreenshots(fd, featuresRaw, slug);

    const useCasesRaw = parseJSON(fd.get('use_cases')) as any[] | null;
    const use_cases = await processUseCaseThumbnails(fd, useCasesRaw, slug);

    const integrationsRaw = parseJSON(fd.get('integrations')) as any[] | null;
    const integrations = await processIntegrationLogos(fd, integrationsRaw, slug);

    const payload: any = {
      name,
      slug,
      tagline: fd.get('tagline') || null,
      category: fd.get('category') || null,
      status: fd.get('status') || 'draft',
      industries: parseJSON(fd.get('industries')) || [],
      logo_url,
      hero_media_type: fd.get('hero_media_type') || 'image',
      hero_media_url,
      problem: fd.get('problem') || null,
      solution: fd.get('solution') || null,
      stats: parseJSON(fd.get('stats')) || [],
      features: features || [],
      how_it_works: parseJSON(fd.get('how_it_works')) || [],
      use_cases: use_cases || [],
      integrations: integrations || [],
      testimonials: parseJSON(fd.get('testimonials')) || [],
      related_product_ids: parseJSON(fd.get('related_product_ids')) || null,
      cta_text: (fd.get('cta_text') as string) || 'Book a free demo',
      seo_meta_title: fd.get('seo_meta_title') || null,
      seo_meta_description: fd.get('seo_meta_description') || null,
      seo_og_image: fd.get('seo_og_image') || null,
    };

    const { data, error } = await supabaseAdmin.from('products').update(payload).eq('id', id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error('PUT /api/admins/products error:', err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

async function processFeaturesScreenshots(fd: FormData, features: any[] | null, slug: string) {
  if (!features) return [];
  for (let i = 0; i < features.length; i++) {
    const file = fd.get(`feature_screenshot_${i}`) as File | null;
    if (file && file.size > 0) {
      const ext = file.name.split('.').pop();
      features[i].screenshot = await uploadFile(file, `${slug}/screenshots/feature_${i}.${ext}`);
    }
  }
  return features;
}

async function processUseCaseThumbnails(fd: FormData, useCases: any[] | null, slug: string) {
  if (!useCases) return [];
  for (let i = 0; i < useCases.length; i++) {
    const file = fd.get(`use_case_thumbnail_${i}`) as File | null;
    if (file && file.size > 0) {
      const ext = file.name.split('.').pop();
      useCases[i].thumbnail = await uploadFile(file, `${slug}/use_cases/thumb_${i}.${ext}`);
    }
  }
  return useCases;
}

async function processIntegrationLogos(fd: FormData, integrations: any[] | null, slug: string) {
  if (!integrations) return [];
  for (let i = 0; i < integrations.length; i++) {
    const file = fd.get(`integration_logo_${i}`) as File | null;
    if (file && file.size > 0) {
      const ext = file.name.split('.').pop();
      integrations[i].logo = await uploadFile(file, `${slug}/integrations/logo_${i}.${ext}`);
    }
  }
  return integrations;
}
