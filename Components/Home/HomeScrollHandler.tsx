"use client";

import { useEffect, useRef } from "react";

export default function HomeScrollHandler() {
  const SCROLL_DISTANCE_PX = 2000;
  const tickingRef = useRef(false);

  // Handle hash-based navigation (e.g. /#gothacked from another page)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);

      const timeoutId = setTimeout(() => {
        requestAnimationFrame(() => {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const progress = Math.min(1, scrolled / SCROLL_DISTANCE_PX);
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
