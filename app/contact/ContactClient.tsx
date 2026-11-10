"use client";

import { EmailCard } from "@/Components/SubComponents/home/ContactCard";
import { PhoneCard } from "@/Components/SubComponents/home/ContactCard";
import OfficeLocations from "@/Components/SubComponents/home/OfficeLocation";
import ContactPageForm from "@/Components/ContactPageForm";
import { motion } from "framer-motion";

export default function ContactClient() {
  return (
    <div className="min-h-fit py-20 px-6 lg:px-20 mt-20 w-[90vw] max-md:w-full mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
      >
        {/* LEFT COLUMN */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-2xl lg:text-4xl font-bold leading-tight text-[#454648]"
          >
            Speak with a System <span className="text-[#225e4d]">developer</span> today
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-[17px] text-[#454648]/80 max-w-3xl"
          >
            Our system developers always here to assist you regarding your issues in SAAS apps or running systems.
          </motion.p>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <EmailCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <PhoneCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="mt-10"
            >
              <OfficeLocations />
            </motion.div>
          </div>
        </motion.aside>

        {/* RIGHT COLUMN - FORM */}
        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <ContactPageForm
            title="Seeking Architectural Excellence?"
            subtitle="Tell us your project vision and receive expert insights, practical feedback, and suitable engagement options from our leadership."
          />
        </motion.main>
      </motion.div>
    </div>
  );
}
