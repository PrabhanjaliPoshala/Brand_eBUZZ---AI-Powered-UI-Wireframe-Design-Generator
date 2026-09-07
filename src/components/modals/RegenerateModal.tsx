import React, { useState } from 'react';
import { Sparkles, X, Wand2, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: (instruction: string, targetScope: string) => Promise<void>;
  isProcessing: boolean;
}

const SAMPLE_PROMPTS = [
  'Make the hero section smaller and add a search bar underneath',
  'Change to a dark modern aesthetic with high-contrast elements',
  'Add customer testimonials and a transparent 3-tier pricing table',
  'Add an exclusive offers banner with coupon code and voucher claim CTA',
  'Add weekly analytics KPI statistics cards and growth charts',
];

export const RegenerateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onRegenerate,
  isProcessing,
}) => {
  const [instruction, setInstruction] = useState('');
  const [targetScope, setTargetScope] = useState('entire_page');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;
    await onRegenerate(instruction, targetScope);
    setInstruction('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-zinc-200">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">AI Layout Regeneration</h2>
              <p className="text-xs text-zinc-500">Provide natural language instructions to morph the wireframe</p>
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Target Scope
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetScope('entire_page')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                  targetScope === 'entire_page'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                Entire Screen / Page
              </button>
              <button
                type="button"
                onClick={() => setTargetScope('selected_section')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                  targetScope === 'selected_section'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                Selected Section Only
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Regeneration Prompt
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g., Make the hero section more compact, introduce a restaurant search bar, and add an offers banner..."
              className="w-full p-3 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-zinc-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Quick Suggestions
            </label>
            <div className="space-y-1.5">
              {SAMPLE_PROMPTS.map((prompt, idx) => (
                <div
                  key={idx}
                  onClick={() => setInstruction(prompt)}
                  className="p-2 bg-zinc-50 hover:bg-blue-50/50 hover:border-blue-200 border border-zinc-200 rounded-lg text-xs text-zinc-700 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <Wand2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !instruction.trim()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Regenerate Layout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
