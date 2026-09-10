import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Template, DomainType } from '../types';
import { store, subscribeToStore } from '../services/store';
import { BrandLockup } from '../components/BrandLockup';
import {
  ArrowLeft,
  Plus,
  Search,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2,
  Eye,
  X,
} from 'lucide-react';

export const TemplateGalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>(() => store.getTemplates());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setTemplates(store.getTemplates());
    });
    return () => unsub();
  }, []);

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'food_delivery', label: 'Food Delivery' },
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'saas', label: 'SaaS' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'education', label: 'Education' },
  ];

  const filtered = templates.filter((t) => {
    const templateCategory = t.category.toLowerCase().replace(/[-\s]/g, '_');
    const matchesCat =
      selectedCategory === 'all' ||
      t.domain === selectedCategory ||
      templateCategory === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUseTemplate = (template: Template) => {
    const newProj = store.createProject(
      template.name,
      template.description,
      (template.domain || template.category) as DomainType,
      ['desktop', 'mobile'],
      `Instantiated from template: ${template.name}`,
      {
        pages: ['Home', 'Explore', 'Overview'],
        components: template.elements.map((e) => e.type),
        constraints: ['Adaptive layout'],
        style_hints: ['modern', 'responsive'],
        domain: (template.domain || template.category) as DomainType,
        primary_color: '#2563EB',
        design_rationale: `Derived from ${template.name} reference standard.`,
        isAiGenerated: false,
        source: 'template-gallery',
      },
      template.elements
    );
    navigate(`/projects/${newProj.id}/editor`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.09),transparent_18%),linear-gradient(180deg,#f8fafc_0%,#f4f4f5_100%)] text-zinc-900 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-sm">
                <Layers className="w-4 h-4" />
              </div>
              <BrandLockup compact />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-semibold text-zinc-500 lg:inline">Msoft Technologies</span>
            <button
            type="button"
            onClick={() => navigate('/projects/new')}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Sparkles className="w-4 h-4" />
            <span>Custom AI Wireframe</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
        <section className="overflow-hidden rounded-[28px] border border-zinc-200 bg-gradient-to-br from-slate-900 via-zinc-900 to-blue-950 p-6 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.8)] md:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Launch faster
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                Build polished product flows from ready-made patterns.
              </h2>
              <p className="mt-4 max-w-xl text-sm text-slate-300 md:text-base">
                Choose from conversion-focused starter templates, tune the content with AI, and move directly into editing with a designer-first canvas.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[320px]">
              {[
                { label: 'Templates', value: '48+' },
                { label: 'Industries', value: '12' },
                { label: 'Avg. launch', value: '2x faster' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-zinc-900">Explore industry wireframe kits</h3>
              <p className="mt-1 text-sm text-zinc-500">Pick a starting point and take it straight into the editor.</p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-9 pr-3 text-xs text-zinc-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tmpl) => (
            <article
              key={tmpl.id}
              onClick={() => handleUseTemplate(tmpl)}
              className="group flex cursor-pointer flex-col justify-between rounded-[24px] border border-zinc-200 bg-white p-5 shadow-[0_18px_35px_-25px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_45px_-24px_rgba(37,99,235,0.45)]"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700">
                    {tmpl.category}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">{tmpl.elementCount} elements</span>
                </div>

                <div className={`mb-3 h-28 rounded-2xl p-3 ${tmpl.domain === 'ecommerce' ? 'bg-gradient-to-br from-amber-50 via-white to-rose-50' : tmpl.domain === 'dashboard' ? 'bg-gradient-to-br from-slate-100 via-white to-emerald-50' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
                  <div className="flex h-full flex-col gap-2 rounded-xl border border-zinc-200 bg-white/90 p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[9px] font-black tracking-tight text-zinc-700">{tmpl.domain === 'ecommerce' ? 'ShopMart' : tmpl.domain === 'dashboard' ? 'Analytics Dashboard' : tmpl.domain === 'food_delivery' ? 'CraveBite' : tmpl.domain === 'healthcare' ? 'CarePath' : tmpl.domain === 'education' ? 'LearnLoop' : 'ProductOS'}</div>
                      <div className="flex gap-1"><div className="h-2 w-2 rounded-full bg-blue-200" /><div className="h-2 w-2 rounded-full bg-zinc-200" /></div>
                    </div>
                    {tmpl.domain === 'dashboard' ? (
                      <div className="grid flex-1 grid-cols-[0.6fr_1.4fr] gap-2"><div className="rounded bg-emerald-100" /><div className="space-y-1.5"><div className="h-5 rounded bg-emerald-50" /><div className="grid grid-cols-2 gap-1"><div className="h-5 rounded bg-zinc-100" /><div className="h-5 rounded bg-zinc-100" /></div></div></div>
                    ) : tmpl.domain === 'ecommerce' ? (
                      <div className="grid flex-1 grid-cols-3 gap-2"><div className="col-span-2 rounded bg-rose-100" /><div className="rounded bg-amber-100" /><div className="h-4 rounded bg-zinc-100" /><div className="h-4 rounded bg-zinc-100" /><div className="h-4 rounded bg-zinc-100" /></div>
                    ) : (
                      <div className="flex flex-1 items-end justify-between gap-2"><div className="w-2/3 space-y-1.5"><div className="h-3 w-full rounded bg-blue-100" /><div className="h-2 w-4/5 rounded bg-zinc-200" /><div className="h-4 w-1/3 rounded bg-blue-500/70" /></div><div className="h-full w-1/3 rounded-lg bg-indigo-100" /></div>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-extrabold tracking-tight text-zinc-900 group-hover:text-blue-600">
                  {tmpl.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">{tmpl.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tmpl.elements.slice(0, 4).map((el, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[10px] capitalize text-zinc-600"
                    >
                      {el.type}
                    </span>
                  ))}
                  {tmpl.elements.length > 4 && (
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                      +{tmpl.elements.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(tmpl);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 transition hover:text-zinc-900"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(tmpl);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 transition hover:text-blue-700"
                >
                  <span>Use Template</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white/70 px-6 py-12 text-center">
            <p className="text-lg font-bold text-zinc-900">No templates match your search.</p>
            <p className="mt-1 text-sm text-zinc-500">Try another keyword or switch category.</p>
          </div>
        )}

        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-[24px] border border-zinc-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700">
                    {previewTemplate.category}
                  </span>
                  <h3 className="mt-2 text-xl font-extrabold text-zinc-900">{previewTemplate.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-zinc-600">{previewTemplate.description}</p>

              <div className="mt-5">
                <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Included Components ({previewTemplate.elements.length})
                </h4>
                <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                  {previewTemplate.elements.map((el, i) => (
                    <div
                      key={el.id || i}
                      className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-200 text-[10px] font-bold text-zinc-700">
                          {i + 1}
                        </span>
                        <span className="font-semibold capitalize text-zinc-800">{el.type.replace('_', ' ')}</span>
                      </div>
                      <span className="text-zinc-400">Wireframe</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="rounded-xl px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tmpl = previewTemplate;
                    setPreviewTemplate(null);
                    handleUseTemplate(tmpl);
                  }}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
