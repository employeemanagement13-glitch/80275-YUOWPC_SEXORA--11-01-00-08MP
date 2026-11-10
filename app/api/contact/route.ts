import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email?.trim();
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    const payload = {
      source: body.source || "contact",
      solution_slug: body.solution_slug || null,
      solution_title: body.solution_title || null,
      first_name: body.first_name?.trim() || null,
      last_name: body.last_name?.trim() || null,
      full_name:
        body.full_name?.trim() ||
        `${body.first_name || ""} ${body.last_name || ""}`.trim() ||
        null,
      email: email,
      company_name: body.company_name?.trim() || null,
      phone: body.phone?.trim() || null,
      required_service: body.required_service?.trim() || null,
      details: body.details?.trim() || null,
      is_highlighted: false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("contacts")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Error inserting contact submission:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/contact error:", err);
    return NextResponse.json(
      { success: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
