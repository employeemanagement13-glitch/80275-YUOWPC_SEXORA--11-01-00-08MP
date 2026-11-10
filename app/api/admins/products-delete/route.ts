import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabaseAdmin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });

    const { data: product } = await supabaseAdmin.from('products').select('slug').eq('id', id).single();

    if (product?.slug) {
      const { data: files } = await supabaseAdmin.storage.from('product-images').list(product.slug, { limit: 200 });
      if (files && files.length > 0) {
        const paths = files.map((f: any) => `${product.slug}/${f.name}`);
        await supabaseAdmin.storage.from('product-images').remove(paths).catch(() => {});
      }
    }

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
