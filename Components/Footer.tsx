"use client";
import React, { useState, useEffect } from 'react';
import { getNavData } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { NavColumn } from '@/types/dataType';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const [navData, setNavData] = useState<NavColumn[]>([]);

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const data = await getNavData();
        setNavData(data);
      } catch (err) {
        console.error("Failed to fetch footer nav data", err);
      }
    };
    fetchNavData();
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-white py-16 md:py-24 font-sans text-[#454648]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="md:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/Aroxes Logo.png"
                alt="Aroxes logo"
                width={160}
                height={50}
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </Link>
            <p className="sm:text-base text-sm text-[#454648]/80 leading-relaxed max-w-lg">
              We bring 5+ years of combined leadership experience and advanced AI to enterprise software engineering. We build custom ERP and SaaS systems that solve real operational problems, helping growing enterprises scale with smart, future-ready automation.
            </p>
          </div>

          {navData.map((column) => (
            <div key={column.title} className="md:col-span-1">
              <h4 className="text-lg font-semibold mb-6 text-[#454648] whitespace-nowrap">
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm sm:text-base text-[#454648]/70 hover:text-[#225e4d] transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;