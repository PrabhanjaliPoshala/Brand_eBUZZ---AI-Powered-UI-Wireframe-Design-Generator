import React, { useState } from 'react';
import { Project } from '../../types';
import { Share2, X, Copy, Check, Globe, Lock, ExternalLink, Code2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ShareModal: React.FC<Props> = ({ isOpen, onClose, project }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [accessLevel, setAccessLevel] = useState<'public' | 'team' | 'password'>('public');

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/preview/${project.id}`;
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="800" frameborder="0"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">Share Wireframe Concept</h2>
              <p className="text-xs text-zinc-500">Provide client or teammate access to live preview</p>
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

        <div className="mt-5 space-y-4">
          {/* Access permissions */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Access Permission
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAccessLevel('public')}
                className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${
                  accessLevel === 'public'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Globe className="w-4 h-4 mb-1" />
                <span>Anyone with Link</span>
              </button>
              <button
                type="button"
                onClick={() => setAccessLevel('team')}
                className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${
                  accessLevel === 'team'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Lock className="w-4 h-4 mb-1" />
                <span>Team Members</span>
              </button>
              <button
                type="button"
                onClick={() => setAccessLevel('password')}
                className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${
                  accessLevel === 'password'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Lock className="w-4 h-4 mb-1" />
                <span>Restricted</span>
              </button>
            </div>
          </div>

          {/* Share Link */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Direct Preview URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-600"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Embed snippet */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Embed IFrame Snippet
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={embedCode}
                className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-600 truncate"
              />
              <button
                type="button"
                onClick={handleCopyEmbed}
                className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-bold flex items-center space-x-1.5"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code2 className="w-3.5 h-3.5" />}
                <span>{copiedEmbed ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
