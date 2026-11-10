import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function getSolutionBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("solutions")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;

  return data;
}
