"use client";

import React, { useState } from "react";
import LocationCard from "../SubComponents/About/LocationCard";
import { LocationData } from "@/types/dataType";
import { locations } from "@/lib/data";
import SectionHeader from "../SubComponents/SectionHeader";
import { motion, AnimatePresence } from "framer-motion";

const GlobalPresenceSection: React.FC = () => {
  // State to track the currently selected location. Null if none is selected.
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  const handleCardClick = (location: LocationData) => {
    // If the same card is clicked, deselect it. Otherwise, select the new one.
    if (selectedLocation && selectedLocation.name === location.name) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(location);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className="py-16 sm:py-24 text-[#454648] font-sans px-4"
    >
      <div className="max-w-[80vw] mx-auto">
        
        {/* Header Section */}
        <SectionHeader 
          title="Global Presence" 
          subtitle="We support clients in 23+ countries and drive continued growth through innovation and transformation." 
          className='mb-12 sm:mb-16' 
          subtitleClassName='headingpara mx-auto' 
        />

        {/* Locations Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="
            grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
            gap-8 sm:gap-12 justify-items-center
          "
        >
          {locations.map((location, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: 0.3 + (index * 0.1),
                ease: "easeOut"
              }}
            >
              <LocationCard 
                name={location.name} 
                imageUrl={location.imageUrl} 
                altText={location.altText} 
                city={location.city}
                state={location.state}
                addressLine={location.addressLine}
                phone={location.phone}
                onClick={() => handleCardClick(location)}
                isSelected={selectedLocation?.name === location.name}
                index={index}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Address Details Display Section */}
        <AnimatePresence mode="wait">
          {selectedLocation && (
            <motion.div
              key={selectedLocation.name}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "4rem" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
              className="
                pt-8 
                border-t border-[#f6f6f6] 
                text-[#454648] 
                w-full
                overflow-hidden
              "
            >
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-xl font-bold mb-6 text-[#454648]"
              >
                {selectedLocation.name} Office Details
              </motion.h3>
              
              {/* Address box */}
              <div className="p-0 sm:p-0 rounded-xl">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="
                    flex flex-col space-y-4 text-[16px] 
                    pb-8 border-b border-[#f6f6f6] 
                  "
                >
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="flex flex-col"
                  >
                    <span className="font-semibold text-[#454648]/80">City | State</span> 
                    <span className="text-[#454648]">{selectedLocation.city} | {selectedLocation.state}</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="flex flex-col"
                  >
                    <span className="font-semibold text-[#454648]/80">Address</span>
                    <span className="text-[#454648]">{selectedLocation.addressLine}</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="flex flex-col"
                  >
                    <span className="font-semibold text-[#454648]/80">Phone</span>
                    <span className="text-[#454648]">{selectedLocation.phone}</span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default GlobalPresenceSection;