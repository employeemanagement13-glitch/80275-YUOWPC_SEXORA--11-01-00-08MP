"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus, Trash2, Edit2, X, ImageIcon } from "lucide-react";

type ContentBlock = {
  title?: string;
  description: string;
  referenceImage?: string;
};

type BlogRow = {
  id: string;
  title: string;
  description: string;
  banner_image: string;
  content: ContentBlock[];
  type?: string;
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

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [content, setContent] = useState<ContentBlock[]>([{ title: "", description: "" }]);
  const [contentFiles, setContentFiles] = useState<Map<number, File>>(new Map());

  const [typeField, setTypeField] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);

  async function fetchBlogs() {
    try {
      const res = await fetch('/api/admins/blogs-get');
      const json = await res.json();
      setBlogs((json?.data) || []);
    } catch (err) {
      console.error('fetchBlogs error:', err);
      setBlogs([]);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  function addContentBlock() {
    setContent(prev => [...prev, { title: "", description: "" }]);
  }
  function removeContentBlock(index: number) {
    setContent(prev => prev.filter((_, i) => i !== index));
    setContentFiles(prev => {
      const m = new Map(prev);
      m.delete(index);
      return m;
    });
  }
  function updateContentField(index: number, key: keyof ContentBlock, value: string) {
    setContent(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  }
  function handleContentFileChange(index: number, file: File | null) {
    setContentFiles(prev => {
      const m = new Map(prev);
      if (file) m.set(index, file);
      else m.delete(index);
      return m;
    });
  }

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setBannerFile(null);
    setBannerPreview(null);
    setContent([{ title: "", description: "" }]);
    setContentFiles(new Map());
    setTypeField("");
    setOpen(true);
  }

  function openEdit(blog: BlogRow) {
    setIsEdit(true);
    setEditingId(blog.id);
    setTitle(blog.title);
    setDescription(blog.description);
    setTypeField(blog.type || "");
    setBannerFile(null);
    setBannerPreview(
      blog.banner_image
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${blog.banner_image}`
        : null
    );
    setContent(
      (blog.content || []).map(c => ({
        title: c.title || "",
        description: c.description || "",
        referenceImage: c.referenceImage || "",
      }))
    );
    setContentFiles(new Map());
    setOpen(true);
  }

  function submitForm() {
    if (!title.trim() || !description.trim()) {
      alert("Title & description required");
      return;
    }
    if (!content.length || content.some(c => !c.description.trim())) {
      alert("Please fill description for all content blocks");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("isEdit", String(isEdit));
    fd.append("type", typeField);
    if (isEdit && editingId) fd.append("id", editingId);
    fd.append("content", JSON.stringify(content));

    if (bannerFile) fd.append("banner", bannerFile);
    contentFiles.forEach((file, idx) => fd.append(`contentFile_${idx}`, file));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admins/blogs");
    xhr.setRequestHeader("Accept", "application/json");

    xhr.upload.onprogress = e => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      setUploadProgress(0);
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          alert("Saved");
          setOpen(false);
          fetchBlogs();
        } else {
          alert("Error: " + (res.error || "Unknown"));
          console.error(res);
        }
      } else {
        alert("Upload failed: " + xhr.statusText);
      }
    };
    xhr.onerror = () => {
      setUploadProgress(0);
      alert("Network error");
    };
    xhr.send(fd);
  }

  async function handleDelete(blog: BlogRow) {
    if (!confirm("Delete blog?")) return;
    const resp = await fetch("/api/admins/blogs-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: blog.id }),
    });
    const json = await resp.json();
    if (json.success) fetchBlogs();
    else alert("Delete failed: " + (json.error || ""));
  }

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adminSearchbar">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#454648] tracking-tight">Blogs & Articles</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#225e4d]/10 text-[#225e4d] border border-[#225e4d]/30">
              {blogs.length} Total
            </span>
          </div>
          <p className="text-sm text-[#454648]/75 mt-1">
            Publish research, engineering insights, and company announcements.
          </p>
        </div>
        <button onClick={openAdd} className="buttonstyles flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} /> Add Blog
        </button>
      </div>

      {/* Top Bar */}
      <div className="adminSearchbarParent">
        <div className="searchparent">
          <Search size={16} className="text-[#454648]/60 shrink-0" />
          <input
            className="search"
            placeholder="Search blogs by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs text-[#454648]/70 font-medium px-2">
          Showing {filteredBlogs.length} of {blogs.length}
        </span>
      </div>

      {/* Blog List */}
      <div className="space-y-3">
        {filteredBlogs.length === 0 ? (
          <div className="text-center text-[#454648]/70 py-16 bg-[#f6f6f6] border border-[#eaeaea] rounded-xl">
            No blogs found matching your search.
          </div>
        ) : (
          filteredBlogs.map(b => (
            <div
              key={b.id}
              className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between bg-[#f6f6f6] border border-[#eaeaea] rounded-xl hover:bg-white hover:border-[#225e4d]/30 hover:shadow-lg hover:shadow-[#225e4d]/5 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Banner thumbnail */}
                <div className="shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-white border border-[#eaeaea] flex items-center justify-center shadow-sm">
                  {b.banner_image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${b.banner_image}`}
                      alt={b.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <ImageIcon size={20} className="text-[#454648]/40" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#454648] truncate text-base">{b.title}</div>
                  <div className="text-sm text-[#454648]/75 mt-0.5 line-clamp-1">{b.description}</div>
                  <div className="text-xs text-[#454648]/60 mt-1 flex items-center gap-2">
                    <span>{new Date(b.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{b.content?.length || 0} Content Blocks</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => openEdit(b)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#eaeaea] hover:border-[#225e4d] text-[#454648] hover:text-[#225e4d] bg-white transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(b)}
                  className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
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
          <div className="bg-white border border-[#eaeaea] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaeaea] sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <h2 className="text-lg font-bold text-[#454648]">
                {isEdit ? "Edit Blog" : "Add New Blog"}
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
              {/* Basic fields */}
              <FormInput
                label="Title *"
                value={title}
                onChange={setTitle}
                placeholder="Blog post title"
              />
              <FormTextarea
                label="Description *"
                value={description}
                onChange={setDescription}
                placeholder="Short summary of the blog"
                rows={3}
              />
              <FormInput
                label="Type / Category"
                value={typeField}
                onChange={setTypeField}
                placeholder="e.g. AI, Security, Engineering"
              />

              {/* Banner Image */}
              <div className="border border-[#eaeaea] rounded-xl p-4 space-y-3 bg-[#f6f6f6]">
                <p className="text-sm font-semibold text-[#454648]">Banner Image</p>
                {bannerPreview && (
                  <img
                    src={bannerPreview}
                    className="w-full h-44 object-cover rounded-lg border border-[#eaeaea]"
                    alt="Banner preview"
                  />
                )}
                <div>
                  <FieldLabel>{isEdit ? "Replace banner (optional)" : "Upload banner *"}</FieldLabel>
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm text-[#454648] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-[#225e4d] file:text-white file:cursor-pointer cursor-pointer"
                    onChange={e => {
                      const f = e.target.files?.[0] || null;
                      setBannerFile(f);
                      if (f) setBannerPreview(URL.createObjectURL(f));
                    }}
                  />
                </div>
              </div>

              {/* Content Blocks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#454648]">Content Blocks</p>
                  <button
                    className="buttonstyles flex items-center gap-1.5 px-3 py-1.5 text-xs"
                    onClick={addContentBlock}
                  >
                    <Plus size={14} /> Add Block
                  </button>
                </div>

                {content.map((c, i) => (
                  <div key={i} className="border border-[#eaeaea] rounded-xl p-4 space-y-3 bg-[#f6f6f6]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#454648]/80 uppercase tracking-wider">
                        Block {i + 1}
                      </span>
                      <button
                        onClick={() => removeContentBlock(i)}
                        className="px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-xs flex items-center gap-1 transition-colors cursor-pointer bg-white"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                    <FormInput
                      label="Block Title (optional)"
                      value={c.title || ""}
                      onChange={v => updateContentField(i, "title", v)}
                      placeholder="Section heading"
                    />
                    <FormTextarea
                      label="Block Description *"
                      value={c.description}
                      onChange={v => updateContentField(i, "description", v)}
                      placeholder="Content for this section"
                      rows={4}
                    />
                    <div>
                      <FieldLabel>Reference Image (optional)</FieldLabel>
                      <input
                        type="file"
                        accept="image/*"
                        className="text-sm text-[#454648] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-[#225e4d] file:text-white file:cursor-pointer cursor-pointer"
                        onChange={e => handleContentFileChange(i, e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                ))}
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
