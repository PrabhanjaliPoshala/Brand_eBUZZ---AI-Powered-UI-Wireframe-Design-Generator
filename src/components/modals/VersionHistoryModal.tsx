import React, { useState } from 'react';
import { Project, WireframeVersion } from '../../types';
import { store } from '../../services/store';
import {
  History,
  X,
  RotateCcw,
  Plus,
  Calendar,
  Layers,
  User,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onRestoreVersion: (elements: any[]) => void;
}

export const VersionHistoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  project,
  onRestoreVersion,
}) => {
  const [versions, setVersions] = useState<WireframeVersion[]>(() => store.getVersions(project.id));
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (!isOpen) return null;

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    store.saveVersion(
      project.id,
      newTitle.trim(),
      newDesc.trim(),
      project.wireframe.elements
    );
    setVersions(store.getVersions(project.id));
    setNewTitle('');
    setNewDesc('');
    setShowCreateForm(false);
  };

  const handleRestore = (versionId: string) => {
    const elements = store.restoreVersion(project.id, versionId);
    if (elements) {
      onRestoreVersion(elements);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">Version History & Snapshots</h2>
              <p className="text-xs text-zinc-500">Track iterations and restore previous wireframe concepts</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snapshot button */}
        <div className="py-3 flex items-center justify-between border-b border-zinc-100">
          <span className="text-xs font-semibold text-zinc-600">
            {versions.length} recorded version{versions.length === 1 ? '' : 's'}
          </span>
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Snapshot</span>
          </button>
        </div>

        {/* Create form */}
        {showCreateForm && (
          <form onSubmit={handleCreateVersion} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 my-2 space-y-3">
            <h4 className="text-xs font-bold text-zinc-800">New Version Snapshot</h4>
            <div>
              <input
                type="text"
                placeholder="Snapshot title (e.g., Added Reviews & Promo Banner)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Optional description of modifications made..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="px-3 py-1 bg-zinc-900 text-white rounded-md text-xs font-bold disabled:opacity-50"
              >
                Save Version
              </button>
            </div>
          </form>
        )}

        {/* Versions List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2.5">
          {versions.map((ver, idx) => (
            <div
              key={ver.id}
              className="p-4 border border-zinc-200 hover:border-zinc-300 rounded-xl bg-white flex items-start justify-between shadow-2xs transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-800 text-[10px] font-mono font-bold rounded-md">
                    v{ver.versionNumber}
                  </span>
                  <h3 className="text-xs font-bold text-zinc-900">{ver.title}</h3>
                  {idx === 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-600">{ver.description}</p>
                <div className="flex items-center space-x-4 text-[11px] text-zinc-400 pt-1">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(ver.createdAt).toLocaleString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{ver.createdBy}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Layers className="w-3 h-3" />
                    <span>{ver.elementCount} elements</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRestore(ver.id)}
                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold flex items-center space-x-1 shrink-0 ml-4 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore</span>
              </button>
            </div>
          ))}

          {versions.length === 0 && (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No versions recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
