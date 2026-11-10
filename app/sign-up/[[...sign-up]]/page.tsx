// app/sign-up/[[...sign-up]]/page.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import the SignUp component with SSR disabled.
const SignUp = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignUp),
  { ssr: false }
);

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff]">
      <SignUp path="/sign-up" routing="path" />
    </div>
  );
}
