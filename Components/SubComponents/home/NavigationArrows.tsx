"use client";

import React from "react";
import { cn } from "@/utils/cn"; // Optional. If you don't have cn(), remove it.

interface NavigationArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  PrevIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  NextIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  showSeparator?: boolean;          // For blog section line
  separatorClassName?: string;      // Custom styling for separator
  align?: "start" | "center" | "end"; // Align arrows
  className?: string;
  buttonClassName?: string;
}

const NavigationArrows: React.FC<NavigationArrowsProps> = ({
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  PrevIcon,
  NextIcon,
  showSeparator = false,
  separatorClassName = "",
  align = "start",
  className = "",
  buttonClassName = "",
}) => {
  return (
    <div
      className={cn(
        "flex items-center mt-12",
        align === "start" && "justify-start",
        align === "center" && "justify-center",
        align === "end" && "justify-end",
        className
      )}
    >
      {/* Optional horizontal separator */}
      {showSeparator && (
        <div
          className={cn(
            "grow border-t border-[#eaeaea] h-px mr-4 sm:mr-8 hidden sm:block",
            separatorClassName
          )}
        ></div>
      )}

      {/* Arrow Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onPrev}
          disabled={prevDisabled}
          aria-label="Previous"
          className={cn(
            `p-3 bg-white text-black rounded-full shadow-lg transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 cursor-pointer`,
            buttonClassName
          )}
        >
          <PrevIcon className="w-6 h-6" />
        </button>

        <button
          onClick={onNext}
          disabled={nextDisabled}
          aria-label="Next"
          className={cn(
            `p-3 bg-white text-black rounded-full shadow-lg transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 cursor-pointer`,
            buttonClassName
          )}
        >
          <NextIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default NavigationArrows;
