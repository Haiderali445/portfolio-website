# React Admin Dashboard Specifications

## 1. Overview
The **Portfolio Admin Dashboard** is a secured, standalone application at `/admin` route, enabling dynamic content management, drag-and-drop page building, and agentic workflow monitoring—all powered by **Supabase** and deployed on **Vercel Hobby Tier** for $0 cost.

---

## 2. Tech Stack Requirements

### 2.1 Core Framework
*   **React**: Version 19 (latest stable)
*   **Build Tool**: Vite 5+ (fast HMR, optimized production builds)
*   **Deployment**: Vercel Hobby Tier (100GB bandwidth/month, global CDN)

### 2.2 Admin Framework
*   **Refine.js**: Headless admin framework for rapid CRUD development
    *   **Data Provider**: `@refinedev/supabase` for direct Supabase integration
    *   **Router**: React Router v6
    *   **Auth Provider**: Supabase Auth (Email/Password + GitHub OAuth)

### 2.3 UI & Styling
*   **Component Library**: Shadcn/UI (accessible, customizable components)
*   **Styling**: Tailwind CSS (matching portfolio dark theme)
*   **Icons**: Lucide React (consistent with portfolio)
*   **Theme**: Strict Dark Mode (reuse `index.css` design tokens)

### 2.4 Page Builder
*   **Puck.js**: Visual drag-and-drop page builder
    *   **Version**: Latest stable (v0.14+)
    *   **Purpose**: Reorder portfolio sections without code changes
    *   **Storage**: Layout JSON saved to Supabase `page_layouts` table

### 2.5 Forms & Validation
*   **React Hook Form**: Performant form state management
*   **Zod**: TypeScript-first schema validation
*   **Rich Text**: Tiptap editor for bio/project descriptions

### 2.6 State Management
*   **TanStack Query** (React Query v5): Server state, caching, optimistic updates
*   **Zustand**: Client state for UI preferences (optional)

---

## 3. Core Modules

### 3.1 Dashboard Home
*   **Quick Stats Cards**:
    *   Total Projects (count from `projects` table)
    *   Total Skills (count from `skills` table)
    *   Last Updated (max `updated_at` across all tables)
    *   API Health Status (ping FastAPI `/health` endpoint)
*   **Quick Actions**:
    *   "Add New Project" → Navigate to Project Studio
    *   "Reorder Sections" → Open Puck.js Page Builder
    *   "View Agent Memory" → Navigate to Agentic Workflow Module
*   **Recent Activity Feed**:
    *   Last 10 updates across all tables (using audit `updated_at` fields)

### 3.2 Profile Manager
*   **Fields**:
    *   Name, Designation, Bio (Tiptap Rich Text Editor)
    *   Email, Phone, Location
    *   Social Links (GitHub, LinkedIn, Instagram, Twitter)
*   **Resume Upload**:
    *   Drag-and-drop file upload to Supabase Storage
    *   Auto-update `resume_url` in `profile` table
    *   File size limit: 2MB (PDF only)
*   **Avatar Config**:
    *   Image cropper (react-easy-crop)
    *   Upload to Supabase Storage
    *   Auto-update `avatar_url`

### 3.3 Skill Matrix
*   **Visual Grid**: Display skills as cards (reuse portfolio `SkillCard` component)
*   **Drag-and-Drop Sorting**:
    *   Library: `@dnd-kit/core` + `@dnd-kit/sortable`
    *   Reorder skills within categories
    *   Auto-save new order to `proficiency` field (or add `order` column)
*   **Edit Modal**:
    *   Category dropdown (AI, Backend, Solutions, Other)
    *   Glow Color picker (preset RGB values + custom hex input)
    *   Icon Key selector (searchable dropdown of available icons)
    *   Proficiency slider (0-100)
    *   Featured toggle

### 3.4 Project Studio
*   **CRUD Interface**:
    *   List view with search/filter (by technology, featured status)
    *   Create/Edit form with all fields
    *   Delete with confirmation modal
*   **Media Gallery**:
    *   Multi-image upload to Supabase Storage
    *   Drag-to-reorder images
    *   Set "Featured Image" (update `thumbnail_url`)
    *   Image compression before upload (target: <200KB per image)
*   **Tech Stack Selector**:
    *   Multi-select dropdown (react-select)
    *   Auto-suggest from existing technologies in database
    *   Add new technologies on-the-fly
*   **Slug Auto-Generation**:
    *   Auto-generate URL-safe slug from title
    *   Validate uniqueness against database

### 3.5 Automation Hub (Social Integration)
*   **Composio/Pipedream Integration**:
    *   **Trigger**: When a project's `featured_order` is set (published)
    *   **Action**: Auto-post to LinkedIn and Twitter
    *   **Content Template**:
        ```
        🚀 New Project: {title}
        
        {summary}
        
        🔗 View live: {demo_link}
        💻 Source: {repo_link}
        
        #webdev #react #{technologies[0]}
        ```
    *   **UI Controls**:
        *   Toggle "Auto-Post" checkbox on project form
        *   Preview post content before publishing
        *   Manual retry button for failed posts
*   **Webhook Configuration**:
    *   Supabase Database Webhook on `projects` INSERT/UPDATE
    *   Endpoint: Pipedream workflow URL
    *   Payload: Full project object

### 3.6 Layout Management (Puck.js Integration)

#### Purpose
Enable visual reordering of portfolio sections (Hero, Skills, Projects, Solutions, etc.) without code changes.

#### Implementation

**Puck.js Configuration**:
```javascript
import { Puck } from "@measured/puck";

const config = {
  components: {
    Hero: {
      fields: {
        visible: { type: "radio", options: [{ label: "Show", value: true }, { label: "Hide", value: false }] }
      },
      defaultProps: { visible: true },
      render: ({ visible }) => <div>Hero Section {visible ? "✓" : "✗"}</div>
    },
    Skills: {
      fields: { visible: { type: "radio", options: [{ label: "Show", value: true }, { label: "Hide", value: false }] } },
      defaultProps: { visible: true },
      render: ({ visible }) => <div>Skills Section {visible ? "✓" : "✗"}</div>
    },
    Projects: { /* similar structure */ },
    Solutions: { /* similar structure */ },
    Experience: { /* similar structure */ },
    Contact: { /* similar structure */ }
  }
};
```

**Layout JSON Schema** (saved to `page_layouts` table):
```json
{
  "page_name": "home",
  "layout_json": {
    "content": [
      { "type": "Hero", "props": { "visible": true } },
      { "type": "Skills", "props": { "visible": true } },
      { "type": "Projects", "props": { "visible": true } },
      { "type": "Solutions", "props": { "visible": true } },
      { "type": "Experience", "props": { "visible": false } },
      { "type": "Contact", "props": { "visible": true } }
    ],
    "root": { "props": {} }
  },
  "is_published": false,
  "version": 1
}
```

**Workflow**:
1.  **Edit Mode**: Admin opens `/admin/layout-builder`
2.  **Drag & Drop**: Reorder sections using Puck.js visual editor
3.  **Preview**: Toggle preview mode to see changes
4.  **Save Draft**: Save to `page_layouts` with `is_published = false`
5.  **Publish**: Set `is_published = true`, increment `version`
6.  **Frontend Consumption**: Portfolio fetches published layout and renders sections in order

**Supabase Integration**:
```javascript
// Save layout
const saveLayout = async (layoutData) => {
  const { data, error } = await supabase
    .from('page_layouts')
    .upsert({
      page_name: 'home',
      layout_json: layoutData,
      is_published: false,
      version: currentVersion + 1
    });
};

// Publish layout
const publishLayout = async (layoutId) => {
  await supabase
    .from('page_layouts')
    .update({ is_published: true })
    .eq('id', layoutId);
};
```

### 3.7 Agentic Workflow Module

#### Agent Memory Viewer
*   **Table View**: Display `agent_memory` entries
    *   Columns: Timestamp, Thought Type, Content (truncated), Metadata
    *   Filter by: `thought_type`, date range, `agent_id`
    *   Search: Full-text search on `content`
*   **Detail Modal**:
    *   Full thought content
    *   Metadata JSON viewer
    *   Related context (linked `agent_context` entries)
    *   Semantic similarity search (find related thoughts)

#### Task Queue Manager
*   **Queue Dashboard**:
    *   Pending tasks count (by priority)
    *   Processing tasks (with progress indicators)
    *   Completed tasks (last 24 hours)
    *   Failed tasks (with retry button)
*   **Manual Task Creation**:
    *   Form to create new tasks
    *   Task type selector (generate_project_description, update_skills, etc.)
    *   Priority slider (1-10)
    *   Payload JSON editor
    *   Schedule time picker
*   **Task Detail View**:
    *   Full payload
    *   Execution logs
    *   Error messages (if failed)
    *   Retry history

#### Agent Performance Metrics
*   **Charts** (using Recharts):
    *   Tasks processed per day (line chart)
    *   Success vs. failure rate (pie chart)
    *   Average task execution time (bar chart)
    *   Memory growth over time (area chart)

---

## 4. UI/UX Guidelines

### 4.1 Theme
*   **Strict Dark Mode**: Match portfolio `index.css` design tokens
*   **Color Palette**:
    *   Background: `#0a0a0a` (near-black)
    *   Surface: `#1a1a1a` (cards, modals)
    *   Primary: `#8B5CF6` (purple accent)
    *   Text: `#e5e5e5` (high contrast)
*   **Typography**: Inter font family (same as portfolio)

### 4.2 Navigation
*   **Layout**: Sidebar + Top Bar
    *   **Sidebar**: Collapsible, icons + labels
        *   Dashboard, Projects, Skills, Experience, Solutions, Layout Builder, Agent Workflows, Settings
    *   **Top Bar**: User avatar, notifications, logout button
*   **Active State**: Highlight current route with purple accent

### 4.3 Feedback
*   **Toast Notifications**: Sonner library (lightweight, accessible)
    *   Success: Green checkmark, auto-dismiss (3s)
    *   Error: Red X, manual dismiss
    *   Info: Blue info icon, auto-dismiss (5s)
*   **Loading States**:
    *   Skeleton loaders for tables/cards
    *   Spinner for buttons during async actions
*   **Optimistic Updates**: Immediate UI update, rollback on error

### 4.4 Safety
*   **Unsaved Changes Warning**:
    *   Detect dirty forms (React Hook Form `formState.isDirty`)
    *   Show confirmation modal on navigation attempt
*   **Delete Confirmation**:
    *   Two-step delete (button → modal with "Type to confirm")
*   **Auto-Save**: Draft mode for long forms (save every 30 seconds)

---

## 5. Security Checklist

### 5.1 Authentication
*   [ ] **Route Protection**: Wrap all `/admin/*` routes in `<RequireAuth>` component
*   [ ] **Session Management**: Supabase Auth with refresh tokens
*   [ ] **OAuth Integration**: GitHub OAuth for passwordless login
*   [ ] **Session Timeout**: Auto-logout after 30 minutes of inactivity

### 5.2 Authorization
*   [ ] **RLS Policies**: Enforce admin UUID check on all tables (see `BACKEND_ROADMAP.md`)
*   [ ] **Service Role Key**: Store in environment variables, never expose to client
*   [ ] **API Key Rotation**: Document process for rotating Supabase keys

### 5.3 Data Protection
*   [ ] **Storage Rules**: Public read for images, authenticated write for admin
*   [ ] **File Upload Validation**: Check file type, size, and scan for malware (ClamAV on Render)
*   [ ] **XSS Prevention**: Sanitize rich text editor output (DOMPurify)
*   [ ] **CSRF Protection**: Supabase handles this automatically

### 5.4 Monitoring
*   [ ] **Audit Logs**: Track all CRUD operations with `created_at`/`updated_at`
*   [ ] **Failed Login Attempts**: Monitor Supabase Auth logs
*   [ ] **Suspicious Activity**: Alert on bulk deletes or rapid updates

---

## 6. Vercel Deployment Configuration

### 6.1 Environment Variables
```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# FastAPI Backend
VITE_API_BASE_URL=https://your-api.onrender.com

# Optional: Analytics
VITE_VERCEL_ANALYTICS_ID=your-analytics-id
```

### 6.2 Build Configuration (`vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/admin/:path*", "destination": "/admin/:path*" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 6.3 Edge Caching Strategy
*   **Static Assets**: `max-age=31536000` (1 year, immutable)
*   **HTML**: `max-age=0, must-revalidate` (always fresh)
*   **API Responses**: `max-age=60, stale-while-revalidate=300` (1-min cache, 5-min stale)

### 6.4 Bandwidth Optimization
*   **Image Optimization**: Use Vercel Image Optimization API
    ```jsx
    import Image from 'next/image'; // If using Next.js
    <Image src={project.thumbnail_url} width={400} height={300} alt={project.title} />
    ```
*   **Code Splitting**: Lazy load routes with React.lazy()
    ```javascript
    const ProjectStudio = lazy(() => import('./modules/ProjectStudio'));
    ```
*   **Tree Shaking**: Ensure Vite's production build removes unused code
*   **Compression**: Vercel automatically serves Brotli/Gzip

### 6.5 Monitoring Dashboard
*   **Vercel Analytics**: Enable Web Vitals tracking
*   **Bandwidth Usage**: Check Vercel dashboard weekly
*   **Alert Threshold**: Set up email alert at 80GB (80% of 100GB limit)

---

## 7. Development Workflow

### 7.1 Local Setup
```bash
# Clone repo
git clone https://github.com/your-username/portfolio-admin.git
cd portfolio-admin

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run dev server
npm run dev
```

### 7.2 Database Migrations
*   Use Supabase CLI for schema changes
    ```bash
    supabase migration new add_page_layouts_table
    # Edit migration file
    supabase db push
    ```

### 7.3 Testing Strategy
*   **Unit Tests**: Vitest for utility functions
*   **Component Tests**: React Testing Library for UI components
*   **E2E Tests**: Playwright for critical user flows (login, create project, publish layout)

### 7.4 Deployment
```bash
# Push to main branch
git push origin main

# Vercel auto-deploys on push
# Monitor deployment at vercel.com/dashboard
```

---

## 8. Future Enhancements

### 8.1 Advanced Features
*   **Version Control**: Track layout versions, rollback capability
*   **A/B Testing**: Test different section orders, track engagement
*   **Analytics Integration**: Heatmaps, scroll depth, section engagement
*   **Collaborative Editing**: Real-time collaboration with Supabase Realtime

### 8.2 AI Enhancements
*   **Auto-Tagging**: AI suggests project tags based on description
*   **Content Suggestions**: AI recommends improvements to project descriptions
*   **Image Alt Text**: Auto-generate accessible alt text for images
*   **SEO Optimization**: AI-powered meta description generation

### 8.3 Performance
*   **Incremental Static Regeneration**: Pre-render portfolio pages
*   **Service Worker**: Offline support for admin dashboard
*   **WebSocket**: Real-time updates for task queue status
