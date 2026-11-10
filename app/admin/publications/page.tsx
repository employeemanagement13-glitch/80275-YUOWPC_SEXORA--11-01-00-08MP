"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Search, Plus, Trash2, Edit2, X, Download, FileText } from "lucide-react";

type Publication = {
  id: string;
  title: string;
  description: string;
  banner_image: string;
  file_path: string;
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1 w-full">
    <FieldLabel>{label}</FieldLabel>
    <input
      type="text"
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
  rows = 3,
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

export default function AdminPublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [search, setSearch] = useState("");

  // form state
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  // progress (optional)
  const [uploadProgress, setUploadProgress] = useState(0);

  async function fetchPublications() {
    const { data, error } = await supabase
      .from("publications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Fetch publications error:", error);
    } else {
      setPublications(data as Publication[]);
    }
  }

  useEffect(() => {
    fetchPublications();
  }, []);

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setBannerFile(null);
    setPdfFile(null);
    setBannerPreview(null);
    setOpen(true);
  }

  function openEdit(pub: Publication) {
    setIsEdit(true);
    setEditingId(pub.id);
    setTitle(pub.title);
    setDescription(pub.description);
    setBannerFile(null);
    setPdfFile(null);
    setBannerPreview(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/publication-images/${pub.banner_image}`
    );
    setOpen(true);
  }

  function submitForm() {
    if (!title.trim() || !description.trim()) {
      alert("Title & description required");
      return;
    }
    if (!bannerFile && !isEdit) {
      alert("Banner image is required for new publication");
      return;
    }
    if (!pdfFile && !isEdit) {
      alert("PDF file is required for new publication");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("isEdit", String(isEdit));
    if (isEdit && editingId) fd.append("id", editingId);
    if (bannerFile) fd.append("banner", bannerFile);
    if (pdfFile) fd.append("file", pdfFile);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admins/publications");
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
          fetchPublications();
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

  async function handleDelete(pub: Publication) {
    if (!confirm("Delete this publication?")) return;
    const resp = await fetch("/api/admins/publications-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pub.id }),
    });
    const json = await resp.json();
    if (json.success) {
      fetchPublications();
    } else {
      alert("Delete failed: " + (json.error || ""));
    }
  }

  const filteredPublications = publications.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adminSearchbar">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#454648] tracking-tight">Research & Publications</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#225e4d]/10 text-[#225e4d] border border-[#225e4d]/30">
              {publications.length} Total
            </span>
          </div>
          <p className="text-sm text-[#454648]/75 mt-1">
            Publish and manage whitepapers, technical specifications, and research reports.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="buttonstyles flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} /> Add Publication
        </button>
      </div>

      {/* Top Bar */}
      <div className="adminSearchbarParent">
        <div className="searchparent">
          <Search size={16} className="text-[#454648]/60 shrink-0" />
          <input
            placeholder="Search publications by title..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs text-[#454648]/70 font-medium px-2">
          Showing {filteredPublications.length} of {publications.length}
        </span>
      </div>

      {/* Publications List */}
      <div className="space-y-3">
        {filteredPublications.length === 0 ? (
          <div className="text-center text-[#454648]/70 py-16 bg-[#f6f6f6] border border-[#eaeaea] rounded-xl">
            No publications found matching your search.
          </div>
        ) : (
          filteredPublications.map((p) => (
            <div
              key={p.id}
              className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between bg-[#f6f6f6] border border-[#eaeaea] rounded-xl hover:bg-white hover:border-[#225e4d]/30 hover:shadow-lg hover:shadow-[#225e4d]/5 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Banner thumbnail */}
                <div className="shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-white border border-[#eaeaea] flex items-center justify-center shadow-sm">
                  {p.banner_image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/publication-images/${p.banner_image}`}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <FileText size={20} className="text-[#454648]/40" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#454648] text-base truncate">{p.title}</div>
                  <div className="text-sm text-[#454648]/75 mt-0.5 line-clamp-1">{p.description}</div>
                  <div className="text-xs text-[#454648]/60 mt-1">
                    {new Date(p.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  className="px-3.5 py-1.5 rounded-lg border border-[#eaeaea] hover:border-[#225e4d] text-[#454648] hover:text-[#225e4d] bg-white transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
                  onClick={() => openEdit(p)}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <a
                  href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/publication-files/${p.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg border border-[#225e4d]/30 bg-[#225e4d]/10 text-[#225e4d] hover:bg-[#225e4d] hover:text-white transition-all text-xs font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <Download size={13} /> PDF
                </a>
                <button
                  className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
                  onClick={() => handleDelete(p)}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#eaeaea] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaeaea] sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <h2 className="text-lg font-bold text-[#454648]">
                {isEdit ? "Edit Publication" : "Add New Publication"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-[#454648]/60 hover:text-[#454648] p-1.5 rounded-lg hover:bg-[#f6f6f6] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-5">
              <FormInput
                label="Title *"
                value={title}
                onChange={setTitle}
                placeholder="Publication title"
              />
              <FormTextarea
                label="Description *"
                value={description}
                onChange={setDescription}
                placeholder="Brief description of this publication"
                rows={3}
              />

              {/* Banner Image */}
              <div className="border border-[#eaeaea] rounded-xl p-4 space-y-3 bg-[#f6f6f6]">
                <p className="text-sm font-semibold text-[#454648]">Banner Image{!isEdit && " *"}</p>
                {bannerPreview && (
                  <img
                    src={bannerPreview}
                    className="w-full h-44 object-cover rounded-lg border border-[#eaeaea]"
                    alt="Banner preview"
                  />
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm text-[#454648] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-[#225e4d] file:text-white file:cursor-pointer cursor-pointer"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setBannerFile(f);
                      if (f) setBannerPreview(URL.createObjectURL(f));
                    }}
                  />
                  {isEdit && (
                    <p className="text-xs text-[#454648]/60 mt-1.5">Leave empty to keep current image</p>
                  )}
                </div>
              </div>

              {/* PDF Upload */}
              <div className="border border-[#eaeaea] rounded-xl p-4 space-y-3 bg-[#f6f6f6]">
                <p className="text-sm font-semibold text-[#454648]">Publication PDF{!isEdit && " *"}</p>
                <div>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="text-sm text-[#454648] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-[#225e4d] file:text-white file:cursor-pointer cursor-pointer"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setPdfFile(f);
                    }}
                  />
                  {isEdit && (
                    <p className="text-xs text-[#454648]/60 mt-1.5">Leave empty to keep current PDF</p>
                  )}
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
                  onClick={() => setOpen(false)}
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
