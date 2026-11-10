"use client";
import React from "react";
import Image from "next/image";
import { socials } from "@/lib/data";
import { motion } from "framer-motion";

const SocialLinks = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      className="rounded-xl shadow-2xl shadow-neutral-900/50"
    >
      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="text-xl md:text-2xl font-bold text-white mb-3"
      >
        Connect With Us
      </motion.h3>

      <div className="flex space-x-6 pt-2">
        {socials.map((s, index) => (
          <motion.a
            key={index}
            href={s.link}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            // transition={{ duration: 0.2 }}
            className="text-white hover:text-blue-500 transition-colors"
            aria-label="social icon"
          >
            <Image src={s.image} alt={s.link} width={30} height={30} />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default SocialLinks;