# React Admin Dashboard Specifications

## 1. Overview
The **Portfolio Admin Dashboard** will be a secured, standalone route (e.g., `/admin`) or a separate subdomain application allowing the user to manage content, upload media, and view analytics without touching the codebase.

---

## 2. Tech Stack Requirements
*   **Framework**: React (Vite) - integrated into the current repo or monorepo.
*   **UI Library**: Shadcn/UI (for a professional, accessible interface).
*   **State Management**: TanStack Query (React Query) for handling server state.
*   **Authentication**: Supabase Auth (Email/Password + GitHub OAuth).
*   **Forms**: React Hook Form + Zod (Validation).

---

## 3. Core Modules

### 3.1 Dashboard Home
*   **Quick Stats**: Total Projects, Profile Views (if Analytics connected), Last Updated timestamp.
*   **Quick Actions**: "Add New Project", "Update Status", "Write Blog Post".
*   **System Health**: API Status check.

### 3.2 Profile Manager
*   **Fields**: Name, Designation, Bio (Rich Text Editor / Tiptap), Social Links.
*   **Resume Upload**: Drag-and-drop bucket upload (Supabase Storage) which auto-updates the `resume_url`.
*   **Avatar Config**: Crop and upload profile pictures.

### 3.3 Skill Matrix
*   **Visual Grid**: Display skills as cards (reusing the `SkillCard` component).
*   **Drag-and-Drop Sorting**: Reorder skills.
*   **Edit Modal**: Change Category, Glow Color (Color Picker with preset RGBs), and Icon Key.

### 3.4 Project Studio
*   **CRUD Interface**: Create, Read, Update, Delete projects.
*   **Media Gallery**:
    *   Upload project screenshots.
    *   Set "Featured Image".
*   **Tech Stack Selector**: Multi-select dropdown for technologies.

### 3.5 Automation Hub (Social Integration)
*   **Composio/Pipedream Integration**:
    *   *Trigger*: When a "Project" is published.
    *   *Action*: Auto-post to LinkedIn and Twitter with the project summary and link.
    *   *UI*: Toggle "Auto-Post" checkbox on the project form.

---

## 4. UI/UX Guidelines
*   **Theme**: Strict Dark Mode (matching the portfolio `index.css`).
*   **Navigation**: Sidebar Layout (Dashboard, Projects, Skills, Experiences, Settings).
*   **Feedback**: Toast notifications for all success/error actions.
*   **Safety**: "Unsaved Changes" warnings when navigating away from dirty forms.

---

## 5. Security Checklist
*   [ ] **Route Protection**: Wrap all admin routes in a `<RequireAuth>` high-order component.
*   [ ] **RLS Policies**: Configure Supabase Row Level Security to allow `SELECT` for public (anon) but `INSERT/UPDATE/DELETE` only for the admin user UUID.
*   [ ] **Storage Rules**: Public read access for images; Authenticated write access.
