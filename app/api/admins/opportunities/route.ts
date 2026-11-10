import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function POST(req: Request) {
  const formData = await req.formData();

  const position = (formData.get("position") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const link = (formData.get("link") as string)?.trim() || null;
  const isEdit = formData.get("isEdit") === "true";
  const id = (formData.get("id") as string) || null;

  const imageFile = formData.get("image") as File | null;

  // basic validation
  if (!position || !description) {
    return NextResponse.json({ success: false, error: "Position and description required" }, { status: 400 });
  }

  // For new: require image; for edit: optional
  if (!isEdit && !imageFile) {
    return NextResponse.json({ success: false, error: "Image is required for new opportunity" }, { status: 400 });
  }

  if (isEdit && !id) {
    return NextResponse.json({ success: false, error: "id is required for edit" }, { status: 400 });
  }

  let imagePath: string | null = null;

  // If imageFile uploaded — upload new image
  if (imageFile) {
    const ext = imageFile.name.split('.').pop();
    imagePath = `images/${Date.now()}-${Math.random().toString(36)}.${ext}`;
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from("opportunity-images")
      .upload(imagePath, imageFile);
    
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return NextResponse.json({ success: false, error: "Failed to upload image" }, { status: 500 });
    }
  }

  if (isEdit) {
    // Fetch old record
    const { data: old, error: fetchErr } = await supabaseAdmin
      .from("opportunities")
      .select("*")
      .eq("id", id)
      .single();
    
    if (fetchErr || !old) {
      return NextResponse.json({ success: false, error: "Opportunity not found" }, { status: 404 });
    }

    // If new image uploaded — delete old one
    if (imagePath && old.image) {
      await supabaseAdmin
        .storage
        .from("opportunity-images")
        .remove([old.image])
        .catch(() => {});
    }

    // Build update object
    const updateObj: any = {
      position,
      description,
      link: link || null,
    };
    if (imagePath) updateObj.image = imagePath;

    // Perform update
    const { data: updated, error: dbErr } = await supabaseAdmin
      .from("opportunities")
      .update(updateObj)
      .eq("id", id)
      .select()
      .single();

    if (dbErr) {
      console.error("DB update error:", dbErr);
      return NextResponse.json({ success: false, error: "Failed to update opportunity" }, { status: 500 });
    }

    return NextResponse.json({ success: true, opportunity: updated });
  } else {
    // New insertion
    const { data, error: dbErr } = await supabaseAdmin
      .from("opportunities")
      .insert({
        position,
        description,
        image: imagePath,
        link: link || null,
      })
      .select()
      .single();

    if (dbErr) {
      console.error("DB insert error:", dbErr);
      return NextResponse.json({ success: false, error: "Failed to create opportunity" }, { status: 500 });
    }

    return NextResponse.json({ success: true, opportunity: data });
  }
}