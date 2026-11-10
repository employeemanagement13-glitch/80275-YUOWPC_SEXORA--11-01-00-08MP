// app/api/admins/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("admins")
      .select("email");

    if (error) {
      console.error("GET /api/admins error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const emails = Array.isArray(data) ? data.map((r: any) => String(r.email).toLowerCase()) : [];

    return NextResponse.json(emails, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/admins error:", err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
