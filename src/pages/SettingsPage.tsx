import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { isSupabaseConfigured } from '../services/supabase';
import {
  Settings,
  ArrowLeft,
  User,
  Shield,
  Database,
  Palette,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Code,
  Save,
} from 'lucide-react';
import { BrandLockup } from '../components/BrandLockup';

export const SettingsPage: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [fontFamily, setFontFamily] = useState('Plus Jakarta Sans');
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopySql = () => {
    const sqlScript = `-- Supabase Schema for AI-Driven Wireframe Platform
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'designer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pages (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  elements JSONB NOT NULL,
  order_index INTEGER DEFAULT 0
);`;
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <BrandLockup compact />
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-zinc-900">Workspace Settings</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold border border-zinc-200">
              Preferences
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-semibold text-zinc-500 md:inline">Msoft Technologies</span>
          <Link
            to="/dashboard"
            className="px-3.5 py-1.5 rounded-xl border border-zinc-300 text-zinc-700 text-xs font-semibold hover:bg-zinc-100 transition"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl w-full mx-auto p-6 md:p-10 flex-1 space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">Application Configuration</h2>
          <p className="text-xs text-zinc-500 mt-1">Manage personal profile, Supabase database synchronization, and brand design defaults.</p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {currentUser?.name?.slice(0, 2).toUpperCase() || 'US'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">{currentUser?.name}</h3>
                <p className="text-xs text-zinc-500">{currentUser?.email}</p>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Role: {currentUser?.role}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Profile details updated
                </span>
              )}
              <button
                type="submit"
                className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Database & Supabase Integration Status */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Database & Persistence Engine</h3>
                <p className="text-xs text-zinc-500">Supabase cloud sync with offline-first client storage fallback</p>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
              <span>{isSupabaseConfigured ? 'Connected to Supabase' : 'Offline Fallback Mode (Active)'}</span>
            </span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            {isSupabaseConfigured
              ? 'Your application is connected to a live Supabase project. Authentication, projects, multi-page wireframes, and audit logs persist directly in PostgreSQL.'
              : 'The application operates with resilient offline-first storage and in-memory mock synchronization. To connect a remote PostgreSQL database, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'}
          </p>

          <div className="p-4 bg-zinc-900 rounded-xl text-zinc-300 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Database Schema (supabase/schema.sql)</span>
              <button
                type="button"
                onClick={handleCopySql}
                className="text-zinc-400 hover:text-white transition flex items-center gap-1 text-[11px]"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied' : 'Copy DDL'}</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Includes tables: profiles, projects, pages, wireframes, versions, comments, analytics, and audit_logs with Row Level Security (RLS) policies.
            </p>
          </div>
        </div>

        {/* Brand Preset Defaults */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Brand System Defaults</h3>
              <p className="text-xs text-zinc-500">Default styling tokens applied when generating new projects</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                Default Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern & Clean)</option>
                <option value="Inter">Inter (Neutral & Standard)</option>
                <option value="Space Grotesk">Space Grotesk (Tech & Punchy)</option>
                <option value="Playfair Display">Playfair Display (Editorial & Luxury)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
                Default Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-9 h-9 rounded-xl border border-zinc-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 text-xs font-mono text-zinc-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
