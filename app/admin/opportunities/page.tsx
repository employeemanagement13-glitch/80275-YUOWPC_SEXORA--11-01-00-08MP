"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Search, Plus, Trash2, Edit2, X, ImageIcon, ExternalLink } from "lucide-react";

type Opportunity = {
  id: string;
  position: string;
  description: string;
  image: string; // stores path like "images/123456789-abc.jpg"
  link: string | null;
  created_at: string;
};

// ---- Styled form sub-components ----
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-semibold uppercase tracking-wider text-[#454648]/80 mb-1.5">{children}</label>
);

const FormInput = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="flex flex-col gap-1 w-full">
    <FieldLabel>{label}</FieldLabel>
    <input
      type={type}
      className="border border-[#eaeaea] p-2.5 rounded-lg w-full bg-white text-[#454648] placeholder-neutral-400 focus:border-[#225e4d] focus:ring-1 focus:ring-[#225e4d] outline-none transition-all text-sm shadow-sm"
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const FormTextarea = ({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <div className="flex flex-col gap-1 w-full">
    <FieldLabel>{label}</FieldLabel>
    <textarea
      className="border border-[#eaeaea] p-2.5 rounded-lg w-full bg-white text-[#454648] placeholder-neutral-400 focus:border-[#225e4d] focus:ring-1 focus:ring-[#225e4d] outline-none resize-y transition-all text-sm leading-relaxed shadow-sm"
      value={value || ""}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState("");

  // form state
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // progress (optional)
  const [uploadProgress, setUploadProgress] = useState(0);

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    // If it's already a full URL (for blob previews), return as-is
    if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) {
      return imagePath;
    }
    // Otherwise construct the Supabase URL
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/opportunity-images/${imagePath}`;
  };

  async function fetchOpportunities() {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Fetch opportunities error:", error);
    } else {
      setOpportunities(data as Opportunity[]);
    }
  }

  useEffect(() => {
    fetchOpportunities();
  }, []);

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setPosition("");
    setDescription("");
    setLink("");
    setImageFile(null);
    setImagePreview(null);
    setOpen(true);
  }

  function openEdit(opp: Opportunity) {
    setIsEdit(true);
    setEditingId(opp.id);
    setPosition(opp.position);
    setDescription(opp.description);
    setLink(opp.link || "");
    setImageFile(null);

    // Use the helper function to get the image URL
    const imageUrl = getImageUrl(opp.image);
    setImagePreview(imageUrl);

    setOpen(true);
  }

  function submitForm() {
    if (!position.trim() || !description.trim()) {
      alert("Position & description required");
      return;
    }
    if (!imageFile && !isEdit) {
      alert("Image is required for new opportunity");
      return;
    }

    const fd = new FormData();
    fd.append("position", position);
    fd.append("description", description);
    fd.append("link", link);
    fd.append("isEdit", String(isEdit));
    if (isEdit && editingId) fd.append("id", editingId);
    if (imageFile) fd.append("image", imageFile);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admins/opportunities");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(pct);
      }
    };
    xhr.onload = async () => {
      setUploadProgress(0);
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          alert("Saved successfully");
          setOpen(false);
          fetchOpportunities();
        } else {
          alert("Server error: " + (res.error || "Unknown"));
          console.error(res);
        }
      } else {
        alert("Upload failed: " + xhr.statusText);
      }
    };
    xhr.onerror = () => {
      setUploadProgress(0);
      alert("Upload request failed");
    };
    xhr.send(fd);
  }

  async function handleDelete(opp: Opportunity) {
    if (!confirm("Delete this opportunity?")) return;
    const resp = await fetch("/api/admins/opportunities-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: opp.id }),
    });
    const json = await resp.json();
    if (json.success) {
      fetchOpportunities();
    } else {
      alert("Delete failed: " + (json.error || ""));
    }
  }

  const filteredOpportunities = opportunities.filter(
    (o) =>
      o.position.toLowerCase().includes(search.toLowerCase()) ||
      o.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adminSearchbar">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#454648] tracking-tight">Career Opportunities</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#225e4d]/10 text-[#225e4d] border border-[#225e4d]/30">
              {opportunities.length} Total
            </span>
          </div>
          <p className="text-sm text-[#454648]/75 mt-1">
            Manage open engineering, design, and leadership opportunities at Aroxes.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="buttonstyles flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} /> Add Opportunity
        </button>
      </div>

      {/* Top Bar */}
      <div className="adminSearchbarParent">
        <div className="searchparent">
          <Search size={16} className="text-[#454648]/60 shrink-0" />
          <input
            placeholder="Search opportunities by title or description..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs text-[#454648]/70 font-medium px-2">
          Showing {filteredOpportunities.length} of {opportunities.length}
        </span>
      </div>

      {/* Opportunities List */}
      <div className="space-y-3">
        {filteredOpportunities.length === 0 ? (
          <div className="text-center text-[#454648]/70 py-16 bg-[#f6f6f6] border border-[#eaeaea] rounded-xl">
            No opportunities found matching your search.
          </div>
        ) : (
          filteredOpportunities.map((o) => {
            const imageUrl = getImageUrl(o.image);
            return (
              <div
                key={o.id}
                className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between bg-[#f6f6f6] border border-[#eaeaea] rounded-xl hover:bg-white hover:border-[#225e4d]/30 hover:shadow-lg hover:shadow-[#225e4d]/5 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Image thumbnail */}
                  <div className="shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-white border border-[#eaeaea] flex items-center justify-center shadow-sm">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={o.position}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Failed to load image:", imageUrl);
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon size={20} className="text-[#454648]/40" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#454648] text-base">{o.position}</div>
                    <div className="text-sm text-[#454648]/75 mt-0.5 line-clamp-1">{o.description}</div>
                    {o.link && (
                      <a
                        href={o.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#225e4d] hover:text-[#1b4d3f] font-medium mt-1 hover:underline"
                      >
                        <ExternalLink size={12} /> {o.link}
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    className="px-3.5 py-1.5 rounded-lg border border-[#eaeaea] hover:border-[#225e4d] text-[#454648] hover:text-[#225e4d] bg-white transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
                    onClick={() => openEdit(o)}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
                    onClick={() => handleDelete(o)}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#eaeaea] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaeaea] sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <h2 className="text-lg font-bold text-[#454648]">
                {isEdit ? "Edit Opportunity" : "Add New Opportunity"}
              </h2>
              <button
                onClick={() => {
                  if (imagePreview && imagePreview.startsWith("blob:")) {
                    URL.revokeObjectURL(imagePreview);
                  }
                  setOpen(false);
                }}
                className="text-[#454648]/60 hover:text-[#454648] p-1.5 rounded-lg hover:bg-[#f6f6f6] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-5">
              <FormInput
                label="Position / Title *"
                value={position}
                onChange={setPosition}
                placeholder="e.g. Frontend Developer, Marketing Intern"
              />

              <FormTextarea
                label="Description *"
                value={description}
                onChange={setDescription}
                placeholder="Describe the opportunity..."
                rows={4}
              />

              <FormInput
                label="Link (Optional)"
                value={link}
                onChange={setLink}
                placeholder="https://example.com/apply"
                type="url"
              />

              {/* Image Upload */}
              <div className="border border-[#eaeaea] rounded-xl p-4 space-y-3 bg-[#f6f6f6]">
                <p className="text-sm font-semibold text-[#454648]">
                  Image{!isEdit && " *"}
                </p>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    className="w-full h-44 object-cover rounded-lg border border-[#eaeaea]"
                    alt="Preview"
                    onError={(e) => {
                      console.error("Failed to load preview image");
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm text-[#454648] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-[#225e4d] file:text-white file:cursor-pointer cursor-pointer"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setImageFile(f);
                      if (f) {
                        setImagePreview(URL.createObjectURL(f));
                      } else {
                        setImagePreview(null);
                      }
                    }}
                  />
                  <p className="text-xs text-[#454648]/60 mt-2">
                    {isEdit ? "Leave empty to keep current image" : "Required for new opportunity"}
                  </p>
                </div>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#454648]/70">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#225e4d] rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#eaeaea]">
                <button
                  onClick={() => {
                    if (imagePreview && imagePreview.startsWith("blob:")) {
                      URL.revokeObjectURL(imagePreview);
                    }
                    setOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-[#eaeaea] text-[#454648] hover:bg-[#f6f6f6] transition-colors cursor-pointer text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={submitForm}
                  className="buttonstyles px-6 py-2 text-sm font-medium"
                >
                  {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
