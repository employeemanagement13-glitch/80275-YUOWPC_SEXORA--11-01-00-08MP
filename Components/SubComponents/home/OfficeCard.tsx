"use client";
import React from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export interface OfficeCardProps {
  country: string;
  address: string;
}

const OfficeCard: React.FC<OfficeCardProps> = ({ country, address }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-[#f6f6f6] p-4 rounded-md space-y-2"
    >
      <div className="flex items-center font-semibold text-white">
        <MapPin className="w-4 h-4 mr-2 text-[#225e4d]" />
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-sm text-[#454648]"
        >
          {country}
        </motion.span>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-sm text-[#454648]/70"
      >
        {address}
      </motion.p>
    </motion.div>
  );
};

export default OfficeCard;