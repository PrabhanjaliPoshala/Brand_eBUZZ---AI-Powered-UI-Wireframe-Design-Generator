import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project, DeviceType } from '../types';
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Download,
  History,
  Share2,
  Check,
  ChevronDown,
  ArrowLeft,
  FileCode,
  FileSpreadsheet,
  FileText,
  Eye,
  Layout,
  MessageSquare,
  Cpu,
} from 'lucide-react';
import { BrandLockup } from './BrandLockup';

interface Props {
  project: Project;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  mode: 'wireframe' | 'preview';
  onModeChange: (mode: 'wireframe' | 'preview') => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenRegenerateModal: () => void;
  onOpenExportModal: () => void;
  onOpenVersionModal: () => void;
  onOpenShareModal: () => void;
  onOpenCommentsModal: () => void;
  onBackToDashboard: () => void;
  saveStatus: 'saved' | 'saving';
  unresolvedCommentCount?: number;
}

export const EditorTopBar: React.FC<Props> = ({
  project,
  device,
  onDeviceChange,
  mode,
  onModeChange,
  zoom,
  onZoomChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenRegenerateModal,
  onOpenExportModal,
  onOpenVersionModal,
  onOpenShareModal,
  onOpenCommentsModal,
  onBackToDashboard,
  saveStatus,
  unresolvedCommentCount = 0,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="h-14 border-b border-zinc-200 bg-white px-4 flex items-center justify-between select-none shadow-2xs z-30 shrink-0">
      {/* Left: Back & Project Title */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onBackToDashboard}
          title="Back to Projects"
          className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-zinc-200" />
        <BrandLockup compact />

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-extrabold text-zinc-900 tracking-tight max-w-[200px] truncate">
              {project.name}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              {project.domain.replace('_', ' ')}
            </span>
            <Link
              to={`/projects/${project.id}/analysis`}
              title="Review AI Requirement Analysis & Spec"
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-zinc-600 hover:text-blue-600 hover:bg-blue-50 border border-zinc-200 flex items-center gap-1 transition"
            >
              <Cpu className="w-3 h-3 text-blue-600" />
              <span className="hidden sm:inline">AI Analysis</span>
            </Link>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-zinc-400">
            {saveStatus === 'saving' ? (
              <span className="text-amber-600 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Saving changes...</span>
              </span>
            ) : (
              <span className="text-emerald-600 flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>All changes saved</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle: Device & Mode Switcher & Undo/Redo & Zoom */}
      <div className="flex items-center space-x-3">
        <span className="hidden text-xs font-semibold text-zinc-500 xl:inline">Msoft Technologies</span>
        {/* Device Switcher */}
        <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
          <button
            type="button"
            title="Desktop (1200px)"
            onClick={() => onDeviceChange('desktop')}
            className={`p-1.5 rounded-md flex items-center space-x-1 text-xs font-semibold transition-all ${
              device === 'desktop'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">1200px</span>
          </button>
          <button
            type="button"
            title="Tablet (768px)"
            onClick={() => onDeviceChange('tablet')}
            className={`p-1.5 rounded-md flex items-center space-x-1 text-xs font-semibold transition-all ${
              device === 'tablet'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">768px</span>
          </button>
          <button
            type="button"
            title="Mobile (375px)"
            onClick={() => onDeviceChange('mobile')}
            className={`p-1.5 rounded-md flex items-center space-x-1 text-xs font-semibold transition-all ${
              device === 'mobile'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">375px</span>
          </button>
        </div>

        <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

        {/* Mode Switcher: Wireframe vs Realistic Preview */}
        <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
          <button
            type="button"
            onClick={() => onModeChange('wireframe')}
            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              mode === 'wireframe'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Wireframe</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('preview')}
            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              mode === 'preview'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        <div className="h-4 w-px bg-zinc-200 hidden md:block" />

        {/* Undo / Redo */}
        <div className="hidden md:flex items-center space-x-1">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo"
            className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo"
            className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-zinc-200 hidden lg:block" />

        {/* Zoom Controls */}
        <div className="hidden lg:flex items-center space-x-1 text-xs text-zinc-600">
          <button
            type="button"
            title="Zoom Out"
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
            className="p-1 hover:bg-zinc-100 rounded-md"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            title="Zoom In"
            onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))}
            className="p-1 hover:bg-zinc-100 rounded-md"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: AI Regenerate, Versions, Export, Comments, Share */}
      <div className="flex items-center space-x-2">
        {/* AI Regenerate Prompt Button */}
        <button
          type="button"
          onClick={onOpenRegenerateModal}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Regenerate</span>
        </button>

        {/* Version History Button */}
        <button
          type="button"
          onClick={onOpenVersionModal}
          title="Version History"
          className="p-1.5 hover:bg-zinc-100 text-zinc-700 rounded-lg flex items-center space-x-1 text-xs font-medium"
        >
          <History className="w-4 h-4" />
          <span className="hidden xl:inline">History</span>
        </button>

        {/* Comments Collaboration Button */}
        <button
          type="button"
          onClick={onOpenCommentsModal}
          title="Team Comments & Feedback"
          className="relative p-1.5 hover:bg-zinc-100 text-zinc-700 rounded-lg flex items-center space-x-1 text-xs font-medium"
        >
          <MessageSquare className="w-4 h-4" />
          {unresolvedCommentCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
              {unresolvedCommentCount}
            </span>
          )}
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={onOpenShareModal}
          title="Share Project"
          className="p-1.5 hover:bg-zinc-100 text-zinc-700 rounded-lg flex items-center space-x-1 text-xs font-medium"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden xl:inline">Share</span>
        </button>

        {/* Export Dropdown / Modal Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => onOpenExportModal()}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
