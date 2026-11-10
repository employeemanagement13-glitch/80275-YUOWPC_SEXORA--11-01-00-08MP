"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ExternalLink, ShieldCheck } from "lucide-react";

const ADMIN_LINKS = [
  { label: "Products", href: "/admin/products" },
  { label: "Solutions", href: "/admin/solutions" },
  { label: "Blogs", href: "/admin/blogs" },
  { label: "Opportunities", href: "/admin/opportunities" },
  { label: "Publications", href: "/admin/publications" },
  { label: "Contact Messages", href: "/admin/contact" },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#eaeaea] font-sans">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Logo & Admin Badge */}
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="flex items-center gap-3 group">
            <Image
              src="/Aroxes Logo.png"
              alt="Aroxes Logo"
              width={140}
              height={40}
              priority
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="inline-flex items-center gap-1 text-[#225e4d] text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#225e4d]/10 border border-[#225e4d]/25">
              <ShieldCheck size={13} className="text-[#225e4d]" />
              Admin
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 bg-[#f6f6f6] p-1 rounded-xl border border-[#eaeaea]">
          {ADMIN_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#225e4d] text-white font-semibold shadow-sm"
                    : "text-[#454648] hover:text-[#225e4d] hover:bg-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* View Public Site Link */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#454648] hover:text-[#225e4d] bg-white border border-[#eaeaea] hover:border-[#225e4d] transition-colors shadow-sm"
          >
            <span>View Site</span>
            <ExternalLink size={12} className="text-[#454648]/70" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-[#454648] hover:text-[#225e4d] p-2 rounded-lg hover:bg-[#f6f6f6] transition-colors"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-[#eaeaea] px-5 py-4 space-y-1.5">
          {ADMIN_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#225e4d] text-white font-semibold"
                    : "text-[#454648] hover:bg-[#f6f6f6] hover:text-[#225e4d]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#eaeaea]">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 text-xs text-[#454648] hover:text-[#225e4d] rounded-lg hover:bg-[#f6f6f6]"
            >
              <span>View Public Site</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
