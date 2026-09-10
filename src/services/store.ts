import {
  User,
  Project,
  ProjectPage,
  WireframeVersion,
  ProjectComment,
  Template,
  GenerationJob,
  AuditLog,
  ExportHistoryItem,
  BrandPreset,
  WireframeElement,
  AIAnalysisResult,
  DeviceType,
  DomainType,
  AnalyticsEvent,
  UserRole,
  AssetItem,
  AppNotification,
} from '../types';
import { sampleDemoProject, sampleDemoVersions, sampleDemoComments, SAMPLE_DEMO_PROJECT_ID } from '../data/sampleDemoProject';
import { initialTemplates } from '../data/initialTemplates';
import { generatePagesFromAnalysis } from './aiService';
import { supabase, isSupabaseConfigured, authService } from './supabase';

const USERS_STORAGE_KEY = 'ai_wireframe_users';
const CURRENT_USER_KEY = 'ai_wireframe_current_user';
const AUTH_TOKEN_KEY = 'ai_wireframe_auth_token';
const PROJECTS_STORAGE_KEY = 'ai_wireframe_projects';
const VERSIONS_STORAGE_KEY = 'ai_wireframe_versions';
const COMMENTS_STORAGE_KEY = 'ai_wireframe_comments';
const TEMPLATES_STORAGE_KEY = 'ai_wireframe_templates';
const JOBS_STORAGE_KEY = 'ai_wireframe_jobs';
const AUDIT_STORAGE_KEY = 'ai_wireframe_audit';
const EXPORT_STORAGE_KEY = 'ai_wireframe_exports';
const ANALYTICS_STORAGE_KEY = 'ai_wireframe_analytics';
const ASSETS_STORAGE_KEY = 'ai_wireframe_assets';
const NOTIFICATIONS_STORAGE_KEY = 'ai_wireframe_notifications';

export const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Prabhanjali Poshala',
    email: 'poshalaprabhanjali@gmail.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'usr-des-2',
    name: 'Liam Zhang',
    email: 'liam.zhang@designlab.io',
    role: 'designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-08-20T14:30:00Z',
  },
  {
    id: 'usr-reg-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@techventure.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-09-01T09:15:00Z',
  },
  {
    id: 'usr-inact-4',
    name: 'Marcus Bell',
    email: 'marcus.bell@inactive.io',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    status: 'inactive',
    createdAt: '2026-08-10T11:00:00Z',
  },
];

export const DEFAULT_BRAND_PRESET: BrandPreset = {
  brandName: 'Default Brand',
  primaryColor: '#2563EB',
  secondaryColor: '#64748B',
  fontFamily: 'Plus Jakarta Sans',
  borderRadius: 8,
  buttonStyle: 'rounded',
  spacingStyle: 'normal',
};

// Listeners for store changes
type StoreListener = () => void;
const listeners = new Set<StoreListener>();

function notifyListeners() {
  listeners.forEach((l) => l());
}

export function subscribeToStore(listener: StoreListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

class StoreService {
  constructor() {
    this.initStorage();
  }

  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Error reading localStorage for key ${key}:`, e);
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      notifyListeners();
    } catch (e) {
      console.warn(`Error writing localStorage for key ${key}:`, e);
    }
  }

  private initStorage() {
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      this.setItem(USERS_STORAGE_KEY, DEFAULT_USERS);
    }
    if (!localStorage.getItem(CURRENT_USER_KEY)) {
      this.setItem(CURRENT_USER_KEY, DEFAULT_USERS[0]);
    }
    if (!localStorage.getItem(PROJECTS_STORAGE_KEY)) {
      this.setItem(PROJECTS_STORAGE_KEY, [sampleDemoProject]);
    }
    if (!localStorage.getItem(VERSIONS_STORAGE_KEY)) {
      this.setItem(VERSIONS_STORAGE_KEY, sampleDemoVersions);
    }
    if (!localStorage.getItem(COMMENTS_STORAGE_KEY)) {
      this.setItem(COMMENTS_STORAGE_KEY, sampleDemoComments);
    }
    if (!localStorage.getItem(TEMPLATES_STORAGE_KEY)) {
      this.setItem(TEMPLATES_STORAGE_KEY, initialTemplates);
    } else {
      const storedTemplates = this.getItem<Template[]>(TEMPLATES_STORAGE_KEY, []);
      const storedIds = new Set(storedTemplates.map((template) => template.id));
      const missingTemplates = initialTemplates.filter((template) => !storedIds.has(template.id));
      if (missingTemplates.length > 0) {
        this.setItem(TEMPLATES_STORAGE_KEY, [...storedTemplates, ...missingTemplates]);
      }
    }
    if (!localStorage.getItem(JOBS_STORAGE_KEY)) {
      const initialJobs: GenerationJob[] = [
        {
          id: 'job-101',
          projectId: SAMPLE_DEMO_PROJECT_ID,
          projectName: 'Food Delivery Platform',
          status: 'completed',
          model: 'gemini-3.8-flash',
          durationMs: 1820,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          tokensUsed: 642,
          promptSnippet: 'Create a modern food delivery website with location search...',
        },
        {
          id: 'job-102',
          projectName: 'SaaS Analytics Engine',
          status: 'completed',
          model: 'gemini-3.8-flash',
          durationMs: 2150,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          tokensUsed: 890,
          promptSnippet: 'Build a high throughput analytics wireframe with KPI cards...',
        },
      ];
      this.setItem(JOBS_STORAGE_KEY, initialJobs);
    }
    if (!localStorage.getItem(AUDIT_STORAGE_KEY)) {
      const initialLogs: AuditLog[] = [
        {
          id: 'log-1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          userEmail: 'poshalaprabhanjali@gmail.com',
          action: 'Wireframe generated',
          projectName: 'Food Delivery Platform',
          status: 'success',
          details: 'Generated 8 components for desktop canvas layout',
        },
        {
          id: 'log-2',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          userEmail: 'poshalaprabhanjali@gmail.com',
          action: 'User login',
          status: 'success',
          details: 'Authenticated via Admin role',
        },
        {
          id: 'log-3',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          userEmail: 'liam.zhang@designlab.io',
          action: 'Version created',
          projectName: 'Food Delivery Platform',
          status: 'info',
          details: 'Created Version 2: Added reviews & offers banner',
        },
      ];
      this.setItem(AUDIT_STORAGE_KEY, initialLogs);
    }
    if (!localStorage.getItem(ASSETS_STORAGE_KEY)) {
      const initialAssets: AssetItem[] = [
        {
          id: 'asset-1',
          name: 'Hero Food Delivery Cover',
          category: 'image',
          url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
          projectId: SAMPLE_DEMO_PROJECT_ID,
          projectName: 'Food Delivery Platform',
          fileSize: '240 KB',
          dimensions: '1200 x 600',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'asset-2',
          name: 'Modern SaaS Logo Icon',
          category: 'logo',
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
          projectName: 'Design Library',
          fileSize: '45 KB',
          dimensions: '512 x 512',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 'asset-3',
          name: 'App Store Download Badge',
          category: 'icon',
          url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
          projectId: SAMPLE_DEMO_PROJECT_ID,
          projectName: 'Food Delivery Platform',
          fileSize: '32 KB',
          dimensions: '240 x 80',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          id: 'asset-4',
          name: 'Empty State Wireframe Graphic',
          category: 'illustration',
          url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80',
          projectName: 'Global Design System',
          fileSize: '110 KB',
          dimensions: '800 x 600',
          createdAt: new Date(Date.now() - 345600000).toISOString(),
        },
      ];
      this.setItem(ASSETS_STORAGE_KEY, initialAssets);
    }
    if (!localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)) {
      const initialNotifications: AppNotification[] = [
        {
          id: 'notif-1',
          title: 'New Feedback on Food Delivery',
          message: 'Liam Zhang left a comment on the Checkout layout.',
          type: 'comment',
          read: false,
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          link: `/projects/${SAMPLE_DEMO_PROJECT_ID}/comments`,
        },
        {
          id: 'notif-2',
          title: 'Version 2 Snapshot Created',
          message: 'Automated snapshot generated after layout revision.',
          type: 'version',
          read: false,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          link: `/projects/${SAMPLE_DEMO_PROJECT_ID}/versions`,
        },
        {
          id: 'notif-3',
          title: 'AI Model Ready',
          message: 'Gemini 3.8 Flash model operational with heuristic fallback.',
          type: 'system',
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          link: '/admin/ai',
        },
      ];
      this.setItem(NOTIFICATIONS_STORAGE_KEY, initialNotifications);
    }
  }

  // --- USER & AUTH METHODS ---
  getCurrentUser(): User {
    return this.getItem<User>(CURRENT_USER_KEY, DEFAULT_USERS[0]);
  }

  setCurrentUser(user: User): void {
    this.setItem(CURRENT_USER_KEY, user);
    localStorage.setItem(AUTH_TOKEN_KEY, 'active_session');
    this.logAudit(user.email, 'User login', undefined, 'success', `Switched active session to ${user.name} (${user.role})`);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token !== 'logged_out';
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return this.isAuthenticated() && Boolean(user && user.role === 'admin');
  }

  async login(
    email: string,
    password?: string,
    _rememberMe = true
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    if (isSupabaseConfigured && password) {
      const res = await authService.signIn(email, password);
      if (res.user) {
        this.setCurrentUser(res.user);
        this.recordAnalyticsEvent('user_login', undefined, undefined, { email, role: res.user.role });
        return { success: true, user: res.user };
      }
    }

    const allUsers = this.getUsers();
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.status === 'inactive') {
        return { success: false, error: 'Your account has been deactivated. Please contact an admin.' };
      }
      this.setCurrentUser(found);
      this.recordAnalyticsEvent('user_login', undefined, undefined, { email, role: found.role });
      return { success: true, user: found };
    }

    return { success: false, error: 'Invalid email or password.' };
  }

  async signup(
    name: string,
    email: string,
    password?: string,
    role: UserRole = 'user'
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const safeRole: UserRole = role === 'admin' ? 'user' : role;

    if (isSupabaseConfigured && password) {
      const res = await authService.signUp(email, password, name);
      if (res.error) return { success: false, error: res.error };
      if (res.user) {
        this.setCurrentUser(res.user);
        this.recordAnalyticsEvent('user_login', undefined, undefined, { email, role: res.user.role });
        return { success: true, user: res.user };
      }
    }

    const newUser = this.addUser({
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role: safeRole,
      status: 'active',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
    });
    this.setCurrentUser(newUser);
    this.recordAnalyticsEvent('user_login', undefined, undefined, { email, role });
    return { success: true, user: newUser };
  }

  async logout(): Promise<void> {
    await authService.signOut();
    localStorage.setItem(AUTH_TOKEN_KEY, 'logged_out');
    notifyListeners();
  }

  async signOut(): Promise<void> {
    return this.logout();
  }

  switchUser(id: string): User | undefined {
    const user = this.getUsers().find((u) => u.id === id);
    if (user) {
      this.setCurrentUser(user);
    }
    return user;
  }

  getUsers(): User[] {
    return this.getItem<User[]>(USERS_STORAGE_KEY, DEFAULT_USERS);
  }

  updateUser(id: string, updates: Partial<User>): void {
    const users = this.getUsers().map((u) => (u.id === id ? { ...u, ...updates } : u));
    this.setItem(USERS_STORAGE_KEY, users);
    const currentUser = this.getCurrentUser();
    if (currentUser.id === id) {
      this.setItem(CURRENT_USER_KEY, { ...currentUser, ...updates });
    }
    this.logAudit(currentUser.email, 'User profile updated', undefined, 'info', `Updated user ID ${id}`);
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const users = [...this.getUsers(), newUser];
    this.setItem(USERS_STORAGE_KEY, users);
    this.logAudit(this.getCurrentUser().email, 'User created', undefined, 'success', `Created new user ${newUser.email}`);
    return newUser;
  }

  // --- PROJECT METHODS ---
  getProjects(): Project[] {
    return this.getItem<Project[]>(PROJECTS_STORAGE_KEY, [sampleDemoProject]);
  }

  getProjectById(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }

  createProject(
    name: string,
    description: string,
    domain: DomainType,
    devices: DeviceType[],
    requirement: string,
    analysis: AIAnalysisResult,
    elements: WireframeElement[],
    brandPreset?: BrandPreset,
    pages?: ProjectPage[]
  ): Project {
    const projectId = `proj-${Date.now()}`;
    const user = this.getCurrentUser();

    // Multi-page synthesis
    const synthesizedPages: ProjectPage[] =
      pages && pages.length > 0
        ? pages
        : generatePagesFromAnalysis(analysis, devices[0] || 'desktop');

    // Make sure all pages point to this projectId
    synthesizedPages.forEach((p) => {
      p.projectId = projectId;
    });

    // Default primary page elements
    const primaryElements =
      elements && elements.length > 0
        ? elements
        : synthesizedPages[0]?.elements || [];

    const newProject: Project = {
      id: projectId,
      userId: user.id,
      name,
      description,
      domain,
      devices,
      requirement,
      analysis,
      wireframe: {
        id: `wf-${Date.now()}`,
        projectId,
        name: `${name} Layout`,
        elements: primaryElements,
        device: devices[0] || 'desktop',
        mode: 'wireframe',
        updatedAt: new Date().toISOString(),
      },
      pages: synthesizedPages,
      activePageName: synthesizedPages[0]?.name || 'Home',
      brandPreset: brandPreset || {
        ...DEFAULT_BRAND_PRESET,
        brandName: name,
        primaryColor: analysis.primary_color || '#2563EB',
      },
      status: 'generated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const projects = [newProject, ...this.getProjects()];
    this.setItem(PROJECTS_STORAGE_KEY, projects);

    // Save initial version
    this.saveVersion(projectId, 'Initial Generation', 'Automatically generated from AI requirement analysis.', primaryElements);

    // Log audit, generation job & analytics
    this.logAudit(user.email, 'Project created', name, 'success', `Created multi-page project with ${synthesizedPages.length} pages and ${primaryElements.length} components`);
    this.recordJob(projectId, name, 'gemini-3.8-flash', 1450, 'completed', requirement.slice(0, 100));
    this.recordAnalyticsEvent('project_created', projectId, name, { pagesCount: synthesizedPages.length, domain });
    this.recordAnalyticsEvent('ai_generation', projectId, name, { pages: analysis.pages });

    // Background sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('projects')
        .insert(
          [
            {
              id: projectId,
              user_id: user.id,
              name,
              description,
              domain,
              devices,
              requirement,
              brand_preset: newProject.brandPreset,
              status: 'generated',
            } as any,
          ] as any
        )
        .then(({ error }: any) => {
          if (error) console.warn('Supabase sync warning:', error);
        });
    }

    return newProject;
  }

  duplicateProject(id: string): Project | undefined {
    const p = this.getProjectById(id);
    if (!p) return undefined;
    const newPages: ProjectPage[] = (p.pages || []).map((page, idx) => ({
      ...page,
      id: `page-${Date.now()}-${idx}`,
      elements: JSON.parse(JSON.stringify(page.elements)),
    }));
    return this.createProject(
      `${p.name} (Copy)`,
      p.description,
      p.domain,
      p.devices,
      p.requirement,
      p.analysis,
      JSON.parse(JSON.stringify(p.wireframe.elements)),
      p.brandPreset ? JSON.parse(JSON.stringify(p.brandPreset)) : undefined,
      newPages.length > 0 ? newPages : undefined
    );
  }

  updateProject(id: string, updates: Partial<Project>): void {
    const projects = this.getProjects().map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    this.setItem(PROJECTS_STORAGE_KEY, projects);

    if (isSupabaseConfigured && supabase) {
      // @ts-ignore - Supabase type definitions don't include database schema
      supabase.from('projects').update(updates).eq('id', id).then(() => {});
    }
  }

  updateProjectWireframe(id: string, elements: WireframeElement[], device?: DeviceType, mode?: 'wireframe' | 'preview'): void {
    const project = this.getProjectById(id);
    if (!project) return;

    const activePage = project.activePageName || 'Home';
    let updatedPages = project.pages || [];
    const pageIndex = updatedPages.findIndex((p) => p.name.toLowerCase() === activePage.toLowerCase());

    if (pageIndex !== -1) {
      updatedPages = updatedPages.map((p, idx) => (idx === pageIndex ? { ...p, elements, updatedAt: new Date().toISOString() } : p));
    } else {
      updatedPages.push({
        id: `page-${Date.now()}`,
        projectId: id,
        name: activePage,
        elements,
        orderIndex: updatedPages.length,
        updatedAt: new Date().toISOString(),
      });
    }

    const updatedWireframe = {
      ...project.wireframe,
      elements,
      device: device || project.wireframe.device,
      mode: mode || project.wireframe.mode,
      updatedAt: new Date().toISOString(),
    };

    this.updateProject(id, {
      wireframe: updatedWireframe,
      pages: updatedPages,
    });
  }

  // Multi-page editor helpers
  updateProjectPage(projectId: string, pageName: string, elements: WireframeElement[]): void {
    const project = this.getProjectById(projectId);
    if (!project) return;

    let pages = project.pages || [];
    const pageIndex = pages.findIndex((p) => p.name.toLowerCase() === pageName.toLowerCase());

    if (pageIndex !== -1) {
      pages = pages.map((p, idx) => (idx === pageIndex ? { ...p, elements, updatedAt: new Date().toISOString() } : p));
    } else {
      pages.push({
        id: `page-${Date.now()}`,
        projectId,
        name: pageName,
        elements,
        orderIndex: pages.length,
        updatedAt: new Date().toISOString(),
      });
    }

    const isCurrentActive = !project.activePageName || project.activePageName.toLowerCase() === pageName.toLowerCase();
    const updatedWireframe = isCurrentActive
      ? { ...project.wireframe, elements, updatedAt: new Date().toISOString() }
      : project.wireframe;

    this.updateProject(projectId, {
      pages,
      wireframe: updatedWireframe,
      activePageName: isCurrentActive ? pageName : project.activePageName,
    });
  }

  setActivePage(projectId: string, pageName: string): WireframeElement[] {
    const project = this.getProjectById(projectId);
    if (!project) return [];

    const page = project.pages?.find((p) => p.name.toLowerCase() === pageName.toLowerCase());
    const pageElements = page?.elements || project.wireframe.elements;

    this.updateProject(projectId, {
      activePageName: pageName,
      wireframe: {
        ...project.wireframe,
        elements: pageElements,
        updatedAt: new Date().toISOString(),
      },
    });

    return pageElements;
  }

  addProjectPage(projectId: string, pageName: string, elements?: WireframeElement[]): ProjectPage {
    const project = this.getProjectById(projectId);
    const newPage: ProjectPage = {
      id: `page-${Date.now()}`,
      projectId,
      name: pageName,
      path: `/${pageName.toLowerCase().replace(/\s+/g, '-')}`,
      elements: elements || [
        {
          id: `elem-nav-${Date.now()}`,
          type: 'navbar',
          x: 0,
          y: 0,
          width: '100%',
          height: 72,
          style: { backgroundColor: '#FFFFFF', borderColor: '#E4E4E7', borderWidth: 1, padding: 16 },
          props: { brandName: project?.brandPreset?.brandName || 'ProductOS', links: ['Home', pageName], ctaText: 'Get Started' },
        },
        {
          id: `elem-hero-${Date.now()}`,
          type: 'hero',
          x: 0,
          y: 72,
          width: '100%',
          height: 280,
          style: { backgroundColor: '#F8FAFC', padding: 36, alignment: 'center' },
          props: { title: pageName, subtitle: `Interactive layout for ${pageName} screen.`, primaryBtnText: 'Action', secondaryBtnText: 'Learn More' },
        },
        {
          id: `elem-footer-${Date.now()}`,
          type: 'footer',
          x: 0,
          y: 352,
          width: '100%',
          height: 200,
          style: { backgroundColor: '#18181B', textColor: '#A1A1AA', padding: 36 },
          props: { brandName: project?.brandPreset?.brandName || 'ProductOS', tagline: 'Designed with AI wireframe precision.', columns: [], copyright: '© 2026 All rights reserved.' },
        },
      ],
      orderIndex: (project?.pages?.length || 0),
      updatedAt: new Date().toISOString(),
    };

    if (project) {
      const updatedPages = [...(project.pages || []), newPage];
      const updatedAnalysisPages = Array.from(new Set([...(project.analysis.pages || []), pageName]));
      this.updateProject(projectId, {
        pages: updatedPages,
        activePageName: pageName,
        analysis: { ...project.analysis, pages: updatedAnalysisPages },
        wireframe: {
          ...project.wireframe,
          elements: newPage.elements,
          updatedAt: new Date().toISOString(),
        },
      });
      this.logAudit(this.getCurrentUser().email, 'Page created', project.name, 'info', `Added page "${pageName}" to project`);
    }

    return newPage;
  }

  deleteProjectPage(projectId: string, pageName: string): ProjectPage[] {
    const project = this.getProjectById(projectId);
    if (!project || !project.pages || project.pages.length <= 1) return project?.pages || [];

    const remainingPages = project.pages.filter((p) => p.name.toLowerCase() !== pageName.toLowerCase());
    const firstRemaining = remainingPages[0];

    this.updateProject(projectId, {
      pages: remainingPages,
      activePageName: firstRemaining.name,
      analysis: {
        ...project.analysis,
        pages: remainingPages.map((p) => p.name),
      },
      wireframe: {
        ...project.wireframe,
        elements: firstRemaining.elements,
        updatedAt: new Date().toISOString(),
      },
    });

    return remainingPages;
  }

  deleteProject(id: string): void {
    const project = this.getProjectById(id);
    const projects = this.getProjects().filter((p) => p.id !== id);
    this.setItem(PROJECTS_STORAGE_KEY, projects);
    if (project) {
      this.logAudit(this.getCurrentUser().email, 'Project deleted', project.name, 'warning', `Deleted project ${id}`);
    }
  }


  // --- VERSION METHODS ---
  getVersions(projectId: string): WireframeVersion[] {
    const all = this.getItem<WireframeVersion[]>(VERSIONS_STORAGE_KEY, sampleDemoVersions);
    return all.filter((v) => v.projectId === projectId).sort((a, b) => b.versionNumber - a.versionNumber);
  }

  saveVersion(projectId: string, title: string, description: string, elements: WireframeElement[]): WireframeVersion {
    const existing = this.getVersions(projectId);
    const nextNumber = existing.length > 0 ? Math.max(...existing.map((e) => e.versionNumber)) + 1 : 1;
    const user = this.getCurrentUser();

    const newVer: WireframeVersion = {
      id: `ver-${Date.now()}-${nextNumber}`,
      projectId,
      versionNumber: nextNumber,
      title: title || `Version ${nextNumber}`,
      description: description || 'Iterative refinement',
      elements: JSON.parse(JSON.stringify(elements)),
      createdAt: new Date().toISOString(),
      createdBy: `${user.name} (${user.role})`,
      elementCount: elements.length,
    };

    const all = this.getItem<WireframeVersion[]>(VERSIONS_STORAGE_KEY, sampleDemoVersions);
    this.setItem(VERSIONS_STORAGE_KEY, [newVer, ...all]);

    const project = this.getProjectById(projectId);
    this.logAudit(user.email, 'Version created', project?.name, 'info', `Saved Version ${nextNumber}: ${title}`);

    return newVer;
  }

  restoreVersion(projectId: string, versionId: string): WireframeElement[] | null {
    const versions = this.getVersions(projectId);
    const target = versions.find((v) => v.id === versionId);
    if (!target) return null;

    this.updateProjectWireframe(projectId, target.elements);
    const user = this.getCurrentUser();
    const project = this.getProjectById(projectId);
    this.logAudit(user.email, 'Version restored', project?.name, 'warning', `Restored layout to Version ${target.versionNumber}: ${target.title}`);
    return target.elements;
  }

  // --- COMMENTS METHODS ---
  getComments(projectId: string): ProjectComment[] {
    const all = this.getItem<ProjectComment[]>(COMMENTS_STORAGE_KEY, sampleDemoComments);
    return all.filter((c) => c.projectId === projectId);
  }

  addComment(projectId: string, content: string, sectionTitle?: string, elementId?: string): ProjectComment {
    const user = this.getCurrentUser();
    const newComment: ProjectComment = {
      id: `comm-${Date.now()}`,
      projectId,
      sectionTitle,
      elementId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      resolved: false,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    const all = this.getItem<ProjectComment[]>(COMMENTS_STORAGE_KEY, sampleDemoComments);
    this.setItem(COMMENTS_STORAGE_KEY, [newComment, ...all]);
    return newComment;
  }

  toggleCommentResolution(commentId: string): void {
    const all = this.getItem<ProjectComment[]>(COMMENTS_STORAGE_KEY, sampleDemoComments);
    const updated = all.map((c) => (c.id === commentId ? { ...c, resolved: !c.resolved } : c));
    this.setItem(COMMENTS_STORAGE_KEY, updated);
  }

  replyComment(commentId: string, content: string): void {
    const user = this.getCurrentUser();
    const all = this.getItem<ProjectComment[]>(COMMENTS_STORAGE_KEY, sampleDemoComments);
    const updated = all.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: `reply-${Date.now()}`,
              userId: user.id,
              userName: user.name,
              userAvatar: user.avatar,
              content,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    });
    this.setItem(COMMENTS_STORAGE_KEY, updated);
  }

  // --- TEMPLATES METHODS ---
  getTemplates(): Template[] {
    return this.getItem<Template[]>(TEMPLATES_STORAGE_KEY, initialTemplates);
  }

  addTemplate(template: Omit<Template, 'id'>): Template {
    const newTmpl: Template = {
      ...template,
      id: `tmpl-${Date.now()}`,
    };
    const templates = [newTmpl, ...this.getTemplates()];
    this.setItem(TEMPLATES_STORAGE_KEY, templates);
    this.logAudit(this.getCurrentUser().email, 'Template created', newTmpl.name, 'success', `Created template in category ${newTmpl.category}`);
    return newTmpl;
  }

  deleteTemplate(id: string): void {
    const tmpl = this.getTemplates().find((t) => t.id === id);
    const templates = this.getTemplates().filter((t) => t.id !== id);
    this.setItem(TEMPLATES_STORAGE_KEY, templates);
    if (tmpl) {
      this.logAudit(this.getCurrentUser().email, 'Template deleted', tmpl.name, 'warning', `Deleted template ${id}`);
    }
  }

  // --- JOBS & AUDIT ---
  getJobs(): GenerationJob[] {
    return this.getItem<GenerationJob[]>(JOBS_STORAGE_KEY, []);
  }

  recordJob(
    projectId: string | undefined,
    projectName: string,
    model: string,
    durationMs: number,
    status: 'queued' | 'running' | 'completed' | 'failed',
    promptSnippet: string
  ): void {
    const newJob: GenerationJob = {
      id: `job-${Date.now()}`,
      projectId,
      projectName,
      status,
      model,
      durationMs,
      createdAt: new Date().toISOString(),
      tokensUsed: Math.floor(Math.random() * 400) + 450,
      promptSnippet,
    };
    const jobs = [newJob, ...this.getJobs()].slice(0, 100);
    this.setItem(JOBS_STORAGE_KEY, jobs);
  }

  getAuditLogs(): AuditLog[] {
    return this.getItem<AuditLog[]>(AUDIT_STORAGE_KEY, []);
  }

  logAudit(
    userEmail: string,
    action: string,
    projectName?: string,
    status: 'success' | 'warning' | 'info' = 'info',
    details?: string
  ): void {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userEmail,
      action,
      projectName,
      status,
      details,
    };
    const logs = [newLog, ...this.getAuditLogs()].slice(0, 200);
    this.setItem(AUDIT_STORAGE_KEY, logs);
  }

  // --- EXPORTS ---
  getExports(): ExportHistoryItem[] {
    return this.getItem<ExportHistoryItem[]>(EXPORT_STORAGE_KEY, [
      {
        id: 'exp-1',
        projectId: SAMPLE_DEMO_PROJECT_ID,
        projectName: 'Food Delivery Platform',
        format: 'JSON',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        fileSize: '14.2 KB',
      },
      {
        id: 'exp-2',
        projectId: SAMPLE_DEMO_PROJECT_ID,
        projectName: 'Food Delivery Platform',
        format: 'HTML',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        fileSize: '38.6 KB',
      },
    ]);
  }

  recordExport(projectId: string, projectName: string, format: 'JSON' | 'HTML' | 'PNG' | 'PDF', fileSize: string): void {
    const item: ExportHistoryItem = {
      id: `exp-${Date.now()}`,
      projectId,
      projectName,
      format,
      timestamp: new Date().toISOString(),
      fileSize,
    };
    const exports = [item, ...this.getExports()];
    this.setItem(EXPORT_STORAGE_KEY, exports);
    this.logAudit(this.getCurrentUser().email, 'Export performed', projectName, 'success', `Exported as ${format} (${fileSize})`);
    this.recordAnalyticsEvent('export', projectId, projectName, { format, fileSize });
  }

  // --- ANALYTICS EVENTS ---
  getAnalyticsEvents(): AnalyticsEvent[] {
    return this.getItem<AnalyticsEvent[]>(ANALYTICS_STORAGE_KEY, [
      {
        id: 'ev-1',
        eventType: 'project_created',
        projectName: 'Food Delivery Platform',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'ev-2',
        eventType: 'ai_generation',
        projectName: 'Food Delivery Platform',
        metadata: { model: 'gemini-3.8-flash', durationMs: 1450 },
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'ev-3',
        eventType: 'ai_regeneration',
        projectName: 'Food Delivery Platform',
        metadata: { instruction: 'Add meal deals and promo tags' },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'ev-4',
        eventType: 'export',
        projectName: 'Food Delivery Platform',
        metadata: { format: 'HTML', fileSize: '38.6 KB' },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'ev-5',
        eventType: 'template_used',
        metadata: { templateName: 'E-Commerce Living Catalog' },
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ]);
  }

  recordAnalyticsEvent(
    eventType: AnalyticsEvent['eventType'],
    projectId?: string,
    projectName?: string,
    metadata?: Record<string, any>
  ): void {
    const user = this.getCurrentUser();
    const newEvent: AnalyticsEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user?.id,
      eventType,
      projectId,
      projectName,
      metadata,
      createdAt: new Date().toISOString(),
    };
    const events = [newEvent, ...this.getAnalyticsEvents()].slice(0, 500);
    this.setItem(ANALYTICS_STORAGE_KEY, events);
  }

  // --- ASSETS METHODS (Phase 29) ---
  getAssets(): AssetItem[] {
    return this.getItem<AssetItem[]>(ASSETS_STORAGE_KEY, []);
  }

  addAsset(asset: Omit<AssetItem, 'id' | 'createdAt'>): AssetItem {
    const newAsset: AssetItem = {
      ...asset,
      id: `asset-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const assets = [newAsset, ...this.getAssets()];
    this.setItem(ASSETS_STORAGE_KEY, assets);
    this.logAudit(this.getCurrentUser().email, 'Asset uploaded', asset.projectName, 'info', `Added asset "${asset.name}" (${asset.category})`);
    return newAsset;
  }

  deleteAsset(id: string): void {
    const assets = this.getAssets().filter((a) => a.id !== id);
    this.setItem(ASSETS_STORAGE_KEY, assets);
  }

  // --- NOTIFICATIONS METHODS ---
  getNotifications(): AppNotification[] {
    return this.getItem<AppNotification[]>(NOTIFICATIONS_STORAGE_KEY, []);
  }

  markNotificationRead(id: string): void {
    const notifs = this.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    this.setItem(NOTIFICATIONS_STORAGE_KEY, notifs);
  }

  markAllNotificationsRead(): void {
    const notifs = this.getNotifications().map((n) => ({ ...n, read: true }));
    this.setItem(NOTIFICATIONS_STORAGE_KEY, notifs);
  }

  addNotification(notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): AppNotification {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const notifs = [newNotif, ...this.getNotifications()].slice(0, 50);
    this.setItem(NOTIFICATIONS_STORAGE_KEY, notifs);
    return newNotif;
  }

  // --- SYSTEM HEALTH & DATA BACKUP (Phase 39) ---
  exportAllData(): string {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      users: this.getUsers(),
      projects: this.getProjects(),
      templates: this.getTemplates(),
      versions: this.getItem(VERSIONS_STORAGE_KEY, []),
      comments: this.getItem(COMMENTS_STORAGE_KEY, []),
      jobs: this.getJobs(),
      auditLogs: this.getAuditLogs(),
      assets: this.getAssets(),
      analytics: this.getAnalyticsEvents(),
    };
    return JSON.stringify(snapshot, null, 2);
  }

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.projects) this.setItem(PROJECTS_STORAGE_KEY, data.projects);
      if (data.users) this.setItem(USERS_STORAGE_KEY, data.users);
      if (data.templates) this.setItem(TEMPLATES_STORAGE_KEY, data.templates);
      if (data.versions) this.setItem(VERSIONS_STORAGE_KEY, data.versions);
      if (data.comments) this.setItem(COMMENTS_STORAGE_KEY, data.comments);
      if (data.jobs) this.setItem(JOBS_STORAGE_KEY, data.jobs);
      if (data.auditLogs) this.setItem(AUDIT_STORAGE_KEY, data.auditLogs);
      if (data.assets) this.setItem(ASSETS_STORAGE_KEY, data.assets);
      notifyListeners();
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
}

export const store = new StoreService();
