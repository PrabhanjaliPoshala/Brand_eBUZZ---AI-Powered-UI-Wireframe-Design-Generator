import React from 'react';
import {
  WireframeElement,
  DeviceType,
  BrandPreset,
} from '../types';
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Utensils,
  Search,
  Star,
  Clock,
  Tag,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  ChevronRight,
  User,
  PieChart,
} from 'lucide-react';

interface Props {
  element: WireframeElement;
  isSelected: boolean;
  mode: 'wireframe' | 'preview';
  device: DeviceType;
  brandPreset: BrandPreset;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const CanvasElementRenderer: React.FC<Props> = ({
  element,
  isSelected,
  mode,
  device,
  brandPreset,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}) => {
  const isWireframe = mode === 'wireframe';
  const primaryColor = brandPreset?.primaryColor || '#2563EB';
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';

  return (
    <div
      id={`canvas-elem-${element.id}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`relative group transition-all duration-150 cursor-pointer ${
        isSelected
          ? 'ring-2 ring-blue-600 ring-offset-2 z-20 shadow-md'
          : 'hover:ring-1 hover:ring-zinc-300'
      }`}
      style={{
        width: typeof element.width === 'number' ? `${element.width}px` : element.width,
        minHeight: typeof element.height === 'number' ? `${element.height}px` : element.height,
        backgroundColor: isWireframe
          ? '#FFFFFF'
          : element.style?.backgroundColor || '#FFFFFF',
        borderColor: isWireframe ? '#E4E4E7' : element.style?.borderColor || 'transparent',
      }}
    >
      {/* Floating Action Controls on Selection */}
      {isSelected && (
        <div className="absolute -top-9 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md flex items-center space-x-2 z-30">
          <span className="uppercase tracking-wider text-[10px] font-mono">
            {element.type} • {element.height}px
          </span>
          <div className="flex items-center space-x-1 pl-1 border-l border-blue-400">
            {onMoveUp && (
              <button
                type="button"
                title="Move Up"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp();
                }}
                className="p-1 hover:bg-blue-700 rounded-xs"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
            )}
            {onMoveDown && (
              <button
                type="button"
                title="Move Down"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown();
                }}
                className="p-1 hover:bg-blue-700 rounded-xs"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            )}
            <button
              type="button"
              title="Duplicate"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="p-1 hover:bg-blue-700 rounded-xs"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              type="button"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 hover:bg-red-600 rounded-xs text-red-100"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Render Component Content */}
      <div className="w-full h-full">
        {renderComponentBody(element, isWireframe, primaryColor, isMobile, isTablet)}
      </div>
    </div>
  );
};

function renderComponentBody(
  element: WireframeElement,
  isWireframe: boolean,
  primaryColor: string,
  isMobile: boolean,
  _isTablet: boolean
) {
  const props = element.props || {};

  // 1. NAVBAR
  if (element.type === 'navbar') {
    if (isWireframe) {
      return (
        <div className="w-full border-b border-zinc-300 bg-zinc-100/70 px-6 py-4 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-md bg-zinc-300 flex items-center justify-center font-bold text-zinc-600">
              LOGO
            </div>
            <span className="font-bold text-zinc-700 text-sm tracking-tight">
              {props.brandName || 'BrandLogo'}
            </span>
          </div>
          {!isMobile && (
            <div className="flex items-center space-x-6 text-zinc-500">
              {(props.links || ['Home', 'Features', 'Pricing']).map((l: string, i: number) => (
                <span key={i} className="hover:text-zinc-800">
                  {l}
                </span>
              ))}
            </div>
          )}
          <div className="px-3 py-1.5 border border-zinc-400 rounded-md text-zinc-600 bg-white font-medium">
            {props.ctaText || 'Action'}
          </div>
        </div>
      );
    }

    return (
      <header className="w-full bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Utensils className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-zinc-900 text-lg tracking-tight">
              {props.brandName || 'BrandLogo'}
            </span>
          </div>
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-6 pl-4 border-l border-zinc-200">
              {(props.links || ['Restaurants', 'Deals', 'Track Order']).map((l: string, i: number) => (
                <span
                  key={i}
                  className="text-zinc-600 hover:text-zinc-900 text-sm font-medium transition-colors"
                >
                  {l}
                </span>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {props.showLocation && (
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-zinc-100 rounded-full text-xs text-zinc-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{props.currentLocation || 'San Francisco, CA'}</span>
            </div>
          )}
          <button
            type="button"
            className="px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            {props.ctaText || 'Sign In'}
          </button>
        </div>
      </header>
    );
  }

  // 2. HERO
  if (element.type === 'hero') {
    if (isWireframe) {
      return (
        <div className="w-full py-16 px-6 border-b border-zinc-300 bg-zinc-50 flex flex-col items-center justify-center text-center font-mono">
          <div className="w-48 h-6 bg-zinc-200 rounded-sm mb-4 flex items-center justify-center text-[10px] text-zinc-500">
            [PROMO BADGE PLACEHOLDER]
          </div>
          <div className="w-3/4 max-w-2xl h-10 bg-zinc-300 rounded-sm mb-3 flex items-center justify-center font-bold text-zinc-700 text-sm">
            {props.title || '[HERO HEADLINE TEXT]'}
          </div>
          <div className="w-2/3 max-w-xl h-6 bg-zinc-200 rounded-sm mb-8 flex items-center justify-center text-xs text-zinc-600">
            {props.subtitle || '[Hero supporting descriptive subtitle copy]'}
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-36 h-10 bg-zinc-800 rounded-md flex items-center justify-center text-white text-xs font-bold">
              {props.primaryBtnText || '[PRIMARY CTA]'}
            </div>
            <div className="w-32 h-10 border border-zinc-400 bg-white rounded-md flex items-center justify-center text-zinc-700 text-xs font-semibold">
              {props.secondaryBtnText || '[SECONDARY CTA]'}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full py-16 px-6 bg-gradient-to-b from-orange-50/50 to-white border-b border-zinc-200 flex flex-col items-center text-center">
        {props.badgeText && (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-5 shadow-2xs border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{props.badgeText}</span>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight max-w-3xl leading-tight mb-4">
          {props.title || 'Delicious Meals Delivered in Minutes'}
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mb-8 leading-relaxed">
          {props.subtitle || 'Order from over 1,200+ neighborhood kitchens with instant contactless drop-off.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-3 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            style={{ backgroundColor: primaryColor }}
          >
            <span>{props.primaryBtnText || 'Find Food Nearby'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          {props.secondaryBtnText && (
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-3 bg-white text-zinc-800 font-semibold text-sm rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors shadow-xs"
            >
              {props.secondaryBtnText}
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. SEARCH BAR
  if (element.type === 'search') {
    if (isWireframe) {
      return (
        <div className="w-full py-6 px-6 border-b border-zinc-200 bg-white font-mono">
          <div className="max-w-2xl mx-auto flex items-center space-x-2">
            <div className="flex-1 h-11 border-2 border-dashed border-zinc-300 rounded-lg px-4 flex items-center text-xs text-zinc-400">
              [Search Input: {props.placeholder || 'Enter search query...'}]
            </div>
            <div className="w-24 h-11 bg-zinc-300 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-700">
              {props.buttonText || 'SEARCH'}
            </div>
          </div>
          {props.popularTags && (
            <div className="max-w-2xl mx-auto flex items-center space-x-2 mt-3 text-[11px] text-zinc-400">
              <span>Tags:</span>
              {props.popularTags.slice(0, 4).map((t: string, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-zinc-100 rounded-xs border border-zinc-200 text-zinc-600">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="w-full py-8 px-6 bg-white border-b border-zinc-200">
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-sm rounded-2xl overflow-hidden border border-zinc-300 focus-within:ring-2 focus-within:ring-blue-500">
            <div className="pl-4 text-zinc-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              readOnly
              value={props.placeholder || 'Enter your delivery address or postal code...'}
              className="w-full py-3.5 pl-3 pr-32 text-zinc-800 text-sm focus:outline-hidden bg-transparent"
            />
            <button
              type="button"
              className="absolute right-1.5 px-5 py-2.5 text-white text-xs font-bold rounded-xl shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              {props.buttonText || 'Search'}
            </button>
          </div>
          {props.popularTags && (
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-700">Trending:</span>
              {props.popularTags.map((t: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-medium cursor-pointer transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. RESTAURANT GRID / PRODUCT GRID
  if (element.type === 'restaurant_grid' || element.type === 'product_grid') {
    const isRestaurant = element.type === 'restaurant_grid';
    const items = isRestaurant
      ? props.restaurants || [
          { name: 'Bella Stone Pizza', cuisine: 'Italian', rating: 4.9, deliveryTime: '20m', badge: 'Popular' },
          { name: 'Umami Ramen House', cuisine: 'Japanese', rating: 4.8, deliveryTime: '30m', badge: 'Top Rated' },
          { name: 'Green Garden Bowls', cuisine: 'Vegan', rating: 4.7, deliveryTime: '25m', badge: 'Healthy' },
        ]
      : props.products || [
          { name: 'Minimalist Desk Chair', price: '$240', category: 'Furniture', rating: 4.9 },
          { name: 'Studio LED Desk Lamp', price: '$85', category: 'Lighting', rating: 4.8 },
          { name: 'Ceramic Work Planter', price: '$42', category: 'Accessories', rating: 5.0 },
        ];

    if (isWireframe) {
      return (
        <div className="w-full py-10 px-6 border-b border-zinc-300 bg-white font-mono">
          <div className="mb-6 text-center">
            <div className="h-6 w-64 bg-zinc-300 rounded-sm mx-auto mb-2 flex items-center justify-center text-xs font-bold text-zinc-700">
              [GRID TITLE: {props.heading || 'Catalog Grid'}]
            </div>
            <div className="h-4 w-96 bg-zinc-100 rounded-sm mx-auto flex items-center justify-center text-[10px] text-zinc-400">
              [Subheading and filters placeholder]
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {items.slice(0, isMobile ? 1 : 3).map((item: any, i: number) => (
              <div key={i} className="border-2 border-dashed border-zinc-300 rounded-xl p-4 bg-zinc-50">
                <div className="w-full h-32 bg-zinc-200 rounded-lg flex items-center justify-center text-xs text-zinc-500 font-bold mb-3">
                  [IMAGE PLACEHOLDER]
                </div>
                <div className="h-4 w-3/4 bg-zinc-300 rounded-xs mb-2"></div>
                <div className="h-3 w-1/2 bg-zinc-200 rounded-xs mb-4"></div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                  <div className="h-4 w-16 bg-zinc-300 rounded-xs"></div>
                  <div className="h-6 w-16 bg-zinc-400 rounded-sm"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full py-12 px-6 bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              {props.heading || 'Featured Spots'}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {props.subheading || 'Curated options recommended by our team'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.slice(0, isMobile ? 1 : 3).map((item: any, i: number) => (
              <div
                key={i}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all p-4 flex flex-col"
              >
                <div className="relative w-full h-40 bg-zinc-100 rounded-xl overflow-hidden flex items-center justify-center text-zinc-400 mb-4">
                  <div className="flex flex-col items-center">
                    {isRestaurant ? (
                      <Utensils className="w-8 h-8 text-zinc-300 mb-1" />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-zinc-300 mb-1" />
                    )}
                    <span className="text-xs font-medium text-zinc-400">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-xs text-xs font-bold text-zinc-800 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="font-bold text-zinc-900 text-base">{item.name}</h3>
                  <div className="flex items-center space-x-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{item.rating || '4.9'}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mb-3">{item.cuisine || item.category || 'Specialty'}</p>
                <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-zinc-600">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{item.deliveryTime || item.price || '$25.00'}</span>
                  </div>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 bg-zinc-900 text-white font-semibold rounded-lg hover:bg-zinc-800 transition-colors text-xs shadow-2xs"
                  >
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 5. OFFERS BANNER
  if (element.type === 'offers_banner') {
    if (isWireframe) {
      return (
        <div className="w-full py-8 px-6 bg-zinc-100 border-2 border-dashed border-zinc-300 font-mono text-center">
          <div className="font-bold text-sm text-zinc-700 mb-1">[OFFERS BANNER PLACEHOLDER]</div>
          <div className="text-xs text-zinc-500">{props.title} • {props.discount}</div>
        </div>
      );
    }

    return (
      <div className="w-full py-8 px-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-amber-200">Exclusive Promo</div>
              <h3 className="text-xl sm:text-2xl font-black">{props.title || 'Get 40% Off First 3 Orders'}</h3>
              <p className="text-xs text-amber-100 mt-0.5">{props.description || 'Apply code at checkout.'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-4 py-2 bg-black/25 font-mono text-sm font-bold tracking-wider rounded-lg border border-white/20">
              {props.code || 'FEAST40'}
            </span>
            <button
              type="button"
              className="px-4 py-2 bg-white text-orange-700 text-xs font-bold rounded-lg shadow-sm hover:bg-zinc-100"
            >
              {props.cta || 'Claim Voucher'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. STATISTICS CARDS
  if (element.type === 'statistics_card') {
    const stats = props.stats || [
      { label: 'Active Deployments', value: '42,000+', change: '+18%' },
      { label: 'Avg Latency', value: '14ms', change: 'Optimized' },
      { label: 'Satisfaction Score', value: '99.4%', change: 'Top 1%' },
    ];

    if (isWireframe) {
      return (
        <div className="w-full py-6 px-6 bg-white border-b border-zinc-200 font-mono">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {stats.map((s: any, i: number) => (
              <div key={i} className="border border-zinc-300 p-3 rounded-lg bg-zinc-50">
                <div className="h-3 w-16 bg-zinc-300 rounded-xs mb-2"></div>
                <div className="text-lg font-bold text-zinc-800">{s.value}</div>
                <div className="text-[10px] text-zinc-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full py-8 px-6 bg-white border-b border-zinc-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {stats.map((s: any, i: number) => (
            <div key={i} className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-zinc-500">{s.label}</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-zinc-900 tracking-tight">{s.value}</div>
              <div className="text-[11px] font-semibold text-emerald-600 mt-1">{s.change}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 7. TESTIMONIALS
  if (element.type === 'testimonials') {
    const items = props.items || [
      { quote: 'Unparalleled platform for rapid prototyping.', author: 'Alex Chen', role: 'Staff Engineer' },
      { quote: 'Saved our team 40 hours during sprint planning.', author: 'Elena Diaz', role: 'Head of Product' },
    ];

    if (isWireframe) {
      return (
        <div className="w-full py-8 px-6 bg-zinc-50 border-b border-zinc-300 font-mono">
          <div className="text-center font-bold text-zinc-700 text-sm mb-6">[TESTIMONIALS SECTION]</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {items.map((t: any, i: number) => (
              <div key={i} className="border border-zinc-300 p-4 rounded-lg bg-white">
                <div className="h-3 w-20 bg-zinc-200 mb-2"></div>
                <div className="text-xs text-zinc-600 mb-4">"{t.quote}"</div>
                <div className="text-[11px] font-bold text-zinc-700">{t.author}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full py-12 px-6 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mb-2">
            {props.heading || 'Loved by Product Teams'}
          </h2>
          <p className="text-zinc-500 text-sm mb-8">{props.subheading || 'Real feedback from our daily users'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {items.map((t: any, i: number) => (
              <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center space-x-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center space-x-3 pt-3 border-t border-zinc-100">
                  <div className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">{t.author}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 8. PRICING
  if (element.type === 'pricing') {
    if (isWireframe) {
      return (
        <div className="w-full py-10 px-6 bg-white border-b border-zinc-300 font-mono text-center">
          <div className="text-sm font-bold text-zinc-700 mb-6">[PRICING TIERS: Free / Pro / Enterprise]</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {['Starter', 'Professional', 'Enterprise'].map((tier, i) => (
              <div key={i} className="border-2 border-zinc-300 p-4 rounded-lg bg-zinc-50 text-left">
                <div className="font-bold text-zinc-800 text-sm mb-1">{tier}</div>
                <div className="text-lg font-bold text-zinc-900 mb-4">{i === 0 ? '$0' : i === 1 ? '$29' : '$99'}</div>
                <div className="h-7 bg-zinc-300 rounded-xs mb-3"></div>
                <div className="space-y-1 text-[10px] text-zinc-500">
                  <div>• Feature A included</div>
                  <div>• Feature B included</div>
                  <div>• Priority support</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full py-14 px-6 bg-white border-b border-zinc-200">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-zinc-900 mb-2">{props.heading || 'Transparent Pricing'}</h2>
          <p className="text-zinc-500 text-sm mb-10">{props.subheading || 'Choose the right plan for your team'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              { name: 'Starter', price: '$0', desc: 'For individuals and exploration', features: ['3 Active Projects', 'Standard AI Generation', 'JSON Export', 'Community Support'] },
              { name: 'Professional', price: '$29', popular: true, desc: 'For growing teams and studios', features: ['Unlimited Projects', 'Priority AI Engine', 'All Export Formats', 'Version Restore', 'Custom Brand Presets'] },
              { name: 'Enterprise', price: '$99', desc: 'For organizations with compliance needs', features: ['Dedicated SLA', 'SSO & Role Control', 'Custom AI Rules', 'Audit Logs Access', '1-on-1 Onboarding'] },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 border flex flex-col ${
                  plan.popular
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md bg-blue-50/20'
                    : 'border-zinc-200 bg-white shadow-2xs'
                }`}
              >
                {plan.popular && (
                  <span className="self-start px-2.5 py-0.5 bg-blue-600 text-white rounded-full text-[11px] font-bold mb-3">
                    Most Popular
                  </span>
                )}
                <div className="font-extrabold text-zinc-900 text-lg">{plan.name}</div>
                <p className="text-xs text-zinc-500 mt-1 mb-4">{plan.desc}</p>
                <div className="flex items-baseline space-x-1 mb-6">
                  <span className="text-3xl font-extrabold text-zinc-900">{plan.price}</span>
                  <span className="text-xs text-zinc-500 font-medium">/ month</span>
                </div>
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl font-bold text-xs mb-6 transition-opacity ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:opacity-90 shadow-sm'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800'
                  }`}
                >
                  Get Started
                </button>
                <div className="space-y-2.5 text-xs text-zinc-600 mt-auto">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 9. CHART WIDGET
  if (element.type === 'chart') {
    if (isWireframe) {
      return (
        <div className="w-full py-8 px-6 bg-zinc-50 border border-dashed border-zinc-300 font-mono text-center">
          <div className="text-xs font-bold text-zinc-700 mb-2">[ANALYTICS CHART: {props.title || 'Growth Trend'}]</div>
          <div className="h-44 bg-zinc-200 rounded-lg flex items-center justify-center text-xs text-zinc-400">
            [Chart Canvas Placeholder: Bars / Line Area]
          </div>
        </div>
      );
    }

    return (
      <div className="w-full py-8 px-6 bg-white border-b border-zinc-200">
        <div className="max-w-5xl mx-auto bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-zinc-900 text-base">{props.title || 'Weekly Volume & Growth'}</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md">
              +28.4% WoW
            </span>
          </div>
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-4 border-b border-zinc-200">
            {[40, 65, 55, 80, 70, 95, 85].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${val}%`,
                    backgroundColor: idx === 5 ? primaryColor : '#CBD5E1',
                  }}
                ></div>
                <span className="text-[10px] text-zinc-500 font-mono">D{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 10. FOOTER
  if (element.type === 'footer') {
    if (isWireframe) {
      return (
        <div className="w-full py-8 px-6 bg-zinc-800 text-zinc-400 font-mono text-xs border-t border-zinc-700">
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
            <div>[FOOTER: {props.brandName || 'BrandLogo'}] • {props.tagline || 'Tagline'}</div>
            <div>[NAV LINKS: Company • Legal • Privacy]</div>
            <div>{props.copyright || '© 2026 All rights reserved.'}</div>
          </div>
        </div>
      );
    }

    return (
      <footer className="w-full bg-zinc-900 text-zinc-400 py-12 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white font-bold text-sm">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white font-extrabold text-sm">{props.brandName || 'CraveBite'}</div>
              <p className="text-[11px] text-zinc-500 mt-0.5">{props.tagline || 'Connected food systems engineered with clarity.'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-xs font-medium">
            <span className="hover:text-white cursor-pointer">About Us</span>
            <span className="hover:text-white cursor-pointer">Support</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
          <div className="text-xs text-zinc-600 font-mono">
            {props.copyright || '© 2026 CraveBite Technologies Inc.'}
          </div>
        </div>
      </footer>
    );
  }

  // 11. GENERIC / FALLBACK SECTION
  return (
    <div className="w-full py-8 px-6 bg-white border-b border-zinc-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 text-zinc-400 text-xs font-mono mb-2 uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{element.type}</span>
        </div>
        <h3 className="text-xl font-bold text-zinc-900">
          {props.title || props.heading || `${element.type.toUpperCase()} Component`}
        </h3>
        <p className="text-zinc-600 text-sm mt-1">
          {props.subtitle || props.text || 'Custom component with editable properties in the right inspector.'}
        </p>
      </div>
    </div>
  );
}
