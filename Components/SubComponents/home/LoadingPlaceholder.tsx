"use client";
import React from "react";

interface LoadingCardPlaceholderProps {
  type?: "solution" | "blog";
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const LoadingCardPlaceholder: React.FC<LoadingCardPlaceholderProps> = ({
  type = "solution",
  height,
  className = "",
  style = {},
}) => {
  if (type === "blog") {
    return (
      <div
        className={`bg-[#f6f6f6] rounded-xl overflow-hidden flex flex-col animate-pulse-slow ${className}`}
        style={{ height: height || 400, ...style }}
      >
        {/* Placeholder Image */}
        <div className="h-48 bg-[#f6f6f6] shrink-0"></div>

        {/* Placeholder Text */}
        <div className="p-6 grow space-y-4">
          <div className="h-4 bg-neutral-700 w-1/3 rounded"></div>
          <div className="h-6 bg-neutral-600 w-full rounded"></div>
          <div className="h-6 bg-neutral-600 w-5/6 rounded"></div>
          <div className="h-4 bg-neutral-700 w-full rounded"></div>
          <div className="h-4 bg-neutral-700 w-4/5 rounded"></div>
          <div className="h-4 bg-neutral-700 w-1/2 rounded"></div>
        </div>
      </div>
    );
  }

  // Default: solution placeholder
  return (
    <div
      className={`bg-[#f6f6f6] border border-[#f6f6f6] rounded-xl p-8 md:p-10 flex flex-col animate-pulse ${className}`}
      style={{ height: height || 310, ...style }}
    >
      {/* Title Placeholder */}
      <div className="h-7 bg-[#f6f6f6] w-3/4 rounded mb-5"></div>

      {/* Bullet/Description Placeholder */}
      <div className="space-y-3">
        <div className="h-4 bg-[#f6f6f6] w-full rounded"></div>
        <div className="h-4 bg-[#f6f6f6] w-11/12 rounded"></div>
        <div className="h-4 bg-[#f6f6f6] w-4/5 rounded"></div>
      </div>
    </div>
  );
};

export default LoadingCardPlaceholder;
