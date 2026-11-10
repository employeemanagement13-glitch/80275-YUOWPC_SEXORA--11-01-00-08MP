"use client";

import React from "react";

const CARD_DARK = "#f6f6f6";

export default function CarDetailsCard() {
  return (
    <div
      className="p-4 rounded-md shadow-2xl text-sm font-mono absolute w-60"
      style={{
        backgroundColor: CARD_DARK,
        borderColor: "#eaeaea",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="text-[#454648] text-lg font-bold mb-2 border-b border-[#eaeaea] pb-1">
        MERCEDES-BENZ
      </div>

      <div className="grid grid-cols-2 gap-2 text-[#454648]/70">
        <span className="font-semibold">MODEL</span>
        <span className="text-[#454648]">E-Class</span>

        <span className="font-semibold">COLOR</span>
        <span className="text-[#454648]">Black</span>

        <span className="font-semibold">NO PLATE</span>
        <span className="text-[#454648]">*****</span>
      </div>
    </div>
  );
}
