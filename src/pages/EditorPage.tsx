import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, WireframeElement, DeviceType } from '../types';
import { store, subscribeToStore } from '../services/store';
import { ComponentDefinition } from '../data/componentDefinitions';
import { regenerateWireframePrompt } from '../services/aiService';

import { EditorTopBar } from '../components/EditorTopBar';
import { ComponentLibrarySidebar } from '../components/ComponentLibrarySidebar';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { CanvasElementRenderer } from '../components/CanvasElementRenderer';

import { RegenerateModal } from '../components/modals/RegenerateModal';
import { ExportModal } from '../components/modals/ExportModal';
import { VersionHistoryModal } from '../components/modals/VersionHistoryModal';
import { CommentsModal } from '../components/modals/CommentsModal';
import { ShareModal } from '../components/modals/ShareModal';
import { SAMPLE_DEMO_PROJECT_ID } from '../data/sampleDemoProject';
import { Plus, Layers, Trash2, Globe, Sparkles } from 'lucide-react';

export const EditorPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(() => {
    const id = projectId || SAMPLE_DEMO_PROJECT_ID;
    return store.getProjectById(id) || null;
  });

  // Editor states
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [mode, setMode] = useState<'wireframe' | 'preview'>('preview');
  const [zoom, setZoom] = useState<number>(1);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>('Home');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // History stack for Undo / Redo
  const [history, setHistory] = useState<WireframeElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Modals
  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Sync with store
  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      const id = projectId || SAMPLE_DEMO_PROJECT_ID;
      const current = store.getProjectById(id);
      if (current) setProject({ ...current });
    });
    return () => unsubscribe();
  }, [projectId]);

  // Sync active page when project loads or updates
  useEffect(() => {
    if (project?.activePageName && project.activePageName !== activePage) {
      setActivePage(project.activePageName);
    }
  }, [project?.id, project?.activePageName]);

  // Initialize history when project loads
  useEffect(() => {
    if (project && history.length === 0) {
      setHistory([project.wireframe.elements]);
      setHistoryIndex(0);
      if (project.wireframe.device) {
        setDevice(project.wireframe.device);
      }
    }
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Project Not Found</h2>
        <p className="text-sm text-zinc-500 mb-6">
          The requested wireframe project could not be located in your local storage.
        </p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const pagesList =
    project.pages && project.pages.length > 0
      ? project.pages.map((p) => p.name)
      : project.analysis.pages || ['Home'];

  const elements = project.wireframe.elements;
  const selectedElement = elements.find((e) => e.id === selectedElementId) || null;

  // Auto-save helper with multi-page & history tracking
  const pushNewState = (newElements: WireframeElement[]) => {
    setSaveStatus('saving');
    store.updateProjectPage(project.id, activePage, newElements);
    store.updateProjectWireframe(project.id, newElements, device, mode);

    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(JSON.parse(JSON.stringify(newElements)));
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);

    setTimeout(() => {
      setSaveStatus('saved');
    }, 400);
  };

  // Multi-page switching
  const handleSelectPage = (pageName: string) => {
    if (pageName === activePage) return;
    store.updateProjectPage(project.id, activePage, elements);
    const newPageElems = store.setActivePage(project.id, pageName);
    setActivePage(pageName);
    setSelectedElementId(null);
    setHistory([newPageElems]);
    setHistoryIndex(0);
  };

  const handleAddPage = (pageName: string) => {
    const newPage = store.addProjectPage(project.id, pageName);
    setActivePage(pageName);
    setSelectedElementId(null);
    setHistory([newPage.elements]);
    setHistoryIndex(0);
  };

  const handleDeletePage = (pageName: string) => {
    if (pagesList.length <= 1) return;
    const remaining = store.deleteProjectPage(project.id, pageName);
    if (activePage === pageName && remaining.length > 0) {
      handleSelectPage(remaining[0].name);
    }
  };

  // Undo / Redo handlers
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = () => {
    if (!canUndo) return;
    const prevIndex = historyIndex - 1;
    const prevElements = history[prevIndex];
    setHistoryIndex(prevIndex);
    store.updateProjectWireframe(project.id, prevElements, device, mode);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const nextIndex = historyIndex + 1;
    const nextElements = history[nextIndex];
    setHistoryIndex(nextIndex);
    store.updateProjectWireframe(project.id, nextElements, device, mode);
  };

  // Component operations
  const handleAddComponent = (def: ComponentDefinition) => {
    const newId = `elem-${def.type}-${Date.now()}`;
    const newElement = def.createDefaultElement(newId, elements.length * 100);
    const updated = [...elements, newElement];
    pushNewState(updated);
    setSelectedElementId(newId);
  };

  const handleUpdateElement = (updatedElement: WireframeElement) => {
    const updated = elements.map((el) => (el.id === updatedElement.id ? updatedElement : el));
    pushNewState(updated);
  };

  const handleDeleteElement = (id: string) => {
    const updated = elements.filter((el) => el.id !== id);
    pushNewState(updated);
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const handleDuplicateElement = (el: WireframeElement) => {
    const newId = `elem-${el.type}-${Date.now()}`;
    const duplicate: WireframeElement = {
      ...JSON.parse(JSON.stringify(el)),
      id: newId,
      y: (el.y || 0) + 40,
    };
    const index = elements.findIndex((item) => item.id === el.id);
    const updated = [...elements];
    updated.splice(index + 1, 0, duplicate);
    pushNewState(updated);
    setSelectedElementId(newId);
  };

  const handleMoveElement = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= elements.length) return;

    const updated = [...elements];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    pushNewState(updated);
  };

  // AI Regeneration
  const handleRegenerate = async (instruction: string, targetScope: string) => {
    setIsRegenerating(true);
    try {
      const result = await regenerateWireframePrompt(elements, instruction, targetScope);
      pushNewState(result.elements);
      store.saveVersion(project.id, `AI: ${instruction.slice(0, 30)}...`, instruction, result.elements);
    } catch (err) {
      console.error('Regeneration error:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Determine canvas frame sizing
  const getCanvasWidth = () => {
    if (device === 'mobile') return '375px';
    if (device === 'tablet') return '768px';
    return '100%';
  };

  const comments = store.getComments(project.id);
  const unresolvedComments = comments.filter((c) => !c.resolved).length;

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-100 overflow-hidden text-zinc-900">
      {/* Top Bar */}
      <EditorTopBar
        project={project}
        device={device}
        onDeviceChange={(d) => {
          setDevice(d);
          store.updateProjectWireframe(project.id, elements, d, mode);
        }}
        mode={mode}
        onModeChange={(m) => {
          setMode(m);
          store.updateProjectWireframe(project.id, elements, device, m);
        }}
        zoom={zoom}
        onZoomChange={setZoom}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenRegenerateModal={() => setIsRegenerateOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
        onOpenVersionModal={() => setIsVersionOpen(true)}
        onOpenShareModal={() => setIsShareOpen(true)}
        onOpenCommentsModal={() => setIsCommentsOpen(true)}
        onBackToDashboard={() => navigate('/dashboard')}
        saveStatus={saveStatus}
        unresolvedCommentCount={unresolvedComments}
      />

      {/* Main Workspace (Left Sidebar + Canvas Stage + Right Sidebar) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Component Library, Layers & Pages */}
        <ComponentLibrarySidebar
          onAddComponent={handleAddComponent}
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onMoveElement={handleMoveElement}
          onDeleteElement={handleDeleteElement}
          pages={pagesList}
          activePage={activePage}
          onSelectPage={handleSelectPage}
          onAddPage={handleAddPage}
        />

        {/* Center Canvas Stage */}
        <div
          id="canvas-viewport"
          onClick={() => setSelectedElementId(null)}
          className="flex-1 overflow-y-auto bg-zinc-200/70 p-6 md:p-8 flex flex-col items-center justify-start transition-all"
        >
          {/* Top Canvas Multi-Page Navigation Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl mb-4 bg-white/95 backdrop-blur-md border border-zinc-200/90 rounded-2xl p-2 shadow-xs flex flex-wrap items-center justify-between gap-3 select-none"
          >
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <div className="flex items-center gap-1 text-xs font-bold text-zinc-500 px-2 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Pages:</span>
              </div>

              {pagesList.map((pName) => (
                <div key={pName} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleSelectPage(pName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      activePage === pName
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span>{pName}</span>
                    {activePage === pName && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>

                  {pagesList.length > 1 && (
                    <button
                      type="button"
                      title={`Delete ${pName}`}
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete page "${pName}"?`)) {
                          handleDeletePage(pName);
                        }
                      }}
                      className="ml-0.5 p-1 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-zinc-100 transition text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const name = prompt('Enter new page name (e.g. Products, Cart, Checkout, Profile):');
                  if (name && name.trim()) handleAddPage(name.trim());
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-blue-600 hover:bg-blue-50 border border-dashed border-blue-300 flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Page</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>route: /{activePage.toLowerCase().replace(/\s+/g, '-')}</span>
            </div>
          </div>

          {/* Device Frame Wrapper */}
          <div
            className={`transition-all duration-200 shadow-xl rounded-2xl overflow-hidden bg-white ${
              device !== 'desktop'
                ? 'border-[10px] border-zinc-800 ring-1 ring-zinc-900/10'
                : 'border border-zinc-200 w-full max-w-6xl'
            }`}
            style={{
              width: getCanvasWidth(),
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Mobile / Tablet Simulated Status Header */}
            {device !== 'desktop' && (
              <div className="h-6 bg-zinc-800 text-white flex items-center justify-between px-6 text-[10px] font-mono select-none">
                <span>9:41</span>
                <div className="w-16 h-3 bg-zinc-900 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {/* Wireframe Canvas Elements */}
            <div className="w-full flex flex-col divide-y divide-zinc-200/50 min-h-[700px]">
              {elements.map((element, index) => (
                <CanvasElementRenderer
                  key={element.id}
                  element={element}
                  isSelected={element.id === selectedElementId}
                  mode={mode}
                  device={device}
                  brandPreset={project.brandPreset}
                  onSelect={() => setSelectedElementId(element.id)}
                  onDelete={() => handleDeleteElement(element.id)}
                  onDuplicate={() => handleDuplicateElement(element)}
                  onMoveUp={index > 0 ? () => handleMoveElement(index, 'up') : undefined}
                  onMoveDown={
                    index < elements.length - 1
                      ? () => handleMoveElement(index, 'down')
                      : undefined
                  }
                />
              ))}

              {elements.length === 0 && (
                <div className="py-24 text-center text-zinc-400 font-mono text-xs">
                  Canvas is empty. Drag or click components in the left library to start designing.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Properties Panel */}
        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
        />
      </div>

      {/* Modals */}
      <RegenerateModal
        isOpen={isRegenerateOpen}
        onClose={() => setIsRegenerateOpen(false)}
        onRegenerate={handleRegenerate}
        isProcessing={isRegenerating}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
      />

      <VersionHistoryModal
        isOpen={isVersionOpen}
        onClose={() => setIsVersionOpen(false)}
        project={project}
        onRestoreVersion={(newElements) => {
          pushNewState(newElements);
        }}
      />

      <CommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        project={project}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        project={project}
      />
    </div>
  );
};
