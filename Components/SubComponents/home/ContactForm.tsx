"use client";
import React, { useState, useEffect } from "react";
import ContactField from "./ContactField";
import { supabase } from "@/utils/supabaseClient";

const ContactForm = () => {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [telNo, setTelNo] = useState("");
  const [requiredService, setRequiredService] = useState("");
  const [details, setDetails] = useState("");
  const [services, setServices] = useState<string[]>([]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase.from("solutions").select("title");
        if (!error && data) {
          const titles = data.map((s: any) => s.title).filter(Boolean);
          setServices(titles);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "home",
          full_name: fullName,
          company_name: companyName,
          email: email,
          phone: telNo,
          required_service: requiredService,
          details: details,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setStatus("success");
        setFullName("");
        setCompanyName("");
        setEmail("");
        setTelNo("");
        setRequiredService("");
        setDetails("");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setErrorMessage(json.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="cardBackground w-full rounded-xl p-8 md:p-10 shadow-2xl shadow-neutral-900/10">
      <h2 className="text-2xl md:text-3xl font-bold text-[#454648] mb-8 leading-snug">
        Get Your Enterprise Automation & ERP Solution Quote
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <ContactField
            id="fullName"
            placeholder="Full Name*"
            value={fullName}
            onChange={(v) => setFullName(v)}
          />
          <ContactField
            id="companyName"
            placeholder="Company Name*"
            value={companyName}
            onChange={(v) => setCompanyName(v)}
          />
        </div>

        {/* Row 2 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <ContactField
            id="email"
            placeholder="Email Address*"
            type="email"
            value={email}
            onChange={(v) => setEmail(v)}
          />
          <ContactField
            id="telNo"
            placeholder="Phone Number*"
            type="tel"
            value={telNo}
            onChange={(v) => setTelNo(v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#454648] text-sm font-medium">Required Service*</label>
          <div className="relative">
            <select
              id="requiredService"
              value={requiredService}
              onChange={(e) => setRequiredService(e.target.value)}
              className="w-full bg-[#f6f6f6] text-[#454648]/80 border border-[#eaeaea] rounded-md px-4 py-3 appearance-none transition-colors duration-200 focus:outline-none focus:border-[#225e4d] focus:ring-2 focus:ring-[#225e4d]/20 cursor-pointer"
              required
            >
              <option value="">Select a service</option>
              {services.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#454648]/60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <textarea
          id="details"
          placeholder="Describe your need?*"
          rows={5}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full bg-[#f6f6f6] text-[#454648] border border-[#eaeaea] 
                     focus:border-[#225e4d] focus:ring-2 focus:ring-[#225e4d]/20 focus:outline-none rounded-md px-4 py-3 
                     text-base placeholder-[#454648]/60 transition-colors duration-200 
                     resize-none"
          required
        ></textarea>

        {status === "loading" && (
          <p className="text-yellow-500 text-sm">Submitting...</p>
        )}
        {status === "success" && (
          <p className="text-green-500 font-semibold text-sm">
            ✓ Request submitted successfully!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`buttonstyles py-2 px-6 rounded-md transition-colors duration-200 shadow-lg font-bold text-white ${
            status !== "idle" ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {status === "loading"
            ? "Submitting..."
            : status === "success"
            ? "Submitted"
            : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
