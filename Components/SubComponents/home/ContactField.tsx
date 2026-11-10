"use client";
import React from "react";

interface InputFieldProps {
  id: string;
  placeholder: string;
  type?: string;
  value?: string;
  required?: boolean;
  onChange?: (v: string) => void;
}

const ContactField: React.FC<InputFieldProps> = ({
  id,
  placeholder,
  value,
  type = "text",
  required = true,
  onChange,
}) => (
  <input
    type={type}
    id={id}
    placeholder={placeholder}
    required={required}
    value={value}   // <-- FIXED
    onChange={(e) => onChange && onChange(e.target.value)}  // <-- FIXED
    className="w-full bg-[#f6f6f6] text-[#454648] border border-[#eaeaea] 
               focus:border-[#225e4d] focus:outline-none rounded-md px-4 py-3 
               text-base placeholder-neutral-500 transition-colors duration-200"
  />
);

export default ContactField;
