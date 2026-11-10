"use client";

import React from "react";
import SectionHeader from "../SubComponents/SectionHeader";
import { motion } from "framer-motion";

interface BulletsInSectionProps {
  title: string;
  para?: string;
  bullets: string[];
  className?: string;
}

const BulletsInSection: React.FC<BulletsInSectionProps> = ({
  title,
  para,
  bullets,
  className = "",
}) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.3 }}
      className={`py-16 text-white mx-auto font-sans px-4 w-full max-w-6xl ${className}`}
    >
      <div className="mx-auto">
        {/* Heading */}
        <SectionHeader title={title} subtitle={para} />

        {/* Card container */}
        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
            className="cardBackground rounded-xl p-6 sm:p-8 max-md:py-2.5 max-md:px-[5px] shadow-xl w-[90%] mx-auto"
          >
            <ul className="space-y-3 list-none">
              {bullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.2,
                    delay: 0.1 + (i * 0.1),
                    ease: "easeOut"
                  }}
                  className="flex gap-3 items-start pl-4 sm:pl-8 max-md:pl-2"
                >
                  {/* small dot with animation */}
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.15,
                      delay: 0.2 + (i * 0.1),
                      type: "spring",
                      stiffness: 300
                    }}
                    className="mt-2.5 w-2 h-2 rounded-full bg-gray-500 shrink-0"
                  />
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.2,
                      delay: 0.3 + (i * 0.1)
                    }}
                    className="text-[15px] sm:text-[16px] text-[#454648] leading-relaxed"
                  >
                    {b}
                  </motion.span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default BulletsInSection;