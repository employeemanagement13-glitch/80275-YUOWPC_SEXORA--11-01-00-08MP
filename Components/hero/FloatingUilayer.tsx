// Components/hero/FloatingUILayer.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import AttackCard from "../AttackCard";
import StatsCircle from "../ui/StatusCircle";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import Image from "next/image";

const CARD_DARK = "#f6f6f6";
const ACCENT_RED = "#225e4d";

// ZigZag Animated Line Component
interface ZigZagProgressLineProps {
  color?: string;
  width?: number;
  height?: number;
  duration?: number;
  peaks?: number;
}

const ZigZagProgressLine: React.FC<ZigZagProgressLineProps> = ({
  color = ACCENT_RED,
  width = 120,
  height = 80,
  duration = 1.5,
  peaks = 4,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Calculate progress (0 to 1 for one complete cycle)
      const cycleTime = duration * 1000;
      const cycleProgress = (elapsed % cycleTime) / cycleTime;
      setProgress(cycleProgress);
      
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isAnimating) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isAnimating, duration]);

  // Create zig-zag path with smooth peaks
  const createZigZagPath = () => {
    const points: { x: number; y: number }[] = [];
    const peakHeight = height * 0.8;
    
    // Start point at bottom-left
    points.push({ x: 0, y: height });
    
    // Create zig-zag points with Bezier curves for smooth animation
    const segmentWidth = width / (peaks * 2);
    
    for (let i = 0; i <= peaks * 2; i++) {
      const x = i * segmentWidth;
      let y: number;
      
      if (i % 2 === 0) {
        // Even points - low points
        y = height - (progress * peakHeight * (i / (peaks * 2)));
      } else {
        // Odd points - high points
        y = height - peakHeight - (progress * peakHeight * (1 - i / (peaks * 2)));
      }
      
      // Ensure y stays within bounds
      y = Math.max(2, Math.min(height - 2, y));
      points.push({ x, y });
    }
    
    // End point at top-right
    points.push({ x: width, y: height * 0.2 });
    
    // Create smooth path with cubic Bezier curves
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      
      path += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    
    return path;
  };

  // Create trailing effect path (previous frame)
  const createTrailPath = () => {
    const points: { x: number; y: number }[] = [];
    const peakHeight = height * 0.8;
    const trailProgress = progress - 0.1 < 0 ? progress + 0.9 : progress - 0.1;
    
    points.push({ x: 0, y: height });
    
    const segmentWidth = width / (peaks * 2);
    
    for (let i = 0; i <= peaks * 2; i++) {
      const x = i * segmentWidth;
      let y: number;
      
      if (i % 2 === 0) {
        y = height - (trailProgress * peakHeight * (i / (peaks * 2)));
      } else {
        y = height - peakHeight - (trailProgress * peakHeight * (1 - i / (peaks * 2)));
      }
      
      y = Math.max(2, Math.min(height - 2, y));
      points.push({ x, y });
    }
    
    points.push({ x: width, y: height * 0.2 });
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      
      path += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    
    return path;
  };

  // Create moving dot position
  const getMovingDotPosition = () => {
    const x = width * progress;
    const peakHeight = height * 0.8;
    const segmentWidth = width / (peaks * 2);
    const segmentIndex = Math.floor(x / segmentWidth);
    const segmentProgress = (x % segmentWidth) / segmentWidth;
    
    let y: number;
    
    if (segmentIndex % 2 === 0) {
      // Going up in this segment
      y = height - peakHeight * (segmentIndex / (peaks * 2)) - 
          (peakHeight * segmentProgress / (peaks * 2));
    } else {
      // Going down in this segment
      y = height - peakHeight - 
          peakHeight * (1 - (segmentIndex / (peaks * 2))) + 
          (peakHeight * segmentProgress / (peaks * 2));
    }
    
    // Clamp y position
    y = Math.max(5, Math.min(height - 5, y));
    
    return { x, y };
  };

  // Generate peaks for static background
  const staticPoints = Array.from({ length: peaks * 2 + 2 }, (_, i) => {
    const x = (i * width) / (peaks * 2 + 1);
    const y = height * 0.5 + Math.sin(i * Math.PI / peaks) * height * 0.3;
    return { x, y };
  });

  const staticPath = staticPoints.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = staticPoints[i - 1];
    const midX = (prev.x + point.x) / 2;
    return `${path} C ${midX} ${prev.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="relative overflow-hidden" style={{ width: `${width}px`, height: `${height}px` }}>
      {/* Static background zig-zag */}
      <svg width={width} height={height} className="absolute">
        <path
          d={staticPath}
          stroke={`${color}20`}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="3,3"
        />
      </svg>
      
      {/* Animated trailing line (faded) */}
      <svg width={width} height={height} className="absolute">
        <path
          d={createTrailPath()}
          stroke={`${color}50`}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      
      {/* Main animated zig-zag line */}
      <svg width={width} height={height} className="absolute">
        <path
          d={createZigZagPath()}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Animated moving dot */}
        <circle
          cx={getMovingDotPosition().x}
          cy={getMovingDotPosition().y}
          r="4"
          fill="white"
          stroke={color}
          strokeWidth="2"
        >
          <animate
            attributeName="r"
            values="4;5;4"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </circle>
        
        {/* Glow effect */}
        <path
          d={createZigZagPath()}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.2"
          filter="url(#glow)"
        />
        
        {/* SVG filter for glow */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
      
      {/* Progress indicator text */}
      <div className="absolute bottom-1 left-1 text-[10px] text-[#454648]/70">
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
};

// Mobile version - simpler continuous zig-zag
const MobileZigZagProgressLine: React.FC<ZigZagProgressLineProps> = ({
  color = ACCENT_RED,
  height = 60,
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    let animationId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Complete animation every 3 seconds and repeat
      const progress = (elapsed % 3000) / 3000;
      setAnimationProgress(progress);
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Calculate points for zig-zag
  const zigZagPoints = Array.from({ length: 7 }, (_, i) => {
    const x = (i * 100) / 6; // 0 to 100%
    const amplitude = height * 0.3;
    const frequency = 2;
    
    // Moving wave effect
    const waveOffset = animationProgress * Math.PI * 2;
    const y = height / 2 + Math.sin(i * frequency + waveOffset) * amplitude;
    
    return { x, y };
  });

  // Create SVG path from points
  const createPath = () => {
    let path = `M ${zigZagPoints[0].x} ${zigZagPoints[0].y}`;
    
    for (let i = 1; i < zigZagPoints.length; i++) {
      const prev = zigZagPoints[i - 1];
      const curr = zigZagPoints[i];
      const midX = (prev.x + curr.x) / 2;
      
      // Smooth curve between points
      path += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    
    return path;
  };

  // Calculate moving dot position
  const dotX = animationProgress * 100;
  const dotY = height / 2 + Math.sin(animationProgress * Math.PI * 2) * height * 0.3;

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <svg
        width="100%"
        height={height}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        {/* Background static line */}
        <path
          d="M0,50 C20,30 40,70 60,30 S80,70 100,50"
          stroke={`${color}20`}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="2,2"
        />
        
        {/* Animated zig-zag line */}
        <path
          d={createPath()}
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <animate
            attributeName="d"
            values={
              `M0,${height/2} C20,${height*0.7} 40,${height*0.3} 60,${height*0.7} S80,${height*0.3} 100,${height/2};
               M0,${height/2} C20,${height*0.3} 40,${height*0.7} 60,${height*0.3} S80,${height*0.7} 100,${height/2};
               M0,${height/2} C20,${height*0.7} 40,${height*0.3} 60,${height*0.7} S80,${height*0.3} 100,${height/2}`
            }
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Moving dot */}
        <circle
          cx={dotX}
          cy={dotY}
          r="3"
          fill="white"
          stroke={color}
          strokeWidth="2"
        >
          <animate
            attributeName="r"
            values="3;4;3"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      
      {/* CSS animation for continuous flow */}
      <style jsx>{`
        @keyframes zigzag {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
        }
        
        svg {
          animation: zigzag 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default function FloatingUILayer() {
  const isDesktop = useIsDesktop();

  return (
    <div className="relative w-full h-full max-md:h-fit flex flex-col items-center">
      {/* Badge with responsive font sizes */}
      <div className="mb-2 sm:mb-6 md:mb-8 mt-1 sm:mt-8 md:mt-12 lg:mt-16 xl:mt-16">
        <span
          className="inline-block px-3 sm:px-4 py-1 sm:py-2 text-[10px] xs:text-xs sm:text-sm md:text-base font-medium rounded-full border border-gray-700"
          style={{ backgroundColor: CARD_DARK }}
        >
          Cybersecurity Solutions Provider
        </span>
      </div>

      {/* Main Heading with responsive font sizes */}
      <h1 className="text-center text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold tracking-tight mb-3 sm:mb-10 md:mb-12 px-2 xs:px-3 sm:px-4 max-w-5xl mx-auto leading-tight">
        Keep your apps safe <br className="hidden xs:block" /> & secure
      </h1>

      {/* MOBILE LAYOUT (below md) - Vertical stacking, no overlap */}
      <div className="max-md:hidden md:hidden w-full max-w-sm xs:max-w-md mx-auto space-y-6 px-2 xs:px-4">
        {/* Top Row - Left Card and Right Stats */}
        <div className="flex flex-row-reverse xs:flex-row justify-between items-stretch gap-4 xs:gap-6">
          {/* Left Card */}
          <div className="flex flex-col items-center bg-[#f6f6f6] px-3 xs:px-4 py-3 xs:py-4 rounded-xl w-fit xs:w-1/2">
            <div className="mb-3 p-2 xs:p-3 rounded-full bg-white shadow-xl flex items-center justify-center w-10 h-10 xs:w-12 xs:h-12 relative">
              <Lock className="text-orange-500 w-4 h-4 xs:w-5 xs:h-5" />
              <div className="absolute -top-1 -right-1 text-[10px] xs:text-xs font-bold bg-white text-gray-800 px-1 xs:px-1.5 py-0.5 rounded-full shadow-md border border-gray-200">
                7.5M+
              </div>
            </div>
            <div
              className="px-3 xs:px-4 py-2 xs:py-2.5 rounded-full text-white font-semibold text-xs xs:text-sm whitespace-nowrap"
              style={{ backgroundColor: ACCENT_RED }}
            >
              Attacks in 2025
            </div>
          </div>

          {/* Right Stats with Progress Line */}
          <div className="flex flex-col items-center px-3 xs:px-4 py-3 xs:py-4 rounded-xl w-fit max-md:flex-row xs:w-1/2">
            <div className="scale-75 xs:scale-90">
              <StatsCircle value="+90%" label="Secure" color={ACCENT_RED} />
            </div>
          </div>
        </div>

        {/* Bottom Row - Attack Card and Safety Stats */}
        <div className="flex flex-row-reverse xs:flex-row justify-between items-center gap-4 xs:gap-6">
          {/* Left Attack Card */}
          <div className="w-full xs:w-1/2">
            <AttackCard percentage="+58%" label="Result" isUp={true} />
          </div>

          {/* Right Stats Circle */}
          <div className="w-full xs:w-1/2 flex justify-center">
            <div className="scale-75 xs:scale-90">
              <StatsCircle value="+50%" label="Keeps safe" color={ACCENT_RED} />
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP/TABLET LAYOUT (md and above) */}
      <div className="hidden md:block relative w-full max-w-7xl mx-auto h-[400px] lg:h-[500px] xl:h-[600px]">
        {/* Left Side Content */}
        <div 
          className="absolute flex flex-col items-center bg-[#f6f6f6] px-5 py-4 rounded-xl"
          style={{
            left: "5%",
            top: "10%",
            width: "clamp(150px, 15vw, 200px)",
            zIndex: 10,
          }}
        >
          {/* <div className="mb-3 p-3 rounded-full bg-white shadow-xl flex items-center justify-center w-fit h-fit relative overflow-hidden"> */}
            <Image src={"/lock.gif"} height={100} width={100} alt="Lock" className="w-16 h-14 rounded-full"/> 
          {/* </div> */}

          <div className="absolute top-3 right-4 text-sm font-bold bg-white text-gray-800 px-2 py-1 rounded-full shadow-md border border-gray-200">
            7.5M+
          </div>

          <div
            className="mt-3 px-5 py-3 rounded-full text-white font-semibold text-base whitespace-nowrap"
            style={{ backgroundColor: ACCENT_RED }}
          >
            Attacks in 2025
          </div>
        </div>

        {/* Left Stats Circle - 90% Apps Compromised */}
        <div 
          className="absolute"
          style={{
            left: "5%",
            top: "45%",
            zIndex: 10,
          }}
        >
          <StatsCircle value="+90%" label="Apps Compromised" color={ACCENT_RED} />
        </div>

        {/* Right Side Attack Card - 58% Result */}
        <div 
          className="absolute"
          style={{
            right: "5%",
            top: "10%",
            zIndex: 10,
          }}
        >
          <AttackCard percentage="+58%" label="Result" isUp={true} />
        </div>

        {/* Right Stats Circle - 50% Keeps safe */}
        <div 
          className="absolute"
          style={{
            right: "5%",
            top: "50%",
            zIndex: 10,
          }}
        >
          <StatsCircle value="+50%" label="Keeps your apps safe" color={ACCENT_RED} />
        </div>
      </div>
    </div>
  );
}