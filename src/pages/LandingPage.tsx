import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
  Layout,
  Download,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Monitor,
  Tablet,
  FileCode,
  ShieldCheck,
  Zap,
  Sliders,
  Users,
  Copy,
} from 'lucide-react';
import { SAMPLE_DEMO_PROJECT_ID } from '../data/sampleDemoProject';
import { BrandLockup } from '../components/BrandLockup';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_18%),linear-gradient(180deg,#f8fafc_0%,#f4f4f5_100%)] text-zinc-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <BrandLockup />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#how-it-works" className="hover:text-zinc-900 transition">How it Works</a>
            <a href="#features" className="hover:text-zinc-900 transition">Features</a>
            <a href="#templates" className="hover:text-zinc-900 transition">Templates</a>
            <Link to="/templates" className="hover:text-zinc-900 transition">Library</Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-semibold text-zinc-500 lg:inline">Msoft Technologies</span>
            <Link
              to="/login"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-100 transition"
            >
              Sign In
            </Link>
            <Link
              to="/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition hover:shadow-lg"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-zinc-200/80 bg-[linear-gradient(180deg,rgba(239,246,255,0.8)_0%,rgba(255,255,255,0.62)_38%,rgba(255,255,255,0)_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Next-Gen Gemini AI Wireframe Synthesis</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 max-w-4xl mx-auto leading-[1.1]">
            Turn Ideas Into Wireframes <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              With Natural Language
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Describe your website or application in plain language and generate structured wireframes, multi-page layouts, components, and design concepts in seconds.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/projects/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-semibold shadow-lg shadow-blue-600/20 transition hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Designing Free</span>
            </Link>

            <Link
              to={`/projects/${SAMPLE_DEMO_PROJECT_ID}/editor`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 text-base font-semibold border border-zinc-300 shadow-sm transition"
            >
              <Layout className="w-5 h-5 text-zinc-500" />
              <span>Explore Interactive Demo</span>
            </Link>
          </div>

          {/* Prompt Preview Snippet */}
          <div className="mt-12 max-w-3xl mx-auto bg-zinc-900 text-white rounded-2xl shadow-[0_30px_80px_-30px_rgba(15,23,42,0.95)] p-4 sm:p-6 border border-zinc-800 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="ml-2">prompt-synthesis-stream</span>
              </div>
              <span className="text-emerald-400">Gemini 3.8 Flash • Deterministic Fallback Ready</span>
            </div>

            <p className="mt-3 text-sm text-zinc-300 font-mono leading-relaxed">
              <span className="text-blue-400">Prompt:</span> "Build a modern food delivery platform with a location search bar, popular restaurant carousel, meal categories, promotional coupons banner, reviews, and multi-page order tracking."
            </p>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 font-mono">4 Pages Identified</span>
              <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 font-mono">8 UI Sections</span>
              <span className="px-2.5 py-1 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50 font-mono">
                Wireframe Model JSON Generated
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white/70 backdrop-blur-sm border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {['Figma-like canvas', 'AI generation', 'Responsive previews', 'Commenting', 'Version history', 'Exports'].map((label) => (
              <div key={label} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Workflow / How It Works */}
      <section id="how-it-works" className="py-20 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Step-by-Step Architecture
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
              From Raw Requirement to Interactive Wireframe
            </h3>
            <p className="mt-3 text-base text-zinc-600">
              Our four-stage pipeline extracts intent, structures page hierarchies, and renders responsive canvas components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Natural Language Prompt',
                desc: 'Describe what you want in everyday language. Mention features, target users, or key pages.',
                icon: Sparkles,
                color: 'text-blue-600 bg-blue-50',
              },
              {
                step: '02',
                title: 'AI Analysis & Domain',
                desc: 'Gemini decomposes requirements into domain models, required pages, components, and constraints.',
                icon: Cpu,
                color: 'text-purple-600 bg-purple-50',
              },
              {
                step: '03',
                title: 'Multi-Page Synthesis',
                desc: 'Generate individual wireframe layouts for each page—home, catalog, details, checkout, and dashboard.',
                icon: Layers,
                color: 'text-emerald-600 bg-emerald-50',
              },
              {
                step: '04',
                title: 'Visual Polish & Export',
                desc: 'Edit with drag-and-drop, switch between wireframe & realistic modes, and export to HTML, JSON, or PDF.',
                icon: Download,
                color: 'text-amber-600 bg-amber-50',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:shadow-md transition relative group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-zinc-200 group-hover:text-blue-500/30 transition">
                    {item.step}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-zinc-900 mb-2">{item.title}</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section id="features" className="py-20 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4">
                <Sliders className="w-3.5 h-3.5" />
                <span>True Dual-Mode Rendering</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                Switch Instantly Between Wireframe & Realistic Preview
              </h3>
              <p className="mt-4 text-base text-zinc-600 leading-relaxed">
                Test low-fidelity structural alignment for UX validation, then switch to high-fidelity realistic preview with real typography, imagery, and brand color presets in one click.
              </p>

              <div className="mt-6 space-y-3.5">
                {[
                  'Device preview toggles: Desktop (1200px), Tablet (768px), and Mobile (375px)',
                  'Independent multi-page support with page selector tabs',
                  'Inline property editor: modify titles, buttons, badges, and layout heights',
                  'AI section regeneration: ask AI to redesign or adjust specific sections',
                  'Complete version history with diffs and one-click rollback',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-zinc-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/projects/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold transition"
                >
                  <span>Build Your First Wireframe</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Preview Showcase Mockup */}
            <div className="bg-zinc-100 p-4 sm:p-8 rounded-3xl border border-zinc-200 shadow-inner">
              <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden">
                <div className="bg-zinc-800 text-zinc-300 px-4 py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="ml-2 font-mono text-[11px] text-zinc-400">cravebite-wireframe.wf</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-medium text-[10px]">Wireframe Mode</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-700 text-zinc-300 text-[10px]">Desktop</span>
                  </div>
                </div>

                {/* Wireframe Mockup Lines */}
                <div className="p-6 space-y-4 font-mono">
                  <div className="h-10 border-2 border-dashed border-zinc-300 rounded-lg flex items-center justify-between px-4 text-xs text-zinc-400">
                    <span>[Logo] Brand</span>
                    <div className="flex gap-3">
                      <span>[Home]</span>
                      <span>[Restaurants]</span>
                      <span>[Menu]</span>
                    </div>
                    <span className="px-2 py-1 bg-zinc-200 rounded text-[10px] text-zinc-600">[Cart (2)]</span>
                  </div>

                  <div className="h-28 border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-lg flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-xs font-bold text-blue-900">[Hero Section with Location Search]</span>
                    <span className="text-[11px] text-zinc-500 mt-1">"Order from over 500+ local kitchens"</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-24 border border-zinc-300 rounded p-2 text-[10px] text-zinc-500">
                      <div className="h-10 bg-zinc-200 rounded mb-2"></div>
                      <span>[Pizza & Italian]</span>
                    </div>
                    <div className="h-24 border border-zinc-300 rounded p-2 text-[10px] text-zinc-500">
                      <div className="h-10 bg-zinc-200 rounded mb-2"></div>
                      <span>[Burgers & Bowls]</span>
                    </div>
                    <div className="h-24 border border-zinc-300 rounded p-2 text-[10px] text-zinc-500">
                      <div className="h-10 bg-zinc-200 rounded mb-2"></div>
                      <span>[Vegan & Salads]</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Templates Section */}
      <section id="templates" className="py-20 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
                Curated Domain Blueprints
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-zinc-900">
                Start From Production-Ready Templates
              </h3>
            </div>
            <Link
              to="/templates"
              className="mt-4 md:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1.5"
            >
              <span>Explore All Templates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Food Delivery Platform',
                domain: 'Food & Dining',
                description: 'Complete multi-page app layout with search, restaurant listings, meals, and real-time order tracking.',
                pages: ['Home', 'Restaurants', 'Menu', 'Order Tracking'],
                color: 'border-orange-200 bg-orange-50/30',
              },
              {
                title: 'E-Commerce Living Store',
                domain: 'E-Commerce',
                description: 'High-converting retail experience with product filters, item gallery, bag slide-over, and 1-click checkout.',
                pages: ['Home', 'Products', 'Product Details', 'Cart', 'Checkout'],
                color: 'border-blue-200 bg-blue-50/30',
              },
              {
                title: 'SaaS Metric Pulse',
                domain: 'SaaS & Analytics',
                description: 'Modern B2B marketing site and analytical app featuring KPI cards, interactive charts, and billing tiers.',
                pages: ['Overview', 'Analytics', 'Settings', 'Pricing'],
                color: 'border-indigo-200 bg-indigo-50/30',
              },
            ].map((tmpl, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700">
                    {tmpl.domain}
                  </span>
                  <h4 className="text-lg font-bold text-zinc-900 mt-3">{tmpl.title}</h4>
                  <p className="text-sm text-zinc-600 mt-2">{tmpl.description}</p>

                  <div className="mt-4 pt-4 border-t border-zinc-100">
                    <span className="text-xs font-semibold text-zinc-500 block mb-2">Included Pages:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tmpl.pages.map((p, pIdx) => (
                        <span key={pIdx} className="text-[11px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <Link
                    to="/projects/new"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition"
                  >
                    <span>Use Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-zinc-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to Accelerate Your Design Workflow?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-xl mx-auto">
            Generate your first wireframe concept in seconds. No credit card required. Free tier includes unlimited local projects.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-base border border-zinc-700 transition"
            >
              <span>Open Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              W
            </div>
            <span className="font-semibold text-zinc-900">Automated Web Design Assistant</span>
            <span>•</span>
            <span>© 2026 All rights reserved</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/templates" className="hover:text-zinc-900 transition">Templates</Link>
            <Link to="/analytics" className="hover:text-zinc-900 transition">Analytics</Link>
            <Link to="/settings" className="hover:text-zinc-900 transition">Settings</Link>
            <Link to="/admin" className="hover:text-zinc-900 transition">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
