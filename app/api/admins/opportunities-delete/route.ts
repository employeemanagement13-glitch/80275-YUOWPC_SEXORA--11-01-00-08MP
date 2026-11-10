import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "id required" }, { status: 400 });
    }

    // Fetch the opportunity record to get image path
    const { data: opp, error: fetchErr } = await supabaseAdmin
      .from("opportunities")
      .select("image")
      .eq("id", id)
      .single();

    if (fetchErr) {
      console.error("Error fetching opportunity:", fetchErr);
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    if (!opp) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    // Attempt to delete image if exists
    if (opp.image) {
      const delImg = await supabaseAdmin
        .storage
        .from("opportunity-images")
        .remove([opp.image]);
      
      if (delImg.error) {
        console.warn("Failed to delete image:", delImg.error);
      }
    }

    // Delete the database record
    const { error: dbErr } = await supabaseAdmin
      .from("opportunities")
      .delete()
      .eq("id", id);

    if (dbErr) {
      console.error("DB delete error:", dbErr);
      return NextResponse.json({ success: false, error: "Failed to delete DB row" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("OPPORTUNITIES DELETE ERROR:", err);
    return NextResponse.json({ success: false, error: err.message || "Unknown error" }, { status: 500 });
  }
}