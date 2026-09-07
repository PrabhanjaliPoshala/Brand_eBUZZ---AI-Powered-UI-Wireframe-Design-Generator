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
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col">
      {/* Navigation Bar */}
      <header className="h-16 border-b border-zinc-200 bg-white px-6 md:px-10 flex items-center justify-between shadow-2xs sticky top-0 z-30">
        <div className="flex items-center space-x-8">
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-zinc-900 block leading-tight">
                WireframeOS
              </span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                Autonomous Design Platform
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold text-zinc-600">
            <span
              onClick={() => navigate('/dashboard')}
              className="text-zinc-900 cursor-pointer border-b-2 border-zinc-900 pb-1"
            >
              Dashboard
            </span>
            <span
              onClick={() => navigate('/projects')}
              className="hover:text-zinc-900 cursor-pointer transition-colors"
            >
              All Projects
            </span>
            <span
              onClick={() => navigate('/templates')}
              className="hover:text-zinc-900 cursor-pointer transition-colors"
            >
              Templates
            </span>
            <span
              onClick={() => navigate('/assets')}
              className="hover:text-zinc-900 cursor-pointer transition-colors"
            >
              Assets
            </span>
            <span
              onClick={() => navigate('/analytics')}
              className="hover:text-zinc-900 cursor-pointer transition-colors"
            >
              Analytics
            </span>
            <span
              onClick={() => navigate('/settings')}
              className="hover:text-zinc-900 cursor-pointer transition-colors"
            >
              Settings
            </span>
            {currentUser.role === 'admin' && (
              <span
                onClick={() => navigate('/admin')}
                className="hover:text-zinc-900 cursor-pointer transition-colors flex items-center space-x-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </span>
            )}
          </nav>
        </div>

        {/* User Switcher / Profile */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <NotificationsPopover />

          {/* Quick Role Switcher */}
          <div className="hidden sm:flex items-center space-x-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-400 pl-2">Role:</span>
            {allUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => store.setCurrentUser(u)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
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
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-colors"
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
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-10">
        {/* Hero Banner & KPI Stats */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Design & Wireframe Workspace
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Translate natural language requirements into structured wireframe concepts in seconds.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/projects/new')}
              className="self-start md:self-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate New Wireframe</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="text-xs font-medium text-zinc-400 mb-1 flex items-center justify-between">
                <span>Active Projects</span>
                <Layout className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-zinc-900">{projects.length}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>Ready in workspace</span>
              </div>
            </div>

            <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="text-xs font-medium text-zinc-400 mb-1 flex items-center justify-between">
                <span>AI Generations</span>
                <Sparkles className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-zinc-900">{jobs.length}</div>
              <div className="text-[11px] text-zinc-500 font-medium mt-1">
                Gemini 3.8 Flash model
              </div>
            </div>

            <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="text-xs font-medium text-zinc-400 mb-1 flex items-center justify-between">
                <span>Total Exports</span>
                <Download className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-zinc-900">{exports.length}</div>
              <div className="text-[11px] text-zinc-500 font-medium mt-1">HTML, JSON & Spec</div>
            </div>

            <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="text-xs font-medium text-zinc-400 mb-1 flex items-center justify-between">
                <span>Templates Available</span>
                <Layers className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-zinc-900">{templates.length}</div>
              <div className="text-[11px] text-purple-600 font-semibold mt-1">Pre-configured Kits</div>
            </div>
          </div>
        </div>

        {/* Projects Section with Search & Filter */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-bold text-zinc-900">Your Wireframe Projects</h2>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Domain Filter */}
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-medium text-zinc-700 focus:outline-hidden"
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

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-medium text-zinc-700 focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="generated">Generated</option>
                <option value="draft">Draft</option>
                <option value="exported">Exported</option>
              </select>
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => navigate(`/projects/${proj.id}/editor`)}
                className="bg-white border border-zinc-200/90 hover:border-blue-500 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                {/* Visual Thumbnail / Header Preview */}
                <div className="h-36 bg-gradient-to-b from-zinc-100 to-zinc-50 border-b border-zinc-100 p-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100/80 text-blue-800 border border-blue-200">
                      {proj.domain.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {proj.wireframe.elements.length} elements
                    </span>
                  </div>

                  {/* Blueprint visual wire lines */}
                  <div className="space-y-1.5 opacity-60">
                    <div className="h-3 w-3/4 bg-zinc-300 rounded-xs"></div>
                    <div className="h-2 w-1/2 bg-zinc-200 rounded-xs"></div>
                    <div className="flex space-x-2 pt-1">
                      <div className="h-6 flex-1 bg-zinc-200 rounded-sm"></div>
                      <div className="h-6 flex-1 bg-zinc-200 rounded-sm"></div>
                      <div className="h-6 flex-1 bg-zinc-200 rounded-sm"></div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors" />
                </div>

                {/* Project Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-zinc-900 text-base group-hover:text-blue-600 transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {proj.description || proj.requirement}
                  </p>

                  <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        title="Duplicate"
                        onClick={(e) => handleDuplicateProject(e, proj)}
                        className="p-1 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 rounded-md transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={(e) => handleDeleteProject(e, proj.id)}
                        className="p-1 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* "+ Create Project" placeholder card */}
            <div
              onClick={() => navigate('/projects/new')}
              className="border-2 border-dashed border-zinc-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[220px] group"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-100 group-hover:bg-blue-100 group-hover:text-blue-600 flex items-center justify-center text-zinc-400 mb-3 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-blue-600 transition-colors">
                Create New Project
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-[200px]">
                Describe your application requirement in plain English.
              </p>
            </div>
          </div>
        </div>

        {/* Template Gallery Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Recommended Templates</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Kickstart your design with curated industry concepts</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/templates')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>View All ({templates.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.slice(0, 4).map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleCreateFromTemplate(tmpl)}
                className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl p-4 shadow-2xs hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                      {tmpl.category}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {tmpl.elementCount} blocks
                    </span>
                  </div>
                  <h3 className="font-bold text-zinc-900 text-sm mb-1">{tmpl.name}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{tmpl.description}</p>
                </div>
                <div className="pt-4 mt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-blue-600 font-bold">
                  <span>Use Template</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
