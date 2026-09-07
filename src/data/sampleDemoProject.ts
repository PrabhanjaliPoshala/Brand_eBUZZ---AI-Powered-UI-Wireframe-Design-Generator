import { Project, WireframeElement, WireframeVersion, ProjectComment } from '../types';

export const SAMPLE_DEMO_PROJECT_ID = 'demo-food-delivery-101';

export const sampleFoodDeliveryElements: WireframeElement[] = [
  {
    id: 'elem-navbar',
    type: 'navbar',
    x: 0,
    y: 0,
    width: '100%',
    height: 72,
    style: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E4E4E7',
      borderWidth: 1,
      padding: 16,
    },
    props: {
      brandName: 'CraveBite',
      logoIcon: 'Utensils',
      links: ['Restaurants', 'Deals', 'Categories', 'Track Order'],
      ctaText: 'Sign In',
      showLocation: true,
      currentLocation: 'San Francisco, CA',
    },
  },
  {
    id: 'elem-hero',
    type: 'hero',
    x: 0,
    y: 72,
    width: '100%',
    height: 340,
    style: {
      backgroundColor: '#FFF7ED',
      padding: 48,
      alignment: 'center',
    },
    props: {
      title: 'Delicious Food Delivered to Your Doorstep',
      subtitle: 'Order from over 1,200+ top-rated local eateries with lightning fast 30-min delivery.',
      badgeText: '50% Off First 3 Orders',
      primaryBtnText: 'Find Food Nearby',
      secondaryBtnText: 'Explore Offers',
    },
  },
  {
    id: 'elem-search',
    type: 'search',
    x: 0,
    y: 412,
    width: '100%',
    height: 96,
    style: {
      backgroundColor: '#FFFFFF',
      padding: 20,
    },
    props: {
      placeholder: 'Enter your delivery address, street or postal code...',
      buttonText: 'Locate Me & Search',
      popularTags: ['Burgers', 'Artisan Pizza', 'Sushi Rolls', 'Healthy Bowls', 'Tacos'],
    },
  },
  {
    id: 'elem-categories',
    type: 'section',
    x: 0,
    y: 508,
    width: '100%',
    height: 200,
    style: {
      backgroundColor: '#FAFAFA',
      padding: 32,
    },
    props: {
      heading: 'Browse By Category',
      subheading: 'Satisfy your cravings with our most popular food categories',
      items: [
        { name: 'Pizza', count: '142 spots', icon: 'Pizza', tag: 'Fast Delivery' },
        { name: 'Burgers', count: '98 spots', icon: 'Utensils', tag: 'Popular' },
        { name: 'Sushi & Asian', count: '76 spots', icon: 'Fish', tag: 'Top Rated' },
        { name: 'Desserts & Bakery', count: '54 spots', icon: 'Cake', tag: 'Sweet' },
        { name: 'Salads & Vegan', count: '39 spots', icon: 'Salad', tag: 'Healthy' },
        { name: 'Coffee & Drinks', count: '61 spots', icon: 'Coffee', tag: 'Breakfast' },
      ],
    },
  },
  {
    id: 'elem-offers',
    type: 'offers_banner',
    x: 0,
    y: 708,
    width: '100%',
    height: 180,
    style: {
      backgroundColor: '#FEF3C7',
      borderColor: '#F59E0B',
      borderWidth: 1,
      borderRadius: 12,
      padding: 24,
      margin: 16,
    },
    props: {
      title: 'Mega Weekend Food Feast',
      discount: 'Up to 40% OFF',
      code: 'FEAST40',
      description: 'Free delivery on all orders above $25 from premier gourmet partners.',
      cta: 'Claim Discount Voucher',
    },
  },
  {
    id: 'elem-restaurants',
    type: 'restaurant_grid',
    x: 0,
    y: 888,
    width: '100%',
    height: 480,
    style: {
      backgroundColor: '#FFFFFF',
      padding: 36,
    },
    props: {
      heading: 'Featured Local Restaurants',
      subheading: 'Hand-picked restaurants near you with stellar community reviews',
      columns: 3,
      restaurants: [
        {
          name: 'The Rustic Truffle Pizza Co.',
          cuisine: 'Italian • Stone-fired Pizza',
          rating: 4.9,
          reviews: 420,
          deliveryTime: '20-30 min',
          deliveryFee: 'Free Delivery',
          priceRange: '$$',
          badge: 'Staff Choice',
        },
        {
          name: 'Umami Bento & Ramen House',
          cuisine: 'Japanese • Bowls & Bento',
          rating: 4.8,
          reviews: 310,
          deliveryTime: '25-35 min',
          deliveryFee: '$1.99',
          priceRange: '$$$',
          badge: 'Top Rated',
        },
        {
          name: 'Green Leaf Organics',
          cuisine: 'Vegan • Salads & Cold Pressed',
          rating: 4.7,
          reviews: 180,
          deliveryTime: '15-25 min',
          deliveryFee: 'Free Delivery',
          priceRange: '$$',
          badge: 'Eco-Certified',
        },
      ],
    },
  },
  {
    id: 'elem-reviews',
    type: 'testimonials',
    x: 0,
    y: 1368,
    width: '100%',
    height: 320,
    style: {
      backgroundColor: '#F8FAFC',
      padding: 40,
    },
    props: {
      heading: 'Loved by Hungry Foodies',
      subheading: 'Real reviews from customers who order weekly through CraveBite',
      items: [
        {
          quote: 'The real-time driver tracking and hot food arrival guarantee has made CraveBite my go-to lunch app every single day.',
          author: 'Sophia Chen',
          role: 'Product Designer',
          rating: 5,
        },
        {
          quote: 'Amazing curated local spots that I could not find anywhere else. The deals section actually saves real cash.',
          author: 'Marcus Vance',
          role: 'Software Architect',
          rating: 5,
        },
        {
          quote: 'Clean interface, zero hidden service fees, and lightning delivery times even during peak dinner rush.',
          author: 'Elena Rostova',
          role: 'Marketing Lead',
          rating: 5,
        },
      ],
    },
  },
  {
    id: 'elem-footer',
    type: 'footer',
    x: 0,
    y: 1688,
    width: '100%',
    height: 220,
    style: {
      backgroundColor: '#18181B',
      textColor: '#A1A1AA',
      padding: 40,
    },
    props: {
      brandName: 'CraveBite',
      tagline: 'Connecting food lovers with exceptional neighborhood kitchens.',
      columns: [
        { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog'] },
        { title: 'For Foodies', links: ['Mobile App', 'CraveBite Pass', 'Gift Cards', 'Safety'] },
        { title: 'Partners', links: ['Add Your Restaurant', 'Become a Courier', 'Enterprise Catering'] },
      ],
      copyright: '© 2026 CraveBite Technologies Inc. All rights reserved.',
    },
  },
];

export const sampleDemoProject: Project = {
  id: SAMPLE_DEMO_PROJECT_ID,
  name: 'Food Delivery Platform',
  description: 'A modern food delivery website with location search, restaurant categories, restaurant cards, offers section, customer reviews, and footer.',
  domain: 'food_delivery',
  devices: ['desktop', 'tablet', 'mobile'],
  requirement: 'Create a modern food delivery website with a navbar, hero section, location search, restaurant categories, restaurant cards, offers section, customer reviews and footer.',
  analysis: {
    pages: ['Home', 'Restaurants', 'Menu', 'Order Tracking'],
    components: [
      'Navbar',
      'Hero',
      'Location Search',
      'Categories',
      'Restaurant Grid',
      'Restaurant Card',
      'Offers',
      'Reviews',
      'Footer',
    ],
    constraints: ['Mobile friendly', 'Location GPS auto-detect', 'Fast card loading'],
    style_hints: ['modern', 'clean', 'vibrant', 'orange'],
    domain: 'food_delivery',
    primary_color: '#EA580C',
    design_rationale: 'High-conversion visual layout with prominent search input above the fold, categorized meal filters, and verified restaurant cards with reviews.',
    isAiGenerated: true,
    source: 'gemini-3.8-flash',
  },
  wireframe: {
    id: 'wf-food-delivery',
    projectId: SAMPLE_DEMO_PROJECT_ID,
    name: 'Home Wireframe v1.2',
    elements: sampleFoodDeliveryElements,
    device: 'desktop',
    mode: 'wireframe',
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  brandPreset: {
    brandName: 'CraveBite',
    primaryColor: '#EA580C',
    secondaryColor: '#0284C7',
    fontFamily: 'Plus Jakarta Sans',
    borderRadius: 12,
    buttonStyle: 'rounded',
    spacingStyle: 'normal',
  },
  activePageName: 'Home',
  pages: [
    {
      id: 'demo-page-home',
      projectId: SAMPLE_DEMO_PROJECT_ID,
      name: 'Home',
      path: '/',
      elements: sampleFoodDeliveryElements,
      orderIndex: 0,
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'demo-page-restaurants',
      projectId: SAMPLE_DEMO_PROJECT_ID,
      name: 'Restaurants',
      path: '/restaurants',
      elements: [
        sampleFoodDeliveryElements[0], // navbar
        sampleFoodDeliveryElements[2], // search
        sampleFoodDeliveryElements[5], // restaurant grid
        sampleFoodDeliveryElements[7], // footer
      ],
      orderIndex: 1,
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'demo-page-menu',
      projectId: SAMPLE_DEMO_PROJECT_ID,
      name: 'Menu',
      path: '/menu',
      elements: [
        sampleFoodDeliveryElements[0], // navbar
        sampleFoodDeliveryElements[3], // categories
        sampleFoodDeliveryElements[4], // offers banner
        sampleFoodDeliveryElements[5], // restaurant grid
        sampleFoodDeliveryElements[7], // footer
      ],
      orderIndex: 2,
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'demo-page-track',
      projectId: SAMPLE_DEMO_PROJECT_ID,
      name: 'Order Tracking',
      path: '/order-tracking',
      elements: [
        sampleFoodDeliveryElements[0], // navbar
        {
          id: 'elem-track-hero',
          type: 'hero',
          x: 0,
          y: 72,
          width: '100%',
          height: 280,
          style: { backgroundColor: '#FFF7ED', padding: 36, alignment: 'center' },
          props: {
            title: 'Your Order is on the Way!',
            subtitle: 'Estimated Arrival: 18 - 25 minutes • Courier: Marco S. (4.9 ★)',
            badgeText: 'Order #CB-84920 In Transit',
            primaryBtnText: 'Contact Courier',
            secondaryBtnText: 'View Digital Receipt',
          },
        },
        sampleFoodDeliveryElements[6], // reviews
        sampleFoodDeliveryElements[7], // footer
      ],
      orderIndex: 3,
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  status: 'generated',
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  updatedAt: new Date(Date.now() - 1800000).toISOString(),
};

export const sampleDemoVersions: WireframeVersion[] = [
  {
    id: 'ver-1',
    projectId: SAMPLE_DEMO_PROJECT_ID,
    versionNumber: 1,
    title: 'Initial Generation',
    description: 'Generated initial wireframe layout from natural language prompt.',
    elements: sampleFoodDeliveryElements.slice(0, 5),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdBy: 'AI Generator',
    elementCount: 5,
  },
  {
    id: 'ver-2',
    projectId: SAMPLE_DEMO_PROJECT_ID,
    versionNumber: 2,
    title: 'Added Reviews and Offers',
    description: 'Inserted customer reviews carousel and promotional weekend discount banner.',
    elements: sampleFoodDeliveryElements.slice(0, 7),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'Alex Designer',
    elementCount: 7,
  },
  {
    id: 'ver-3',
    projectId: SAMPLE_DEMO_PROJECT_ID,
    versionNumber: 3,
    title: 'Refined Hero & Location Bar',
    description: 'Expanded search bar tags and adjusted hero badge copy for higher CTA conversion.',
    elements: sampleFoodDeliveryElements,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    createdBy: 'You (poshalaprabhanjali@gmail.com)',
    elementCount: 8,
  },
];

export const sampleDemoComments: ProjectComment[] = [
  {
    id: 'comm-1',
    projectId: SAMPLE_DEMO_PROJECT_ID,
    elementId: 'elem-hero',
    sectionTitle: 'Hero Section',
    userId: 'user-designer-1',
    userName: 'Elena Vance',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    content: 'Move the CTA button directly below the hero text and emphasize the 50% first-order discount badge.',
    resolved: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    replies: [
      {
        id: 'reply-1',
        userId: 'current-user',
        userName: 'Prabhanjali',
        content: 'Done! Adjusted button placement and added amber highlighted pill tag.',
        createdAt: new Date(Date.now() - 82000000).toISOString(),
      },
    ],
  },
  {
    id: 'comm-2',
    projectId: SAMPLE_DEMO_PROJECT_ID,
    elementId: 'elem-search',
    sectionTitle: 'Location Search',
    userId: 'user-pm-1',
    userName: 'Marcus Sterling',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    content: 'Could we include auto-detection geolocation chip next to the input for quicker mobile checkout?',
    resolved: false,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    replies: [],
  },
];
