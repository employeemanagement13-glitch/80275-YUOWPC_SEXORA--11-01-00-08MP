"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";

interface RightSolutionHeaderProps {
  formHeading: string;
  formParagraph: string;
  checkboxtitle: string;
  checkboxOptions?: string[];
  solutionSlug?: string;
  solutionTitle?: string;
}

interface FormData {
  fullName: string;
  companyName: string;
  email: string;
  telNo: string;
  testingTypes: string[];
}

const RightSolutionHeader: React.FC<RightSolutionHeaderProps> = ({
  formHeading,
  formParagraph,
  checkboxtitle,
  checkboxOptions = [],
  solutionSlug,
  solutionTitle,
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    companyName: "",
    email: "",
    telNo: "",
    testingTypes: [],
  });

  const [options, setOptions] = useState<string[]>(checkboxOptions);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (checkboxOptions && checkboxOptions.length > 0) {
      setOptions(checkboxOptions);
    } else {
      const fetchServices = async () => {
        try {
          const { data, error } = await supabase.from("solutions").select("title");
          if (!error && data) {
            const titles = data.map((s: any) => s.title).filter(Boolean);
            setOptions(titles);
          }
        } catch (err) {
          console.error("Error fetching solution options:", err);
        }
      };
      fetchServices();
    }
  }, [checkboxOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (label: string): void => {
    setFormData((prev) => {
      const isChecked = prev.testingTypes.includes(label);
      return {
        ...prev,
        testingTypes: isChecked
          ? prev.testingTypes.filter((t) => t !== label)
          : [...prev.testingTypes, label],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "solutions",
          solution_slug: solutionSlug || null,
          solution_title: solutionTitle || null,
          full_name: formData.fullName,
          company_name: formData.companyName,
          email: formData.email,
          phone: formData.telNo,
          required_service: formData.testingTypes.join(", "),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setStatus("success");
        setFormData({
          fullName: "",
          companyName: "",
          email: "",
          telNo: "",
          testingTypes: [],
        });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setErrorMessage(json.error || "Submission failed. Try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Submission failed. Try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-[#f6f6f6] w-full p-6 sm:p-8 rounded-lg shadow-xl"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-xl sm:text-2xl font-bold text-[#454648] mb-3"
      >
        {formHeading}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="text-[#454648]/70 text-xs sm:text-sm mb-8"
      >
        {formParagraph}
      </motion.p>

      <form onSubmit={handleSubmit}>
        {(["fullName", "companyName", "email", "telNo"] as const).map(
          (field, index) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 0.05 * index }}
            >
              <input
                name={field}
                type={field === "email" ? "email" : "text"}
                placeholder={
                  field === "fullName"
                    ? "Full Name"
                    : field === "companyName"
                      ? "Company Name"
                      : field === "email"
                        ? "Email"
                        : "Tel No"
                }
                value={formData[field]}
                onChange={handleInputChange}
                className="w-full px-4 py-3 mb-4 bg-[#f6f6f6] border border-[#eaeaea] rounded-md text-[#454648] placeholder:text-[#454648]/60"
                required
              />
            </motion.div>
          )
        )}

        <motion.fieldset
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mb-6"
        >
          <legend className="text-[#454648] text-base font-medium mb-3">
            {checkboxtitle}
          </legend>

          <div className="grid grid-cols-2 gap-3">
            {options.map((option, index) => (
              <motion.label
                key={option}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.05 * index }}
                className="flex items-center gap-2 text-[#454648] cursor-pointer"
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="checkbox"
                  checked={formData.testingTypes.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  className="sr-only"
                />

                <motion.div
                  className={`relative h-4 w-4 rounded border flex items-center justify-center ${
                    formData.testingTypes.includes(option)
                      ? "bg-[#225e4d] border-[#225e4d]"
                      : "bg-white border-[#dfe3e8]"
                  }`}
                  animate={{
                    scale: formData.testingTypes.includes(option) ? 1.1 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                >
                  {formData.testingTypes.includes(option) && (
                    <motion.svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  )}
                </motion.div>

                <span className="text-sm">{option}</span>
              </motion.label>
            ))}
          </div>
        </motion.fieldset>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: status !== "idle" ? 1 : 0,
            scale: status !== "idle" ? 1 : 0.9,
          }}
          transition={{ type: "spring", stiffness: 200 }}
          className="h-8 mb-4"
        >
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
        </motion.div>

        <motion.button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`px-5 py-2 rounded-md cursor-pointer font-bold bg-[#225e4d] hover:bg-[#1b4d3f] transition w-fit text-white ${
            status !== "idle" ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {status === "loading"
            ? "Submitting..."
            : status === "success"
            ? "Successful!"
            : "Submit"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default RightSolutionHeader;