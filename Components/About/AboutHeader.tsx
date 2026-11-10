"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

// Image/Video Graphic Component
const SecurityGraphic: React.FC = () => {
  // Using a placeholder image URL for the security/shield graphic
  const imageUrl = "/about/team.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full aspect-[3/2] overflow-hidden rounded-xl lg:rounded-3xl shadow-2xl"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute inset-0"
      >
        <Image
          src={imageUrl}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          alt="Cybersecurity Shield Graphic"
          className="w-full h-full object-cover"
          draggable={false}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            // Fallback placeholder with better aesthetics
            target.src = "/about/team.jpg";
          }}
        />
        <div className="absolute inset-0 bg-white/10 backdrop-brightness-75" />
      </motion.div>
    </motion.div>
  );
};

const AboutUsSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-16 sm:py-24 text-[#454648] font-sans px-4 mt-10"
    >
      <div className="max-w-7xl mx-auto">

        <div className="
          grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center
        ">

          {/* Left Column: Image/Graphic */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-1"
          >
            <SecurityGraphic />
          </motion.div>

          {/* Right Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="order-2 lg:order-2 flex flex-col"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="heading mb-6"
            >
              About Us
            </motion.h1>

            <div className="text-lg text-[#454648]/80 space-y-5 leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Aroxes was founded on a singular principle: legacy software creates operational friction, while intelligent, autonomous engineering eliminates it. Led by senior technology executives with over 5 years of combined leadership across global markets, we build high-throughput SaaS, retail ERPs, and Agentic AI ecosystems.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Our methodology delivers composable, zero-latency architectures tailored to scale your complex enterprise operations.
              </motion.p>
            </div>

            {/* Button - using a dark red consistent with the image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5, delay: 0.9 }}
            // whileHover={{ scale: 1.05 }}
            // whileTap={{ scale: 0.95 }}
            >
              <Link
                className="
                  mt-8 
                  cursor-pointer
                  transition-all
                  px-8 py-3 
                  rounded-xl 
                  buttonstyles
                  w-fit sm:w-fit
                  inline-block
                "
                href="https://calendly.com/aroxes-group/30min"
              >
                Book Consultation
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </motion.section>
  );
};

export default AboutUsSection;