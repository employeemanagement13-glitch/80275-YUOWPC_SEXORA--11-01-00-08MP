"use client";

import React from "react";
import ContactForm from "../SubComponents/home/ContactForm";
import SocialLinks from "../SubComponents/home/SocialLinks";
import { EmailCard, PhoneCard } from "../SubComponents/home/ContactCard";
import OfficeLocations from "../SubComponents/home/OfficeLocation";
import ContactPageForm from "../ContactPageForm";
import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className="py-16 md:py-24 text-white font-sans overflow-hidden"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse max-md:flex-col lg:flex-row justify-between items-start gap-12 lg:gap-20">

          {/* FORM - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:w-1/2"
          >
            <ContactForm />
          </motion.div>

          {/* RIGHT SIDE - Info Side (Restoring original content but with new sizing) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-[#454648]/80 flex flex-col gap-10 w-full lg:w-1/2 h-full lg:pt-10"
          >
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <SocialLinks />
            </motion.div> */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <EmailCard />
                <PhoneCard />
              </div>
            </motion.div>

            <div className="w-full h-px bg-[#f6f6f6]" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <OfficeLocations />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection;