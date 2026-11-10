// /app/api/admin/blogs-delete/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "id required" }, { status: 400 });
    }

    const { data: blog } = await supabaseAdmin.from("blogs").select("*").eq("id", id).single();
    if (blog) {
      if (blog.banner_image) {
        await supabaseAdmin.storage.from("blog-images").remove([blog.banner_image]).catch(() => {});
      }
      (blog.content || []).forEach(async (c: any) => {
        if (c.referenceImage) {
          await supabaseAdmin.storage.from("blog-images").remove([c.referenceImage]).catch(() => {});
        }
      });
    }

    await supabaseAdmin.from("blogs").delete().eq("id", id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("BLOG DELETE ERROR:", err);
    return NextResponse.json({ success: false, error: err.message || "Unknown error" }, { status: 500 });
  }
}
