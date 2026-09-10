import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { store, subscribeToStore } from '../services/store';
import { Project, DomainType } from '../types';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Layout,
  ExternalLink,
  Trash2,
  Copy,
  MessageSquare,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { BrandLockup } from '../components/BrandLockup';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => store.getProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'name'>('updated');

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setProjects(store.getProjects());
    });
    return () => unsub();
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      store.deleteProject(id);
    }
  };

  const handleDuplicate = (id: string) => {
    store.duplicateProject(id);
  };

  const filteredProjects = projects
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.domain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDomain = domainFilter === 'all' || p.domain === domainFilter;
      return matchSearch && matchDomain;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),transparent_18%),linear-gradient(180deg,#f8fafc_0%,#f4f4f5_100%)] text-zinc-900 flex flex-col font-sans">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="group flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <BrandLockup compact />
            </Link>
            <span className="text-zinc-300">/</span>
            <span className="text-sm font-semibold text-zinc-700">All Projects</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-semibold text-zinc-500 md:inline">Msoft Technologies</span>
            <Link
              to="/projects/new"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
            >
              <Plus className="w-4 h-4" />
              <span>New Wireframe</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-6 md:p-10">
        <section className="rounded-[28px] border border-zinc-200 bg-gradient-to-br from-slate-900 via-zinc-900 to-blue-950 p-6 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.8)] md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Project directory
              </span>
              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Everything you are building, in one place.</h1>
              <p className="mt-3 text-sm text-slate-300 md:text-base">
                Track progress, jump into the editor, and manage each concept without losing momentum.
              </p>
            </div>

            <div className="grid min-w-[260px] gap-3 sm:grid-cols-3">
              {[
                { label: 'Projects', value: String(projects.length) },
                { label: 'Domains', value: String(new Set(projects.map((p) => p.domain)).size) },
                { label: 'Updated', value: 'Today' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-[0_18px_35px_-25px_rgba(15,23,42,0.35)] md:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">Project Directory</h2>
              <p className="mt-1 text-xs text-zinc-500">Manage and access all saved wireframe projects ({projects.length})</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-52 rounded-xl border border-zinc-300 bg-white py-2 pl-9 pr-3 text-xs text-zinc-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-64"
                />
              </div>

              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Domains</option>
                <option value="food_delivery">Food Delivery</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="saas">SaaS</option>
                <option value="dashboard">Dashboard</option>
                <option value="portfolio">Portfolio</option>
                <option value="healthcare">Healthcare</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="updated">Recently Updated</option>
                <option value="created">Recently Created</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((proj) => {
                const pagesCount = proj.pages?.length || 1;
                const elementsCount = proj.wireframe.elements?.length || 0;

                return (
                  <div
                    key={proj.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_18px_35px_-25px_rgba(15,23,42,0.35)] transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_45px_-24px_rgba(37,99,235,0.45)]"
                  >
                    <div className="p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700">
                          {proj.domain.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDuplicate(proj.id)}
                            className="rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                            title="Duplicate project"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(proj.id, proj.name)}
                            className="rounded-lg p-1 text-zinc-400 transition hover:bg-red-50 hover:text-red-500"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4 h-28 rounded-2xl bg-gradient-to-br from-slate-100 via-white to-blue-50 p-3">
                        <div className="flex h-full flex-col justify-between rounded-xl border border-zinc-200 bg-white/90 p-3">
                          <div className="flex items-center justify-between">
                            <div className="h-2.5 w-16 rounded-full bg-zinc-200" />
                            <div className="h-2.5 w-10 rounded-full bg-blue-100" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-2.5 w-3/4 rounded-full bg-zinc-200" />
                            <div className="h-2.5 w-1/2 rounded-full bg-zinc-200" />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-7 rounded-lg bg-zinc-100" />
                            <div className="h-7 rounded-lg bg-zinc-100" />
                            <div className="h-7 rounded-lg bg-zinc-100" />
                          </div>
                        </div>
                      </div>

                      <Link to={`/projects/${proj.id}`} className="block transition group-hover:text-blue-600">
                        <h3 className="text-base font-extrabold tracking-tight text-zinc-900">{proj.name}</h3>
                      </Link>
                      <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                        {proj.description || 'AI wireframe concept'}
                      </p>

                      <div className="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          {pagesCount} {pagesCount === 1 ? 'page' : 'pages'}
                        </span>
                        <span>•</span>
                        <span>{elementsCount} components</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-5 py-3 text-xs">
                      <span className="text-zinc-400">{new Date(proj.updatedAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <Link to={`/projects/${proj.id}`} className="font-medium text-zinc-600 transition hover:text-zinc-900">
                          Details
                        </Link>
                        <Link
                          to={`/projects/${proj.id}/editor`}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white shadow-sm transition hover:bg-blue-500"
                        >
                          <span>Editor</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-zinc-300 bg-white/80 p-12 text-center">
              <Layout className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
              <h3 className="text-sm font-bold text-zinc-700">No projects match your filter</h3>
              <p className="mt-1 mb-4 text-xs text-zinc-400">Try adjusting your search query or domain category.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDomainFilter('all');
                }}
                className="rounded-xl bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
