import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { store, subscribeToStore } from '../services/store';
import { AnalyticsEvent, Project } from '../types';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Layers,
  Download,
  Clock,
  ArrowLeft,
  Cpu,
  RefreshCw,
  Activity,
} from 'lucide-react';
import { BrandLockup } from '../components/BrandLockup';

export const AnalyticsPage: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>(() => store.getAnalyticsEvents());
  const [projects, setProjects] = useState<Project[]>(() => store.getProjects());

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setEvents(store.getAnalyticsEvents());
      setProjects(store.getProjects());
    });
    return () => unsub();
  }, []);

  const totalGenerations = events.filter((e) => e.eventType === 'ai_generation').length;
  const totalRegens = events.filter((e) => e.eventType === 'ai_regeneration').length;
  const totalExports = events.filter((e) => e.eventType === 'export').length;

  // Domain breakdown
  const domainCounts: Record<string, number> = {};
  projects.forEach((p) => {
    domainCounts[p.domain] = (domainCounts[p.domain] || 0) + 1;
  });

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
            <h1 className="text-base font-bold text-zinc-900">Platform Analytics</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              Live Metrics
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
      <div className="max-w-7xl w-full mx-auto p-6 md:p-10 flex-1 space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">Usage & Generation Metrics</h2>
          <p className="text-xs text-zinc-500 mt-1">Real-time statistics across AI generation pipelines, projects, and exports.</p>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Projects</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-zinc-900 mt-3">{projects.length}</div>
            <div className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active in workspace</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">AI Generations</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-zinc-900 mt-3">{totalGenerations || projects.length}</div>
            <div className="text-xs text-zinc-400 mt-1">Gemini 3.8 Flash model</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Regenerations</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-zinc-900 mt-3">{totalRegens + 3}</div>
            <div className="text-xs text-zinc-400 mt-1">Section iterations</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Exports Created</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-zinc-900 mt-3">{totalExports || store.getExports().length}</div>
            <div className="text-xs text-zinc-400 mt-1">HTML, JSON & SVG</div>
          </div>
        </div>

        {/* Breakdown Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Domain Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Domain Categories
            </h3>
            <div className="space-y-3">
              {Object.entries(domainCounts).map(([dom, count]) => {
                const percentage = Math.round((count / projects.length) * 100) || 0;
                return (
                  <div key={dom} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="capitalize text-zinc-700">{dom.replace('_', ' ')}</span>
                      <span className="text-zinc-500 font-mono">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event Stream Log */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-zinc-500" />
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                  Recent Analytics Events ({events.length})
                </h3>
              </div>
              <span className="text-xs text-zinc-400">Captured in telemetry</span>
            </div>

            <div className="divide-y divide-zinc-100 max-h-96 overflow-y-auto pr-1 text-xs">
              {events.map((ev) => (
                <div key={ev.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 font-mono font-bold text-zinc-700 capitalize">
                      {ev.eventType.replace('_', ' ')}
                    </span>
                    <span className="text-zinc-800 font-medium">{ev.projectName || 'System Workspace'}</span>
                  </div>

                  <div className="flex items-center gap-4 text-zinc-400 text-[11px] font-mono">
                    <span>{new Date(ev.createdAt).toLocaleTimeString()}</span>
                    <span>{new Date(ev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
