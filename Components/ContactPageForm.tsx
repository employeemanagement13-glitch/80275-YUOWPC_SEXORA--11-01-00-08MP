"use client";

import React, { useState, useEffect } from "react";
import ContactField from "./SubComponents/home/ContactField";
import { supabase } from "@/utils/supabaseClient";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactFormProps {
  title?: string;
  subtitle?: string;
}

export default function ContactPageForm({
  title = "Get in touch",
  subtitle,
}: ContactFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [requiredService, setRequiredService] = useState("");
  const [details, setDetails] = useState("");

  const [serviceOptions, setServiceOptions] = useState<string[]>([]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  // 🔥 Fetch services from `solutions` table
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from("solutions").select("title");

      if (error) {
        console.error("Error fetching services:", error);
        return;
      }

      setServiceOptions(data.map((item: any) => item.title));
    };

    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    if (!firstName || !businessEmail) {
      setError("Please provide your name and email.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact",
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
          email: businessEmail,
          company_name: companyName,
          required_service: requiredService,
          details,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Submission failed. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setFirstName("");
      setLastName("");
      setBusinessEmail("");
      setCompanyName("");
      setRequiredService("");
      setDetails("");

      setTimeout(() => setStatus("idle"), 3500);
    } catch (err) {
      console.error(err);
      setError("Submission failed. Try again later.");
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
      className="cardBackground w-full rounded-xl p-6 md:p-10 shadow-xl border border-[#f6f6f6]"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="text-2xl sm:text-3xl mb-2 font-bold text-[#454648] leading-snug"
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-[#454648]/80 mb-6 max-md:text-base max-md:mt-4"
        >
          {subtitle}
        </motion.p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex-1"
          >
            <ContactField
              id="firstName"
              placeholder="First Name*"
              value={firstName}
              onChange={(v) => setFirstName(v)}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex-1"
          >
            <ContactField
              id="lastName"
              placeholder="Last Name*"
              value={lastName}
              onChange={(v) => setLastName(v)}
            />
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex-1"
          >
            <ContactField
              id="businessEmail"
              placeholder="Business Email*"
              type="email"
              value={businessEmail}
              onChange={(v) => setBusinessEmail(v)}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex-1"
          >
            <ContactField
              id="companyName"
              placeholder="Company Name*"
              value={companyName}
              onChange={(v) => setCompanyName(v)}
            />
          </motion.div>
        </div>

        {/* Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <label className="text-sm font-medium text-[#454648] block mb-2">
            Required Service*
          </label>

          <div className="relative w-full">
            <select
              value={requiredService}
              onChange={(e) => setRequiredService(e.target.value)}
              className="
                w-full bg-white border border-[#dfe3e8] text-[#454648]
                rounded-lg px-4 py-3 pr-10 cursor-pointer
                appearance-none
                focus:ring-2 focus:ring-[#225e4d]/20 focus:border-[#225e4d]
                transition-all duration-200
              "
            >
              <option value="">Select a service</option>
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#454648]/70">
              <ChevronDown className="text-[5px]"/>
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <textarea
            id="details"
            placeholder="Define your need?*"
            rows={6}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full bg-white text-[#454648] border border-[#eaeaea] 
                       focus:border-[#225e4d] focus:outline-none rounded-md px-4 py-3 
                       text-base placeholder-neutral-500 transition-colors duration-200 
                       resize-none"
            required
          ></textarea>
        </motion.div>

        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-yellow-400 overflow-hidden"
            >
              Submitting…
            </motion.p>
          )}
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-green-400 font-semibold"
            >
              ✓ Request submitted successfully!
            </motion.p>
          )}
          {status === "error" && error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-red-400"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-6 mt-2"
        >
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className={`buttonstyles py-2 px-6 rounded-md transition-colors duration-200 shadow-lg font-bold text-white ${status !== "idle"
                ? "opacity-60 cursor-not-allowed"
                : "bg-[#225e4d] hover:bg-[#1b4d3f]"
              }`}
          >
            {status === "loading"
              ? "Submitting..."
              : status === "success"
                ? "Submitted"
                : "Submit"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
