"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ChevronDown, Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Solutions", href: "/solutions", hasDropdown: false },
  { label: "Products", href: "/products", hasDropdown: false },
  // { label: "Publications", href: "/publications" },
  { label: "Blogs", href: "/blogs" },
  // { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkedAdmin, setCheckedAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // On mount, fetch admins list and combine with Clerk client-side user to determine access.
  const { user, isLoaded } = useUser();

  useEffect(() => {
    let mounted = true;
    async function checkAdmin() {
      try {
        // derive email from Clerk user when available
        const emailFromUser = isLoaded && user
          ? (user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? null)
          : null;

        const email = emailFromUser ? String(emailFromUser).toLowerCase() : null;
        if (mounted) setUserEmail(email);

        if (!email) {
          if (mounted) {
            setIsAdmin(false);
            setCheckedAdmin(true);
            if (pathname?.startsWith('/admin')) {
              router.replace('/');
            }
          }
          return;
        }

        // Check sessionStorage cache first
        const cacheKey = `aroxes_admin_${email}`;
        const cached = typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;
        if (cached !== null) {
          const isAllowed = cached === "true";
          if (mounted) {
            setIsAdmin(isAllowed);
            setCheckedAdmin(true);
            if (pathname?.startsWith('/admin') && !isAllowed) {
              router.replace('/');
            }
          }
          return;
        }

        const adminsRes = await fetch('/api/admins');
        let adminsList: string[] = [];
        if (adminsRes.ok) {
          const data = await adminsRes.json();
          if (Array.isArray(data)) adminsList = data;
        }

        const adminsSet = new Set(
          adminsList
            .filter((e: any) => typeof e === 'string')
            .map((e: string) => e.toLowerCase())
        );

        const allowed = adminsSet.has(email);
        if (typeof window !== "undefined") {
          sessionStorage.setItem(cacheKey, String(allowed));
        }

        if (mounted) {
          setIsAdmin(allowed);
          setCheckedAdmin(true);
        }

        // If user is trying to access /admin/* and is not allowed, send them back to home.
        if (mounted && pathname?.startsWith('/admin') && !allowed) {
          router.replace('/');
        }
      } catch (err) {
        if (mounted) {
          setIsAdmin(false);
          setCheckedAdmin(true);
          setUserEmail(null);
          if (pathname?.startsWith('/admin')) {
            router.replace('/');
          }
        }
      }
    }

    checkAdmin();
    return () => { mounted = false; };
  }, [pathname, router, user, isLoaded]);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eaeaea] bg-white/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/Aroxes Logo.png"
            alt="Aroxes logo"
            width={160}
            height={50}
            priority
            className="h-8 sm:h-9 md:h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="group flex items-center gap-1 text-[15px] font-medium text-[#454648] transition-colors duration-200 hover:text-[#225e4d]"
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown
                    size={16}
                    className="text-[#454648]/70 transition-transform duration-200 group-hover:-rotate-180 group-hover:text-[#225e4d]"
                  />
                )}
              </Link>
            </li>
          ))}

          {/* Admin link: only show when confirmed admin */}
          {isAdmin === true && (
            <li>
              <Link
                href="/admin/contact"
                className="group flex items-center gap-1 text-[15px] font-medium text-[#454648] transition-colors duration-200 hover:text-[#225e4d]"
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop CTA */}
        <Link
          href="/contact"
          className="hidden shrink-0 items-center gap-2 rounded-full bg-[#225e4d] px-5 py-2.5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#1b4d3f] lg:inline-flex"
        >
          Get in touch
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-full border border-[#dfe3e8] p-2 text-[#454648] lg:hidden"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-white transition-[max-height] duration-300 ease-in-out lg:hidden ${isMobileOpen ? "max-h-[28rem]" : "max-h-0"}`}
      >
        <ul className="flex flex-col gap-1 px-5 pb-6 pt-2 sm:px-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-between rounded-lg px-2 py-3 text-[15px] font-medium text-[#454648] hover:bg-[#f6f6f6] hover:text-[#225e4d]"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown size={16} className="text-[#454648]/60" />}
              </Link>
            </li>
          ))}

          {/* Mobile admin link - only when allowed */}
          {isAdmin === true && (
            <li>
              <Link
                href="/admin"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-between rounded-lg px-2 py-3 text-[15px] font-medium text-[#454648] hover:bg-[#f6f6f6] hover:text-[#225e4d]"
              >
                Admin
              </Link>
            </li>
          )}

          <li className="pt-3">
            <Link
              href="/contact"
              onClick={() => setIsMobileOpen(false)}
              className="flex w-full items-center justify-center rounded-full bg-[#225e4d] px-5 py-3 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#1b4d3f]"
            >
              Get in touch
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
