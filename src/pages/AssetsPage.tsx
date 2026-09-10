import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { store, subscribeToStore } from '../services/store';
import { AssetItem, Project } from '../types';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Filter,
  ArrowLeft,
  Sparkles,
  Layers,
  Tag,
  X,
} from 'lucide-react';
import { BrandLockup } from '../components/BrandLockup';

export const AssetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<AssetItem[]>(() => store.getAssets());
  const [projects, setProjects] = useState<Project[]>(() => store.getProjects());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add Asset Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<AssetItem['category']>('image');
  const [newUrl, setNewUrl] = useState('');
  const [newProjectId, setNewProjectId] = useState<string>('');

  // Preview Modal
  const [previewAsset, setPreviewAsset] = useState<AssetItem | null>(null);

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setAssets(store.getAssets());
      setProjects(store.getProjects());
    });
    return () => unsub();
  }, []);

  const handleCopyUrl = (asset: AssetItem) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (asset: AssetItem) => {
    if (confirm(`Delete asset "${asset.name}"?`)) {
      store.deleteAsset(asset.id);
    }
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    const proj = projects.find((p) => p.id === newProjectId);

    store.addAsset({
      name: newName.trim(),
      category: newCategory,
      url: newUrl.trim(),
      projectId: proj?.id,
      projectName: proj?.name,
      fileSize: '120 KB',
      dimensions: '800 x 600',
    });

    setNewName('');
    setNewUrl('');
    setNewProjectId('');
    setShowAddModal(false);
  };

  const filteredAssets = assets.filter((a) => {
    const matchCat = categoryFilter === 'all' || a.category === categoryFilter;
    const matchSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.projectName && a.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
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
            <h1 className="text-base font-bold text-zinc-900">Asset Management</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              Media & Icons
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-semibold text-zinc-500 md:inline">Msoft Technologies</span>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Media Asset</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl w-full mx-auto p-6 md:p-10 flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">Design Assets Library</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Curate images, logos, and vector illustrations referenced across wireframes ({assets.length})
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 w-52 sm:w-64"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="image">Images</option>
              <option value="logo">Logos</option>
              <option value="icon">Icons</option>
              <option value="illustration">Illustrations</option>
            </select>
          </div>
        </div>

        {/* Asset Grid */}
        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-zinc-300 transition flex flex-col group"
              >
                {/* Visual Thumbnail */}
                <div
                  onClick={() => setPreviewAsset(asset)}
                  className="h-44 bg-zinc-100 relative cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback placeholder on broken URL
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-zinc-800 shadow-2xs">
                    {asset.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 truncate" title={asset.name}>
                      {asset.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {asset.dimensions || 'Vector'} • {asset.fileSize}
                    </p>
                    {asset.projectName && (
                      <span className="inline-block mt-2 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md truncate max-w-full">
                        {asset.projectName}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(asset)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewAsset(asset)}
                        title="Preview"
                        className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(asset)}
                        title="Delete asset"
                        className="p-1 text-zinc-400 hover:text-red-600 rounded-md transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
            <ImageIcon className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-zinc-700">No assets match your criteria</h3>
            <p className="text-xs text-zinc-400 mt-1 mb-4">Upload a new image or icon, or reset your search filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900">Add New Media Asset</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hero Food Banner"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                >
                  <option value="image">Image (Photograph / Banner)</option>
                  <option value="logo">Logo</option>
                  <option value="icon">Icon</option>
                  <option value="illustration">Illustration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Media URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Associate with Project (Optional)</label>
                <select
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                >
                  <option value="">Global / Workspace Wide</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-zinc-600 hover:bg-zinc-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewAsset && (
        <div
          onClick={() => setPreviewAsset(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 cursor-default space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900">{previewAsset.name}</h3>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 max-h-96 flex items-center justify-center">
              <img
                src={previewAsset.url}
                alt={previewAsset.name}
                className="max-h-96 object-contain w-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
              <span>Dimensions: {previewAsset.dimensions || 'N/A'}</span>
              <button
                type="button"
                onClick={() => handleCopyUrl(previewAsset)}
                className="px-3 py-1.5 bg-zinc-900 text-white rounded-xl font-bold flex items-center gap-1.5 text-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Asset URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
