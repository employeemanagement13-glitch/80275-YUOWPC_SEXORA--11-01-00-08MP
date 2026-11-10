// app/api/admin/solutions/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

const BUCKET = "solutions-images"; // <-- as you confirmed

type JsonObj = { title?: string; desc?: string; [k: string]: any };

function parseJSON(val: any) {
  if (!val) return null;
  try {
    if (typeof val === "string") return JSON.parse(val);
    return val;
  } catch {
    return null;
  }
}

function makeSlugFromTitle(t: string) {
  return t
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function ensureUniqueSlug(initialSlug: string) {
  let slug = initialSlug;
  let i = 0;
  while (true) {
    const { data, error } = await supabaseAdmin
      .from("solutions")
      .select("id")
      .eq("slug", slug)
      .limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return slug;
    i++;
    slug = `${initialSlug}-${Date.now().toString(36).slice(-5)}-${i}`;
  }
}

// upload File (File from req.formData())
async function uploadFile(file: File) {
  const ext = file.name.split(".").pop();
  const path = `banner/${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file as any, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrl } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return publicUrl.publicUrl;
}

function getFormField(fd: FormData, key: string) {
  const v = fd.get(key);
  if (v === null) return null;
  // if it's a File, return it as-is
  if (v instanceof File) return v;
  if (typeof v === "string") {
    // allow "null" string to indicate null
    if (v === "null") return null;
    return v;
  }
  return String(v);
}

export async function POST(req: Request) {
  try {
    const fd = await req.formData();
    
    const title = getFormField(fd, "title") as string | null;
    if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

    let slug = (getFormField(fd, "slug") as string) || makeSlugFromTitle(title);
    slug = await ensureUniqueSlug(slug);
    
    // handle banner file
    let banner_image: string | null = null;
    const bannerFile = fd.get("banner_image") as File | null;
    if (bannerFile && bannerFile.size > 0) {
      banner_image = await uploadFile(bannerFile);
    }
    
    console.log("The Category is : ", getFormField(fd, "category"))
    const payload: any = {
      title,
      slug,
      description: getFormField(fd, "description"),
      name: getFormField(fd, "name"),
      category: getFormField(fd, "category"),
      headtitle: getFormField(fd, "headtitle"),
      headerdesc: getFormField(fd, "headerdesc"),
      formtitle: getFormField(fd, "formtitle"),
      formdesc: getFormField(fd, "formdesc"),
      checkboxtitle: getFormField(fd, "checkboxtitle"),
      banner_image,
      updated_at: new Date().toISOString(),

      // arrays (string)
      formcheckboxes: parseJSON(getFormField(fd, "formcheckboxes")),
      benefitsofservice: parseJSON(getFormField(fd, "benefitsofservice")),
      typesofservice: parseJSON(getFormField(fd, "typesofservice")),
      deliverables: parseJSON(getFormField(fd, "deliverables")),
      whoconsider: parseJSON(getFormField(fd, "whoconsider")),

      // arrays of objects
      whydoyouneed: parseJSON(getFormField(fd, "whydoyouneed")),
      methodology: parseJSON(getFormField(fd, "methodology")),
      keycomponents: parseJSON(getFormField(fd, "keycomponents")),
      frameworks: parseJSON(getFormField(fd, "frameworks")),
      capabilities: parseJSON(getFormField(fd, "capabilities")),
      whyus: parseJSON(getFormField(fd, "whyus")),
      whatyouget: parseJSON(getFormField(fd, "whatyouget")),
      procedure: parseJSON(getFormField(fd, "procedure")),
      matters: parseJSON(getFormField(fd, "matters")),
      differences: parseJSON(getFormField(fd, "differences")),
      ourapproach: parseJSON(getFormField(fd, "ourapproach")),
    };

    const { data, error } = await supabaseAdmin
      .from("solutions")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/admins/solutions error:", err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const fd = await req.formData();
    const id = getFormField(fd, "id") as string | null;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const title = getFormField(fd, "title") as string | null;

    let slug = (getFormField(fd, "slug") as string) || (title ? makeSlugFromTitle(title) : null);
    if (slug) slug = await ensureUniqueSlug(slug);

    // banner: either new file or old url
    let banner_image = getFormField(fd, "banner_image_old") as string | null;
    const bannerFile = fd.get("banner_image") as File | null;
    if (bannerFile && bannerFile.size > 0) {
      banner_image = await uploadFile(bannerFile);
    }

    const updatePayload: any = {
      title,
      slug,
      description: getFormField(fd, "description"),
      name: getFormField(fd, "name"),
      category: getFormField(fd, "category"),
      headtitle: getFormField(fd, "headtitle"),
      headerdesc: getFormField(fd, "headerdesc"),
      formtitle: getFormField(fd, "formtitle"),
      formdesc: getFormField(fd, "formdesc"),
      checkboxtitle: getFormField(fd, "checkboxtitle"),
      banner_image,
      updated_at: new Date().toISOString(),

      // arrays
      formcheckboxes: parseJSON(getFormField(fd, "formcheckboxes")),
      benefitsofservice: parseJSON(getFormField(fd, "benefitsofservice")),
      typesofservice: parseJSON(getFormField(fd, "typesofservice")),
      deliverables: parseJSON(getFormField(fd, "deliverables")),
      whoconsider: parseJSON(getFormField(fd, "whoconsider")),

      // object arrays
      whydoyouneed: parseJSON(getFormField(fd, "whydoyouneed")),
      methodology: parseJSON(getFormField(fd, "methodology")),
      keycomponents: parseJSON(getFormField(fd, "keycomponents")),
      frameworks: parseJSON(getFormField(fd, "frameworks")),
      capabilities: parseJSON(getFormField(fd, "capabilities")),
      whyus: parseJSON(getFormField(fd, "whyus")),
      whatyouget: parseJSON(getFormField(fd, "whatyouget")),
      procedure: parseJSON(getFormField(fd, "procedure")),
      matters: parseJSON(getFormField(fd, "matters")),
      differences: parseJSON(getFormField(fd, "differences")),
      ourapproach: parseJSON(getFormField(fd, "ourapproach")),
    };

    const { data, error } = await supabaseAdmin
      .from("solutions")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("PUT /api/admins/solutions error:", err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
