import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { store, subscribeToStore } from '../services/store';
import { Project, WireframeVersion } from '../types';
import {
  History,
  ArrowLeft,
  RotateCcw,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Layout,
  ExternalLink,
  GitCompare,
} from 'lucide-react';
import { BrandLockup } from '../components/BrandLockup';

export const ProjectVersionsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | undefined>(() =>
    projectId ? store.getProjectById(projectId) : undefined
  );
  const [versions, setVersions] = useState<WireframeVersion[]>(() =>
    projectId ? store.getVersions(projectId) : []
  );
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [restoredSuccess, setRestoredSuccess] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      if (projectId) {
        setProject(store.getProjectById(projectId));
        const v = store.getVersions(projectId);
        setVersions(v);
        if (!selectedVersionId && v.length > 0) {
          setSelectedVersionId(v[0].id);
        }
      }
    });
    return () => unsub();
  }, [projectId]);

  useEffect(() => {
    if (versions.length > 0 && !selectedVersionId) {
      setSelectedVersionId(versions[0].id);
    }
  }, [versions]);

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

  const selectedVersion = versions.find((v) => v.id === selectedVersionId) || versions[0];

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    store.saveVersion(
      project.id,
      newTitle.trim(),
      newDesc.trim() || 'Manual revision snapshot',
      project.wireframe.elements
    );

    setNewTitle('');
    setNewDesc('');
    setIsCreating(false);
  };

  const handleRestore = (ver: WireframeVersion) => {
    if (confirm(`Are you sure you want to restore Version ${ver.versionNumber}: "${ver.title}"? Current changes will be overwritten.`)) {
      store.restoreVersion(project.id, ver.id);
      setRestoredSuccess(true);
      setTimeout(() => setRestoredSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <Link
            to={`/projects/${project.id}/editor`}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <BrandLockup compact />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-900">{project.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">
                Version History
              </span>
            </div>
            <p className="text-xs text-zinc-500">Track iterations, diffs, and restore previous wireframe snapshots</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-semibold text-zinc-500 md:inline">Msoft Technologies</span>
          {restoredSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Version Restored Successfully
            </span>
          )}
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-300 text-zinc-800 text-xs font-semibold hover:bg-zinc-100 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Snapshot</span>
          </button>
          <Link
            to={`/projects/${project.id}/editor`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition"
          >
            <Layout className="w-4 h-4" />
            <span>Open Canvas</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl w-full mx-auto p-6 md:p-10 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Versions Timeline List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Snapshots ({versions.length})
            </h2>
            <span className="text-xs text-zinc-500">Auto-saved on AI iterations</span>
          </div>

          {isCreating && (
            <form onSubmit={handleCreateSnapshot} className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-blue-700 uppercase">New Manual Snapshot</h3>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Snapshot title (e.g., Pre-checkout layout)"
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description of changes..."
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  Save Snapshot
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2.5">
            {versions.map((ver) => {
              const isSelected = selectedVersion?.id === ver.id;
              return (
                <div
                  key={ver.id}
                  onClick={() => setSelectedVersionId(ver.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'border-blue-600 bg-white shadow-sm ring-2 ring-blue-600/10'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-900">
                      v{ver.versionNumber}: {ver.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {new Date(ver.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-2">{ver.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {ver.elements.length} components
                    </span>
                    <span>{new Date(ver.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Version Detail & Elements Inspection */}
        <div className="lg:col-span-2 space-y-6">
          {selectedVersion ? (
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs font-mono">
                      Version {selectedVersion.versionNumber}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900">{selectedVersion.title}</h3>
                  </div>
                  <p className="text-xs text-zinc-500 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Created on {new Date(selectedVersion.createdAt).toLocaleString()}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCompareMode(!compareMode)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      compareMode
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <GitCompare className="w-4 h-4" />
                    <span>{compareMode ? 'Exit Comparison' : 'Compare with Live Canvas'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRestore(selectedVersion)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restore this Version</span>
                  </button>
                </div>
              </div>

              {compareMode ? (
                /* Comparison / Diff View */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Snapshot Elements</span>
                      <p className="text-xl font-black text-zinc-800">{selectedVersion.elements.length}</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Live Canvas Elements</span>
                      <p className="text-xl font-black text-blue-600">{project.wireframe.elements.length}</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Net Component Delta</span>
                      <p className={`text-xl font-black ${
                        project.wireframe.elements.length >= selectedVersion.elements.length ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {project.wireframe.elements.length - selectedVersion.elements.length > 0 ? '+' : ''}
                        {project.wireframe.elements.length - selectedVersion.elements.length}
                      </p>
                    </div>
                  </div>

                  <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200 text-xs">
                    <div className="bg-zinc-100/80 px-4 py-2.5 font-bold text-zinc-700 flex justify-between">
                      <span>Component in Live Canvas</span>
                      <span>Diff Status vs. Version {selectedVersion.versionNumber}</span>
                    </div>
                    {project.wireframe.elements.map((liveEl) => {
                      const matchInVer = selectedVersion.elements.find((e) => e.id === liveEl.id || e.type === liveEl.type);
                      return (
                        <div key={liveEl.id} className="px-4 py-3 flex items-center justify-between bg-white hover:bg-zinc-50">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-900 capitalize">{liveEl.type.replace('_', ' ')}</span>
                            <span className="text-[10px] font-mono text-zinc-400">({liveEl.id})</span>
                          </div>
                          {matchInVer ? (
                            <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-medium">
                              Preserved / In both
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                              + Added in Live
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Standard Snapshot View */
                <>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Description / Notes</h4>
                    <p className="text-sm text-zinc-700 bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 leading-relaxed">
                      {selectedVersion.description || 'No release notes provided.'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Component Layout Hierarchy ({selectedVersion.elements.length} elements)
                      </h4>
                      <span className="text-xs text-zinc-400 font-mono">Snapshot Tree</span>
                    </div>

                    <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                      {selectedVersion.elements.map((el, idx) => (
                        <div
                          key={el.id}
                          className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/70 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="font-semibold text-zinc-800 capitalize">{el.type.replace('_', ' ')}</span>
                              <span className="text-[11px] text-zinc-400 ml-2 font-mono">id: {el.id}</span>
                            </div>
                          </div>
                          <div className="text-right text-[11px] text-zinc-500">
                            <span>height: {el.height}px</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center text-zinc-400">
              No version snapshot selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
