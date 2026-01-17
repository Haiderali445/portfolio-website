# System Handover & Backend Roadmap

## 1. Executive Summary
This document outlines the technical transition from the current **Client-Side Data Architecture** (Phase 3) to a fully **Server-Side Driven Architecture** (Phase 4). The goal is to implement a robust, scalable backend using **Supabase** (PostgreSQL) and a **Semantic API Layer** to enable dynamic content management and AI-driven updates.

---

## 2. Database Schema Design (Supabase/PostgreSQL)

The database will consist of the following core tables. All tables will include standard audit fields: `id` (UUID), `created_at` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ).

### 2.1 Core Tables

#### `profile`
*   **id**: UUID (Primary Key)
*   **name**: TEXT
*   **designation**: TEXT
*   **bio**: TEXT (HTML supported)
*   **email**: TEXT
*   **phone**: TEXT
*   **location**: TEXT
*   **resume_url**: TEXT (PDF Link)
*   **avatar_url**: TEXT (Image Link)
*   **social_links**: JSONB
    *   *Schema*: `{ github: string, linkedin: string, instagram: string, twitter: string }`

#### `skills`
*   **id**: UUID (Primary Key)
*   **name**: TEXT (e.g., "React")
*   **category**: TEXT (Enum: 'AI', 'Backend', 'Solutions', 'Other')
*   **glow_hex**: TEXT (e.g., "#8B5CF6") - *Used to drive the RGB shadow logic*
*   **icon_path**: TEXT
*   **proficiency**: INTEGER (0-100)
*   **is_featured**: BOOLEAN

#### `projects`
*   **id**: UUID (Primary Key)
*   **title**: TEXT
*   **slug**: TEXT (Unique, for routing)
*   **summary**: TEXT
*   **description**: TEXT (Markdown/HTML)
*   **thumbnail_url**: TEXT
*   **technologies**: TEXT[] (Array of strings)
*   **demo_link**: TEXT
*   **repo_link**: TEXT
*   **featured_order**: INTEGER (Nullable, for sorting)

#### `experience`
*   **id**: UUID (Primary Key)
*   **company**: TEXT
*   **role**: TEXT
*   **start_date**: DATE
*   **end_date**: DATE (Nullable, NULL = Present)
*   **description**: TEXT
*   **skills_used**: TEXT[]
*   **logo_url**: TEXT

#### `solutions` (Bento Grid Content)
*   **id**: UUID (Primary Key)
*   **title**: TEXT (e.g., "AI Integration")
*   **icon_key**: TEXT
*   **items**: JSONB
    *   *Schema*: `[{ label: string, status: string }]`
*   **order**: INTEGER

#### `testimonials`
*   **id**: UUID (Primary Key)
*   **author_name**: TEXT
*   **author_role**: TEXT
*   **company**: TEXT
*   **content**: TEXT
*   **avatar_url**: TEXT
*   **is_visible**: BOOLEAN

---

## 3. Semantic API Layer

We will implement a Node.js/Express (or Next.js API Route) layer to serve data. This abstraction allows for future AI agent integration.

### 3.1 Endpoints

*   `GET /api/v1/portfolio/full`: Fetches the aggregated JSON object matching the current `usePortfolioData` hook structure.
    *   *Response*: `{ personal, skills, projects, experience, ... }`
    *   *Cache Strategy*: Redis or Vercel Edge Cache (TTL: 60s).

*   `POST /api/v1/admin/update-node`: Generic endpoint for AI Agents to update specific content nodes.
    *   *Body*: `{ collection: 'skills', id: '...', updates: { ... } }`
    *   *Security*: Bearer Token (Service Role).

### 3.2 AI Integration Points
*   **Content Generation**: The API will accept prompts to auto-generate project descriptions.
*   **Skill Extraction**: Webhooks on GitHub push events can trigger an analysis of the repo to auto-suggest new skills in the `skills` table.

---

## 4. Migration Strategy

1.  **Setup Supabase Project**: Initialize Auth and Database.
2.  **Seed Data**: Write a script to push local `src/utils/data/*.js` content into Supabase tables.
3.  **Update Client Hook**:
    *   Modify `src/hooks/usePortfolioData.js`.
    *   Replace the `setTimeout` mock with `supabase.from(...).select(...)` calls.
    *   Implement `Promise.all` to fetch all tables in parallel.
4.  **Admin Dashboard**: Connect the React Admin Dashboard (see `DASHBOARD_SPECS.md`) to Supabase.
