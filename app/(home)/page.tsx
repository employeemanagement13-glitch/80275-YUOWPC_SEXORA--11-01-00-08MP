import React from "react";
import Hero from "@/Components/Hero";
import HomeScrollHandler from "@/Components/Home/HomeScrollHandler";

export default function HomePage() {
  return (
    <div className="bg-[#ffffff]">
      <HomeScrollHandler />
      <Hero />
    </div>
  );
}