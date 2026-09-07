import React from 'react';
import { WireframeElement } from '../types';
import {
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Maximize2,
  Trash2,
  Copy,
  Layers,
  Palette,
} from 'lucide-react';

interface Props {
  selectedElement: WireframeElement | null;
  onUpdateElement: (updated: WireframeElement) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (element: WireframeElement) => void;
}

export const PropertiesPanel: React.FC<Props> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
}) => {
  if (!selectedElement) {
    return (
      <aside className="w-80 border-l border-zinc-200 bg-white flex flex-col items-center justify-center p-6 text-center text-zinc-400">
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3 text-zinc-400">
          <Sliders className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-zinc-700">No Component Selected</p>
        <p className="text-xs text-zinc-400 mt-1 max-w-[200px]">
          Click any component on the wireframe canvas to inspect and edit its layout, dimensions, typography, and styling.
        </p>
      </aside>
    );
  }

  const props = selectedElement.props || {};
  const style = selectedElement.style || {};

  const handlePropChange = (key: string, value: any) => {
    onUpdateElement({
      ...selectedElement,
      props: {
        ...selectedElement.props,
        [key]: value,
      },
    });
  };

  const handleStyleChange = (key: string, value: any) => {
    onUpdateElement({
      ...selectedElement,
      style: {
        ...selectedElement.style,
        [key]: value,
      },
    });
  };

  return (
    <aside className="w-80 border-l border-zinc-200 bg-white flex flex-col h-full overflow-y-auto text-zinc-900 shadow-2xs">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70 sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              {selectedElement.type}
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">ID: {selectedElement.id}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            title="Duplicate"
            onClick={() => onDuplicateElement(selectedElement)}
            className="p-1.5 hover:bg-zinc-200 rounded-md text-zinc-600"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Delete"
            onClick={() => onDeleteElement(selectedElement.id)}
            className="p-1.5 hover:bg-red-50 text-red-600 rounded-md"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6 text-xs">
        {/* Dimensions & Positioning */}
        <div>
          <div className="flex items-center space-x-1.5 text-zinc-500 font-bold uppercase tracking-wider text-[11px] mb-3">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Layout & Dimensions</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Width</label>
              <input
                type="text"
                value={selectedElement.width}
                onChange={(e) => onUpdateElement({ ...selectedElement, width: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Height (px)</label>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) =>
                  onUpdateElement({ ...selectedElement, height: parseInt(e.target.value) || 60 })
                }
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">X Position</label>
              <input
                type="number"
                value={selectedElement.x}
                onChange={(e) =>
                  onUpdateElement({ ...selectedElement, x: parseInt(e.target.value) || 0 })
                }
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Y Position</label>
              <input
                type="number"
                value={selectedElement.y}
                onChange={(e) =>
                  onUpdateElement({ ...selectedElement, y: parseInt(e.target.value) || 0 })
                }
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Component Text & Content Properties */}
        <div className="pt-4 border-t border-zinc-200">
          <div className="flex items-center space-x-1.5 text-zinc-500 font-bold uppercase tracking-wider text-[11px] mb-3">
            <Type className="w-3.5 h-3.5" />
            <span>Content & Text</span>
          </div>

          {(props.title !== undefined || props.heading !== undefined) && (
            <div className="mb-3">
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Heading / Title</label>
              <input
                type="text"
                value={props.title || props.heading || ''}
                onChange={(e) => {
                  if (props.title !== undefined) handlePropChange('title', e.target.value);
                  if (props.heading !== undefined) handlePropChange('heading', e.target.value);
                }}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}

          {(props.subtitle !== undefined || props.subheading !== undefined) && (
            <div className="mb-3">
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Subtitle / Tagline</label>
              <textarea
                rows={2}
                value={props.subtitle || props.subheading || ''}
                onChange={(e) => {
                  if (props.subtitle !== undefined) handlePropChange('subtitle', e.target.value);
                  if (props.subheading !== undefined) handlePropChange('subheading', e.target.value);
                }}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}

          {props.brandName !== undefined && (
            <div className="mb-3">
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Brand Name</label>
              <input
                type="text"
                value={props.brandName}
                onChange={(e) => handlePropChange('brandName', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}

          {props.badgeText !== undefined && (
            <div className="mb-3">
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Badge Text</label>
              <input
                type="text"
                value={props.badgeText}
                onChange={(e) => handlePropChange('badgeText', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}

          {props.primaryBtnText !== undefined && (
            <div className="mb-3">
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Primary Button Label</label>
              <input
                type="text"
                value={props.primaryBtnText}
                onChange={(e) => handlePropChange('primaryBtnText', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}

          {props.secondaryBtnText !== undefined && (
            <div className="mb-3">
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Secondary Button Label</label>
              <input
                type="text"
                value={props.secondaryBtnText}
                onChange={(e) => handlePropChange('secondaryBtnText', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}

          {props.ctaText !== undefined && (
            <div className="mb-3">
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">CTA Button Label</label>
              <input
                type="text"
                value={props.ctaText}
                onChange={(e) => handlePropChange('ctaText', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}

          {props.placeholder !== undefined && (
            <div className="mb-3">
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Search / Input Placeholder</label>
              <input
                type="text"
                value={props.placeholder}
                onChange={(e) => handlePropChange('placeholder', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Styling, Alignment & Spacing */}
        <div className="pt-4 border-t border-zinc-200">
          <div className="flex items-center space-x-1.5 text-zinc-500 font-bold uppercase tracking-wider text-[11px] mb-3">
            <Palette className="w-3.5 h-3.5" />
            <span>Styles & Appearance</span>
          </div>

          {/* Text Alignment */}
          <div className="mb-3">
            <label className="text-[11px] text-zinc-500 font-medium block mb-1.5">Text Alignment</label>
            <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => handleStyleChange('alignment', 'left')}
                className={`py-1 rounded-md flex items-center justify-center ${
                  style.alignment === 'left' ? 'bg-white shadow-xs text-zinc-900 font-bold' : 'text-zinc-500'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleStyleChange('alignment', 'center')}
                className={`py-1 rounded-md flex items-center justify-center ${
                  style.alignment === 'center' ? 'bg-white shadow-xs text-zinc-900 font-bold' : 'text-zinc-500'
                }`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleStyleChange('alignment', 'right')}
                className={`py-1 rounded-md flex items-center justify-center ${
                  style.alignment === 'right' ? 'bg-white shadow-xs text-zinc-900 font-bold' : 'text-zinc-500'
                }`}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Background Color */}
          <div className="mb-3">
            <label className="text-[11px] text-zinc-500 font-medium block mb-1">Background Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={style.backgroundColor || '#FFFFFF'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-7 h-7 rounded-md cursor-pointer border border-zinc-200 p-0"
              />
              <input
                type="text"
                value={style.backgroundColor || '#FFFFFF'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="flex-1 px-2.5 py-1.5 border border-zinc-200 rounded-md font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Padding & Radius */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Padding (px)</label>
              <input
                type="number"
                value={style.padding ?? 24}
                onChange={(e) => handleStyleChange('padding', parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 font-medium block mb-1">Radius (px)</label>
              <input
                type="number"
                value={style.borderRadius ?? 0}
                onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
