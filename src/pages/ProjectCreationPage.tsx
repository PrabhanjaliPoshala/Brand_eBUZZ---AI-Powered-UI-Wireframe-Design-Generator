import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DomainType, DeviceType, BrandPreset } from '../types';
import { parseRequirementWithAI, generateWireframeFromAnalysis } from '../services/aiService';
import { store } from '../services/store';
import {
  Sparkles,
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  Wand2,
  Layers,
  FileCode2,
  Zap,
  ArrowLeft,
} from 'lucide-react';

const DOMAIN_OPTIONS: { id: DomainType; label: string; description: string }[] = [
  { id: 'food_delivery', label: 'Food Delivery', description: 'Restaurant listings, menus, carts & trackers' },
  { id: 'ecommerce', label: 'E-Commerce', description: 'Product catalogs, filters, pricing & checkout' },
  { id: 'saas', label: 'SaaS Platform', description: 'Hero CTAs, feature matrices, pricing & docs' },
  { id: 'dashboard', label: 'Analytics Dashboard', description: 'KPI cards, charts, metrics & data tables' },
  { id: 'portfolio', label: 'Portfolio & Agency', description: 'Case studies, services, team & inquiry forms' },
  { id: 'healthcare', label: 'Healthcare & Clinic', description: 'Doctor appointments, services & patient portal' },
  { id: 'education', label: 'Education & LMS', description: 'Course catalogues, lessons & instructor bios' },
  { id: 'general', label: 'General Web Application', description: 'Flexible modern web layout & modules' },
];

const EXAMPLE_PROMPTS = [
  {
    title: 'Food Delivery Platform',
    domain: 'food_delivery' as DomainType,
    prompt:
      'Build a modern food delivery website with location-based restaurant search, category chips (Pizza, Burgers, Vegan), promotional offers banner (40% OFF), restaurant rating cards with delivery time badges, and a checkout section.',
  },
  {
    title: 'E-Commerce Living Catalog',
    domain: 'ecommerce' as DomainType,
    prompt:
      'Create an artisan lifestyle e-commerce store with sticky navbar, high-impact hero showcase, product catalog grid with pricing and star reviews, category filters, and customer testimonials.',
  },
  {
    title: 'Enterprise SaaS Engine',
    domain: 'saas' as DomainType,
    prompt:
      'Design a modern SaaS landing page with dark theme hints, compelling hero title, 3-column feature highlights, transparent tiered pricing table, and trusted customer praise.',
  },
  {
    title: 'Executive Analytics Dashboard',
    domain: 'dashboard' as DomainType,
    prompt:
      'Create an executive metrics dashboard with sidebar navigation, 4 KPI statistics cards, weekly growth chart widget, and recent activity data table.',
  },
];

export const ProjectCreationPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState<DomainType>('food_delivery');
  const [devices, setDevices] = useState<DeviceType[]>(['desktop', 'mobile']);
  const [requirement, setRequirement] = useState('');

  // Generation loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const steps = [
    'Parsing natural language requirement with Gemini...',
    'Identifying pages, components & layout constraints...',
    'Synthesizing responsive component tree & design tokens...',
    'Constructing interactive wireframe canvas...',
  ];

  const handleDeviceToggle = (dev: DeviceType) => {
    if (devices.includes(dev)) {
      if (devices.length > 1) {
        setDevices(devices.filter((d) => d !== dev));
      }
    } else {
      setDevices([...devices, dev]);
    }
  };

  const handleSelectExample = (ex: typeof EXAMPLE_PROMPTS[0]) => {
    setName(ex.title);
    setDomain(ex.domain);
    setRequirement(ex.prompt);
    setDescription(`AI-generated design concept for ${ex.title}`);
  };

  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !requirement.trim()) return;

    setIsGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      // 1. AI Requirement Understanding
      const analysis = await parseRequirementWithAI(requirement, domain);

      // 2. Synthesize Wireframe Elements
      const elements = generateWireframeFromAnalysis(analysis, devices[0] || 'desktop');

      // 3. Brand Preset
      const brandPreset: BrandPreset = {
        brandName: name,
        primaryColor: analysis.primary_color || '#2563EB',
        secondaryColor: '#64748B',
        fontFamily: 'Plus Jakarta Sans',
        borderRadius: 8,
        buttonStyle: 'rounded',
        spacingStyle: 'normal',
      };

      // 4. Save to Store
      clearInterval(stepInterval);
      setGenerationStep(steps.length - 1);

      const project = store.createProject(
        name.trim(),
        description.trim() || `${name} wireframe concept`,
        domain,
        devices,
        requirement.trim(),
        analysis,
        elements,
        brandPreset
      );

      setTimeout(() => {
        setIsGenerating(false);
        navigate(`/projects/${project.id}/analysis`);
      }, 500);
    } catch (err) {
      console.error('Error in generation pipeline:', err);
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col">
      {/* Top Navbar */}
      <header className="h-14 border-b border-zinc-200 bg-white px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              AI
            </div>
            <span className="font-extrabold text-sm tracking-tight text-zinc-900">
              New Project Generator
            </span>
          </div>
        </div>
        <div className="text-xs text-zinc-400 font-medium">
          Step 1: Requirement Specification
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-3 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Autonomous Design Synthesis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Create a New Wireframe Project
          </h1>
          <p className="text-zinc-600 text-sm mt-1.5 leading-relaxed">
            Describe what you need in plain English. Our AI architecture will automatically identify pages, section hierarchies, responsive components, and synthesize a working wireframe.
          </p>
        </div>

        {/* Quick Example Presets */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-3">
            <Wand2 className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Or Choose an Example Requirement
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EXAMPLE_PROMPTS.map((ex, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectExample(ex)}
                className="p-3.5 bg-white border border-zinc-200 hover:border-blue-500 rounded-xl cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                    {ex.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-zinc-100 text-zinc-600">
                    {ex.domain}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {ex.prompt}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleStartGeneration} className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Project Name & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Project Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Food Delivery Platform"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Description / Purpose (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Customer ordering experience with fast cart"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Domain Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Industry Domain *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DOMAIN_OPTIONS.map((item) => {
                const isSelected = domain === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setDomain(item.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20 shadow-2xs font-bold'
                        : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/40 text-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-zinc-400 font-normal mt-0.5 line-clamp-1">
                      {item.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Target Devices */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Target Devices
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'desktop' as DeviceType, label: 'Desktop (1200px)', icon: Monitor },
                { id: 'tablet' as DeviceType, label: 'Tablet (768px)', icon: Tablet },
                { id: 'mobile' as DeviceType, label: 'Mobile (375px)', icon: Smartphone },
              ].map((d) => {
                const isSelected = devices.includes(d.id);
                const Icon = d.icon;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleDeviceToggle(d.id)}
                    className={`p-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600 shadow-2xs'
                        : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Natural Language Requirement */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Natural Language Requirement *
              </label>
              <span className="text-[11px] text-zinc-400">Describe features, sections, content & tone</span>
            </div>
            <textarea
              required
              rows={5}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="e.g., Create a modern food delivery web app with:
- Sticky navigation bar with location selector and order tracking link
- Hero section with search bar for restaurants and dishes
- Category icons carousel (Pizza, Sushi, Burgers, Healthy)
- Exclusive offers and deals banner with coupon codes
- Restaurant grid with ratings, cuisine tags, and delivery time badges
- Clean footer with mobile app download links and legal info"
              className="w-full p-4 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden text-zinc-900"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={isGenerating || !name.trim() || !requirement.trim()}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Wireframe & Concept</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </main>

      {/* Generation Progress Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border border-zinc-100">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-zinc-900 mb-2">
              Synthesizing Design Wireframe
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Translating natural language requirements into structured concepts
            </p>

            <div className="space-y-3 text-left bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs">
              {steps.map((stepText, idx) => {
                const isCurrent = idx === generationStep;
                const isDone = idx < generationStep;
                return (
                  <div key={idx} className="flex items-center space-x-2.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-zinc-300 shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        isCurrent
                          ? 'font-bold text-blue-700'
                          : isDone
                          ? 'text-zinc-800 font-medium'
                          : 'text-zinc-400'
                      }`}
                    >
                      {stepText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
