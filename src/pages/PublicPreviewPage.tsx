import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, DeviceType } from '../types';
import { store } from '../services/store';
import { CanvasElementRenderer } from '../components/CanvasElementRenderer';
import {
  Monitor,
  Tablet,
  Smartphone,
  Layout,
  Eye,
  Download,
  ArrowLeft,
  Sparkles,
  Layers,
} from 'lucide-react';
import { downloadHtml, downloadJson } from '../services/exporter';
import { SAMPLE_DEMO_PROJECT_ID } from '../data/sampleDemoProject';

export const PublicPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const id = projectId || SAMPLE_DEMO_PROJECT_ID;
  const project = store.getProjectById(id);

  const [device, setDevice] = useState<DeviceType>('desktop');
  const [mode, setMode] = useState<'wireframe' | 'preview'>('preview');
  const [activePage, setActivePage] = useState<string>(() => project?.activePageName || 'Home');

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Concept Not Found</h2>
        <p className="text-sm text-zinc-500 mb-6">This wireframe preview link is invalid or expired.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg"
        >
          Go to Platform
        </button>
      </div>
    );
  }

  const pages = project.pages || [{ name: 'Home', elements: project.wireframe.elements }];
  const currentPageObj = pages.find((p) => p.name === activePage) || pages[0];
  const elements = currentPageObj?.elements || project.wireframe.elements;

  const getCanvasWidth = () => {
    if (device === 'mobile') return '375px';
    if (device === 'tablet') return '768px';
    return '100%';
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col text-zinc-900">
      {/* Top Banner */}
      <header className="h-14 border-b border-zinc-200 bg-white px-6 flex items-center justify-between shadow-2xs sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/projects/${project.id}/editor`)}
            className="text-xs text-blue-600 hover:underline flex items-center space-x-1 font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Open in Editor</span>
          </button>
          <div className="h-4 w-px bg-zinc-200" />
          <div>
            <h1 className="text-sm font-bold text-zinc-900">{project.name}</h1>
            <span className="text-[10px] text-zinc-400 font-mono">Live Interactive Preview</span>
          </div>
        </div>

        {/* Device and Mode Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-md text-xs font-semibold ${
                device === 'desktop' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-md text-xs font-semibold ${
                device === 'tablet' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-md text-xs font-semibold ${
                device === 'mobile' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button
              type="button"
              onClick={() => setMode('wireframe')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center space-x-1 ${
                mode === 'wireframe' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
              }`}
            >
              <Layout className="w-3 h-3" />
              <span>Wireframe</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center space-x-1 ${
                mode === 'preview' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-zinc-500'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Realistic</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => downloadHtml(project)}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
          >
            <Download className="w-3 h-3" />
            <span>Export HTML</span>
          </button>
        </div>
      </header>

      {/* Canvas Viewport */}
      <main className="flex-1 p-6 md:p-10 flex flex-col items-center justify-start overflow-y-auto">
        {pages.length > 1 && (
          <div className="w-full max-w-6xl mb-4 bg-white border border-zinc-200 rounded-2xl p-2 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <div className="flex items-center gap-1 text-xs font-bold text-zinc-500 px-2 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Pages:</span>
              </div>
              {pages.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setActivePage(p.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activePage === p.name
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-mono text-zinc-400 pr-2">
              /{activePage.toLowerCase().replace(/\s+/g, '-')}
            </span>
          </div>
        )}

        <div
          className={`transition-all duration-200 shadow-xl rounded-2xl overflow-hidden bg-white ${
            device !== 'desktop'
              ? 'border-[10px] border-zinc-800 ring-1 ring-zinc-900/10'
              : 'border border-zinc-200 w-full max-w-6xl'
          }`}
          style={{ width: getCanvasWidth() }}
        >
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

          <div className="w-full flex flex-col divide-y divide-zinc-200/50">
            {elements.map((element) => (
              <CanvasElementRenderer
                key={element.id}
                element={element}
                isSelected={false}
                mode={mode}
                device={device}
                brandPreset={project.brandPreset}
                onSelect={() => {}}
                onDelete={() => {}}
                onDuplicate={() => {}}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
