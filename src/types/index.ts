export type UserRole = 'admin' | 'designer' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export type DomainType =
  | 'food_delivery'
  | 'ecommerce'
  | 'saas'
  | 'dashboard'
  | 'portfolio'
  | 'education'
  | 'healthcare'
  | 'finance'
  | 'general';

export interface AIAnalysisResult {
  pages: string[];
  components: string[];
  constraints: string[];
  style_hints: string[];
  domain: DomainType | string;
  primary_color: string;
  design_rationale?: string;
  isAiGenerated?: boolean;
  source?: string;
}

export type ComponentCategory = 'basic' | 'layout' | 'navigation' | 'content' | 'forms';

export type ComponentType =
  | 'navbar'
  | 'header'
  | 'hero'
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'divider'
  | 'container'
  | 'grid'
  | 'columns'
  | 'section'
  | 'card'
  | 'product_card'
  | 'product_grid'
  | 'restaurant_grid'
  | 'offers_banner'
  | 'form'
  | 'input'
  | 'select'
  | 'checkbox'
  | 'search'
  | 'sidebar'
  | 'table'
  | 'statistics_card'
  | 'testimonials'
  | 'pricing'
  | 'footer'
  | 'login_form'
  | 'signup_form'
  | 'checkout'
  | 'dashboard_widget'
  | 'chart';

export interface ElementStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  textColor?: string;
  fontSize?: number;
  alignment?: 'left' | 'center' | 'right';
  opacity?: number;
}

export interface WireframeElement {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number | string;
  height: number | string;
  style?: ElementStyle;
  props: Record<string, any>;
}

export interface WireframeModel {
  id: string;
  projectId: string;
  name: string;
  elements: WireframeElement[];
  device: DeviceType;
  mode: 'wireframe' | 'preview';
  updatedAt: string;
}

export interface WireframeVersion {
  id: string;
  projectId: string;
  versionNumber: number;
  title: string;
  description: string;
  elements: WireframeElement[];
  createdAt: string;
  createdBy: string;
  elementCount: number;
}

export interface CommentReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  elementId?: string;
  sectionTitle?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  resolved: boolean;
  createdAt: string;
  replies: CommentReply[];
}

export interface ProjectPage {
  id: string;
  projectId: string;
  name: string;
  path?: string;
  elements: WireframeElement[];
  orderIndex?: number;
  updatedAt?: string;
}

export interface BrandPreset {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: number;
  buttonStyle: 'rounded' | 'pill' | 'square';
  spacingStyle: 'compact' | 'normal' | 'spacious';
}

export interface Project {
  id: string;
  userId?: string;
  name: string;
  description: string;
  domain: DomainType;
  devices: DeviceType[];
  requirement: string;
  analysis: AIAnalysisResult;
  wireframe: WireframeModel;
  pages?: ProjectPage[];
  activePageName?: string;
  brandPreset: BrandPreset;
  status: 'draft' | 'generated' | 'reviewed';
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  eventType:
    | 'project_created'
    | 'ai_generation'
    | 'ai_regeneration'
    | 'export'
    | 'template_used'
    | 'component_added'
    | 'version_restored'
    | 'user_login';
  projectId?: string;
  projectName?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  domain: DomainType;
  description: string;
  elements: WireframeElement[];
  previewTags: string[];
  elementCount?: number;
  featured?: boolean;
  isPublished?: boolean;
}

export interface GenerationJob {
  id: string;
  projectId?: string;
  projectName: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  model: string;
  durationMs: number;
  createdAt: string;
  tokensUsed?: number;
  promptSnippet: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  projectName?: string;
  status: 'success' | 'warning' | 'info';
  details?: string;
}

export interface ExportHistoryItem {
  id: string;
  projectId: string;
  projectName: string;
  format: 'JSON' | 'HTML' | 'PNG' | 'PDF';
  timestamp: string;
  fileSize: string;
}

export interface AssetItem {
  id: string;
  name: string;
  category: 'image' | 'icon' | 'logo' | 'illustration';
  url: string;
  projectId?: string;
  projectName?: string;
  fileSize: string;
  dimensions?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'comment' | 'generation' | 'version' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}
