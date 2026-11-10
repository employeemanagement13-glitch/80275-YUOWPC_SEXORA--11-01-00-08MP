// /app/api/admin/publications-delete/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "id required" }, { status: 400 });
    }

    // Fetch the publication record to get storage paths
    const { data: pub, error: fetchErr } = await supabaseAdmin
      .from("publications")
      .select("banner_image, file_path")
      .eq("id", id)
      .single();

    if (fetchErr) {
      console.error("Error fetching publication:", fetchErr);
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    if (!pub) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    const toDelete: string[] = [];
    if (pub.banner_image) toDelete.push(pub.banner_image);
    if (pub.file_path) toDelete.push(pub.file_path);

    // Attempt to delete files from both buckets
    const delImg = await supabaseAdmin
      .storage
      .from("publication-images")
      .remove(pub.banner_image ? [pub.banner_image] : []);
    if (delImg.error) {
      console.warn("Failed to delete banner image:", delImg.error);
      // proceed anyway
    }

    const delPdf = await supabaseAdmin
      .storage
      .from("publication-files")
      .remove(pub.file_path ? [pub.file_path] : []);
    if (delPdf.error) {
      console.warn("Failed to delete pdf file:", delPdf.error);
      // proceed anyway
    }

    // Delete the database record
    const { error: dbErr } = await supabaseAdmin
      .from("publications")
      .delete()
      .eq("id", id);

    if (dbErr) {
      console.error("DB delete error:", dbErr);
      return NextResponse.json({ success: false, error: "Failed to delete DB row" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUBLICATIONS DELETE ERROR:", err);
    return NextResponse.json({ success: false, error: err.message || "Unknown error" }, { status: 500 });
  }
}
