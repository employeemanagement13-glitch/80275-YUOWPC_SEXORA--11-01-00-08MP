'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { SafeIcon } from '@/Components/SafeIcon';

type Stat = { label: string; value: string };
type Feature = { icon: string; title: string; description: string; screenshot: string };
type HowItWorks = { step: number; title: string; description: string; icon: string };
type UseCase = { industry: string; scenario: string; thumbnail: string };
type Integration = { name: string; logo: string };
type Testimonial = { quote: string; author: string; company: string; result: string };

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  status: string;
  industries: string[];
  logo_url: string;
  hero_media_type: string;
  hero_media_url: string;
  updated_at: string;
  // Full-detail fields (only present after fetching a single product for editing)
  problem?: string;
  solution?: string;
  stats?: Stat[];
  features?: Feature[];
  how_it_works?: HowItWorks[];
  use_cases?: UseCase[];
  integrations?: Integration[];
  testimonials?: Testimonial[];
  related_product_ids?: string[];
  cta_text?: string;
  seo_meta_title?: string;
  seo_meta_description?: string;
  seo_og_image?: string;
};

const EMPTY_PRODUCT: Partial<ProductRow> = {
  name: '',
  slug: '',
  tagline: '',
  category: '',
  status: 'draft',
  industries: [],
  logo_url: '',
  hero_media_type: 'image',
  hero_media_url: '',
  problem: '',
  solution: '',
  stats: [],
  features: [],
  how_it_works: [],
  use_cases: [],
  integrations: [],
  testimonials: [],
  related_product_ids: [],
  cta_text: 'Book a free demo',
  seo_meta_title: '',
  seo_meta_description: '',
  seo_og_image: '',
};

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-semibold uppercase tracking-wider text-[#454648]/80 mb-1.5">{children}</label>
);

const FormInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
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
      className="border border-[#eaeaea] p-2.5 rounded-lg w-full bg-white text-[#454648] focus:border-[#225e4d] focus:ring-1 focus:ring-[#225e4d] outline-none transition-all placeholder-neutral-400 text-sm shadow-sm"
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const FormTextarea = ({
  label,
  value,
  onChange,
  placeholder = '',
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
      className="border border-[#eaeaea] p-2.5 rounded-lg w-full bg-white text-[#454648] focus:border-[#225e4d] focus:ring-1 focus:ring-[#225e4d] outline-none resize-y transition-all placeholder-neutral-400 text-sm leading-relaxed shadow-sm"
      value={value || ''}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const FormSelect = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) => (
  <div className="flex flex-col gap-1 w-full">
    <FieldLabel>{label}</FieldLabel>
    <select
      className="border border-[#eaeaea] p-2.5 rounded-lg w-full bg-white text-[#454648] focus:border-[#225e4d] focus:ring-1 focus:ring-[#225e4d] outline-none transition-all text-sm shadow-sm"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#eaeaea] rounded-xl overflow-hidden mb-4 bg-[#f6f6f6] shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#f0f0f0] text-[#454648] font-medium hover:bg-[#eaeaea] transition-colors"
      >
        <span className="text-sm font-semibold">{title}</span>
        {open ? <ChevronUp size={16} className="text-[#454648]/60" /> : <ChevronDown size={16} className="text-[#454648]/60" />}
      </button>
      {open && <div className="p-5 bg-white space-y-4 border-t border-[#eaeaea]">{children}</div>}
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ProductRow>>({ ...EMPTY_PRODUCT });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [featureScreenshots, setFeatureScreenshots] = useState<Map<number, File>>(new Map());
  const [useCaseThumbnails, setUseCaseThumbnails] = useState<Map<number, File>>(new Map());
  const [integrationLogos, setIntegrationLogos] = useState<Map<number, File>>(new Map());
  const [industriesText, setIndustriesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch('/api/admins/products-get');
      const json = await res.json();
      setProducts(json?.data || []);
    } catch (err) {
      console.error('fetchProducts error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  function setField(key: keyof ProductRow, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openAdd() {
    setIsEdit(false);
    setEditId(null);
    setForm({ ...EMPTY_PRODUCT });
    setIndustriesText('');
    setLogoFile(null);
    setLogoPreview(null);
    setHeroFile(null);
    setHeroPreview(null);
    setFeatureScreenshots(new Map());
    setUseCaseThumbnails(new Map());
    setIntegrationLogos(new Map());
    setOpen(true);
  }

  async function openEdit(p: ProductRow) {
    setEditLoading(true);
    setOpen(true);
    setIsEdit(true);
    setEditId(p.id);
    // Pre-fill lightweight fields immediately so the modal opens fast
    setForm({
      name: p.name || '',
      slug: p.slug || '',
      tagline: p.tagline || '',
      category: p.category || '',
      status: p.status || 'draft',
      industries: p.industries || [],
      logo_url: p.logo_url || '',
      hero_media_type: p.hero_media_type || 'image',
      hero_media_url: p.hero_media_url || '',
      problem: '',
      solution: '',
      stats: [],
      features: [],
      how_it_works: [],
      use_cases: [],
      integrations: [],
      testimonials: [],
      related_product_ids: [],
      cta_text: 'Book a free demo',
      seo_meta_title: '',
      seo_meta_description: '',
      seo_og_image: '',
    });
    setIndustriesText((p.industries || []).join(', '));
    setLogoFile(null);
    setLogoPreview(p.logo_url || null);
    setHeroFile(null);
    setHeroPreview(p.hero_media_url || null);
    setFeatureScreenshots(new Map());
    setUseCaseThumbnails(new Map());
    setIntegrationLogos(new Map());
    // Fetch full product data in background
    try {
      const res = await fetch(`/api/admins/products-get?id=${encodeURIComponent(p.id)}`);
      const json = await res.json();
      if (json?.data) {
        const full = json.data as ProductRow;
        setForm({
          name: full.name || '',
          slug: full.slug || '',
          tagline: full.tagline || '',
          category: full.category || '',
          status: full.status || 'draft',
          industries: full.industries || [],
          logo_url: full.logo_url || '',
          hero_media_type: full.hero_media_type || 'image',
          hero_media_url: full.hero_media_url || '',
          problem: full.problem || '',
          solution: full.solution || '',
          stats: full.stats || [],
          features: full.features || [],
          how_it_works: full.how_it_works || [],
          use_cases: full.use_cases || [],
          integrations: full.integrations || [],
          testimonials: full.testimonials || [],
          related_product_ids: full.related_product_ids || [],
          cta_text: full.cta_text || 'Book a free demo',
          seo_meta_title: full.seo_meta_title || '',
          seo_meta_description: full.seo_meta_description || '',
          seo_og_image: full.seo_og_image || '',
        });
        setIndustriesText((full.industries || []).join(', '));
        setLogoPreview(full.logo_url || null);
        setHeroPreview(full.hero_media_url || null);
      }
    } catch (err) {
      console.error('openEdit fetch error:', err);
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(p: ProductRow) {
    if (!confirm(`Delete product "${p.name}"?`)) return;
    const res = await fetch('/api/admins/products-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id }),
    });
    const json = await res.json();
    if (json.success) fetchProducts();
    else alert('Delete failed: ' + (json.error || ''));
  }

  function submitForm() {
    const { name } = form;
    if (!name?.trim()) { alert('Name is required'); return; }

    const slug = (form.slug?.trim() || makeSlug(name)).trim();

    const parsedIndustries = industriesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('slug', slug);
    fd.append('tagline', form.tagline || '');
    fd.append('category', form.category || '');
    fd.append('status', form.status || 'draft');
    fd.append('industries', JSON.stringify(parsedIndustries));
    fd.append('logo_url', form.logo_url || '');
    fd.append('hero_media_type', form.hero_media_type || 'image');
    fd.append('hero_media_url', form.hero_media_url || '');
    fd.append('problem', form.problem || '');
    fd.append('solution', form.solution || '');
    fd.append('stats', JSON.stringify(form.stats || []));
    fd.append('features', JSON.stringify(form.features || []));
    fd.append('how_it_works', JSON.stringify(form.how_it_works || []));
    fd.append('use_cases', JSON.stringify(form.use_cases || []));
    fd.append('integrations', JSON.stringify(form.integrations || []));
    fd.append('testimonials', JSON.stringify(form.testimonials || []));
    fd.append('related_product_ids', JSON.stringify(form.related_product_ids || []));
    fd.append('cta_text', form.cta_text || 'Book a free demo');
    fd.append('seo_meta_title', form.seo_meta_title || '');
    fd.append('seo_meta_description', form.seo_meta_description || '');
    fd.append('seo_og_image', form.seo_og_image || '');

    if (logoFile) fd.append('logo_file', logoFile);
    else { fd.append('logo_url_old', form.logo_url || ''); }

    if (heroFile) fd.append('hero_file', heroFile);
    else { fd.append('hero_media_url_old', form.hero_media_url || ''); }

    featureScreenshots.forEach((file, idx) => fd.append(`feature_screenshot_${idx}`, file));
    useCaseThumbnails.forEach((file, idx) => fd.append(`use_case_thumbnail_${idx}`, file));
    integrationLogos.forEach((file, idx) => fd.append(`integration_logo_${idx}`, file));

    if (isEdit && editId) fd.append('id', editId);

    const method = isEdit ? 'PUT' : 'POST';
    const xhr = new XMLHttpRequest();
    xhr.open(method, '/api/admins/products');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      setUploadProgress(0);
      setSaving(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          setOpen(false);
          fetchProducts();
        } else {
          alert('Error: ' + (res.error || 'Unknown'));
        }
      } else {
        alert('Save failed: ' + xhr.statusText);
      }
    };
    xhr.onerror = () => { setSaving(false); setUploadProgress(0); alert('Network error'); };

    setSaving(true);
    xhr.send(fd);
  }

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.slug?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge: Record<string, string> = {
    live: 'bg-emerald-50 text-[#225e4d] border-[#225e4d]/30',
    beta: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    coming_soon: 'bg-blue-50 text-blue-700 border-blue-200',
    draft: 'bg-neutral-100 text-[#454648] border-neutral-200',
  };

  return (
    <div className="adminSearchbar">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#454648] tracking-tight">Products</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#225e4d]/10 text-[#225e4d] border border-[#225e4d]/30">
              {products.length} Total
            </span>
          </div>
          <p className="text-sm text-[#454648]/75 mt-1">
            Manage your SaaS products, feature breakdowns, architecture stats, and use cases.
          </p>
        </div>
        <button onClick={openAdd} className="buttonstyles flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="adminSearchbarParent">
        <div className="searchparent">
          <Search size={16} className="text-[#454648]/60 shrink-0" />
          <input
            className="search"
            placeholder="Search products by name, slug, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs text-[#454648]/70 font-medium px-2">
          Showing {filtered.length} of {products.length}
        </span>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-5 flex justify-between items-center bg-[#f6f6f6] border border-[#eaeaea] rounded-xl animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-neutral-200" />
                  <div className="space-y-2">
                    <div className="w-36 h-4 bg-neutral-200 rounded" />
                    <div className="w-24 h-3 bg-neutral-200 rounded" />
                  </div>
                </div>
                <div className="w-20 h-8 bg-neutral-200 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {filtered.map((p) => (
              <div
                key={p.id}
                className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#f6f6f6] border border-[#eaeaea] rounded-xl hover:bg-white hover:border-[#225e4d]/30 hover:shadow-lg hover:shadow-[#225e4d]/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  {p.logo_url ? (
                    <img
                      src={p.logo_url}
                      alt={p.name}
                      className="w-12 h-12 object-contain rounded-lg bg-white border border-[#eaeaea] p-1.5 shadow-sm"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white border border-[#eaeaea] flex items-center justify-center text-xs font-bold text-[#225e4d] shadow-sm">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-[#454648] text-base">{p.name}</div>
                    <div className="text-xs text-[#454648]/70 flex items-center flex-wrap gap-2 mt-1">
                      <span className="font-mono text-[#454648]/60">/{p.slug}</span>
                      {p.category && (
                        <>
                          <span>•</span>
                          <span className="text-[#454648]/80">{p.category}</span>
                        </>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadge[p.status] || statusBadge.draft}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => openEdit(p)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#eaeaea] hover:border-[#225e4d] text-[#454648] hover:text-[#225e4d] bg-white transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center text-[#454648]/70 py-16 bg-[#f6f6f6] border border-[#eaeaea] rounded-xl">
                No products found matching your search.
              </div>
            )}
          </>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#eaeaea] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaeaea] sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <h2 className="text-lg font-bold text-[#454648]">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setOpen(false)} className="text-[#454648]/60 hover:text-[#454648] p-1.5 rounded-lg hover:bg-[#f6f6f6] transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {editLoading && (
                <div className="flex items-center gap-2 text-sm text-[#225e4d] bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
                  <svg className="animate-spin h-4 w-4 text-[#225e4d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading full product details…
                </div>
              )}
              <CollapsibleSection title="Basic Info" defaultOpen>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Product Name *"
                    value={form.name || ''}
                    onChange={(v) => {
                      setField('name', v);
                      if (!isEdit) setField('slug', makeSlug(v));
                    }}
                  />
                  <FormInput
                    label="Slug"
                    value={form.slug || ''}
                    onChange={(v) => setField('slug', v)}
                    placeholder="auto-generated from name"
                  />
                </div>
                <FormInput
                  label="Tagline"
                  value={form.tagline || ''}
                  onChange={(v) => setField('tagline', v)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormSelect
                    label="Category"
                    value={form.category || ''}
                    onChange={(v) => setField('category', v)}
                    options={[
                      { label: '— Select —', value: '' },
                      { label: 'AI Agent', value: 'ai_agent' },
                      { label: 'Automation', value: 'automation' },
                      { label: 'SaaS Platform', value: 'saas_platform' },
                      { label: 'ERP System', value: 'erp_system' },
                    ]}
                  />
                  <FormSelect
                    label="Status"
                    value={form.status || 'draft'}
                    onChange={(v) => setField('status', v)}
                    options={[
                      { label: 'Draft', value: 'draft' },
                      { label: 'Live', value: 'live' },
                      { label: 'Beta', value: 'beta' },
                      { label: 'Coming Soon', value: 'coming_soon' },
                    ]}
                  />
                </div>
                <FormInput
                  label="Industries (comma-separated)"
                  value={industriesText}
                  onChange={(v) => setIndustriesText(v)}
                  placeholder="Healthcare, Finance, Retail"
                />
                <FormInput
                  label="CTA Button Text"
                  value={form.cta_text || ''}
                  onChange={(v) => setField('cta_text', v)}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Media">
                <div className="space-y-3">
                  <FieldLabel>Logo</FieldLabel>
                  {logoPreview && (
                    <img src={logoPreview} alt="logo" className="w-16 h-16 object-contain rounded bg-[#1a1a1a] p-1" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm text-neutral-300"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setLogoFile(f);
                      if (f) setLogoPreview(URL.createObjectURL(f));
                    }}
                  />
                </div>
                <div className="space-y-3">
                  <FormSelect
                    label="Hero Media Type"
                    value={form.hero_media_type || 'image'}
                    onChange={(v) => setField('hero_media_type', v)}
                    options={[
                      { label: 'Image', value: 'image' },
                      { label: 'Video', value: 'video' },
                      { label: 'GIF', value: 'gif' },
                    ]}
                  />
                  {heroPreview && (
                    <img src={heroPreview} alt="hero" className="w-full h-40 object-cover rounded" />
                  )}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="text-sm text-neutral-300"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setHeroFile(f);
                      if (f) setHeroPreview(URL.createObjectURL(f));
                    }}
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Problem & Solution">
                <FormTextarea
                  label="Problem"
                  value={form.problem || ''}
                  onChange={(v) => setField('problem', v)}
                  rows={4}
                />
                <FormTextarea
                  label="Solution"
                  value={form.solution || ''}
                  onChange={(v) => setField('solution', v)}
                  rows={4}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Stats">
                {(form.stats || []).map((s, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <FormInput
                      label="Label"
                      value={s.label}
                      onChange={(v) => {
                        const arr = [...(form.stats || [])];
                        arr[i] = { ...arr[i], label: v };
                        setField('stats', arr);
                      }}
                    />
                    <FormInput
                      label="Value"
                      value={s.value}
                      onChange={(v) => {
                        const arr = [...(form.stats || [])];
                        arr[i] = { ...arr[i], value: v };
                        setField('stats', arr);
                      }}
                    />
                    <button
                      type="button"
                      className="buttonstyles px-3 py-2 mb-1 shrink-0"
                      onClick={() => {
                        const arr = (form.stats || []).filter((_, j) => j !== i);
                        setField('stats', arr);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="buttonstyles px-3 py-2 text-sm flex items-center gap-1"
                  onClick={() => setField('stats', [...(form.stats || []), { label: '', value: '' }])}
                >
                  <Plus size={14} /> Add Stat
                </button>
              </CollapsibleSection>

              <CollapsibleSection title="Features">
                {(form.features || []).map((f, i) => (
                  <div key={i} className="border border-neutral-700 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400">Feature {i + 1}</span>
                      <button
                        type="button"
                        className="buttonstyles px-2 py-1"
                        onClick={() => {
                          setField('features', (form.features || []).filter((_, j) => j !== i));
                          setFeatureScreenshots((m) => { const nm = new Map(m); nm.delete(i); return nm; });
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <FormInput
                          label="Icon name (Lucide)"
                          value={f.icon}
                          onChange={(v) => {
                            const arr = [...(form.features || [])];
                            arr[i] = { ...arr[i], icon: v };
                            setField('features', arr);
                          }}
                          placeholder="ShoppingBag"
                        />
                        {f.icon && (
                          <div className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                            Preview: <SafeIcon name={f.icon} size={16} className="text-[#225e4d]" />
                          </div>
                        )}
                      </div>
                      <FormInput
                        label="Title"
                        value={f.title}
                        onChange={(v) => {
                          const arr = [...(form.features || [])];
                          arr[i] = { ...arr[i], title: v };
                          setField('features', arr);
                        }}
                      />
                    </div>
                    <FormTextarea
                      label="Description"
                      value={f.description}
                      onChange={(v) => {
                        const arr = [...(form.features || [])];
                        arr[i] = { ...arr[i], description: v };
                        setField('features', arr);
                      }}
                      rows={2}
                    />
                    <div>
                      <FieldLabel>Screenshot</FieldLabel>
                      {(featureScreenshots.get(i) || f.screenshot) && (
                        <img
                          src={featureScreenshots.get(i) ? URL.createObjectURL(featureScreenshots.get(i)!) : f.screenshot}
                          alt=""
                          className="w-full h-24 object-cover rounded mb-1"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="text-sm text-neutral-300"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (file) setFeatureScreenshots((m) => { const nm = new Map(m); nm.set(i, file); return nm; });
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="buttonstyles px-3 py-2 text-sm flex items-center gap-1"
                  onClick={() =>
                    setField('features', [
                      ...(form.features || []),
                      { icon: '', title: '', description: '', screenshot: '' },
                    ])
                  }
                >
                  <Plus size={14} /> Add Feature
                </button>
              </CollapsibleSection>

              <CollapsibleSection title="How It Works">
                {(form.how_it_works || []).map((h, i) => (
                  <div key={i} className="border border-neutral-700 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400">Step {i + 1}</span>
                      <button
                        type="button"
                        className="buttonstyles px-2 py-1"
                        onClick={() => setField('how_it_works', (form.how_it_works || []).filter((_, j) => j !== i))}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormInput
                        label="Step Number"
                        value={String(h.step || i + 1)}
                        onChange={(v) => {
                          const arr = [...(form.how_it_works || [])];
                          arr[i] = { ...arr[i], step: parseInt(v) || i + 1 };
                          setField('how_it_works', arr);
                        }}
                        type="number"
                      />
                      <div>
                        <FormInput
                          label="Icon name (Lucide)"
                          value={h.icon}
                          onChange={(v) => {
                            const arr = [...(form.how_it_works || [])];
                            arr[i] = { ...arr[i], icon: v };
                            setField('how_it_works', arr);
                          }}
                          placeholder="Zap"
                        />
                        {h.icon && (
                          <div className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                            Preview: <SafeIcon name={h.icon} size={16} className="text-[#225e4d]" />
                          </div>
                        )}
                      </div>
                    </div>
                    <FormInput
                      label="Title"
                      value={h.title}
                      onChange={(v) => {
                        const arr = [...(form.how_it_works || [])];
                        arr[i] = { ...arr[i], title: v };
                        setField('how_it_works', arr);
                      }}
                    />
                    <FormTextarea
                      label="Description"
                      value={h.description}
                      onChange={(v) => {
                        const arr = [...(form.how_it_works || [])];
                        arr[i] = { ...arr[i], description: v };
                        setField('how_it_works', arr);
                      }}
                      rows={2}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="buttonstyles px-3 py-2 text-sm flex items-center gap-1"
                  onClick={() =>
                    setField('how_it_works', [
                      ...(form.how_it_works || []),
                      { step: (form.how_it_works?.length || 0) + 1, title: '', description: '', icon: '' },
                    ])
                  }
                >
                  <Plus size={14} /> Add Step
                </button>
              </CollapsibleSection>

              <CollapsibleSection title="Use Cases">
                {(form.use_cases || []).map((u, i) => (
                  <div key={i} className="border border-neutral-700 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400">Use Case {i + 1}</span>
                      <button
                        type="button"
                        className="buttonstyles px-2 py-1"
                        onClick={() => {
                          setField('use_cases', (form.use_cases || []).filter((_, j) => j !== i));
                          setUseCaseThumbnails((m) => { const nm = new Map(m); nm.delete(i); return nm; });
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <FormInput
                      label="Industry"
                      value={u.industry}
                      onChange={(v) => {
                        const arr = [...(form.use_cases || [])];
                        arr[i] = { ...arr[i], industry: v };
                        setField('use_cases', arr);
                      }}
                    />
                    <FormTextarea
                      label="Scenario"
                      value={u.scenario}
                      onChange={(v) => {
                        const arr = [...(form.use_cases || [])];
                        arr[i] = { ...arr[i], scenario: v };
                        setField('use_cases', arr);
                      }}
                      rows={2}
                    />
                    <div>
                      <FieldLabel>Thumbnail</FieldLabel>
                      {(useCaseThumbnails.get(i) || u.thumbnail) && (
                        <img
                          src={useCaseThumbnails.get(i) ? URL.createObjectURL(useCaseThumbnails.get(i)!) : u.thumbnail}
                          alt=""
                          className="w-full h-24 object-cover rounded mb-1"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="text-sm text-neutral-300"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (file) setUseCaseThumbnails((m) => { const nm = new Map(m); nm.set(i, file); return nm; });
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="buttonstyles px-3 py-2 text-sm flex items-center gap-1"
                  onClick={() =>
                    setField('use_cases', [
                      ...(form.use_cases || []),
                      { industry: '', scenario: '', thumbnail: '' },
                    ])
                  }
                >
                  <Plus size={14} /> Add Use Case
                </button>
              </CollapsibleSection>

              <CollapsibleSection title="Integrations">
                {(form.integrations || []).map((int, i) => (
                  <div key={i} className="flex gap-2 items-end border border-neutral-700 rounded-lg p-3">
                    <div className="flex-1 space-y-2">
                      <FormInput
                        label="Name"
                        value={int.name}
                        onChange={(v) => {
                          const arr = [...(form.integrations || [])];
                          arr[i] = { ...arr[i], name: v };
                          setField('integrations', arr);
                        }}
                      />
                      <div>
                        <FieldLabel>Logo</FieldLabel>
                        {(integrationLogos.get(i) || int.logo) && (
                          <img
                            src={integrationLogos.get(i) ? URL.createObjectURL(integrationLogos.get(i)!) : int.logo}
                            alt=""
                            className="w-10 h-10 object-contain rounded mb-1"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="text-sm text-neutral-300"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (file) setIntegrationLogos((m) => { const nm = new Map(m); nm.set(i, file); return nm; });
                          }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="buttonstyles px-2 py-2 mb-1 shrink-0"
                      onClick={() => {
                        setField('integrations', (form.integrations || []).filter((_, j) => j !== i));
                        setIntegrationLogos((m) => { const nm = new Map(m); nm.delete(i); return nm; });
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="buttonstyles px-3 py-2 text-sm flex items-center gap-1"
                  onClick={() =>
                    setField('integrations', [...(form.integrations || []), { name: '', logo: '' }])
                  }
                >
                  <Plus size={14} /> Add Integration
                </button>
              </CollapsibleSection>

              <CollapsibleSection title="Testimonials">
                {(form.testimonials || []).map((t, i) => (
                  <div key={i} className="border border-neutral-700 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400">Testimonial {i + 1}</span>
                      <button
                        type="button"
                        className="buttonstyles px-2 py-1"
                        onClick={() => setField('testimonials', (form.testimonials || []).filter((_, j) => j !== i))}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <FormTextarea
                      label="Quote"
                      value={t.quote}
                      onChange={(v) => {
                        const arr = [...(form.testimonials || [])];
                        arr[i] = { ...arr[i], quote: v };
                        setField('testimonials', arr);
                      }}
                      rows={2}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <FormInput
                        label="Author"
                        value={t.author}
                        onChange={(v) => {
                          const arr = [...(form.testimonials || [])];
                          arr[i] = { ...arr[i], author: v };
                          setField('testimonials', arr);
                        }}
                      />
                      <FormInput
                        label="Company"
                        value={t.company}
                        onChange={(v) => {
                          const arr = [...(form.testimonials || [])];
                          arr[i] = { ...arr[i], company: v };
                          setField('testimonials', arr);
                        }}
                      />
                      <FormInput
                        label="Result"
                        value={t.result}
                        onChange={(v) => {
                          const arr = [...(form.testimonials || [])];
                          arr[i] = { ...arr[i], result: v };
                          setField('testimonials', arr);
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="buttonstyles px-3 py-2 text-sm flex items-center gap-1"
                  onClick={() =>
                    setField('testimonials', [
                      ...(form.testimonials || []),
                      { quote: '', author: '', company: '', result: '' },
                    ])
                  }
                >
                  <Plus size={14} /> Add Testimonial
                </button>
              </CollapsibleSection>

              <CollapsibleSection title="SEO">
                <FormInput
                  label="SEO Meta Title"
                  value={form.seo_meta_title || ''}
                  onChange={(v) => setField('seo_meta_title', v)}
                />
                <FormTextarea
                  label="SEO Meta Description"
                  value={form.seo_meta_description || ''}
                  onChange={(v) => setField('seo_meta_description', v)}
                  rows={2}
                />
                <FormInput
                  label="OG Image URL"
                  value={form.seo_og_image || ''}
                  onChange={(v) => setField('seo_og_image', v)}
                />
              </CollapsibleSection>

              {uploadProgress > 0 && (
                <div className="w-full bg-neutral-200 h-2 rounded overflow-hidden">
                  <div
                    className="h-full bg-[#225e4d] rounded transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-[#eaeaea]">
                <button
                  type="button"
                  className="px-4 py-2 border border-[#eaeaea] text-[#454648] rounded-lg hover:bg-[#f6f6f6] transition-colors text-sm font-medium"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={submitForm}
                  className="px-6 py-2 buttonstyles text-sm font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
