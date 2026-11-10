// app/api/admin/solutions-get/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    // optional q parameter
    const q = searchParams.get("q") || "";

    let query = supabaseAdmin.from("solutions").select("*");

    if (q.trim() !== "") {
      // use ilike OR to search few columns
      query = query.or(
        `title.ilike.%${q}%,description.ilike.%${q}%,name.ilike.%${q}%`
      );
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/admins/solutions-get error:", err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
