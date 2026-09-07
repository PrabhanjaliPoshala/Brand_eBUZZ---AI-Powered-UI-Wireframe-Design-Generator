-- ==============================================================================
-- AI-Driven Wireframe & Design Concept Generation Platform
-- Complete Supabase PostgreSQL Schema with RLS & Foreign Keys
-- ==============================================================================

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'designer', 'user')),
  avatar TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL DEFAULT 'general',
  devices JSONB NOT NULL DEFAULT '["desktop", "mobile"]'::jsonb,
  requirement TEXT NOT NULL,
  brand_preset JSONB,
  status TEXT NOT NULL DEFAULT 'generated' CHECK (status IN ('draft', 'generated', 'reviewed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PROJECT PAGES (Multi-page wireframe support)
CREATE TABLE IF NOT EXISTS public.project_pages (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. REQUIREMENTS
CREATE TABLE IF NOT EXISTS public.requirements (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  raw_text TEXT NOT NULL,
  domain_hint TEXT,
  parsed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. AI ANALYSIS
CREATE TABLE IF NOT EXISTS public.ai_analysis (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  pages JSONB NOT NULL DEFAULT '["Home"]'::jsonb,
  components JSONB NOT NULL DEFAULT '[]'::jsonb,
  constraints JSONB NOT NULL DEFAULT '[]'::jsonb,
  style_hints JSONB NOT NULL DEFAULT '[]'::jsonb,
  domain TEXT NOT NULL DEFAULT 'general',
  primary_color TEXT NOT NULL DEFAULT '#2563EB',
  design_rationale TEXT,
  is_ai_generated BOOLEAN NOT NULL DEFAULT true,
  source TEXT DEFAULT 'gemini-3.8-flash',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. WIREFRAMES
CREATE TABLE IF NOT EXISTS public.wireframes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  device TEXT NOT NULL DEFAULT 'desktop',
  mode TEXT NOT NULL DEFAULT 'wireframe' CHECK (mode IN ('wireframe', 'preview')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. WIREFRAME VERSIONS
CREATE TABLE IF NOT EXISTS public.wireframe_versions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version_number INT NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  pages JSONB,
  page_name TEXT,
  created_by TEXT NOT NULL,
  element_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. COMMENTS
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  page_name TEXT,
  element_id TEXT,
  section_title TEXT,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. COMMENT REPLIES
CREATE TABLE IF NOT EXISTS public.comment_replies (
  id TEXT PRIMARY KEY,
  comment_id TEXT NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. TEMPLATES
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  domain TEXT NOT NULL,
  description TEXT NOT NULL,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  preview_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  element_count INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. BRAND PRESETS
CREATE TABLE IF NOT EXISTS public.brand_presets (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  primary_color TEXT NOT NULL DEFAULT '#2563EB',
  secondary_color TEXT NOT NULL DEFAULT '#64748B',
  font_family TEXT NOT NULL DEFAULT 'Plus Jakarta Sans',
  border_radius INT NOT NULL DEFAULT 8,
  button_style TEXT NOT NULL DEFAULT 'rounded',
  spacing_style TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. EXPORTS
CREATE TABLE IF NOT EXISTS public.exports (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('JSON', 'HTML', 'PNG', 'PDF')),
  file_size TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. GENERATION JOBS
CREATE TABLE IF NOT EXISTS public.generation_jobs (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
  user_id TEXT,
  project_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  model TEXT NOT NULL DEFAULT 'gemini-3.8-flash',
  duration_ms INT NOT NULL DEFAULT 0,
  tokens_used INT DEFAULT 0,
  prompt_snippet TEXT NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ
);

-- 14. ANALYTICS EVENTS
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  event_type TEXT NOT NULL,
  project_id TEXT,
  project_name TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  project_name TEXT,
  status TEXT NOT NULL DEFAULT 'info' CHECK (status IN ('success', 'warning', 'info')),
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wireframes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wireframe_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users read their own profile or admins read all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Projects: owners can read/write their own projects, admins can read all
CREATE POLICY "Users can manage own projects" ON public.projects
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

CREATE POLICY "Users can manage project pages" ON public.project_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_pages.project_id
      AND (projects.user_id = auth.uid() OR projects.user_id IS NULL OR public.is_admin())
    )
  );

-- Templates: public read for published templates, admin write
CREATE POLICY "Anyone can view published templates" ON public.templates
  FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage templates" ON public.templates
  FOR ALL USING (public.is_admin());

-- Wireframes and Versions: access through project ownership
CREATE POLICY "Users can manage own wireframes" ON public.wireframes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = wireframes.project_id
      AND (projects.user_id = auth.uid() OR projects.user_id IS NULL OR public.is_admin())
    )
  );

CREATE POLICY "Users can manage own versions" ON public.wireframe_versions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = wireframe_versions.project_id
      AND (projects.user_id = auth.uid() OR projects.user_id IS NULL OR public.is_admin())
    )
  );

-- Comments & replies: participants or project owners
CREATE POLICY "Users can view comments on accessible projects" ON public.comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = comments.project_id
      AND (projects.user_id = auth.uid() OR projects.user_id IS NULL OR public.is_admin())
    )
  );

CREATE POLICY "Users can view and add comment replies" ON public.comment_replies
  FOR ALL USING (true);

-- Analytics & Jobs: admins or owners
CREATE POLICY "Admins view all jobs" ON public.generation_jobs
  FOR ALL USING (public.is_admin() OR user_id = auth.uid()::text OR user_id IS NULL);

CREATE POLICY "Admins view audit logs" ON public.audit_logs
  FOR ALL USING (public.is_admin() OR user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins view analytics events" ON public.analytics_events
  FOR ALL USING (public.is_admin() OR user_id = auth.uid()::text OR user_id IS NULL);
