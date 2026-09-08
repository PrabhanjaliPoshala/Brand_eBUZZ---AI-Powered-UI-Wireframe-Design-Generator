import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, DomainType, Template, User } from '../types';
import { store, subscribeToStore } from '../services/store';
import {
  Plus,
  Search,
  Filter,
  Sparkles,
  Layout,
  Clock,
  Download,
  Trash2,
  Copy,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  CheckCircle,
  LogOut,
  Settings,
  BarChart3,
  Image as ImageIcon,
} from 'lucide-react';
import { NotificationsPopover } from '../components/NotificationsPopover';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>(() => store.getProjects());
  const [templates, setTemplates] = useState<Template[]>(() => store.getTemplates());
  const [currentUser, setCurrentUser] = useState<User>(() => store.getCurrentUser());
  const [allUsers, setAllUsers] = useState<User[]>(() => store.getUsers());

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<DomainType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'generated' | 'exported'>('all');

  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setProjects(store.getProjects());
      setTemplates(store.getTemplates());
      setCurrentUser(store.getCurrentUser());
      setAllUsers(store.getUsers());
    });
    return () => unsubscribe();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = domainFilter === 'all' || p.domain === domainFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesDomain && matchesStatus;
  });

  const exports = store.getExports();
  const jobs = store.getJobs();

  const handleCreateFromTemplate = (template: Template) => {
    const newProj = store.createProject(
      template.name,
      template.description,
      (template.domain || template.category) as DomainType,
      ['desktop', 'mobile'],
      `Created from ${template.name} template: ${template.description}`,
      {
        pages: ['Home', 'Explore', 'Details'],
        components: template.elements.map((e) => e.type),
        constraints: ['Adaptive layout'],
        style_hints: ['modern', 'clean'],
        domain: (template.domain || template.category) as DomainType,
        primary_color: '#2563EB',
        design_rationale: `Instantiated from ${template.name} reference template.`,
        isAiGenerated: false,
        source: 'template-library',
      },
      template.elements
    );
    navigate(`/projects/${newProj.id}/editor`);
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this wireframe project?')) {
      store.deleteProject(id);
    }
  };

  const handleDuplicateProject = (e: React.MouseEvent, p: Project) => {
    e.stopPropagation();
    store.duplicateProject(p.id);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),transparent_18%),linear-gradient(180deg,#f8fafc_0%,#f4f4f5_100%)] text-zinc-900 flex flex-col">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
          <div className="flex items-center space-x-8">
            <div
              onClick={() => navigate('/dashboard')}
              className="flex cursor-pointer items-center space-x-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-extrabold text-white shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-base font-extrabold tracking-tight text-zinc-900 leading-tight">
                  WireframeOS
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Autonomous Design Platform
                </span>
              </div>
            </div>

            <nav className="hidden items-center space-x-6 text-xs font-bold text-zinc-600 lg:flex">
              <span
                onClick={() => navigate('/dashboard')}
                className="cursor-pointer border-b-2 border-zinc-900 pb-1 text-zinc-900"
              >
                Dashboard
              </span>
              <span
                onClick={() => navigate('/projects')}
                className="cursor-pointer transition-colors hover:text-zinc-900"
              >
                All Projects
              </span>
              <span
                onClick={() => navigate('/templates')}
                className="cursor-pointer transition-colors hover:text-zinc-900"
              >
                Templates
              </span>
              <span
                onClick={() => navigate('/assets')}
                className="cursor-pointer transition-colors hover:text-zinc-900"
              >
                Assets
              </span>
              <span
                onClick={() => navigate('/analytics')}
                className="cursor-pointer transition-colors hover:text-zinc-900"
              >
                Analytics
              </span>
              <span
                onClick={() => navigate('/settings')}
                className="cursor-pointer transition-colors hover:text-zinc-900"
              >
                Settings
              </span>
              {currentUser.role === 'admin' && (
                <span
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-1 rounded-md bg-purple-50 px-2 py-0.5 text-purple-700 transition-colors hover:text-zinc-900"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </span>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <NotificationsPopover />

            <div className="hidden items-center space-x-1 rounded-xl border border-zinc-200 bg-zinc-100 p-1 text-xs sm:flex">
              <span className="pl-2 text-[10px] font-bold uppercase text-zinc-400">Role:</span>
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => store.setCurrentUser(u)}
                  className={`rounded-lg px-2 py-1 text-xs font-semibold capitalize transition-all ${
                    currentUser.id === u.id
                      ? 'bg-white text-zinc-900 shadow-xs font-bold'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {u.role}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate('/projects/new')}
              className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>New Wireframe</span>
            </button>

            <button
              type="button"
              title="Log out"
              onClick={() => {
                store.signOut();
                navigate('/login');
              }}
              className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              <LogOut className="w-4 h-4" />
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
                Creative workspace
              </span>
              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                Design and wireframe projects at speed.
              </h1>
              <p className="mt-4 max-w-xl text-sm text-slate-300 md:text-base">
                Turn ideas into structured product flows, review live previews, and launch polished experiences from a single workspace.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[320px]">
              {[
                { label: 'Active projects', value: String(projects.length) },
                { label: 'AI generations', value: String(jobs.length) },
                { label: 'Templates', value: String(templates.length) },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <div className="text-xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_18px_35px_-25px_rgba(15,23,42,0.35)]">
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-zinc-400">
              <span>Active projects</span>
              <Layout className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-zinc-900">{projects.length}</div>
            <div className="mt-1 flex items-center space-x-1 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>Ready in workspace</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_18px_35px_-25px_rgba(15,23,42,0.35)]">
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-zinc-400">
              <span>AI generations</span>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-zinc-900">{jobs.length}</div>
            <div className="mt-1 text-[11px] font-medium text-zinc-500">Gemini 3.8 Flash model</div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_18px_35px_-25px_rgba(15,23,42,0.35)]">
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-zinc-400">
              <span>Total exports</span>
              <Download className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-zinc-900">{exports.length}</div>
            <div className="mt-1 text-[11px] font-medium text-zinc-500">HTML, JSON & Spec</div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_18px_35px_-25px_rgba(15,23,42,0.35)]">
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-zinc-400">
              <span>Templates</span>
              <Layers className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-zinc-900">{templates.length}</div>
            <div className="mt-1 text-[11px] font-semibold text-purple-600">Pre-configured kits</div>
          </div>
        </section>

        <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-[0_18px_35px_-25px_rgba(15,23,42,0.35)] md:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Your wireframe projects</h2>
              <p className="mt-1 text-xs text-zinc-500">Filter, find, and continue working on the right concept.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white py-1.5 pl-9 pr-3 text-xs text-zinc-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value as any)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Domains</option>
                <option value="food_delivery">Food Delivery</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="saas">SaaS</option>
                <option value="dashboard">Dashboard</option>
                <option value="portfolio">Portfolio</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Statuses</option>
                <option value="generated">Generated</option>
                <option value="draft">Draft</option>
                <option value="exported">Exported</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => navigate(`/projects/${proj.id}/editor`)}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-[0_18px_35px_-25px_rgba(15,23,42,0.35)] transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_45px_-24px_rgba(37,99,235,0.45)]"
              >
                <div className="relative h-36 overflow-hidden bg-gradient-to-b from-zinc-100 to-zinc-50 p-4">
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="rounded-full border border-blue-200 bg-blue-100/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-800">
                      {proj.domain.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">{proj.wireframe.elements.length} elements</span>
                  </div>

                  <div className="absolute inset-0 opacity-70">
                    <div className="space-y-2 p-4 pt-10">
                      <div className="h-3 w-3/4 rounded-full bg-zinc-300" />
                      <div className="h-2 w-1/2 rounded-full bg-zinc-200" />
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="h-7 rounded-lg bg-zinc-200" />
                        <div className="h-7 rounded-lg bg-zinc-200" />
                        <div className="h-7 rounded-lg bg-zinc-200" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-blue-600/0 transition-colors group-hover:bg-blue-600/5" />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-extrabold tracking-tight text-zinc-900 group-hover:text-blue-600">
                    {proj.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                    {proj.description || proj.requirement}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs text-zinc-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        title="Duplicate"
                        onClick={(e) => handleDuplicateProject(e, proj)}
                        className="rounded-md p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={(e) => handleDeleteProject(e, proj.id)}
                        className="rounded-md p-1 text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div
              onClick={() => navigate('/projects/new')}
              className="group flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-zinc-300 bg-white/60 p-8 text-center transition-all hover:border-blue-500 hover:bg-blue-50/20"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 group-hover:text-blue-600">Create New Project</h3>
              <p className="mt-1 max-w-[200px] text-xs text-zinc-400">
                Describe your application requirement in plain English.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-[0_18px_35px_-25px_rgba(15,23,42,0.35)] md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Recommended templates</h2>
              <p className="mt-1 text-xs text-zinc-500">Kickstart your design with curated industry concepts.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/templates')}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 transition hover:text-blue-700"
            >
              <span>View all ({templates.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {templates.slice(0, 4).map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleCreateFromTemplate(tmpl)}
                className="flex cursor-pointer flex-col justify-between rounded-[20px] border border-zinc-200 bg-white p-4 shadow-[0_12px_25px_-20px_rgba(15,23,42,0.35)] transition-all hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_18px_35px_-24px_rgba(15,23,42,0.4)]"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-700">
                      {tmpl.category}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">{tmpl.elementCount} blocks</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-zinc-900">{tmpl.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">{tmpl.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs font-bold text-blue-600">
                  <span>Use Template</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
