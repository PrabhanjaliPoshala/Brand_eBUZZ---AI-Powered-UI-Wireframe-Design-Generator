import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { store, subscribeToStore } from '../services/store';
import { Project, DomainType } from '../types';
import { generatePagesFromAnalysis, generateWireframeFromAnalysis } from '../services/aiService';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Layers,
  Cpu,
  Palette,
  CheckCircle2,
  Plus,
  Trash2,
  Sliders,
  ShieldCheck,
  Zap,
  Layout,
  RefreshCw,
} from 'lucide-react';

const DOMAIN_OPTIONS: { id: DomainType; label: string }[] = [
  { id: 'food_delivery', label: 'Food Delivery' },
  { id: 'ecommerce', label: 'E-Commerce' },
  { id: 'saas', label: 'SaaS Platform' },
  { id: 'dashboard', label: 'Analytics Dashboard' },
  { id: 'portfolio', label: 'Portfolio & Agency' },
  { id: 'healthcare', label: 'Healthcare & Clinic' },
  { id: 'education', label: 'Education & LMS' },
  { id: 'general', label: 'General Web Application' },
];

const SUGGESTED_COMPONENTS = [
  'navbar',
  'hero',
  'search',
  'categories',
  'restaurant_grid',
  'product_grid',
  'card',
  'form',
  'stats',
  'pricing',
  'testimonials',
  'footer',
];

const normalizeDomain = (value: string | undefined): DomainType => {
  const validDomains: DomainType[] = [
    'food_delivery',
    'ecommerce',
    'saas',
    'dashboard',
    'portfolio',
    'healthcare',
    'education',
    'finance',
    'general',
  ];

  return validDomains.includes(value as DomainType) ? (value as DomainType) : 'general';
};

export const ProjectAnalysisPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | undefined>(() =>
    projectId ? store.getProjectById(projectId) : undefined
  );

  // Editable analysis state
  const [pages, setPages] = useState<string[]>([]);
  const [newPageInput, setNewPageInput] = useState('');
  const [components, setComponents] = useState<string[]>([]);
  const [domain, setDomain] = useState<DomainType>('general');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [rationale, setRationale] = useState('');
  const [constraints, setConstraints] = useState<string[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      if (projectId) {
        const p = store.getProjectById(projectId);
        setProject(p);
      }
    });
    return () => unsub();
  }, [projectId]);

  useEffect(() => {
    if (project) {
      setPages(project.analysis.pages || ['Home']);
      setComponents(project.analysis.components || ['navbar', 'hero', 'footer']);
      setDomain(normalizeDomain(project.domain || project.analysis.domain));
      setPrimaryColor(project.analysis.primary_color || project.brandPreset?.primaryColor || '#2563EB');
      setRationale(project.analysis.design_rationale || '');
      setConstraints(project.analysis.constraints || ['Desktop & Mobile adaptive', 'High visual hierarchy']);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm max-w-md w-full">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Project Not Found</h2>
          <p className="text-sm text-zinc-600 mb-6">The requested wireframe project could not be located.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddPage = () => {
    if (!newPageInput.trim()) return;
    const trimmed = newPageInput.trim();
    if (!pages.includes(trimmed)) {
      setPages([...pages, trimmed]);
    }
    setNewPageInput('');
  };

  const handleRemovePage = (pName: string) => {
    if (pages.length <= 1) return;
    setPages(pages.filter((p) => p !== pName));
  };

  const handleToggleComponent = (comp: string) => {
    if (components.includes(comp)) {
      setComponents(components.filter((c) => c !== comp));
    } else {
      setComponents([...components, comp]);
    }
  };

  const handleSaveOnly = () => {
    const updatedAnalysis = {
      ...project.analysis,
      pages,
      components,
      domain,
      primary_color: primaryColor,
      design_rationale: rationale,
      constraints,
    };

    store.updateProject(project.id, {
      domain,
      analysis: updatedAnalysis,
      brandPreset: {
        ...project.brandPreset,
        primaryColor,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleGenerateAndOpen = () => {
    setIsRegenerating(true);

    const updatedAnalysis = {
      ...project.analysis,
      pages,
      components,
      domain,
      primary_color: primaryColor,
      design_rationale: rationale,
      constraints,
    };

    // Synthesize pages tailored to this updated analysis
    const newPages = generatePagesFromAnalysis(updatedAnalysis, project.devices[0] || 'desktop');
    newPages.forEach((p) => {
      p.projectId = project.id;
    });

    const primaryElements = newPages[0]?.elements || generateWireframeFromAnalysis(updatedAnalysis, project.devices[0] || 'desktop');

    store.updateProject(project.id, {
      domain,
      analysis: updatedAnalysis,
      pages: newPages,
      activePageName: newPages[0]?.name || 'Home',
      wireframe: {
        ...project.wireframe,
        elements: primaryElements,
        updatedAt: new Date().toISOString(),
      },
      brandPreset: {
        ...project.brandPreset,
        primaryColor,
      },
    });

    store.saveVersion(
      project.id,
      'AI Analysis Refinement',
      `Customized analysis: ${pages.length} pages, ${components.length} components.`,
      primaryElements
    );

    store.logAudit(
      store.getCurrentUser().email,
      'Analysis updated',
      project.name,
      'success',
      `Updated pages (${pages.join(', ')}) and rebuilt wireframe`
    );

    setTimeout(() => {
      setIsRegenerating(false);
      navigate(`/projects/${project.id}/editor`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-900">{project.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                AI Analysis Review
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono">ID: {project.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Analysis Saved
            </span>
          )}
          <button
            onClick={handleSaveOnly}
            className="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-700 text-xs font-semibold hover:bg-zinc-100 transition"
          >
            Save Changes
          </button>
          <button
            onClick={handleGenerateAndOpen}
            disabled={isRegenerating}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isRegenerating ? 'Generating Wireframe...' : 'Generate Wireframe & Open Canvas'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl w-full mx-auto p-6 md:p-10 flex-1 space-y-8">
        {/* Banner summary */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-medium mb-3 backdrop-blur-sm">
                <Cpu className="w-3.5 h-3.5 text-blue-200" />
                <span>Synthesis Engine: {project.analysis.source || 'gemini-3.8-flash'}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">AI Requirement Breakdown</h2>
              <p className="text-sm text-blue-100 mt-1 max-w-2xl leading-relaxed">
                Review and fine-tune the pages, components, and design system parameters before entering the visual canvas.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <Link
                to={`/projects/${project.id}/editor`}
                className="px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold transition shadow-sm"
              >
                Skip Directly to Editor
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Pages, Components, Rationale */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Pages Identified */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">1. Pages Identified</h3>
                    <p className="text-xs text-zinc-500">Each page will have its own independent wireframe layout.</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {pages.length} Pages
                </span>
              </div>

              {/* Page chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {pages.map((pName) => (
                  <div
                    key={pName}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-800"
                  >
                    <span>{pName}</span>
                    {pages.length > 1 && (
                      <button
                        onClick={() => handleRemovePage(pName)}
                        className="text-zinc-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add page input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPageInput}
                  onChange={(e) => setNewPageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPage()}
                  placeholder="Add another page (e.g. Reviews, Pricing, Profile)..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
                <button
                  type="button"
                  onClick={handleAddPage}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Page</span>
                </button>
              </div>
            </div>

            {/* 2. Components Identified */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">2. Components Identified</h3>
                    <p className="text-xs text-zinc-500">Select components to include across synthesized views.</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {components.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SUGGESTED_COMPONENTS.map((comp) => {
                  const isSelected = components.includes(comp);
                  return (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => handleToggleComponent(comp)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition text-left ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <span className="capitalize">{comp.replace('_', ' ')}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Design Rationale */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900">3. AI Design Rationale</h3>
                  <p className="text-xs text-zinc-500">Architectural justification for this layout structure.</p>
                </div>
              </div>

              <textarea
                rows={3}
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-zinc-300 text-xs text-zinc-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
            </div>
          </div>

          {/* Right Column (1 Col): Domain, Theme & Constraints */}
          <div className="space-y-6">
            {/* Domain & Style */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-600" />
                <span>Domain & Styling</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                    Domain Archetype
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as DomainType)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  >
                    {DOMAIN_OPTIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-zinc-300 cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 text-xs font-mono text-zinc-800"
                    />
                  </div>

                  {/* Preset swatches */}
                  <div className="flex items-center gap-2 mt-2.5">
                    {['#2563EB', '#EA580C', '#10B981', '#7C3AED', '#0D9488', '#E11D48', '#18181B'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setPrimaryColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          primaryColor.toLowerCase() === c.toLowerCase() ? 'border-zinc-900 scale-110' : 'border-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
                    Style Hints
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(project.analysis.style_hints || ['modern', 'clean', 'vibrant']).map((hint, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 capitalize">
                        {hint}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Constraints Card */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Layout Constraints</span>
              </h3>

              <ul className="space-y-2 text-xs text-zinc-600">
                {constraints.map((cons, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{cons}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Generate Action Card */}
            <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-md text-center">
              <Sparkles className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold">Ready to Edit?</h4>
              <p className="text-xs text-zinc-400 mt-1 mb-4 leading-relaxed">
                Applies your customized requirements and boots up the visual wireframe canvas.
              </p>
              <button
                onClick={handleGenerateAndOpen}
                disabled={isRegenerating}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>{isRegenerating ? 'Generating...' : 'Open Visual Canvas'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
