import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { store, subscribeToStore } from '../services/store';
import { Project } from '../types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Layout,
  History,
  Download,
  Cpu,
  Layers,
  Palette,
  Calendar,
  Clock,
  Trash2,
  Share2,
  MessageSquare,
  Copy,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
} from 'lucide-react';
import { BrandLockup } from '../components/BrandLockup';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | undefined>(() =>
    projectId ? store.getProjectById(projectId) : undefined
  );

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      if (projectId) {
        setProject(store.getProjectById(projectId));
      }
    });
    return () => unsub();
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm max-w-md w-full">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Project Not Found</h2>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to permanently delete "${project.name}"?`)) {
      store.deleteProject(project.id);
      navigate('/projects');
    }
  };

  const pages = project.pages || [{ name: 'Home', elements: project.wireframe.elements }];
  const comments = store.getComments(project.id);
  const versions = store.getVersions(project.id);

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <Link
            to="/projects"
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <BrandLockup compact />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-900">{project.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200 uppercase">
                {project.domain.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono">ID: {project.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden text-xs font-semibold text-zinc-500 md:inline">Msoft Technologies</span>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 transition"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link
            to={`/projects/${project.id}/editor`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition"
          >
            <Layout className="w-4 h-4" />
            <span>Open in Visual Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto p-6 md:p-10 flex-1 space-y-8">
        {/* Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">{project.name}</h2>
            <p className="text-sm text-zinc-600 leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                {pages.length} Pages • {project.wireframe.elements.length} Components
              </span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            <Link
              to={`/projects/${project.id}/analysis`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition"
            >
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>AI Analysis Spec</span>
            </Link>
            <Link
              to={`/projects/${project.id}/comments`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Comments ({comments.length})</span>
            </Link>
            <Link
              to={`/projects/${project.id}/versions`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition"
            >
              <History className="w-4 h-4 text-purple-600" />
              <span>Versions ({versions.length})</span>
            </Link>
            <Link
              to={`/projects/${project.id}/export`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Suite</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                const dup = store.duplicateProject(project.id);
                if (dup) navigate(`/projects/${dup.id}`);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition"
            >
              <Copy className="w-4 h-4 text-zinc-600" />
              <span>Duplicate Project</span>
            </button>
            <Link
              to={`/preview/${project.id}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition"
            >
              <Share2 className="w-4 h-4 text-zinc-600" />
              <span>Public Share URL</span>
            </Link>
          </div>
        </div>

        {/* 2-Column Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Pages & Component Architecture */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pages Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    Project Pages ({pages.length})
                  </h3>
                </div>
                <Link
                  to={`/projects/${project.id}/editor`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-500"
                >
                  Edit in Canvas →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pages.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 hover:bg-zinc-50 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-900">{p.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 font-mono">
                        {p.elements?.length || 0} elements
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-mono">/{p.name.toLowerCase().replace(/\s+/g, '-')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt Requirement Card */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                  Original AI Prompt
                </h3>
              </div>
              <p className="text-xs text-zinc-700 font-mono bg-zinc-50 p-4 rounded-xl border border-zinc-200 leading-relaxed">
                "{project.requirement}"
              </p>
            </div>

            {/* Component Tree */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">
                Active View Components ({project.wireframe.elements.length})
              </h3>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {project.wireframe.elements.map((el, idx) => (
                  <div
                    key={el.id}
                    className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded bg-zinc-200 text-zinc-600 font-mono text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-zinc-800 capitalize">{el.type.replace('_', ' ')}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">id: {el.id}</span>
                    </div>
                    <span className="text-[11px] text-zinc-500">h: {el.height}px</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Theme & Meta */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Design System</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Primary Accent:</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-zinc-300"
                      style={{ backgroundColor: project.brandPreset.primaryColor }}
                    />
                    <span className="font-mono">{project.brandPreset.primaryColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Font Family:</span>
                  <span className="font-medium text-zinc-800">{project.brandPreset.fontFamily}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Border Radius:</span>
                  <span className="font-medium text-zinc-800">{project.brandPreset.borderRadius}px</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Target Devices:</span>
                  <div className="flex items-center gap-1.5">
                    {project.devices.map((d) => (
                      <span key={d} className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 capitalize font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-md text-center">
              <Layout className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold">Ready to Canvas?</h4>
              <p className="text-xs text-zinc-400 mt-1 mb-4 leading-relaxed">
                Add, reorder, style components or invoke AI regeneration on any section.
              </p>
              <Link
                to={`/projects/${project.id}/editor`}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>Launch Visual Canvas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
