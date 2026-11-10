// Components/AttackCard.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

const ACCENT_RED = "#225e4d";
const CARD_DARK = "#1F1F1F";

interface Props {
  percentage: string;
  label: string;
  isUp: boolean;
}

export default function AttackCard({ percentage, label, isUp }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to get last 5 months from current date
  const getLast5Months = () => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const last5Months = [];
    
    for (let i = 4; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      last5Months.push(months[monthIndex]);
    }
    
    return last5Months;
  };

  const last5Months = getLast5Months();

  useEffect(() => {
    if (!isUp || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      console.error("Canvas context not available");
      return;
    }

    // Set canvas dimensions with 85% width to prevent overflow
    const width = 180 * 0.85; // 85% of original width to keep arrow within bounds
    const height = 96;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    
    canvas.width = 180 * dpr; // Keep original width for canvas element
    canvas.height = height * dpr;
    canvas.style.width = `180px`; // Keep original width for display
    canvas.style.height = `${height}px`;
    
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Calculate horizontal offset to center the 85% width graph
    const horizontalOffset = (180 - width) / 2;

    // Generate points for a nice zigzag pattern (5 segments for 5 months)
    const generatePoints = () => {
      const points: Array<{x: number, y: number}> = [];
      
      // Create a nice zigzag pattern that goes up and down
      // Add horizontalOffset to x values to center the graph
      const segmentPattern = [
        { x: horizontalOffset + 0, y: height * 0.8 },    // Start high
        { x: horizontalOffset + width * 0.2, y: height * 0.4 },  // Down
        { x: horizontalOffset + width * 0.4, y: height * 0.7 },  // Up
        { x: horizontalOffset + width * 0.6, y: height * 0.3 },  // Down
        { x: horizontalOffset + width * 0.8, y: height * 0.9 },  // Up high
        { x: horizontalOffset + width, y: height * 0.5 },        // End middle
      ];
      
      return segmentPattern;
    };

    const points = generatePoints();
    let animationStartTime = 0;
    const animationDuration = 5000; // 5 seconds per complete cycle
    
    // Function to get interpolated point along the line
    const getInterpolatedPoint = (progress: number) => {
      const totalLength = points.length - 1;
      const exactPoint = progress * totalLength;
      const segmentIndex = Math.floor(exactPoint);
      const segmentProgress = exactPoint - segmentIndex;
      
      if (segmentIndex >= points.length - 1) {
        return points[points.length - 1];
      }
      
      const startPoint = points[segmentIndex];
      const endPoint = points[segmentIndex + 1];
      
      // Linear interpolation
      return {
        x: startPoint.x + (endPoint.x - startPoint.x) * segmentProgress,
        y: startPoint.y + (endPoint.y - startPoint.y) * segmentProgress
      };
    };
    
    // Function to get angle for arrow direction
    const getAngleAtProgress = (progress: number) => {
      const totalLength = points.length - 1;
      const exactPoint = progress * totalLength;
      const segmentIndex = Math.min(Math.floor(exactPoint), points.length - 2);
      
      const startPoint = points[segmentIndex];
      const endPoint = points[segmentIndex + 1];
      
      return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    };

    // Enhanced easing function for even smoother motion
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    const easeInOutSine = (t: number): number => {
      return -(Math.cos(Math.PI * t) - 1) / 2;
    };

    const draw = (timestamp: number) => {
      if (!animationStartTime) {
        animationStartTime = timestamp;
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, 180, height);
      
      // Draw subtle grid background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      
      // Horizontal grid lines (within the 85% width area)
      const gridLines = 4;
      for (let i = 1; i <= gridLines; i++) {
        const y = i * (height / (gridLines + 1));
        ctx.beginPath();
        ctx.moveTo(horizontalOffset, y);
        ctx.lineTo(horizontalOffset + width, y);
        ctx.stroke();
      }
      
      // Vertical grid lines (aligned with months, within the 85% width area)
      for (let i = 1; i <= 5; i++) {
        const x = horizontalOffset + i * (width / 6);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Calculate progress with smooth easing
      const elapsed = timestamp - animationStartTime;
      const rawProgress = (elapsed % animationDuration) / animationDuration;
      const easedProgress = easeInOutSine(rawProgress);
      
      // Get current interpolated point for drawing
      const currentPoint = getInterpolatedPoint(easedProgress);
      const currentAngle = getAngleAtProgress(easedProgress);
      
      // Calculate how many segments to draw for the line
      const segmentsToDraw = easedProgress * points.length;
      
      // Draw area under the line with gradient
      if (segmentsToDraw >= 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        // Draw completed segments
        const fullSegments = Math.floor(segmentsToDraw);
        for (let i = 1; i <= fullSegments; i++) {
          if (i < points.length) {
            ctx.lineTo(points[i].x, points[i].y);
          }
        }
        
        // Draw partial segment if we're in the middle of one
        if (fullSegments < points.length - 1) {
          const partialProgress = segmentsToDraw - fullSegments;
          const startSegPoint = points[fullSegments];
          const endSegPoint = points[fullSegments + 1];
          const partialX = startSegPoint.x + (endSegPoint.x - startSegPoint.x) * partialProgress;
          const partialY = startSegPoint.y + (endSegPoint.y - startSegPoint.y) * partialProgress;
          ctx.lineTo(partialX, partialY);
        } else {
          ctx.lineTo(currentPoint.x, currentPoint.y);
        }
        
        // Close the path for fill
        ctx.lineTo(currentPoint.x, height);
        ctx.lineTo(points[0].x, height);
        ctx.closePath();
        
        // Create gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "rgba(255, 27, 31, 0.15)");
        gradient.addColorStop(1, "rgba(255, 27, 31, 0.03)");
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // Draw the main line with smooth interpolation
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      // Draw completed segments with smooth curves
      const fullSegments = Math.floor(segmentsToDraw);
      for (let i = 1; i <= fullSegments; i++) {
        if (i < points.length) {
          const prevPoint = points[i - 1];
          const currentPoint = points[i];
          
          // Use quadratic curves for smooth lines
          const cpX = (prevPoint.x + currentPoint.x) / 2;
          const cpY = (prevPoint.y + currentPoint.y) / 2;
          
          ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpX, cpY);
          ctx.quadraticCurveTo(cpX, cpY, currentPoint.x, currentPoint.y);
        }
      }
      
      // Draw partial segment if we're in the middle of one
      if (fullSegments < points.length - 1) {
        const partialProgress = segmentsToDraw - fullSegments;
        const startPoint = points[fullSegments];
        const endPoint = points[fullSegments + 1];
        
        const currentX = startPoint.x + (endPoint.x - startPoint.x) * partialProgress;
        const currentY = startPoint.y + (endPoint.y - startPoint.y) * partialProgress;
        
        const cpX = (startPoint.x + currentX) / 2;
        const cpY = (startPoint.y + currentY) / 2;
        
        ctx.quadraticCurveTo(startPoint.x, startPoint.y, cpX, cpY);
        ctx.quadraticCurveTo(cpX, cpY, currentX, currentY);
      }
      
      ctx.strokeStyle = ACCENT_RED;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      
      // Draw moving dot at the end with pulsing effect
      const pulse = Math.sin(timestamp * 0.001) * 0.5 + 0.5;
      
      // Outer glow
      ctx.beginPath();
      ctx.arc(currentPoint.x, currentPoint.y, 6 + pulse * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 94, 77, ${0.3 * pulse})`;
      ctx.fill();
      
      // Main dot
      ctx.beginPath();
      ctx.arc(currentPoint.x, currentPoint.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      
      // Border
      ctx.beginPath();
      ctx.arc(currentPoint.x, currentPoint.y, 3, 0, Math.PI * 2);
      ctx.strokeStyle = ACCENT_RED;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw a subtle arrow in the direction of movement
      // Check if arrow would go out of bounds and adjust
      ctx.save();
      ctx.translate(currentPoint.x, currentPoint.y);
      ctx.rotate(currentAngle);
      
      // Calculate arrow length based on position to prevent overflow
      const maxArrowLength = 6;
      const minArrowLength = 3;
      
      // Check boundaries and adjust arrow length
      let arrowLength = maxArrowLength;
      
      // If arrow would go beyond right boundary
      if (currentPoint.x + Math.cos(currentAngle) * arrowLength > horizontalOffset + width - 2) {
        arrowLength = Math.max(minArrowLength, (horizontalOffset + width - 2) - currentPoint.x);
      }
      // If arrow would go beyond left boundary
      if (currentPoint.x + Math.cos(currentAngle) * arrowLength < horizontalOffset + 2) {
        arrowLength = Math.max(minArrowLength, currentPoint.x - (horizontalOffset + 2));
      }
      
      // Only draw arrow if there's enough space
      if (arrowLength > minArrowLength) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(arrowLength, 0);
        ctx.strokeStyle = ACCENT_RED;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-3, -2);
        ctx.lineTo(-3, 2);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
      }
      
      ctx.restore();
      
      // Draw subtle trail dots
      const visibleSegments = Math.min(points.length, Math.ceil(segmentsToDraw));
      if (visibleSegments > 2) {
        for (let i = 0; i < visibleSegments; i += 2) {
          if (i < points.length) {
            const point = points[i];
            const distanceFromEnd = (visibleSegments - i) / points.length;
            
            if (distanceFromEnd < 0.4) {
              const alpha = 1 - (distanceFromEnd / 0.4);
              
              ctx.beginPath();
              ctx.arc(point.x, point.y, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
              ctx.fill();
            }
          }
        }
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    const startAnimation = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationStartTime = 0;
      animationRef.current = requestAnimationFrame(draw);
      setIsInitialized(true);
    };

    // Start with a small delay
    const animationTimeout = setTimeout(startAnimation, 100);

    // Cleanup
    return () => {
      clearTimeout(animationTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isUp]);

  return (
    <div className={`p-4 rounded-xl shadow-xl w-48 bg-[#f6f6f6] border border-[#eaeaea] transition-opacity duration-200 ${isInitialized ? 'opacity-100' : 'opacity-0'}`}>
      {/* Month labels - Last 5 months from current date */}
      <div className="flex justify-between text-[10px] text-[#454648]/70 mb-1 px-1">
        {last5Months.map((month, index) => (
          <span key={index} className="opacity-80">
            {month}
          </span>
        ))}
      </div>
      
      {/* Graph container */}
      <div className="h-24 mb-2 flex items-end justify-center relative">
        {isUp ? (
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
            aria-label="Zigzag line graph showing progress over last 5 months"
          />
        ) : (
          <div className="h-full w-full bg-[#eaeaea] rounded"></div>
        )}
      </div>

      {/* Result label and percentage */}
      <div className="flex items-center justify-between px-1">
        <div
          className="text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md"
          style={{ backgroundColor: '#225e4d' }}
        >
          {label}
        </div>

        <div className="text-2xl font-bold" style={{ color: '#225e4d' }}>
          {percentage}
        </div>
      </div>
    </div>
  );
}
