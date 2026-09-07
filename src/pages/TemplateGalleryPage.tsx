import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Template, DomainType } from '../types';
import { store, subscribeToStore } from '../services/store';
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
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
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
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-zinc-200 bg-white px-6 md:px-10 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-zinc-900">
                Template Gallery
              </h1>
              <p className="text-[10px] text-zinc-400">Curated design systems & wireframe blueprints</p>
            </div>
          </div>
        </div>

        <button
          type="button"
            onClick={() => navigate('/projects/new')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Custom AI Wireframe</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Intro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
              Explore Industry Wireframe Kits
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Select a pre-architected concept to inspect, edit, or customize with AI.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden shadow-2xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleUseTemplate(tmpl)}
              className="bg-white border border-zinc-200 hover:border-blue-500 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {tmpl.category}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {tmpl.elementCount} elements
                  </span>
                </div>

                <h3 className="font-extrabold text-zinc-900 text-base group-hover:text-blue-600 transition-colors">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{tmpl.description}</p>

                {/* Simulated component stack chips */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {tmpl.elements.slice(0, 4).map((el, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md text-[10px] font-mono capitalize"
                    >
                      {el.type}
                    </span>
                  ))}
                  {tmpl.elements.length > 4 && (
                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-400 rounded-md text-[10px] font-mono">
                      +{tmpl.elements.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-zinc-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(tmpl);
                  }}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(tmpl);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>Use Template</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Template Preview Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {previewTemplate.category}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 mt-1">{previewTemplate.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">{previewTemplate.description}</p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2.5">
                  Included Components ({previewTemplate.elements.length})
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {previewTemplate.elements.map((el, i) => (
                    <div
                      key={el.id || i}
                      className="p-2.5 rounded-xl border border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-[10px]">
                          {i + 1}
                        </span>
                        <span className="font-semibold text-zinc-800 capitalize">{el.type.replace('_', ' ')}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">h: {el.height}px</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl"
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
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Project from Template</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
