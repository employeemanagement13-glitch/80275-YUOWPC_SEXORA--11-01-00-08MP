"use client";

import React from "react";

const CARD_DARK = "#f6f6f6";

interface Props {
  icon: React.ReactNode;
  value: string;
  label: string;
  accentColor: string;
}

export default function IconCard({ icon, value, label, accentColor }: Props) {
  return (
    <div className={`p-4 rounded-xl ${CARD_DARK} border border-[#eaeaea] w-40 h-40 flex flex-col items-center`}>
      <div className="p-2 rounded-full mb-2" style={{ backgroundColor: accentColor }}>
        {icon}
      </div>
      <div className="text-[#454648] text-xl font-bold">{value}</div>
      <div className="text-[#454648]/70 text-xs text-center">{label}</div>
    </div>
  );
}
