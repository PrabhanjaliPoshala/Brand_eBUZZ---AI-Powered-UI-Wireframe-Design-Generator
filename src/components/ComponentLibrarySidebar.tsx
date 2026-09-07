import React, { useState } from 'react';
import { ComponentCategory, WireframeElement } from '../types';
import { COMPONENT_DEFINITIONS, ComponentDefinition } from '../data/componentDefinitions';
import {
  Search,
  Plus,
  Layers,
  FileText,
  Boxes,
  Compass,
  LayoutGrid,
  CreditCard,
  CheckSquare,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  Sparkles,
} from 'lucide-react';

interface Props {
  onAddComponent: (def: ComponentDefinition) => void;
  elements: WireframeElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onMoveElement: (index: number, direction: 'up' | 'down') => void;
  onDeleteElement: (id: string) => void;
  pages: string[];
  activePage: string;
  onSelectPage: (page: string) => void;
  onAddPage?: (pageName: string) => void;
}

export const ComponentLibrarySidebar: React.FC<Props> = ({
  onAddComponent,
  elements,
  selectedElementId,
  onSelectElement,
  onMoveElement,
  onDeleteElement,
  pages,
  activePage,
  onSelectPage,
  onAddPage,
}) => {
  const [activeTab, setActiveTab] = useState<'components' | 'layers' | 'pages'>('components');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [newPageName, setNewPageName] = useState('');
  const [showAddPageInput, setShowAddPageInput] = useState(false);

  const categories: { id: ComponentCategory | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'All', icon: Boxes },
    { id: 'basic', label: 'Basic', icon: FileText },
    { id: 'layout', label: 'Layout', icon: LayoutGrid },
    { id: 'navigation', label: 'Navigation', icon: Compass },
    { id: 'content', label: 'Content', icon: CreditCard },
    { id: 'forms', label: 'Forms & Charts', icon: CheckSquare },
  ];

  const filteredComponents = COMPONENT_DEFINITIONS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <aside className="w-80 border-r border-zinc-200 bg-white flex flex-col h-full overflow-hidden select-none">
      {/* Sidebar Tabs */}
      <div className="flex items-center border-b border-zinc-200 bg-zinc-50/70 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('components')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'components'
              ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/60'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Library</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('layers')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'layers'
              ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/60'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Layers ({elements.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pages')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'pages'
              ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/60'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Pages ({pages.length})</span>
        </button>
      </div>

      {/* 1. COMPONENTS TAB */}
      {activeTab === 'components' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b border-zinc-200">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="px-3 py-2 border-b border-zinc-100 flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Component List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-1 flex items-center justify-between">
              <span>Available Components</span>
              <span>{filteredComponents.length} items</span>
            </div>

            {filteredComponents.map((def) => (
              <div
                key={def.type}
                onClick={() => onAddComponent(def)}
                className="group p-2.5 border border-zinc-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-blue-100 group-hover:text-blue-600 flex items-center justify-center text-zinc-600 transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                      {def.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{def.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  title="Add to canvas"
                  className="w-6 h-6 rounded-md bg-zinc-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-zinc-500 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {filteredComponents.length === 0 && (
              <div className="py-12 text-center text-zinc-400 text-xs">
                No components matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. LAYERS TAB */}
      {activeTab === 'layers' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-zinc-200 bg-zinc-50/50 flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-700">Canvas Element Order</span>
            <span className="text-[10px] text-zinc-500">Top to bottom sequence</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {elements.map((el, index) => {
              const isSelected = el.id === selectedElementId;
              return (
                <div
                  key={el.id}
                  onClick={() => onSelectElement(el.id)}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold'
                      : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-[10px] font-mono text-zinc-400 w-4">{index + 1}</span>
                    <Eye className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="capitalize truncate font-medium">
                      {el.props.title || el.props.heading || el.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      title="Move Up"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveElement(index, 'up');
                      }}
                      className="p-1 hover:bg-zinc-200 rounded-xs text-zinc-500 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      title="Move Down"
                      disabled={index === elements.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveElement(index, 'down');
                      }}
                      className="p-1 hover:bg-zinc-200 rounded-xs text-zinc-500 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteElement(el.id);
                      }}
                      className="p-1 hover:bg-red-100 text-red-500 rounded-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {elements.length === 0 && (
              <div className="py-12 text-center text-zinc-400 text-xs">
                No components added yet. Add from Library.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. PAGES TAB */}
      {activeTab === 'pages' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-zinc-200 bg-zinc-50/50 flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-700">Project Screens & Pages</span>
            <button
              type="button"
              onClick={() => setShowAddPageInput(!showAddPageInput)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Page</span>
            </button>
          </div>

          {showAddPageInput && (
            <div className="p-3 border-b border-zinc-200 bg-blue-50/30">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Page title (e.g. Order Tracking)"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 border border-zinc-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newPageName.trim() && onAddPage) {
                      onAddPage(newPageName.trim());
                      setNewPageName('');
                      setShowAddPageInput(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {pages.map((page) => {
              const isActive = page === activePage;
              return (
                <div
                  key={page}
                  onClick={() => onSelectPage(page)}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                      : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <FileText className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{page}</span>
                  </div>
                  {isActive && (
                    <span className="text-[10px] uppercase font-mono tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
