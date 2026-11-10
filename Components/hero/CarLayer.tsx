// Components/hero/CarLayer.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const ACCENT_RED = "#EF4444";

interface Props {
  scrollProgress: number;
}

// Smooth easing functions
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number): number => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function CarLayer({ scrollProgress }: Props) {
  const isDesktop = useIsDesktop();
  const [hasScrolled, setHasScrolled] = useState(false);
  
  useEffect(() => {
    if (scrollProgress > 0) {
      setHasScrolled(true);
    }
  }, [scrollProgress]);
  
  // MOBILE/TABLET (below md) - Fixed position, no scaling
  if (!isDesktop) {
    return (
      <div
        className="absolute left-1/2 transform -translate-x-1/2 overflow-hidden select-none pointer-events-none bottom-0"
        style={{
          width: "min(85vw, 400px)", // More compact for overlap safety and tighter spacing
          height: "auto",
          aspectRatio: "900/500",
          zIndex: 20,
          backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent)",
          borderRadius: "0.75rem 0.75rem 0 0",
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 z-0 bg-gray-900/60"></div>

        {/* PROTECTED VIDEO BACKGROUND */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-40 z-1 pointer-events-none select-none"
          src="/video/animation.mp4"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          controls={false}
          style={{
            filter: "brightness(1.2) contrast(1.1) saturate(1.1)",
          }}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    );
  }

  // DESKTOP (md and above) - Animated version
  
  // Phase 1: Move video upward (0% to 40% scroll progress)
  const PHASE1_END = 0.4;
  const phase1Progress = Math.min(scrollProgress / PHASE1_END, 1);
  
  // Video starts at 75% and moves to 55%
  const initialTop = "75%";
  const centerTop = "55%";
  const movementDistance = 20; // 75% to 55% = 20% movement
  
  const easedPhase1Progress = easeOutCubic(phase1Progress);
  const currentTop = `calc(${initialTop} - ${easedPhase1Progress * movementDistance}%)`;

  // Phase 2: Scale video (40% to 100% scroll progress)
  const phase2Start = PHASE1_END;
  const phase2Progress = Math.max(0, (scrollProgress - phase2Start) / (1 - phase2Start));
  
  // Base dimensions
  const baseWidth = 500;
  const baseHeight = 270;
  const aspectRatio = baseHeight / baseWidth;
  
  // Calculate scale - ONLY scale to full width (100vw)
  let carScale = 1;
  
  if (scrollProgress > phase2Start) {
    const easedPhase2Progress = easeInOutCubic(phase2Progress);
    // Scale only to full width, not full viewport
    const maxWidthScale = typeof window !== "undefined" ? window.innerWidth / baseWidth : 1;
    carScale = 1 + easedPhase2Progress * (maxWidthScale - 1);
  }

  // Calculate current dimensions based on scale
  const currentWidth = baseWidth * carScale;
  const currentHeight = baseHeight * carScale;
  
  // Center the video
  const translateX = "-50%";
  const translateY = scrollProgress > phase2Start ? "-50%" : "-50%";

  return (
    <div
      className="absolute left-1/2 overflow-hidden select-none pointer-events-none"
      style={{
        top: currentTop,
        width: `${currentWidth}px`,
        height: `${currentHeight}px`,
        transform: `translate(${translateX}, ${translateY})`,
        transformOrigin: "center center",
        zIndex: 20,
        backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent)",
        borderRadius: "0.75rem",
        transition: hasScrolled 
          ? "width 0.3s cubic-bezier(0.33, 1, 0.68, 1), height 0.3s cubic-bezier(0.33, 1, 0.68, 1), top 0.3s cubic-bezier(0.33, 1, 0.68, 1)" 
          : "none",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 z-0 bg-gray-900/60"></div>

      {/* PROTECTED VIDEO BACKGROUND */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-40 z-1 pointer-events-none select-none"
        src="/video/animation.mp4"
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        controls={false}
        style={{
          filter: "brightness(1.2) contrast(1.1) saturate(1.1)",
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}