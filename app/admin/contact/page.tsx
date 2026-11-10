"use client";

import React, { useEffect, useState } from "react";
import { Search, Eye, EyeOff, Bookmark, Trash2 } from "lucide-react";

type ContactRow = {
  id: string;
  source: string; // 'home' | 'solutions' | 'contact'
  solution_slug?: string | null;
  solution_title?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  email: string;
  company_name?: string | null;
  phone?: string | null;
  required_service?: string | null;
  details?: string | null;
  is_highlighted?: boolean;
  created_at: string;
};

type SolutionOption = {
  slug: string;
  title: string;
};

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [solutionsList, setSolutionsList] = useState<SolutionOption[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Main Switches: 'home' | 'solutions' | 'contact'
  const [activeTab, setActiveTab] = useState<"home" | "solutions" | "contact">("home");

  // Solutions sub-switch: 'general' | solution_slug
  const [solutionSubTab, setSolutionSubTab] = useState<string>("general");

  // Expanded details map for "View" action
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  async function fetchContacts() {
    try {
      setLoading(true);
      const res = await fetch("/api/admins/contacts-get");
      const json = await res.json();
      setContacts(json?.data || []);
    } catch (err) {
      console.error("fetchContacts error:", err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSolutionsList() {
    try {
      const res = await fetch("/api/admins/solutions-get");
      const json = await res.json();
      const raw = json?.data || [];
      const mapped: SolutionOption[] = raw.map((s: any) => ({
        slug: s.slug,
        title: s.title || s.name || s.slug,
      }));
      setSolutionsList(mapped);
    } catch (err) {
      console.error("fetchSolutionsList error:", err);
    }
  }

  useEffect(() => {
    fetchContacts();
    fetchSolutionsList();
  }, []);

  async function handleToggleHighlight(row: ContactRow) {
    const nextState = !row.is_highlighted;
    setContacts((prev) =>
      prev.map((c) => (c.id === row.id ? { ...c, is_highlighted: nextState } : c))
    );

    try {
      const res = await fetch("/api/admins/contacts-toggle-highlight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, is_highlighted: nextState }),
      });
      const json = await res.json();
      if (!json.success) {
        setContacts((prev) =>
          prev.map((c) => (c.id === row.id ? { ...c, is_highlighted: !nextState } : c))
        );
        alert("Failed to update highlight: " + (json.error || ""));
      }
    } catch {
      alert("Network error updating highlight");
      fetchContacts();
    }
  }

  async function handleDelete(row: ContactRow) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setContacts((prev) => prev.filter((c) => c.id !== row.id));

    try {
      const res = await fetch("/api/admins/contacts-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id }),
      });
      const json = await res.json();
      if (!json.success) {
        alert("Delete failed: " + (json.error || ""));
        fetchContacts();
      }
    } catch {
      alert("Network error deleting contact");
      fetchContacts();
    }
  }

  function toggleView(id: string) {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // Filter contacts by active Tab and Solutions sub-tab
  const filteredByTab = contacts.filter((c) => {
    if (activeTab === "home") {
      return c.source === "home";
    }
    if (activeTab === "contact") {
      return c.source === "contact" || (!c.source && !c.solution_slug);
    }
    if (activeTab === "solutions") {
      if (c.source !== "solutions") return false;
      if (solutionSubTab === "general") {
        return !c.solution_slug || c.solution_slug === "general";
      }
      return c.solution_slug === solutionSubTab;
    }
    return true;
  });

  // Filter by search query
  const filteredContacts = filteredByTab.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = (c.full_name || `${c.first_name || ""} ${c.last_name || ""}`).toLowerCase();
    const email = (c.email || "").toLowerCase();
    const company = (c.company_name || "").toLowerCase();
    const phone = (c.phone || "").toLowerCase();
    const service = (c.required_service || "").toLowerCase();
    const details = (c.details || "").toLowerCase();
    return (
      name.includes(q) ||
      email.includes(q) ||
      company.includes(q) ||
      phone.includes(q) ||
      service.includes(q) ||
      details.includes(q)
    );
  });

  return (
    <div className="adminSearchbar">
      {/* Page Title & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#454648] tracking-tight">Contact Messages</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#225e4d]/10 text-[#225e4d] border border-[#225e4d]/30">
              {contacts.length} Total
            </span>
          </div>
          <p className="text-sm text-[#454648]/75 mt-1">
            Review inquiries submitted across Home, Solutions, and Contact pages.
          </p>
        </div>
      </div>

      {/* Search and Top Controls */}
      <div className="adminSearchbarParent">
        <div className="searchparent">
          <Search size={16} className="text-[#454648]/60 shrink-0" />
          <input
            className="search"
            placeholder="Search messages by name, email, company, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 3 Main Switches: Home, Solutions, Contact */}
        <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-[#eaeaea] shadow-sm">
          {(["home", "solutions", "contact"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg font-medium capitalize text-xs transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "bg-[#225e4d] text-white shadow-sm font-semibold"
                  : "text-[#454648] hover:text-[#225e4d] hover:bg-[#f6f6f6]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Solutions Sub-Switches Bar (Only when Solutions tab is active) */}
      {activeTab === "solutions" && (
        <div className="bg-[#f6f6f6] p-3.5 rounded-xl flex flex-wrap gap-2 items-center border border-[#eaeaea] shadow-sm">
          <span className="text-xs font-semibold text-[#454648]/80 mr-2 uppercase tracking-wider">
            Filter Solution:
          </span>
          <button
            onClick={() => setSolutionSubTab("general")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
              solutionSubTab === "general"
                ? "bg-[#225e4d] text-white shadow-sm"
                : "bg-white border border-[#eaeaea] text-[#454648] hover:text-[#225e4d] hover:border-[#225e4d]"
            }`}
          >
            General
          </button>
          {solutionsList.map((sol) => (
            <button
              key={sol.slug}
              onClick={() => setSolutionSubTab(sol.slug)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
                solutionSubTab === sol.slug
                  ? "bg-[#225e4d] text-white shadow-sm"
                  : "bg-white border border-[#eaeaea] text-[#454648] hover:text-[#225e4d] hover:border-[#225e4d]"
              }`}
            >
              {sol.title}
            </button>
          ))}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white border border-[#eaeaea] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#454648]">
            <thead className="bg-[#f6f6f6] text-[#454648]/80 uppercase text-[11px] tracking-wider border-b border-[#eaeaea]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Name</th>
                <th className="py-3.5 px-4 font-semibold">Email</th>
                <th className="py-3.5 px-4 font-semibold">Company</th>
                <th className="py-3.5 px-4 font-semibold">Phone</th>
                <th className="py-3.5 px-4 font-semibold">Req Service</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#eaeaea]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-[#454648]/60">
                    Loading contact messages...
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-[#454648]/60">
                    No messages found for this view.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((c) => {
                  const isExpanded = !!expandedRows[c.id];
                  const nameDisplay =
                    c.full_name ||
                    `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
                    "N/A";

                  return (
                    <React.Fragment key={c.id}>
                      <tr
                        className={`transition-colors duration-150 ${
                          c.is_highlighted
                            ? "bg-emerald-50/70 border-l-4 border-l-[#225e4d]"
                            : "hover:bg-[#fafafa]"
                        }`}
                      >
                        {/* Name */}
                        <td className="py-4 px-4 font-medium text-[#454648]">{nameDisplay}</td>

                        {/* Email */}
                        <td className="py-4 px-4 text-[#454648]/80">
                          <a
                            href={`mailto:${c.email}`}
                            className="hover:underline text-[#225e4d] font-mono text-xs font-medium"
                          >
                            {c.email}
                          </a>
                        </td>

                        {/* Company */}
                        <td className="py-4 px-4 text-[#454648]/80">
                          {c.company_name || "—"}
                        </td>

                        {/* Phone */}
                        <td className="py-4 px-4 text-[#454648]/80 font-mono text-xs">
                          {c.phone || "—"}
                        </td>

                        {/* Req Service */}
                        <td className="py-4 px-4 text-[#454648]/80">
                          {c.required_service ? (
                            <span className="bg-[#f6f6f6] border border-[#eaeaea] px-2.5 py-1 rounded-md text-xs text-[#454648]">
                              {c.required_service}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View Action (Only for Home & Contact tabs) */}
                            {(activeTab === "home" || activeTab === "contact") && (
                              <button
                                onClick={() => toggleView(c.id)}
                                title={isExpanded ? "Hide Message" : "View Message"}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer border shadow-sm ${
                                  isExpanded
                                    ? "bg-[#454648] border-[#454648] text-white"
                                    : "bg-white border-[#eaeaea] text-[#454648] hover:border-[#225e4d] hover:text-[#225e4d]"
                                }`}
                              >
                                {isExpanded ? <EyeOff size={13} /> : <Eye size={13} />}
                                View
                              </button>
                            )}

                            {/* Highlight Action */}
                            <button
                              onClick={() => handleToggleHighlight(c)}
                              title={c.is_highlighted ? "Remove Highlight" : "Highlight"}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer border shadow-sm ${
                                c.is_highlighted
                                  ? "bg-[#225e4d] border-[#225e4d] text-white hover:bg-[#1b4d3f]"
                                  : "bg-white border-[#eaeaea] text-[#454648] hover:border-[#225e4d] hover:text-[#225e4d]"
                              }`}
                            >
                              <Bookmark size={13} className={c.is_highlighted ? "fill-white" : ""} />
                              Highlight
                            </button>

                            {/* Delete Action */}
                            <button
                              onClick={() => handleDelete(c)}
                              title="Delete Message"
                              className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Dropdown Message Details Row (View Action) */}
                      {isExpanded && (activeTab === "home" || activeTab === "contact") && (
                        <tr className={c.is_highlighted ? "bg-emerald-50/40" : "bg-[#f9f9f9]"}>
                          <td colSpan={6} className="px-6 py-4 border-t border-[#eaeaea]">
                            <div className="space-y-2 text-sm text-[#454648]">
                              <div className="font-semibold text-[#454648] flex items-center gap-2">
                                <span>Message Details:</span>
                                <span className="text-xs text-[#454648]/60 font-normal">
                                  Submitted on{" "}
                                  {new Date(c.created_at).toLocaleString()}
                                </span>
                              </div>
                              <div className="bg-white p-4 rounded-xl border border-[#eaeaea] text-[#454648] whitespace-pre-wrap leading-relaxed text-xs sm:text-sm shadow-sm">
                                {c.details ? c.details : "No details provided."}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
