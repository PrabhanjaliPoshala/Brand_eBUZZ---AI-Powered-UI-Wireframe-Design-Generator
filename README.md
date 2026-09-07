# Wireframe Studio

Wireframe Studio is an AI-assisted wireframe and design concept generation platform. Users describe a website or application in natural language, review the generated information architecture, edit the visual wireframe, preview it responsively, collaborate through comments and versions, and export the result.

## What The Project Does

1. Provides a landing page explaining the product.
2. Supports local and optional Supabase authentication.
3. Creates wireframe projects from natural-language requirements.
4. Uses Gemini when configured, with a deterministic local parser when Gemini is unavailable.
5. Converts analysis into pages, components, layout data, styling, and responsive wireframe elements.
6. Provides an analysis review screen before opening the editor.
7. Provides a visual editor with component library, canvas, properties panel, device views, zoom, undo/redo, preview mode, and regeneration.
8. Stores projects and workspace data locally so the application remains usable without Supabase.
9. Supports project details, comments, version history, analytics, assets, templates, settings, administration, and public preview.
10. Exports standalone HTML, JSON, Markdown specification, and SVG blueprint files.

## Technology Stack

- React 19
- TypeScript 5.8
- Vite 6
- Express 4
- React Router 7
- Tailwind CSS 4
- Lucide React icons
- Google GenAI SDK
- Supabase JS SDK
- localStorage fallback persistence
- esbuild for the production server bundle

## Requirements

- Node.js 20 or newer recommended
- npm
- Windows, macOS, or Linux

## Installation

From the project directory:

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` when environment configuration is needed.

```env
GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

All variables are optional for local testing:

- Without `GEMINI_API_KEY`, the built-in deterministic requirement parser is used.
- Without Supabase variables, authentication and persistence use localStorage.
- Do not commit real API keys or Supabase secrets.

## Run The Application

### Development

```bash
npm run dev
```

The server normally starts at:

```text
http://localhost:3000
```

If port 3000 is already occupied, the server automatically tries the next port, such as 3001.

### Production Build

```bash
npm run build
npm start
```

The build creates:

- `dist/index.html`
- `dist/assets/*`
- `dist/server.cjs`

### TypeScript Check

```bash
npm run lint
```

### Vite Preview

```bash
npm run preview
```

## Main User Workflow

### 1. Create an account

Open `/signup`, enter a name, email, password, confirmation, and role. The local fallback creates an active user and redirects to the dashboard.

### 2. Open the dashboard

The dashboard provides:

- Workspace navigation
- User profile and logout
- Project search and filtering
- Project cards
- Duplicate and delete actions
- Statistics
- Recommended templates
- New wireframe actions

### 3. Generate a wireframe

Open `/projects/new` and provide:

- Project name
- Optional description
- Industry domain
- Target devices
- Natural-language requirement

The generator then:

1. Parses the requirement using Gemini or the fallback parser.
2. Detects domain, pages, components, style hints, constraints, and primary color.
3. Creates a project in the store.
4. Opens the analysis review page.

### 4. Review AI analysis

The analysis page allows users to:

- Add or remove pages
- Select components
- Change domain
- Change primary color
- Edit design rationale
- Review layout constraints
- Save changes
- Open the visual canvas

### 5. Edit the wireframe

The editor supports:

- Desktop, tablet, and mobile views
- Wireframe and preview modes
- Zoom controls
- Component library
- Component selection
- Properties editing
- Layer/page navigation
- Add and delete elements
- Undo and redo
- AI regeneration
- Comments
- Version history
- Sharing
- Exporting

### 6. Preview and export

The public preview displays the generated layout as an interactive presentation. Export options include:

- Standalone HTML
- Structured JSON
- Markdown design specification
- SVG blueprint

## Route Map

### Public routes

| Route | Purpose |
| --- | --- |
| `/` | Product landing page |
| `/login` | Sign-in page |
| `/signup` | Account creation |
| `/forgot-password` | Password recovery |
| `/preview/:projectId` | Public project preview |
| `*` | 404 page |

### Protected routes

| Route | Purpose |
| --- | --- |
| `/dashboard` | Main workspace dashboard |
| `/projects` | All projects directory |
| `/projects/new` | New project generator |
| `/projects/:projectId` | Project details |
| `/projects/:projectId/analysis` | AI analysis review |
| `/projects/:projectId/editor` | Visual wireframe editor |
| `/projects/:projectId/comments` | Project comments and review |
| `/projects/:projectId/versions` | Version history |
| `/projects/:projectId/export` | Export center |
| `/templates` | Template gallery |
| `/assets` | Asset management |
| `/analytics` | Usage and generation analytics |
| `/settings` | Workspace settings |
| `/admin` | Admin workspace |
| `/admin/:tab` | Admin section |

Unauthenticated users are redirected to `/login` by `ProtectedRoute`.

## Backend API

The Express server exposes these endpoints:

### Health

```http
GET /api/health
```

Returns server status and whether Gemini is configured.

### Requirement analysis

```http
POST /api/ai/parse-requirement
Content-Type: application/json

{
  "requirement": "Create a food delivery application with restaurant search and checkout",
  "domainHint": "food_delivery"
}
```

The response contains structured analysis such as pages, components, constraints, domain, style hints, and primary color.

### AI regeneration

```http
POST /api/ai/regenerate
Content-Type: application/json

{
  "project": {},
  "instruction": "Make the hero more minimal and add a pricing section"
}
```

If Gemini is unavailable or fails, the endpoint returns a safe fallback response.

## AI Fallback Behavior

AI is optional. The deterministic parser in `server.ts` detects common keywords for:

- Food delivery
- E-commerce
- SaaS
- Dashboards
- Portfolios
- Education
- Finance
- General applications

It also derives likely pages, components, style hints, colors, and constraints. This means project creation remains functional when no API key is available.

AI responses are normalized before being stored. Invalid domains are converted to `general`, and missing page/component data receives safe defaults.

## Data Persistence

The store service uses localStorage as the reliable local persistence layer. It manages:

- Users
- Current session
- Projects
- Wireframe versions
- Comments
- Templates
- Jobs
- Audit logs
- Exports
- Analytics events
- Assets
- Notifications

Supabase is optional. When configured, authentication and cloud operations can be used. If Supabase is missing or unavailable, the UI continues with local data instead of showing a blank screen.

## Important Source Files

| File or folder | Responsibility |
| --- | --- |
| `src/main.tsx` | React entry point |
| `src/App.tsx` | Application routes |
| `src/pages/` | Feature pages |
| `src/components/` | Reusable UI, editor, auth, and modal components |
| `src/services/store.ts` | Local persistence and project state |
| `src/services/supabase.ts` | Optional Supabase authentication and profiles |
| `src/services/aiService.ts` | Client-side analysis and wireframe synthesis |
| `src/services/exporter.ts` | HTML, JSON, Markdown, and SVG exports |
| `src/data/` | Templates, component definitions, and demo data |
| `src/types/index.ts` | Shared TypeScript types |
| `src/index.css` | Global styles and Tailwind entry |
| `server.ts` | Express server, Vite middleware, AI API, and fallback parser |
| `supabase/schema.sql` | Supabase database schema |
| `vite.config.ts` | Vite and Tailwind configuration |
| `tsconfig.json` | TypeScript configuration |

## Demo Data

The application initializes a sample project and template data when localStorage is empty. The first run therefore has content to explore immediately.

A local demo login is available from the login screen. For production, configure Supabase and use real accounts instead.

## Verification Commands

Run the following before committing or deploying:

```bash
npm run lint
npm run build
```

Manual smoke test:

1. Open `/`.
2. Open `/signup` and create a local account.
3. Confirm that the dashboard opens.
4. Open `/projects/new`.
5. Enter a requirement and generate a wireframe.
6. Confirm the analysis page opens.
7. Open the visual canvas.
8. Test preview mode.
9. Open export and download a JSON or HTML file.
10. Visit comments, versions, project details, and public preview.
11. Visit an invalid URL and confirm the intended 404 screen appears.

## Troubleshooting

### Port already in use

The server automatically tries the next port. Read the terminal output for the active URL.

### Red TypeScript markers in VS Code

Run:

```text
Ctrl+Shift+P -> TypeScript: Restart TS Server
```

Then reload the VS Code window. Confirm with:

```bash
npm run lint
```

### Gemini is unavailable

This is supported. Remove or leave `GEMINI_API_KEY` unset and the deterministic fallback parser will continue to generate project analysis.

### Supabase is unavailable

The local store remains active. Check that browser localStorage is enabled.

### A protected page redirects to login

Create an account through `/signup` or use the login page before opening protected routes.

## Current Validation Status

The project has been validated with:

- TypeScript compilation via `npm run lint`
- Production build via `npm run build`
- Public route smoke tests
- Protected route smoke tests
- Signup flow
- New wireframe generation
- AI analysis review
- Visual editor opening
- Preview mode
- Export modal
- Project details, comments, versions, export center, templates, assets, analytics, settings, admin access control, and public preview

The production build may display a bundle-size warning because the application currently ships a large shared JavaScript bundle. This is an optimization warning, not a build failure.
