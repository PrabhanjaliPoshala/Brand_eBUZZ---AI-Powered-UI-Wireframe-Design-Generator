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
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-zinc-900">WireframeAI</span>
          </Link>
          <span className="text-zinc-300">/</span>
          <span className="text-sm font-semibold text-zinc-700">All Projects</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Wireframe</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl w-full mx-auto p-6 md:p-10 flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">Project Directory</h1>
            <p className="text-xs text-zinc-500 mt-1">Manage and access all saved wireframe projects ({projects.length})</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 w-52 sm:w-64"
              />
            </div>

            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
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
              className="px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            >
              <option value="updated">Recently Updated</option>
              <option value="created">Recently Created</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => {
              const pagesCount = proj.pages?.length || 1;
              const elementsCount = proj.wireframe.elements?.length || 0;

              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-zinc-200 hover:border-blue-500/50 hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                        {proj.domain.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicate(proj.id)}
                          className="p-1 text-zinc-400 hover:text-zinc-700 transition rounded-lg hover:bg-zinc-100"
                          title="Duplicate project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id, proj.name)}
                          className="p-1 text-zinc-400 hover:text-red-500 transition rounded-lg hover:bg-zinc-100"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <Link to={`/projects/${proj.id}`} className="block group-hover:text-blue-600 transition">
                      <h3 className="text-base font-bold text-zinc-900 line-clamp-1">{proj.name}</h3>
                    </Link>
                    <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {proj.description || 'AI wireframe concept'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-4 pt-3 border-t border-zinc-100">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        {pagesCount} {pagesCount === 1 ? 'page' : 'pages'}
                      </span>
                      <span>•</span>
                      <span>{elementsCount} components</span>
                    </div>
                  </div>

                  <div className="bg-zinc-50 px-6 py-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                      {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/projects/${proj.id}`}
                        className="px-2.5 py-1 text-zinc-600 hover:text-zinc-900 font-medium transition"
                      >
                        Details
                      </Link>
                      <Link
                        to={`/projects/${proj.id}/editor`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-xs"
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
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
            <Layout className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-zinc-700">No projects match your filter</h3>
            <p className="text-xs text-zinc-400 mt-1 mb-4">Try adjusting your search query or domain category.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDomainFilter('all');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
