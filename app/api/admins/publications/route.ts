import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function POST(req: Request) {
  const formData = await req.formData();

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const isEdit = formData.get("isEdit") === "true";
  const id = (formData.get("id") as string) || null;

  const bannerFile = formData.get("banner") as File | null;
  const pdfFile = formData.get("file") as File | null;

  // basic validation
  if (!title || !description) {
    return NextResponse.json({ success: false, error: "Title and description required" }, { status: 400 });
  }

  // For new: require both files; for edit: optional
  if (!isEdit) {
    if (!bannerFile || !pdfFile) {
      return NextResponse.json({ success: false, error: "Banner image and PDF file are required" }, { status: 400 });
    }
  } else {
    if (!id) {
      return NextResponse.json({ success: false, error: "id is required for edit" }, { status: 400 });
    }
  }

  let bannerPath: string | null = null;
  let pdfPath: string | null = null;

  // If bannerFile uploaded — upload new and mark path
  if (bannerFile) {
    const ext = bannerFile.name.split('.').pop();
    bannerPath = `banners/${Date.now()}-${Math.random().toString(36)}.${ext}`;
    const { error: err1 } = await supabaseAdmin
      .storage
      .from("publication-images")
      .upload(bannerPath, bannerFile);
    if (err1) {
      console.error("Error uploading banner:", err1);
      return NextResponse.json({ success: false, error: "Failed to upload banner" }, { status: 500 });
    }
  }

  // If pdfFile uploaded — upload new pdf
  if (pdfFile) {
    const ext = pdfFile.name.split('.').pop();
    pdfPath = `files/${Date.now()}-${Math.random().toString(36)}.${ext}`;
    const { error: err2 } = await supabaseAdmin
      .storage
      .from("publication-files")
      .upload(pdfPath, pdfFile);
    if (err2) {
      console.error("Error uploading PDF:", err2);
      return NextResponse.json({ success: false, error: "Failed to upload PDF" }, { status: 500 });
    }
  }

  if (isEdit) {
    // Fetch old record
    const { data: old, error: fetchErr } = await supabaseAdmin
      .from("publications")
      .select("*")
      .eq("id", id)
      .single();
    if (fetchErr || !old) {
      return NextResponse.json({ success: false, error: "Publication not found" }, { status: 404 });
    }

    // If new files uploaded — delete old ones
    if (bannerPath && old.banner_image) {
      await supabaseAdmin
        .storage
        .from("publication-images")
        .remove([old.banner_image])
        .catch(() => {});
    }
    if (pdfPath && old.file_path) {
      await supabaseAdmin
        .storage
        .from("publication-files")
        .remove([old.file_path])
        .catch(() => {});
    }

    // Build update object
    const updateObj: any = {
      title,
      description,
    };
    if (bannerPath) updateObj.banner_image = bannerPath;
    if (pdfPath) updateObj.file_path = pdfPath;

    // Perform update
    const { data: updated, error: dbErr } = await supabaseAdmin
      .from("publications")
      .update(updateObj)
      .eq("id", id)
      .select()
      .single();

    if (dbErr) {
      console.error("DB update error:", dbErr);
      return NextResponse.json({ success: false, error: "Failed to update publication" }, { status: 500 });
    }

    return NextResponse.json({ success: true, publication: updated });
  } else {
    // New insertion
    const { data, error: dbErr } = await supabaseAdmin
      .from("publications")
      .insert({
        title,
        description,
        banner_image: bannerPath!,
        file_path: pdfPath!,
      })
      .select()
      .single();

    if (dbErr) {
      console.error("DB insert error:", dbErr);
      return NextResponse.json({ success: false, error: "Failed to create publication" }, { status: 500 });
    }

    return NextResponse.json({ success: true, publication: data });
  }
}
