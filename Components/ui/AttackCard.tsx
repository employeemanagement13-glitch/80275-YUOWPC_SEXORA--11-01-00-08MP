"use client";

import React, { useEffect, useRef } from "react";

const ACCENT_RED = "#225e4d";
const CARD_DARK = "#1F1F1F";

interface Props {
  percentage: string;
  label: string;
  isUp: boolean;
}

export default function AttackCard({ percentage, label, isUp }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isUp) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const width = canvas.width;
    const height = canvas.height;

    let progress = 0;
    let points: number[] = [];

    // Generate rising-only random points
    function generatePoints() {
      points = [];
      let current = height - 2;

      for (let i = 0; i < 40; i++) {
        current -= Math.random() * 2.5; // slower rise (looks better in small width)
        if (current < 5) current = 5;
        points.push(current);
      }
    }

    generatePoints();

    function draw() {
      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = ACCENT_RED;

      const step = width / (points.length - 1);
      const visiblePoints = Math.floor(progress * points.length);

      for (let i = 0; i < visiblePoints; i++) {
        const x = i * step;
        const y = points[i];

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();

      if (progress < 1) {
        progress += 0.02; // faster animation for small width
        requestAnimationFrame(draw);
      }
    }

    draw();
  }, [isUp]);

  return (
    <div className={`p-4 rounded-xl shadow-xl w-48 bg-[#f6f6f6] border border-[#eaeaea]`}>
      <div className="h-6 mb-2 flex items-end">
        {isUp ? (
          <canvas ref={canvasRef} width={120} height={24} />
        ) : (
          <div className="h-full w-full bg-[#eaeaea] rounded-full"></div>
        )}
      </div>

      <div className="flex items-center">
        <div
          className="text-white text-sm font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: ACCENT_RED }}
        >
          {label}
        </div>

        <div className="text-white text-2xl font-bold ml-3" style={{ color: "#ff292d" }}>
          {percentage}
        </div>
      </div>
    </div>
  );
}
