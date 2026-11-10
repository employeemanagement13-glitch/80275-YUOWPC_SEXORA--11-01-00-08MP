"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Search, X } from "lucide-react";

type ObjItem = { title: string; desc: string };

// -------- Reusable Components -------- //
const Input = ({ label, value, onChange, type = "text" }: any) => (
    <div className="flex flex-col gap-1 w-full">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#454648]/80 mb-1">{label}</label>
        <input
            type={type}
            className="border border-[#eaeaea] p-2.5 rounded-lg w-full bg-white text-[#454648] placeholder-neutral-400 focus:border-[#225e4d] focus:ring-1 focus:ring-[#225e4d] outline-none transition-all text-sm shadow-sm"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const TextArea = ({ label, value, onChange }: any) => (
    <div className="flex flex-col gap-1 w-full">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#454648]/80 mb-1">{label}</label>
        <textarea
            className="border border-[#eaeaea] p-2.5 rounded-lg w-full h-24 bg-white text-[#454648] placeholder-neutral-400 focus:border-[#225e4d] focus:ring-1 focus:ring-[#225e4d] outline-none resize-y transition-all text-sm leading-relaxed shadow-sm"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

// ---------- Sanitization helpers ---------- //
function isObjectItemEmpty(obj: any) {
  if (!obj || typeof obj !== "object") return true;
  return Object.values(obj).every(
    (v) => v === undefined || v === null || String(v).trim() === ""
  );
}

function isStringItemEmpty(s: any) {
  return s === undefined || s === null || String(s).trim() === "";
}
 
function sanitizeFormArrays(formData: any) {
  const safe = { ...formData };

  objectArrays.forEach((key) => {
    const arr = safe[key];
    if (!Array.isArray(arr)) {
      safe[key] = [];
    } else if (arr.length === 1 && isObjectItemEmpty(arr[0])) {
      safe[key] = [];
    } else {
      safe[key] = arr.map((it) => (it && typeof it === "object" ? it : { title: "", desc: "" }));
    }
  });

  stringArrays.forEach((key) => {
    const arr = safe[key];
    if (!Array.isArray(arr)) {
      safe[key] = [];
    } else if (arr.length === 1 && isStringItemEmpty(arr[0])) {
      safe[key] = [];
    } else {
      safe[key] = arr.map((it) => (it === undefined || it === null ? "" : String(it)));
    }
  });

  return safe;
}

// ----------- MAIN PAGE ----------- //
export default function SolutionsPage() {
    const [solutions, setSolutions] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [formData, setFormData] = useState<any>(initialFormState);

    // local file state for preview & sending
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    // -------- Fetch all Solutions -------- //
    async function loadSolutions() {
        setLoading(true);

        try {
            const res = await fetch("/api/admins/solutions-get");
            const data = await res.json();
            setSolutions(data?.data || []);
        } catch (err) {
            console.error("Fetch solutions error:", err);
            setSolutions([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSolutions();
    }, []);

    // -------- Reset Form -------- //
    function resetForm() {
        setFormData(initialFormState);
        setEditId(null);
        setBannerFile(null);
        setBannerPreview(null);
    }

    // -------- Add / Update helpers for arrays -------- //
    function addStringItem(key: string) {
        setFormData({
            ...formData,
            [key]: [...(formData[key] || []), ""],
        });
    }

    function updateStringItem(key: string, index: number, value: string) {
        const arr = [...(formData[key] || [])];
        arr[index] = value;
        setFormData({ ...formData, [key]: arr });
    }

    function removeStringItem(key: string, index: number) {
        const arr = [...(formData[key] || [])];
        arr.splice(index, 1);
        setFormData({ ...formData, [key]: arr });
    }

    function addObjectItem(key: string) {
        setFormData({
            ...formData,
            [key]: [...(formData[key] || []), { title: "", desc: "" }],
        });
    }

    function updateObjectItem(key: string, index: number, field: string, value: string) {
        const arr = [...(formData[key] || [])];
        arr[index] = { ...(arr[index] || {}), [field]: value };
        setFormData({ ...formData, [key]: arr });
    }

    function removeObjectItem(key: string, index: number) {
        const arr = [...(formData[key] || [])];
        arr.splice(index, 1);
        setFormData({ ...formData, [key]: arr });
    }

    // -------- Submit Form (FormData: supports file upload) -------- //
    async function handleSubmit() {
        try {
            const sanitized = sanitizeFormArrays(formData);
            const fd = new FormData();

            [
                "title",
                "slug",
                "description",
                "name",
                "category",
                "headtitle",
                "headerdesc",
                "formtitle",
                "formdesc",
                "checkboxtitle",
            ].forEach((k) => {
                const v = sanitized[k] ?? formData[k];
                if (v !== undefined && v !== null) fd.append(k, String(v));
            });

            [
                "formcheckboxes",
                "benefitsofservice",
                "typesofservice",
                "deliverables",
                "whoconsider",
            ].forEach((k) => {
                fd.append(k, JSON.stringify(sanitized[k] || []));
            });

            [
                "whydoyouneed",
                "methodology",
                "keycomponents",
                "frameworks",
                "capabilities",
                "whyus",
                "whatyouget",
                "procedure",
                "matters",
                "differences",
                "ourapproach",
            ].forEach((k) => {
                fd.append(k, JSON.stringify(sanitized[k] || []));
            });

            if (bannerFile) {
                fd.append("banner_image", bannerFile);
            } else {
                if (sanitized.banner_image || formData.banner_image) {
                    fd.append("banner_image_old", sanitized.banner_image || formData.banner_image);
                }
            }

            const method = editId ? "PUT" : "POST";
            if (editId) fd.append("id", editId);

            const res = await fetch("/api/admins/solutions", {
                method,
                body: fd,
            });

            const result = await res.json();
            if (result?.success) {
                await loadSolutions();
                setShowForm(false);
                resetForm();
            } else {
                console.error("Save error:", result);
                alert(result?.error || "Save failed");
            }
        } catch (err) {
            console.error("Submit error:", err);
            alert("Submit failed");
        }
    }

    // -------- Edit Solution -------- //
    function handleEdit(solution: any) {
        setEditId(solution.id);
        const safe: any = { ...initialFormState, ...solution };

        objectArrays.forEach((k) => {
            if (!safe[k] || !Array.isArray(safe[k])) safe[k] = [{ title: "", desc: "" }];
        });
        stringArrays.forEach((k) => {
            if (!safe[k] || !Array.isArray(safe[k])) safe[k] = [""];
        });

        setFormData(safe);
        setBannerPreview(solution.banner_image || null);
        setBannerFile(null);
        setShowForm(true);
    }

    // -------- Delete Solution -------- //
    async function handleDelete(id: string) {
        if (!confirm("Delete this solution?")) return;
        try {
            const res = await fetch("/api/admins/solutions-delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (data?.success) loadSolutions();
            else alert(data?.error || "Delete failed");
        } catch (err) {
            console.error("Delete error:", err);
            alert("Delete failed");
        }
    }

    const filteredSolutions = solutions.filter((s: any) =>
        (s.title || "").toLowerCase().includes(search.toLowerCase())
    );

    // ---------- JSX ---------- //
    return (
        <div className="adminSearchbar">
            {/* Page Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#454648] tracking-tight">Solutions</h1>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#225e4d]/10 text-[#225e4d] border border-[#225e4d]/30">
                            {solutions.length} Total
                        </span>
                    </div>
                    <p className="text-sm text-[#454648]/75 mt-1">
                        Configure enterprise solution architectures, service capabilities, and deliverables.
                    </p>
                </div>
                <button
                    className="buttonstyles flex items-center gap-2 self-start sm:self-auto"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                >
                    <Plus size={16} /> Add Solution
                </button>
            </div>

            {/* Top Search Bar */}
            <div className="adminSearchbarParent">
                <div className="searchparent">
                    <Search size={16} className="text-[#454648]/60 shrink-0" />
                    <input
                        className="search"
                        placeholder="Search solutions by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <span className="text-xs text-[#454648]/70 font-medium px-2">
                    Showing {filteredSolutions.length} of {solutions.length}
                </span>
            </div>

            {/* Solutions List */}
            {loading ? (
                <div className="text-center text-[#454648]/70 py-16 bg-[#f6f6f6] border border-[#eaeaea] rounded-xl">
                    Loading solutions...
                </div>
            ) : filteredSolutions.length === 0 ? (
                <div className="text-center text-[#454648]/70 py-16 bg-[#f6f6f6] border border-[#eaeaea] rounded-xl">
                    No solutions found matching your search.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSolutions.map((solution: any) => (
                        <div
                            key={solution.id}
                            className="bg-[#f6f6f6] border border-[#eaeaea] rounded-xl overflow-hidden hover:bg-white hover:border-[#225e4d]/30 hover:shadow-lg hover:shadow-[#225e4d]/5 transition-all flex flex-col justify-between"
                        >
                            <div>
                                {solution.banner_image && (
                                    <img
                                        src={solution.banner_image}
                                        className="w-full h-44 object-cover"
                                        alt={solution.title}
                                    />
                                )}

                                <div className="p-5">
                                    {solution.category && (
                                        <span className="inline-block text-[11px] font-semibold text-[#225e4d] uppercase tracking-wider mb-2">
                                            {solution.category}
                                        </span>
                                    )}
                                    <h3 className="text-base font-bold text-[#454648]">{solution.title}</h3>
                                    <p className="text-sm text-[#454648]/75 mt-1 line-clamp-2">{solution.description}</p>
                                </div>
                            </div>

                            <div className="p-5 pt-0">
                                <div className="flex items-center gap-2 pt-3 border-t border-[#eaeaea]">
                                    <button
                                        onClick={() => handleEdit(solution)}
                                        className="px-3.5 py-1.5 rounded-lg border border-[#eaeaea] hover:border-[#225e4d] text-[#454648] hover:text-[#225e4d] bg-white transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Edit2 size={13} /> Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(solution.id)}
                                        className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Trash2 size={13} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* -------- Add/Edit Form Modal -------- */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start p-4 sm:p-6 overflow-auto z-50">
                    <div className="bg-white border border-[#eaeaea] p-6 sm:p-8 rounded-2xl w-full max-w-5xl relative text-[#454648] my-8 shadow-2xl">
                        <button
                            className="absolute p-1.5 rounded-lg top-5 right-5 text-[#454648]/60 hover:text-[#454648] hover:bg-[#f6f6f6] transition-colors cursor-pointer"
                            onClick={() => {
                                setShowForm(false);
                                resetForm();
                            }}
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold mb-6 text-[#454648]">
                            {editId ? "Edit Solution" : "Add New Solution"}
                        </h2>

                        {/* -------- FULL FORM -------- */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Title"
                                    value={formData.title}
                                    onChange={(v: string) => setFormData({ ...formData, title: v })}
                                />

                                <Input
                                    label="Name"
                                    value={formData.name}
                                    onChange={(v: string) => setFormData({ ...formData, name: v })}
                                />
                                <Input
                                    label="Category"
                                    value={formData.category}
                                    onChange={(v: string) => setFormData({ ...formData, category: v })}
                                />
                            </div>

                            <TextArea
                                label="Description"
                                value={formData.description}
                                onChange={(v: string) => setFormData({ ...formData, description: v })}
                            />

                            {/* ---------- Banner image uploader ---------- */}
                            <div className="border border-[#eaeaea] rounded-xl p-4 space-y-3 bg-[#f6f6f6]">
                                <p className="text-sm font-semibold text-[#454648]">Banner Image</p>
                                {bannerPreview ? (
                                    <img src={bannerPreview} className="w-full h-40 object-cover rounded-lg border border-[#eaeaea]" alt="Banner preview" />
                                ) : formData.banner_image ? (
                                    <img src={formData.banner_image} className="w-full h-40 object-cover rounded-lg border border-[#eaeaea]" alt="Existing banner" />
                                ) : null}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="text-sm text-[#454648] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-[#225e4d] file:text-white file:cursor-pointer cursor-pointer"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0] || null;
                                        setBannerFile(f);
                                        if (f) setBannerPreview(URL.createObjectURL(f));
                                        else {
                                            setBannerPreview(null);
                                        }
                                    }}
                                />
                            </div>

                            {/* headtitle + headerdesc */}
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Head Title"
                                    value={formData.headtitle}
                                    onChange={(v: string) => setFormData({ ...formData, headtitle: v })}
                                />

                                <TextArea
                                    label="Header Description"
                                    value={formData.headerdesc}
                                    onChange={(v: string) => setFormData({ ...formData, headerdesc: v })}
                                />
                            </div>

                            {/* formtitle + formdesc + checkboxtitle */}
                            <Input
                                label="Form Title"
                                value={formData.formtitle}
                                onChange={(v: string) => setFormData({ ...formData, formtitle: v })}
                            />

                            <TextArea
                                label="Form Description"
                                value={formData.formdesc}
                                onChange={(v: string) => setFormData({ ...formData, formdesc: v })}
                            />

                            <Input
                                label="Checkbox Title"
                                value={formData.checkboxtitle}
                                onChange={(v: string) => setFormData({ ...formData, checkboxtitle: v })}
                            />

                            {/* ------------- OBJECT ARRAYS ------------- */}
                            {objectArrays.map((objKey) => (
                                <div key={objKey} className="border border-[#eaeaea] p-4 rounded-xl bg-[#f6f6f6]">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold text-[#454648] text-xs uppercase tracking-wider">{objKey}</h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => addObjectItem(objKey)}
                                                className="p-1.5 rounded-md bg-[#225e4d] hover:bg-[#1b4d3f] text-white cursor-pointer transition-colors shadow-sm"
                                                title={`Add ${objKey}`}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {(formData[objKey] || []).map((item: ObjItem, idx: number) => (
                                        <div key={idx} className="grid grid-cols-2 gap-4 mb-3">
                                            <Input
                                                label="Title"
                                                value={item?.title}
                                                onChange={(v: string) => updateObjectItem(objKey, idx, "title", v)}
                                            />

                                            <div className="flex gap-2">
                                                <TextArea
                                                    label="Description"
                                                    value={item?.desc}
                                                    onChange={(v: string) => updateObjectItem(objKey, idx, "desc", v)}
                                                />
                                                <button
                                                    onClick={() => removeObjectItem(objKey, idx)}
                                                    className="p-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-lg cursor-pointer h-fit self-end transition-colors"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {/* ------------- STRING ARRAYS ------------- */}
                            {stringArrays.map((key) => (
                                <div key={key} className="border border-[#eaeaea] p-4 rounded-xl bg-[#f6f6f6]">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold text-[#454648] text-xs uppercase tracking-wider">{key}</h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => addStringItem(key)}
                                                className="p-1.5 rounded-md bg-[#225e4d] hover:bg-[#1b4d3f] text-white cursor-pointer transition-colors shadow-sm"
                                                title={`Add ${key}`}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {(formData[key] || []).map((value: any, idx: number) => (
                                        <div key={idx} className="flex gap-2 items-start mb-2">
                                            <Input
                                                label={`Item ${idx + 1}`}
                                                value={value}
                                                onChange={(v: string) => updateStringItem(key, idx, v)}
                                            />
                                            <button
                                                onClick={() => removeStringItem(key, idx)}
                                                className="p-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-lg cursor-pointer h-fit self-end transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {/* Submit */}
                            <div className="flex justify-end gap-3 pt-3 border-t border-[#eaeaea]">
                                <button
                                    onClick={() => {
                                        resetForm();
                                        setShowForm(false);
                                    }}
                                    className="px-4 py-2 rounded-lg border border-[#eaeaea] text-[#454648] hover:bg-[#f6f6f6] transition-colors cursor-pointer text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="buttonstyles px-6 py-2 text-sm font-medium"
                                >
                                    {editId ? "Update" : "Create"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// -------- FORM DEFAULT STATE -------- //
const initialFormState = {
    title: "",
    slug: "",
    category: "",
    description: "",
    banner_image: "",
    name: "",
    headtitle: "",
    headerdesc: "",
    formtitle: "",
    formdesc: "",
    formcheckboxes: [],
    checkboxtitle: "",
    whydoyouneed: [{ title: "", desc: "" }],
    methodology: [{ title: "", desc: "" }],
    keycomponents: [{ title: "", desc: "" }],
    frameworks: [{ title: "", desc: "" }],
    capabilities: [{ title: "", desc: "" }],
    whyus: [{ title: "", desc: "" }],
    whatyouget: [{ title: "", desc: "" }],
    procedure: [{ title: "", desc: "" }],
    matters: [{ title: "", desc: "" }],
    differences: [{ title: "", desc: "" }],
    ourapproach: [{ title: "", desc: "" }],

    benefitsofservice: [""],
    typesofservice: [""],
    deliverables: [""],
    whoconsider: [""],
};

// ---------- Arrays for Looping ---------- //
const objectArrays = [
    "whydoyouneed",
    "methodology",
    "keycomponents",
    "frameworks",
    "capabilities",
    "whyus",
    "whatyouget",
    "procedure",
    "matters",
    "differences",
    "ourapproach",
];

const stringArrays = [
    "formcheckboxes",
    "benefitsofservice",
    "typesofservice",
    "deliverables",
    "whoconsider",
];
