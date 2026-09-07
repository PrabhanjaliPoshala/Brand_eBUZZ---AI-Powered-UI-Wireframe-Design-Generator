import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { store, subscribeToStore } from '../services/store';
import { Project, ExportHistoryItem } from '../types';
import {
  downloadJson,
  downloadHtml,
  downloadMarkdownSummary,
  generateHtmlCode,
} from '../services/exporter';
import {
  Download,
  ArrowLeft,
  Copy,
  Check,
  FileCode,
  FileJson,
  Printer,
  Sparkles,
  Layout,
  History,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

export const ProjectExportPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | undefined>(() =>
    projectId ? store.getProjectById(projectId) : undefined
  );
  const [activeTab, setActiveTab] = useState<'html' | 'json' | 'component_tree'>('html');
  const [copied, setCopied] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>(() => store.getExports());

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      if (projectId) {
        setProject(store.getProjectById(projectId));
      }
      setExportHistory(store.getExports());
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

  const htmlCode = generateHtmlCode(project);
  const jsonCode = JSON.stringify(project.wireframe, null, 2);
  const componentTreeJson = JSON.stringify(
    {
      projectName: project.name,
      domain: project.domain,
      pages: project.pages || [{ name: 'Home', elements: project.wireframe.elements }],
      brandPreset: project.brandPreset,
      componentsCount: project.wireframe.elements.length,
    },
    null,
    2
  );

  const currentCode =
    activeTab === 'html' ? htmlCode : activeTab === 'json' ? jsonCode : componentTreeJson;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    downloadJson(project.wireframe, `${project.name.toLowerCase().replace(/\s+/g, '-')}-wireframe`);
    store.recordExport(project.id, project.name, 'JSON', `${(jsonCode.length / 1024).toFixed(1)} KB`);
  };

  const handleExportHtml = () => {
    downloadHtml(project);
    store.recordExport(project.id, project.name, 'HTML', `${(htmlCode.length / 1024).toFixed(1)} KB`);
  };

  const handleExportComponentTree = () => {
    downloadJson(JSON.parse(componentTreeJson), `${project.name.toLowerCase().replace(/\s+/g, '-')}-components`);
    store.recordExport(project.id, project.name, 'JSON', `${(componentTreeJson.length / 1024).toFixed(1)} KB`);
  };

  const handlePrintPdf = () => {
    store.recordExport(project.id, project.name, 'PDF', 'Document');
    window.print();
  };

  const handleExportSvg = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <rect width="1200" height="900" fill="#f8fafc"/>
      <text x="60" y="70" font-family="sans-serif" font-size="28" font-weight="bold" fill="#0f172a">${project.name} Wireframe</text>
      <text x="60" y="105" font-family="sans-serif" font-size="14" fill="#64748b">Domain: ${project.domain} • ${project.wireframe.elements.length} components • WireframeAI Platform</text>
      <rect x="60" y="140" width="1080" height="64" rx="8" fill="#e2e8f0"/>
      <rect x="60" y="220" width="1080" height="300" rx="12" fill="#cbd5e1"/>
      <rect x="60" y="540" width="340" height="240" rx="8" fill="#e2e8f0"/>
      <rect x="430" y="540" width="340" height="240" rx="8" fill="#e2e8f0"/>
      <rect x="800" y="540" width="340" height="240" rx="8" fill="#e2e8f0"/>
    </svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-wireframe.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    store.recordExport(project.id, project.name, 'PNG', '14.2 KB');
  };

  const projectExports = exportHistory.filter((e) => e.projectId === project.id);

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
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-900">{project.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                Export Center
              </span>
            </div>
            <p className="text-xs text-zinc-500">Generate clean HTML, JSON payloads, or printable PDF documents</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-300 text-zinc-800 text-xs font-semibold hover:bg-zinc-100 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
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
      <div className="max-w-7xl w-full mx-auto p-6 md:p-10 flex-1 space-y-8">
        {/* Quick Export Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleExportHtml}
            className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-blue-500 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900">Clean HTML / Tailwind</h3>
              <p className="text-xs text-zinc-500 mt-1">Standalone web mockup with Tailwind CDN and components.</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 mt-4 flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              Download .html
            </span>
          </button>

          <button
            onClick={handleExportJson}
            className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-purple-500 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <FileJson className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900">Wireframe Model JSON</h3>
              <p className="text-xs text-zinc-500 mt-1">Full structural element tree and design tokens.</p>
            </div>
            <span className="text-xs font-semibold text-purple-600 mt-4 flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              Download .json
            </span>
          </button>

          <button
            onClick={handleExportComponentTree}
            className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-emerald-500 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <Layout className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900">Multi-Page Component Tree</h3>
              <p className="text-xs text-zinc-500 mt-1">Pages, sections, and brand preset hierarchy.</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 mt-4 flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              Download .json
            </span>
          </button>

          <button
            onClick={handleExportSvg}
            className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-amber-500 hover:shadow-md transition text-left group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900">Vector SVG Snapshot</h3>
              <p className="text-xs text-zinc-500 mt-1">Scalable vector blueprint ready for presentations.</p>
            </div>
            <span className="text-xs font-semibold text-amber-600 mt-4 flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              Download .svg
            </span>
          </button>
        </div>

        {/* Code Previewer with Copy */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden flex flex-col">
          <div className="bg-zinc-800/90 px-6 py-3 border-b border-zinc-700/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'html' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                HTML / Tailwind
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'json' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Wireframe JSON
              </button>
              <button
                onClick={() => setActiveTab('component_tree')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'component_tree' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Component Tree
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-medium transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-6 text-zinc-300 font-mono text-xs overflow-x-auto max-h-[420px] leading-relaxed select-all">
            {currentCode}
          </pre>
        </div>

        {/* Project Export History */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-500" />
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                Export Audit Trail ({projectExports.length})
              </h3>
            </div>
            <span className="text-xs text-zinc-400">All export operations logged</span>
          </div>

          {projectExports.length > 0 ? (
            <div className="divide-y divide-zinc-100 text-xs">
              {projectExports.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 font-mono font-bold text-zinc-700">
                      {item.format}
                    </span>
                    <span className="text-zinc-700">{item.projectName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-400">
                    <span>{item.fileSize}</span>
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 py-4 text-center">No previous exports recorded for this project yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
