import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const BrandLockup: React.FC<Props> = ({ compact = false }) => (
  <div className="flex items-center gap-2.5">
    <div className={`${compact ? 'h-8 w-8' : 'h-9 w-9'} flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm`}>
      <Sparkles className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
    </div>
    <div className="min-w-0">
      <span className={`${compact ? 'text-sm' : 'text-base'} block truncate font-extrabold leading-tight tracking-tight text-zinc-900`}>
        Automated Web Design Assistant
      </span>
      <span className="block truncate text-[10px] font-bold uppercase tracking-wider text-blue-600">
        AI-Driven Wireframe Generator
      </span>
    </div>
  </div>
);
