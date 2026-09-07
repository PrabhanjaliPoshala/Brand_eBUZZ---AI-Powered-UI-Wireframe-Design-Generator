import { AIAnalysisResult, DeviceType, DomainType, WireframeElement, ProjectPage } from '../types';

export function generatePagesFromAnalysis(
  analysis: AIAnalysisResult,
  device: DeviceType = 'desktop'
): ProjectPage[] {
  const pageNames = analysis.pages && analysis.pages.length > 0 ? analysis.pages : ['Home'];
  const brandName =
    analysis.domain === 'food_delivery'
      ? 'FoodVibe'
      : analysis.domain === 'ecommerce'
      ? 'LuminaStore'
      : analysis.domain === 'dashboard'
      ? 'PulseAnalytics'
      : 'ProductOS';

  return pageNames.map((name, index) => {
    let elements: WireframeElement[] = [];

    if (name.toLowerCase() === 'home' || index === 0) {
      elements = generateWireframeFromAnalysis(analysis, device);
    } else if (name.toLowerCase().includes('product') && !name.toLowerCase().includes('detail')) {
      // Products / Catalog page
      elements = [
        {
          id: `p-${index}-nav`,
          type: 'navbar',
          x: 0,
          y: 0,
          width: '100%',
          height: 72,
          style: { backgroundColor: '#FFFFFF', borderColor: '#E4E4E7', borderWidth: 1, padding: 16 },
          props: { brandName, links: pageNames.slice(0, 4), ctaText: 'Cart (2)' },
        },
        {
          id: `p-${index}-search`,
          type: 'search',
          x: 0,
          y: 72,
          width: '100%',
          height: 80,
          style: { backgroundColor: '#F8FAFC', padding: 16 },
          props: { placeholder: 'Filter catalog by category, brand or material...', buttonText: 'Apply Filter', popularTags: ['New Releases', 'On Sale', 'Featured'] },
        },
        {
          id: `p-${index}-grid`,
          type: 'product_grid',
          x: 0,
          y: 152,
          width: '100%',
          height: 520,
          style: { backgroundColor: '#FFFFFF', padding: 36 },
          props: {
            heading: 'All Products & Collections',
            subheading: 'Showing 24 verified in-stock items with free standard shipping',
            products: [
              { name: 'Minimalist Desk Lamp', price: '$89.00', category: 'Lighting', rating: 4.8, badge: 'Top Rated' },
              { name: 'Ergonomic Wood Chair', price: '$220.00', category: 'Furniture', rating: 4.9, badge: 'Popular' },
              { name: 'Ceramic Pour-Over Set', price: '$42.00', category: 'Kitchen', rating: 4.7, badge: 'Handmade' },
              { name: 'Leather Tech Sleeve', price: '$65.00', category: 'Accessories', rating: 4.9, badge: 'Bestseller' },
            ],
          },
        },
        {
          id: `p-${index}-footer`,
          type: 'footer',
          x: 0,
          y: 672,
          width: '100%',
          height: 200,
          style: { backgroundColor: '#18181B', textColor: '#A1A1AA', padding: 36 },
          props: { brandName, tagline: 'Crafted for timeless durability and contemporary life.', columns: [{ title: 'Catalog', links: ['All Items', 'New', 'Sale'] }, { title: 'Help', links: ['FAQ', 'Returns', 'Contact'] }], copyright: '© 2026 All rights reserved.' },
        },
      ];
    } else if (name.toLowerCase().includes('restaurant') || name.toLowerCase().includes('menu')) {
      // Food Delivery Menu / Restaurants
      elements = [
        {
          id: `p-${index}-nav`,
          type: 'navbar',
          x: 0,
          y: 0,
          width: '100%',
          height: 72,
          style: { backgroundColor: '#FFFFFF', borderColor: '#E4E4E7', borderWidth: 1, padding: 16 },
          props: { brandName, links: pageNames.slice(0, 4), ctaText: 'View Cart' },
        },
        {
          id: `p-${index}-search`,
          type: 'search',
          x: 0,
          y: 72,
          width: '100%',
          height: 90,
          style: { backgroundColor: '#FFF7ED', padding: 20 },
          props: { placeholder: 'Search dishes, meals, or dietary preferences (Vegan, Halal, Gluten-Free)...', buttonText: 'Search Menu', popularTags: ['Bowls', 'Burgers', 'Ramen', 'Artisan Pizza'] },
        },
        {
          id: `p-${index}-restaurants`,
          type: 'restaurant_grid',
          x: 0,
          y: 162,
          width: '100%',
          height: 480,
          style: { backgroundColor: '#FFFFFF', padding: 36 },
          props: {
            heading: 'Available Menu & Partner Kitchens',
            subheading: 'Average delivery time 22 mins with live driver GPS tracking',
            restaurants: [
              { name: 'Fire & Stone Artisan Pizza', cuisine: 'Italian • Stone-fired', rating: 4.9, deliveryTime: '20-30 min', deliveryFee: 'Free', badge: 'Popular' },
              { name: 'Umami Bento & Ramen', cuisine: 'Japanese • Bowls', rating: 4.8, deliveryTime: '25-35 min', deliveryFee: '$1.99', badge: 'Top Rated' },
              { name: 'Pure Greens Cafe', cuisine: 'Salads • Smoothies', rating: 4.7, deliveryTime: '15-25 min', deliveryFee: 'Free', badge: 'Healthy' },
            ],
          },
        },
        {
          id: `p-${index}-footer`,
          type: 'footer',
          x: 0,
          y: 642,
          width: '100%',
          height: 200,
          style: { backgroundColor: '#18181B', textColor: '#A1A1AA', padding: 36 },
          props: { brandName, tagline: 'Direct delivery from neighborhood kitchens.', columns: [{ title: 'Order', links: ['Near You', 'Fast Delivery', 'Deals'] }, { title: 'Legal', links: ['Terms', 'Privacy', 'Safety'] }], copyright: '© 2026 All rights reserved.' },
        },
      ];
    } else if (name.toLowerCase().includes('cart') || name.toLowerCase().includes('checkout')) {
      // Cart / Checkout page
      elements = [
        {
          id: `p-${index}-nav`,
          type: 'navbar',
          x: 0,
          y: 0,
          width: '100%',
          height: 72,
          style: { backgroundColor: '#FFFFFF', borderColor: '#E4E4E7', borderWidth: 1, padding: 16 },
          props: { brandName, links: ['Home', 'Back to Store'], ctaText: 'Secure Checkout' },
        },
        {
          id: `p-${index}-checkout`,
          type: 'form',
          x: 0,
          y: 72,
          width: '100%',
          height: 420,
          style: { backgroundColor: '#FAFAFA', padding: 36 },
          props: {
            title: name.toLowerCase().includes('checkout') ? 'Instant 1-Click Checkout' : 'Review Your Shopping Cart',
            subtitle: 'Encrypted 256-bit SSL transaction with buyer protection',
            buttonText: 'Confirm & Place Order',
          },
        },
        {
          id: `p-${index}-footer`,
          type: 'footer',
          x: 0,
          y: 492,
          width: '100%',
          height: 180,
          style: { backgroundColor: '#18181B', textColor: '#A1A1AA', padding: 24 },
          props: { brandName, tagline: 'Safe, verified online transactions.', columns: [{ title: 'Security', links: ['PCI-DSS Compliant', 'Refund Guarantee'] }], copyright: '© 2026 All rights reserved.' },
        },
      ];
    } else if (name.toLowerCase().includes('pricing')) {
      // Pricing page
      elements = [
        {
          id: `p-${index}-nav`,
          type: 'navbar',
          x: 0,
          y: 0,
          width: '100%',
          height: 72,
          style: { backgroundColor: '#FFFFFF', borderColor: '#E4E4E7', borderWidth: 1, padding: 16 },
          props: { brandName, links: pageNames.slice(0, 4), ctaText: 'Start Free Trial' },
        },
        {
          id: `p-${index}-pricing`,
          type: 'pricing',
          x: 0,
          y: 72,
          width: '100%',
          height: 450,
          style: { padding: 40, backgroundColor: '#FFFFFF' },
          props: { heading: 'Transparent, Predictable Plans', subheading: 'No hidden setup fees. Upgrade or cancel anytime.' },
        },
        {
          id: `p-${index}-footer`,
          type: 'footer',
          x: 0,
          y: 522,
          width: '100%',
          height: 200,
          style: { backgroundColor: '#18181B', textColor: '#A1A1AA', padding: 36 },
          props: { brandName, tagline: 'Enterprise-grade wireframe synthesis.', columns: [{ title: 'Plans', links: ['Starter', 'Team', 'Enterprise'] }], copyright: '© 2026 All rights reserved.' },
        },
      ];
    } else {
      // General Page layout
      elements = [
        {
          id: `p-${index}-nav`,
          type: 'navbar',
          x: 0,
          y: 0,
          width: '100%',
          height: 72,
          style: { backgroundColor: '#FFFFFF', borderColor: '#E4E4E7', borderWidth: 1, padding: 16 },
          props: { brandName, links: pageNames.slice(0, 4), ctaText: 'Contact Us' },
        },
        {
          id: `p-${index}-hero`,
          type: 'hero',
          x: 0,
          y: 72,
          width: '100%',
          height: 280,
          style: { backgroundColor: '#F8FAFC', padding: 36, alignment: 'center' },
          props: {
            title: `${name} Overview`,
            subtitle: `Detailed layout architecture and functionality for the ${name} experience.`,
            primaryBtnText: 'Get Started',
            secondaryBtnText: 'Documentation',
          },
        },
        {
          id: `p-${index}-content`,
          type: 'section',
          x: 0,
          y: 352,
          width: '100%',
          height: 320,
          style: { backgroundColor: '#FFFFFF', padding: 36 },
          props: {
            heading: `${name} Key Components`,
            subheading: 'Modular responsive sections designed for optimal conversion and clarity',
            items: [
              { title: 'Responsive Structure', desc: 'Adapts seamlessly across mobile, tablet, and desktop screens.' },
              { title: 'Interactive Workflows', desc: 'Pre-configured user flows and contextual actions.' },
              { title: 'Production Ready', desc: 'Easily exportable to clean HTML and structured JSON.' },
            ],
          },
        },
        {
          id: `p-${index}-footer`,
          type: 'footer',
          x: 0,
          y: 672,
          width: '100%',
          height: 200,
          style: { backgroundColor: '#18181B', textColor: '#A1A1AA', padding: 36 },
          props: { brandName, tagline: 'Designed with AI wireframe precision.', columns: [{ title: 'Links', links: ['Home', name] }], copyright: '© 2026 All rights reserved.' },
        },
      ];
    }

    return {
      id: `page-${index}-${Date.now()}`,
      projectId: '',
      name,
      path: `/${name.toLowerCase().replace(/\s+/g, '-')}`,
      elements,
      orderIndex: index,
      updatedAt: new Date().toISOString(),
    };
  });
}


export async function parseRequirementWithAI(
  requirement: string,
  domainHint?: string
): Promise<AIAnalysisResult> {
  try {
    const res = await fetch('/api/ai/parse-requirement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requirement, domainHint }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        pages: data.pages && data.pages.length > 0 ? data.pages : ['Home'],
        components: data.components && data.components.length > 0 ? data.components : ['Navbar', 'Hero', 'Footer'],
        constraints: data.constraints || ['Responsive layout', 'Accessible contrast'],
        style_hints: data.style_hints || ['modern', 'minimal'],
        domain: data.domain || domainHint || 'general',
        primary_color: data.primary_color || '#2563EB',
        design_rationale: data.design_rationale || 'Structured design concept aligned with user requirements.',
        isAiGenerated: Boolean(data.isAiGenerated),
        source: data.source || 'gemini-3.8-flash',
      };
    }
  } catch (err) {
    console.warn('Network call to /api/ai/parse-requirement failed, using client deterministic parser:', err);
  }

  // Client-side deterministic fallback
  return clientDeterministicParser(requirement, domainHint);
}

export function clientDeterministicParser(requirement: string, domainHint?: string): AIAnalysisResult {
  const text = (requirement || '').toLowerCase();

  let domain: DomainType = (domainHint as DomainType) || 'general';
  if (text.includes('food') || text.includes('restaurant') || text.includes('delivery') || text.includes('order meal')) {
    domain = 'food_delivery';
  } else if (text.includes('shop') || text.includes('ecommerce') || text.includes('product') || text.includes('cart') || text.includes('checkout')) {
    domain = 'ecommerce';
  } else if (text.includes('saas') || text.includes('software') || text.includes('b2b') || text.includes('cloud')) {
    domain = 'saas';
  } else if (text.includes('dashboard') || text.includes('crm') || text.includes('analytics') || text.includes('metrics')) {
    domain = 'dashboard';
  } else if (text.includes('portfolio') || text.includes('agency') || text.includes('resume') || text.includes('creative')) {
    domain = 'portfolio';
  } else if (text.includes('education') || text.includes('course') || text.includes('lms')) {
    domain = 'education';
  } else if (text.includes('finance') || text.includes('banking') || text.includes('crypto') || text.includes('invest')) {
    domain = 'finance';
  }

  const pages: string[] = ['Home'];
  if (domain === 'ecommerce' || text.includes('product') || text.includes('catalog')) {
    pages.push('Products');
    if (text.includes('detail')) pages.push('Product Details');
    if (text.includes('cart')) pages.push('Cart');
    if (text.includes('checkout')) pages.push('Checkout');
  } else if (domain === 'food_delivery') {
    pages.push('Restaurants', 'Menu', 'Checkout');
  } else if (domain === 'saas') {
    pages.push('Features', 'Pricing', 'Docs');
  } else if (domain === 'dashboard') {
    pages.push('Analytics', 'Reports', 'Settings');
  }

  const components: string[] = ['Navbar'];
  if (!text.includes('no hero')) components.push('Hero');
  if (text.includes('search') || domain === 'food_delivery' || domain === 'ecommerce') components.push('Search');
  if (text.includes('categor') || domain === 'food_delivery' || domain === 'ecommerce') components.push('Category Grid');

  if (domain === 'food_delivery') {
    components.push('Restaurant Grid', 'Restaurant Card', 'Offers');
  } else if (domain === 'ecommerce') {
    components.push('Product Grid', 'Product Card', 'Filters');
  } else if (domain === 'dashboard') {
    components.push('Sidebar', 'Statistics Cards', 'Chart Widget', 'Data Table');
  } else if (domain === 'saas') {
    components.push('Feature Highlights', 'Pricing Table', 'Testimonials');
  } else {
    components.push('Feature Cards', 'Content Section');
  }

  if (text.includes('review') || text.includes('testimonial')) {
    if (!components.includes('Testimonials')) components.push('Testimonials');
  }
  if (text.includes('pricing') && !components.includes('Pricing Table')) {
    components.push('Pricing Table');
  }
  if (!components.includes('Footer')) {
    components.push('Footer');
  }

  const style_hints: string[] = [];
  if (text.includes('minimal')) style_hints.push('minimal');
  if (text.includes('modern') || style_hints.length === 0) style_hints.push('modern');
  if (text.includes('dark')) style_hints.push('dark');
  if (text.includes('clean')) style_hints.push('clean');
  if (text.includes('playful')) style_hints.push('playful');

  let primary_color = '#2563EB';
  if (text.includes('orange') || domain === 'food_delivery') primary_color = '#EA580C';
  else if (text.includes('green') || text.includes('emerald')) primary_color = '#059669';
  else if (text.includes('purple') || text.includes('violet')) primary_color = '#7C3AED';
  else if (text.includes('red') || text.includes('crimson')) primary_color = '#DC2626';
  else if (text.includes('dark') || text.includes('black')) primary_color = '#18181B';
  else if (text.includes('teal')) primary_color = '#0D9488';

  return {
    pages,
    components,
    constraints: ['Desktop & Mobile adaptive', 'High visual hierarchy', 'WCAG AA contrast compliant'],
    style_hints,
    domain,
    primary_color,
    design_rationale: `Tailored ${domain.replace('_', ' ')} layout synthesized from functional requirements.`,
    isAiGenerated: false,
    source: 'deterministic-parser',
  };
}

export function generateWireframeFromAnalysis(
  analysis: AIAnalysisResult,
  _device: DeviceType = 'desktop'
): WireframeElement[] {
  const elements: WireframeElement[] = [];
  let currentY = 0;

  // 1. Navigation bar
  elements.push({
    id: `wf-elem-nav-${Date.now()}`,
    type: 'navbar',
    x: 0,
    y: currentY,
    width: '100%',
    height: 72,
    style: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E4E4E7',
      borderWidth: 1,
      padding: 16,
    },
    props: {
      brandName: analysis.domain === 'food_delivery' ? 'FoodVibe' : analysis.domain === 'ecommerce' ? 'LuminaStore' : 'ProductOS',
      links: analysis.pages.slice(0, 4),
      ctaText: 'Get Started',
    },
  });
  currentY += 72;

  // 2. Hero Section
  elements.push({
    id: `wf-elem-hero-${Date.now()}`,
    type: 'hero',
    x: 0,
    y: currentY,
    width: '100%',
    height: 340,
    style: {
      alignment: 'center',
      backgroundColor: analysis.style_hints.includes('dark') ? '#09090B' : '#F8FAFC',
      textColor: analysis.style_hints.includes('dark') ? '#FAFAFA' : '#09090B',
      padding: 48,
    },
    props: {
      title:
        analysis.domain === 'food_delivery'
          ? 'Fastest Food Delivery in Your Neighborhood'
          : analysis.domain === 'ecommerce'
          ? 'Discover Timeless Craftsmanship & Contemporary Essentials'
          : 'Scale Your Digital Architecture with Autonomous Systems',
      subtitle:
        analysis.domain === 'food_delivery'
          ? 'Choose from 500+ top local restaurants with instant contactless delivery.'
          : analysis.domain === 'ecommerce'
          ? 'Curated sustainable collections crafted by leading artisan studios.'
          : 'Streamline collaboration and convert complex requirements into living software in seconds.',
      badgeText: 'New 2026 Collection',
      primaryBtnText: analysis.domain === 'food_delivery' ? 'Order Food Now' : analysis.domain === 'ecommerce' ? 'Shop Catalog' : 'Launch Workspace',
      secondaryBtnText: 'Learn More',
    },
  });
  currentY += 340;

  // 3. Search Bar if needed
  if (analysis.components.some((c) => c.toLowerCase().includes('search')) || analysis.domain === 'food_delivery') {
    elements.push({
      id: `wf-elem-search-${Date.now()}`,
      type: 'search',
      x: 0,
      y: currentY,
      width: '100%',
      height: 90,
      style: { backgroundColor: '#FFFFFF', padding: 16 },
      props: {
        placeholder: analysis.domain === 'food_delivery' ? 'Enter delivery address or food craving...' : 'Search items, categories, or keywords...',
        buttonText: 'Search Now',
        popularTags: analysis.domain === 'food_delivery' ? ['Pizza', 'Burger', 'Healthy Bowl', 'Sushi'] : ['New Arrivals', 'Trending', 'Best Value'],
      },
    });
    currentY += 90;
  }

  // 4. Domain specific core content
  if (analysis.domain === 'food_delivery') {
    elements.push({
      id: `wf-elem-offers-${Date.now()}`,
      type: 'offers_banner',
      x: 0,
      y: currentY,
      width: '100%',
      height: 160,
      style: { backgroundColor: '#FEF3C7', padding: 24, borderRadius: 12, margin: 16 },
      props: {
        title: 'Save Big on First 3 Orders',
        discount: '40% OFF',
        code: 'WELCOME40',
        description: 'Free delivery on all local gourmet partners this week.',
        cta: 'Redeem Coupon',
      },
    });
    currentY += 160;

    elements.push({
      id: `wf-elem-restaurants-${Date.now()}`,
      type: 'restaurant_grid',
      x: 0,
      y: currentY,
      width: '100%',
      height: 440,
      style: { backgroundColor: '#FFFFFF', padding: 36 },
      props: {
        heading: 'Top Rated Neighborhood Eateries',
        subheading: 'Verified customer ratings and fast delivery guarantees',
        restaurants: [
          { name: 'Fire & Stone Artisan Pizza', cuisine: 'Italian • Pizza', rating: 4.9, deliveryTime: '20-30 min', deliveryFee: 'Free', badge: 'Popular' },
          { name: 'Tokyo Street Bowls', cuisine: 'Japanese • Ramen', rating: 4.8, deliveryTime: '25-35 min', deliveryFee: '$1.99', badge: 'Top Rated' },
          { name: 'Green Garden Organics', cuisine: 'Salads • Smoothies', rating: 4.7, deliveryTime: '15-25 min', deliveryFee: 'Free', badge: 'Healthy' },
        ],
      },
    });
    currentY += 440;
  } else if (analysis.domain === 'ecommerce') {
    elements.push({
      id: `wf-elem-prodgrid-${Date.now()}`,
      type: 'product_grid',
      x: 0,
      y: currentY,
      width: '100%',
      height: 480,
      style: { backgroundColor: '#FFFFFF', padding: 36 },
      props: {
        heading: 'Featured Catalog',
        subheading: 'Most requested pieces crafted with meticulous detail',
        products: [
          { name: 'Minimalist Oak Chair', price: '$240.00', category: 'Furniture', rating: 4.9, badge: 'Bestseller' },
          { name: 'Studio Desk Lamp', price: '$95.00', category: 'Lighting', rating: 4.8, badge: 'Popular' },
          { name: 'Architect Ceramic Planter', price: '$45.00', category: 'Home', rating: 5.0, badge: 'New' },
        ],
      },
    });
    currentY += 480;
  } else if (analysis.domain === 'dashboard') {
    elements.push({
      id: `wf-elem-stats-${Date.now()}`,
      type: 'statistics_card',
      x: 0,
      y: currentY,
      width: '100%',
      height: 140,
      style: { padding: 20 },
      props: {
        stats: [
          { label: 'Active Projects', value: '42', change: '+8 this week' },
          { label: 'Generated Layouts', value: '1,280', change: '+24%' },
          { label: 'Avg Generation Time', value: '1.4s', change: 'Optimized' },
          { label: 'Team Velocity', value: '98.2%', change: '+5.4%' },
        ],
      },
    });
    currentY += 140;

    elements.push({
      id: `wf-elem-chart-${Date.now()}`,
      type: 'chart',
      x: 0,
      y: currentY,
      width: '100%',
      height: 320,
      style: { padding: 24 },
      props: { title: 'Execution Performance (2026)', chartType: 'area' },
    });
    currentY += 320;
  } else {
    elements.push({
      id: `wf-elem-features-${Date.now()}`,
      type: 'section',
      x: 0,
      y: currentY,
      width: '100%',
      height: 300,
      style: { backgroundColor: '#FAFAFA', padding: 36 },
      props: {
        heading: 'Core Capabilities',
        subheading: 'Engineered for seamless usability and productivity',
        items: [
          { title: 'Intuitive Visuals', desc: 'Real-time wireframe synchronization.' },
          { title: 'Adaptive Resizing', desc: 'Desktop, tablet, and mobile column layouts.' },
          { title: 'Universal Export', desc: 'Download standalone HTML and structured JSON.' },
        ],
      },
    });
    currentY += 300;
  }

  // 5. Testimonials if requested or appropriate
  if (analysis.components.some((c) => c.toLowerCase().includes('review') || c.toLowerCase().includes('testimonial'))) {
    elements.push({
      id: `wf-elem-testim-${Date.now()}`,
      type: 'testimonials',
      x: 0,
      y: currentY,
      width: '100%',
      height: 320,
      style: { backgroundColor: '#F8FAFC', padding: 36 },
      props: {
        heading: 'Customer Praise',
        subheading: 'Stories from satisfied users worldwide',
        items: [
          { quote: 'Transformed our design sprint from 5 days into 2 hours flat.', author: 'Jordan Reed', role: 'Head of Product', rating: 5 },
          { quote: 'Unbeatable clarity and fidelity right out of the box.', author: 'Mira Alvarez', role: 'UX Lead', rating: 5 },
        ],
      },
    });
    currentY += 320;
  }

  // 6. Pricing if requested
  if (analysis.components.some((c) => c.toLowerCase().includes('pricing'))) {
    elements.push({
      id: `wf-elem-pricing-${Date.now()}`,
      type: 'pricing',
      x: 0,
      y: currentY,
      width: '100%',
      height: 420,
      style: { padding: 40 },
      props: {
        heading: 'Flexible Plans',
        subheading: 'Choose the tier suited to your team size',
      },
    });
    currentY += 420;
  }

  // 7. Footer
  elements.push({
    id: `wf-elem-footer-${Date.now()}`,
    type: 'footer',
    x: 0,
    y: currentY,
    width: '100%',
    height: 200,
    style: { backgroundColor: '#18181B', textColor: '#A1A1AA', padding: 36 },
    props: {
      brandName: analysis.domain === 'food_delivery' ? 'FoodVibe' : 'DesignPlatform',
      tagline: 'Modern software wireframing synthesized with AI.',
      columns: [
        { title: 'Explore', links: ['Home', 'Features', 'Pricing'] },
        { title: 'Company', links: ['About Us', 'Careers', 'Contact'] },
      ],
      copyright: '© 2026 All rights reserved.',
    },
  });

  return elements;
}

export async function regenerateWireframePrompt(
  currentElements: WireframeElement[],
  instruction: string,
  targetScope?: string
): Promise<{ elements: WireframeElement[]; message: string }> {
  // Try server endpoint
  try {
    const res = await fetch('/api/ai/regenerate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentWireframe: { elements: currentElements }, instruction, targetScope }),
    });

    if (res.ok) {
      await res.json();
    }
  } catch (err) {
    console.warn('Server regeneration failed, continuing with client mutator:', err);
  }

  // Apply intelligent client-side transformations to elements
  const text = instruction.toLowerCase();
  const modified = JSON.parse(JSON.stringify(currentElements)) as WireframeElement[];

  // 1. "Make hero section smaller"
  if (text.includes('hero') && (text.includes('smaller') || text.includes('compact') || text.includes('reduce'))) {
    modified.forEach((el) => {
      if (el.type === 'hero') {
        el.height = 240;
        if (el.style) {
          el.style.padding = 24;
        }
      }
    });
  }

  // 2. "Add a search bar"
  if (text.includes('search') && !modified.some((el) => el.type === 'search')) {
    const heroIndex = modified.findIndex((el) => el.type === 'hero');
    const newSearch: WireframeElement = {
      id: `elem-search-${Date.now()}`,
      type: 'search',
      x: 0,
      y: 0,
      width: '100%',
      height: 90,
      style: { backgroundColor: '#FFFFFF', padding: 16 },
      props: {
        placeholder: 'Search for anything...',
        buttonText: 'Search',
        popularTags: ['Trending', 'Top Picks', 'Special Deals'],
      },
    };
    if (heroIndex !== -1) {
      modified.splice(heroIndex + 1, 0, newSearch);
    } else {
      modified.unshift(newSearch);
    }
  }

  // 3. "Dark mode" / "Dark modern design"
  if (text.includes('dark')) {
    modified.forEach((el) => {
      if (el.type === 'hero' || el.type === 'section' || el.type === 'navbar' || el.type === 'container') {
        el.style = {
          ...el.style,
          backgroundColor: '#09090B',
          borderColor: '#27272A',
          textColor: '#FAFAFA',
        };
      }
    });
  }

  // 4. "Add reviews" / "Add testimonials"
  if ((text.includes('review') || text.includes('testimonial')) && !modified.some((el) => el.type === 'testimonials')) {
    const footerIndex = modified.findIndex((el) => el.type === 'footer');
    const newTestim: WireframeElement = {
      id: `elem-reviews-${Date.now()}`,
      type: 'testimonials',
      x: 0,
      y: 0,
      width: '100%',
      height: 320,
      style: { backgroundColor: '#F8FAFC', padding: 36 },
      props: {
        heading: 'Community Reviews & Ratings',
        subheading: 'Verified feedback from genuine users',
        items: [
          { quote: 'Exceeded every expectation in quality and speed.', author: 'Alex Thorne', role: 'Lead Architect', rating: 5 },
          { quote: 'Intuitive interface that saved days of back-and-forth.', author: 'Jessica Miller', role: 'VP Design', rating: 5 },
        ],
      },
    };
    if (footerIndex !== -1) {
      modified.splice(footerIndex, 0, newTestim);
    } else {
      modified.push(newTestim);
    }
  }

  // 5. "Add pricing"
  if (text.includes('pricing') && !modified.some((el) => el.type === 'pricing')) {
    const footerIndex = modified.findIndex((el) => el.type === 'footer');
    const newPricing: WireframeElement = {
      id: `elem-pricing-${Date.now()}`,
      type: 'pricing',
      x: 0,
      y: 0,
      width: '100%',
      height: 420,
      style: { padding: 40 },
      props: {
        heading: 'Flexible Subscription Tiers',
        subheading: 'Choose the plan engineered for your scale',
      },
    };
    if (footerIndex !== -1) {
      modified.splice(footerIndex, 0, newPricing);
    } else {
      modified.push(newPricing);
    }
  }

  return {
    elements: modified,
    message: `Updated layout based on instruction: "${instruction}"`,
  };
}
