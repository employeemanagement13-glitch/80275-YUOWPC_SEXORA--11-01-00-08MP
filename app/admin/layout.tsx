// app/admin/layout.tsx
"use server";

import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import AdminNavbar from "@/Components/AdminNavbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();  // or const { isSignedIn, userId } = await auth();

  if (!userId) {
    return redirect("/sign-up");
  }

  const user = await currentUser();
  if (!user) {
    return redirect("/sign-up");
  }

  // According to Clerk docs / types, email may exist under primaryEmailAddress
  const maybeEmail = user.primaryEmailAddress?.emailAddress
    ?? user.emailAddresses?.[0]?.emailAddress;

  if (!maybeEmail) {
    // no email found → cannot authorize
    return redirect("/");
  }

  const email = maybeEmail.toLowerCase();

  // Try exact match first (fast). If not found, fallback to a case-insensitive match
  let data;
  const initialQuery = await supabaseAdmin
    .from("admins")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  data = initialQuery.data;

  if (initialQuery.error || !data) {
    // fallback: case-insensitive search using ILIKE
    const res = await supabaseAdmin
      .from("admins")
      .select("email")
      .ilike("email", email)
      .limit(1);
    if (res.error || !res.data || res.data.length === 0) {
      return redirect("/");
    }
    data = res.data[0];
  }

  // allowed
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#454648] flex flex-col font-sans selection:bg-[#225e4d] selection:text-white">
      <AdminNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
