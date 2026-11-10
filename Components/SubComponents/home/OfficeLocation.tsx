"use client";
import React from "react";
import OfficeCard from "./OfficeCard";
import { motion } from "framer-motion";

const OfficeLocations = () => {
  const offices = [
    {
      country: "Pakistan",
      address: "1636C Block DHA Phase 9, Lahore, Pakistan",
    },
    // {
    //   country: "United States",
    //   address: "30 N Gould St Ste N, Sheridan, WY 82801 USA",
    // },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="text-xl md:text-2xl font-bold text-white mb-3"
      >
        Our offices
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {offices.map((office, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <OfficeCard
              country={office.country}
              address={office.address}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OfficeLocations;