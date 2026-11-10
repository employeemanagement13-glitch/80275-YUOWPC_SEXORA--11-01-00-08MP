// /proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-up(.*)",
  "/sign-in(.*)",
  // other public paths...
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isAdminRoute(req)) {
    return redirectToSignIn();
  }

  if (!isPublicRoute(req)) {
    await auth.protect();  // or your custom logic
  }

  // If signed in — allow; actual admin-role check happens later in server code
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin(.*)"],
};
