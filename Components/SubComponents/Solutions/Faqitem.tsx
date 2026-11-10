"use client";

import React, { useId } from "react";
import { FAQItemProps } from "@/types/dataType";
import { motion, AnimatePresence } from "framer-motion";

// --- REUSABLE FAQ ITEM COMPONENT (Accordion) ---
const FAQItem: React.FC<FAQItemProps> = ({ data, isOpen, onToggle }) => {
  // unique id for aria controls
  const id = useId();
  const headingId = `faq-heading-${data.id}-${id}`;
  const panelId = `faq-panel-${data.id}-${id}`;

  return (
    // The border-b remains to separate items
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
      className="border-b border-[#eaeaea]"
    >
      <motion.button
        id={headingId}
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="flex justify-between items-center cursor-pointer w-full py-4 sm:py-6 text-left transition-colors duration-200 focus:outline-none group"
        onClick={() => onToggle(data.id)}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          className="text-base sm:text-lg md:text-xl font-medium text-[#454648] pr-4"
          animate={{
            color: isOpen ? "#454648" : "#454648"
          }}
          transition={{ duration: 0.3 }}
          whileHover={{
            color: "#454648",
            transition: { duration: 0.2 }
          }}
        >
          {data.question}
        </motion.span>

        {/* Animated Icon: Plus turns into Minus */}
        <motion.div
          className="relative w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center shrink-0 cursor-pointer"
          animate={{ rotate: isOpen ? 0 : 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Horizontal Bar (The Minus/Dash) */}
          <motion.div
            className="absolute h-0.5 w-4 sm:w-5 bg-[#454648]"
            animate={{
              backgroundColor: isOpen ? "#454648" : "#454648",
              rotate: isOpen ? 0 : 0
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Vertical Bar (The Plus part, rotates 90deg to hide/align when open) */}
          <motion.div
            className="absolute h-4 sm:h-5 w-0.5 bg-[#454648]"
            animate={{
              rotate: isOpen ? 90 : 0,
              scaleX: isOpen ? 0 : 1,
              backgroundColor: isOpen ? "#454648" : "#454648"
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            aria-hidden
          />
        </motion.div>
      </motion.button>

      {/* Answer Content (Animated Collapse) */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headingId}
            initial={{
              opacity: 0,
              height: 0,
              marginTop: 0
            }}
            animate={{
              opacity: 1,
              height: "auto",
              marginTop: "0.5rem"
            }}
            exit={{
              opacity: 0,
              height: 0,
              marginTop: 0
            }}
            transition={{
              duration: 0.4,
              ease: "easeInOut"
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1,
                ease: "easeOut"
              }}
            >
              <p className="text-sm sm:text-[16px] md:text-[16px] text-[#454648]/75 pb-4 sm:pb-6 pr-0 sm:pr-4 leading-relaxed">
                {data.answer.split(' ').map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.2 + (index * 0.02),
                      ease: "easeOut"
                    }}
                    className="inline-block mr-1"
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQItem;