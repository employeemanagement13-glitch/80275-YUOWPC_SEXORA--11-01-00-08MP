// Components/ui/StatusCircle.tsx
"use client";

import React from "react";

interface Props {
  value: string;
  label: string;
  color: string;
}

export default function StatsCircle({ value, label, color }: Props) {
  return (
    <div className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center">
      <div
        className="w-full h-full rounded-full absolute"
        style={{ backgroundColor: color, opacity: 0.8 }}
      ></div>

      <div className="relative z-10 text-white text-center">
        <div className="text-sm xs:text-lg sm:text-xl md:text-2xl font-extrabold leading-none">{value}</div>
        <div className="text-[9px] xs:text-xs sm:text-xs md:text-sm font-medium mt-0.5 xs:mt-1 px-1">{label}</div>
      </div>
    </div>
  );
}