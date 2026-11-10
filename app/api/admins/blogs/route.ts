// /app/api/admin/blogs/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export const runtime = "nodejs";  // ensure Node.js runtime

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const isEdit = formData.get("isEdit") === "true";
    const id = (formData.get("id") as string) || null;

    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const type = (formData.get("type") as string)?.trim();
    if (!title || !description) {
      return NextResponse.json({ success: false, error: "Title and description required" }, { status: 400 });
    }

    const bannerFile = formData.get("banner") as File | null;

    const contentJson = (formData.get("content") as string) || "[]";
    const contentArray: any[] = JSON.parse(contentJson);

    if (contentArray.length === 0) {
      return NextResponse.json({ success: false, error: "content cannot be empty" }, { status: 400 });
    }

    // --- Upload banner ---
    let bannerPath: string | null = null;
    if (bannerFile && bannerFile.size > 0) {
      const ext = bannerFile.name.split(".").pop();
      bannerPath = `banners/${Date.now()}-${Math.random().toString(36)}.${ext}`;
      const { error: bannerErr } = await supabaseAdmin.storage
        .from("blog-images")
        .upload(bannerPath, bannerFile, { cacheControl: "3600", upsert: true });
      if (bannerErr) throw bannerErr;
    } else if (!isEdit) {
      return NextResponse.json({ success: false, error: "banner file required for new blog" }, { status: 400 });
    }

    // --- Upload content images ---
    for (let i = 0; i < contentArray.length; i++) {
      const file = formData.get(`contentFile_${i}`) as File | null;
      if (file && file.size > 0) {
        const ext = file.name.split(".").pop();
        const path = `content/${Date.now()}-${i}-${Math.random().toString(36)}.${ext}`;
        const { error } = await supabaseAdmin.storage
          .from("blog-images")
          .upload(path, file, { cacheControl: "3600", upsert: true });
        if (error) throw error;
        contentArray[i].referenceImage = path;
      } else {
        // ensure referenceImage exists (even if empty string)
        contentArray[i].referenceImage = contentArray[i].referenceImage || "";
      }
    }

    function generateSlug(text: string): string {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const customSlug = (formData.get("slug") as string)?.trim();
    const slug = customSlug || generateSlug(title);

    if (isEdit && id) {
      const { data: old } = await supabaseAdmin.from("blogs").select("*").eq("id", id).single();

      if (old) {
        // delete old banner if replaced
        if (bannerPath && old.banner_image) {
          await supabaseAdmin.storage.from("blog-images").remove([old.banner_image]).catch(() => {});
        }
        // delete replaced content images
        (old.content || []).forEach((c: any, idx: number) => {
          const newRef = contentArray[idx]?.referenceImage;
          if (c.referenceImage && newRef && c.referenceImage !== newRef) {
            supabaseAdmin.storage.from("blog-images").remove([c.referenceImage]).catch(() => {});
          }
        });
      }

      const { data: updated } = await supabaseAdmin.from("blogs")
        .update({
          title,
          slug: slug || old?.slug,
          description,
          type,
          banner_image: bannerPath || old?.banner_image,
          content: contentArray,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      return NextResponse.json({ success: true, blog: updated });
    } else {
      const { data: inserted } = await supabaseAdmin.from("blogs")
        .insert({
          title,
          slug,
          description,
          type,
          banner_image: bannerPath,
          content: contentArray,
        })
        .select()
        .single();

      return NextResponse.json({ success: true, blog: inserted });
    }
  } catch (err: any) {
    console.error("BLOG API ERROR:", err);
    return NextResponse.json({ success: false, error: err.message || "Unknown error" }, { status: 500 });
  }
}
