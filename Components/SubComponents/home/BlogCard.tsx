"use client";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export interface BlogCardData {
  id?: string | number;
  title: string;
  summary?: string;
  blogid?: string;
  imagePath: string;
  date?: string;
  category?: string;
}

interface BlogCardProps {
  data: BlogCardData;
  className?: string;
  style?: React.CSSProperties;
  showReadMore?: boolean; // Only show the read more button if true
  readMoreText?: string;   // Default text for Read More
  href?: string;           // URL for read more
  index?: number;
}

const BlogCard: React.FC<BlogCardProps> = ({
  data,
  className = "",
  style = {},
  showReadMore = false,
  readMoreText = "Read more",
  index = 0,
}) => {
  const { title, summary, imagePath, date, category, blogid } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ 
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1
      }}
      className={className}
      style={style}
    >
      <Link
        href={`${blogid}`}
        className={`
          group
          block
          px-5
          py-5
          h-fit
          transition-all duration-200 ease-in-out
          hover:-translate-y-1
          hover:shadow-xl hover:shadow-[#225e4d]/10
          rounded-xl overflow-hidden
          bg-[#f6f6f6]
          border border-[#f6f6f6]
          hover:bg-white
        `}
        target={`${readMoreText === "View PDF" ? "_blank" : ""}`}
        aria-label={`Read blog post: ${title}`}
      >
        <div className="flex flex-col h-full">

          {/* IMAGE */}
          <motion.div 
            className="h-48 overflow-hidden shrink-0 rounded-xl"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={`${imagePath}`}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              loading="lazy"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                img.src = `https://placehold.co/600x400/1e293b/ffffff?text=Blog+Image`;
              }}
            />
          </motion.div>

          {/* TEXT CONTENT */}
          <div className="py-8 grow flex flex-col">

            {/* Date + Category */}
            {date && (
              <motion.p 
                className="text-sm text-[#454648]/70 mb-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                {(() => {
                  const d = new Date(date);
                  return `${String(d.getFullYear()).slice(-2)}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                })()}
                {category && <span> — {category}</span>}
              </motion.p>
            )}

            {/* Title */}
            <motion.h3 
              className="text-[23px] font-medium text-[#454648] mb-4 line-clamp-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              {title}
            </motion.h3>

            {/* Summary */}
            {summary && (
              <motion.p 
                className="text-[16px] text-[#454648]/75 line-clamp-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                {summary}
              </motion.p>
            )}

            {/* Optional Read More */}
            {showReadMore && (
              <motion.div 
                className="flex items-center text-[#225e4d] font-medium text-sm transition-colors duration-200 mt-5"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                {readMoreText}
                <span className="relative w-5 h-5 ml-2 flex items-center justify-center overflow-hidden">
                  {/* Initial Arrow */}
                  <ArrowUpRight className="absolute transition-transform duration-200 ease-in-out group-hover:-translate-y-full group-hover:translate-x-full" />
                  {/* Incoming Arrow */}
                  <ArrowUpRight className="absolute translate-y-full -translate-x-full transition-transform duration-200 ease-in-out group-hover:translate-y-0 group-hover:translate-x-0" />
                </span>
              </motion.div>
            )}

          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
