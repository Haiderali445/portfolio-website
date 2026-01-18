# System Integration Flow - Three Repository Architecture

## Overview

This document explains how the three separate repositories communicate securely:

1. **Portfolio Frontend** (Repo 1) - Main public-facing portfolio
2. **Admin Dashboard** (Repo 2) - Content management dashboard
3. **Backend API** (Repo 3) - FastAPI server with database access

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                 │
└────────────┬──────────────────────────┬─────────────────────┘
             │                          │
             │ View Portfolio           │ Admin Access
             ▼                          ▼
┌────────────────────────┐   ┌────────────────────────┐
│  REPO 1: PORTFOLIO     │   │  REPO 2: DASHBOARD     │
│  (Vercel)              │   │  (Vercel)              │
│                        │   │                        │
│  - React 19            │   │  - React 19            │
│  - Vite                │   │  - Refine.js           │
│  - Tailwind CSS        │   │  - Puck.js             │
│  - Framer Motion       │   │  - Shadcn/UI           │
│                        │   │                        │
│  URL: portfolio.app    │   │  URL: admin.app        │
└────────┬───────────────┘   └────────┬───────────────┘
         │                            │
         │ GET /api/v1/portfolio/full │ POST /api/v1/admin/*
         │                            │ (with X-API-Key header)
         │                            │
         └────────────┬───────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │  REPO 3: BACKEND           │
         │  (Render Free Tier)        │
         │                            │
         │  - FastAPI (Python)        │
         │  - asyncpg                 │
         │  - Groq/HF AI              │
         │                            │
         │  URL: api.onrender.com     │
         └────────────┬───────────────┘
                      │
                      │ PostgreSQL Connection
                      ▼
         ┌────────────────────────────┐
         │  SUPABASE                  │
         │  (Free Tier)               │
         │                            │
         │  - PostgreSQL + pgvector   │
         │  - Row Level Security      │
         │  - Storage (images)        │
         │  - Auth (admin users)      │
         │                            │
         └────────────────────────────┘
```

---

## CORS Configuration

### Problem
By default, browsers block requests from one domain to another (Cross-Origin Resource Sharing).

### Solution
Configure the backend to allow specific origins.

### Backend CORS Setup (Repo 3)

In `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

# Environment variable format:
# ALLOWED_ORIGINS=https://portfolio.vercel.app,https://admin.vercel.app

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Specific domains only
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE
    allow_headers=["*"],  # Including X-API-Key
)
```

### Environment Variables for Each Repo

**Repo 1 (Portfolio) - `.env`**:
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

**Repo 2 (Dashboard) - `.env`**:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_ADMIN_API_KEY=your-admin-api-key
```

**Repo 3 (Backend) - `.env`**:
```env
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
ADMIN_API_KEY=your-admin-api-key
ALLOWED_ORIGINS=https://portfolio.vercel.app,https://admin.vercel.app
GROQ_API_KEY=your-groq-key
```

---

## Data Flow Scenarios

### Scenario 1: User Views Portfolio

```
1. User visits https://portfolio.vercel.app
2. Portfolio frontend loads
3. Frontend calls: GET https://api.onrender.com/api/v1/portfolio/full
4. Backend queries Supabase (public read access via RLS)
5. Backend returns JSON: { personal, skills, projects, experience }
6. Frontend renders portfolio sections
```

**Code Example (Repo 1)**:

```javascript
// src/hooks/usePortfolioData.js
export function usePortfolioData() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/portfolio/full`
      );
      const json = await response.json();
      setData(json);
    }
    fetchData();
  }, []);
  
  return data;
}
```

### Scenario 2: Admin Edits Project

```
1. Admin logs into https://admin.vercel.app
2. Dashboard authenticates via Supabase Auth
3. Admin navigates to Projects > Edit
4. Admin updates project title and saves
5. Dashboard calls: POST https://api.onrender.com/api/v1/admin/update-node
   Headers: { X-API-Key: "admin-key" }
   Body: { collection: "projects", id: "uuid", updates: { title: "New Title" } }
6. Backend verifies API key
7. Backend updates Supabase (admin write access via RLS)
8. Backend returns success
9. Dashboard shows success toast
```

**Code Example (Repo 2)**:

```javascript
// src/pages/projects/ProjectEdit.jsx
async function handleSave(projectId, updates) {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/update-node`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_ADMIN_API_KEY,
      },
      body: JSON.stringify({
        collection: 'projects',
        id: projectId,
        updates,
      }),
    }
  );
  
  if (response.ok) {
    toast.success('Project updated!');
  }
}
```

### Scenario 3: Admin Reorders Sections with Puck.js

```
1. Admin opens Layout Builder in dashboard
2. Puck.js loads current layout from Supabase
3. Admin drags "Skills" section above "Projects"
4. Admin clicks "Publish"
5. Dashboard saves layout JSON to Supabase page_layouts table
   (Direct Supabase client, no backend needed)
6. Portfolio frontend fetches published layout on next load
7. Portfolio renders sections in new order
```

**Code Example (Repo 2)**:

```javascript
// src/pages/LayoutBuilder.jsx
import { Puck } from "@measured/puck";
import { supabaseClient } from "../supabaseClient";

async function handlePublish(layoutData) {
  const { error } = await supabaseClient
    .from('page_layouts')
    .upsert({
      page_name: 'home',
      layout_json: layoutData,
      is_published: true,
      version: Date.now(),
    });
  
  if (!error) {
    toast.success('Layout published!');
  }
}
```

**Code Example (Repo 1)**:

```javascript
// src/hooks/useLayoutData.js
import { supabaseClient } from "../supabaseClient";

export function useLayoutData() {
  const [layout, setLayout] = useState(null);
  
  useEffect(() => {
    async function fetchLayout() {
      const { data } = await supabaseClient
        .from('page_layouts')
        .select('*')
        .eq('page_name', 'home')
        .eq('is_published', true)
        .order('version', { ascending: false })
        .limit(1)
        .single();
      
      setLayout(data?.layout_json);
    }
    fetchLayout();
  }, []);
  
  return layout;
}
```

---

## Security Best Practices

### 1. API Key Protection

**Backend (Repo 3)**:
- Store `ADMIN_API_KEY` in Render environment variables
- Verify key on every admin endpoint
- Use strong random keys (32+ characters)

**Dashboard (Repo 2)**:
- Store `VITE_ADMIN_API_KEY` in Vercel environment variables
- Never commit `.env` to Git
- Rotate keys every 90 days

### 2. Row Level Security (RLS)

**Supabase Configuration**:

```sql
-- Public can read, admin can write
CREATE POLICY "Public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin write" ON projects FOR ALL USING (auth.uid() = 'admin-uuid');
```

**Benefits**:
- Even if API key is compromised, RLS prevents unauthorized writes
- Direct Supabase access from dashboard is still protected

### 3. CORS Restrictions

**Backend Configuration**:
```python
# ❌ BAD: Allow all origins
allow_origins=["*"]

# ✅ GOOD: Specific domains only
allow_origins=[
  "https://portfolio.vercel.app",
  "https://admin.vercel.app"
]
```

### 4. HTTPS Only

- All three repos MUST use HTTPS in production
- Vercel and Render provide free SSL certificates
- Never send API keys over HTTP

---

## Deployment Checklist

### Initial Setup

- [ ] Deploy Backend (Repo 3) to Render
- [ ] Deploy Dashboard (Repo 2) to Vercel
- [ ] Deploy Portfolio (Repo 1) to Vercel
- [ ] Setup Supabase project and run schema SQL
- [ ] Create admin user in Supabase Auth

### Environment Variables

- [ ] Backend: Set `ALLOWED_ORIGINS` with both Vercel URLs
- [ ] Backend: Set `DATABASE_URL` from Supabase
- [ ] Backend: Generate and set `ADMIN_API_KEY`
- [ ] Dashboard: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Dashboard: Set `VITE_API_BASE_URL` (Render URL)
- [ ] Dashboard: Set `VITE_ADMIN_API_KEY` (same as backend)
- [ ] Portfolio: Set `VITE_API_BASE_URL` (Render URL)

### CORS Testing

- [ ] Test portfolio can fetch from backend (no CORS errors)
- [ ] Test dashboard can POST to backend (no CORS errors)
- [ ] Verify browser console shows no CORS warnings

### RLS Testing

- [ ] Verify anonymous users can read portfolio data
- [ ] Verify only admin user can write to tables
- [ ] Test dashboard CRUD operations work
- [ ] Test direct Supabase access from dashboard

---

## Troubleshooting

### Issue: CORS Error in Browser Console

**Error**: `Access to fetch at 'https://api.onrender.com' from origin 'https://portfolio.vercel.app' has been blocked by CORS policy`

**Solution**:
1. Check backend `ALLOWED_ORIGINS` includes the exact origin
2. Ensure no trailing slashes in URLs
3. Redeploy backend after changing environment variables

### Issue: "Unauthorized" on Admin Endpoints

**Error**: `401 Unauthorized`

**Solution**:
1. Verify `X-API-Key` header is being sent
2. Check `VITE_ADMIN_API_KEY` matches backend `ADMIN_API_KEY`
3. Ensure API key has no extra spaces or newlines

### Issue: RLS Blocks Dashboard Operations

**Error**: `new row violates row-level security policy`

**Solution**:
1. Verify admin user UUID in RLS policies
2. Check dashboard user is logged in (check Supabase Auth)
3. Ensure `auth.uid()` in policy matches logged-in user

### Issue: Layout Changes Don't Appear on Portfolio

**Solution**:
1. Verify layout is published (`is_published = true`)
2. Check portfolio is fetching from Supabase correctly
3. Clear browser cache and hard reload

---

## Monitoring

### Backend Health

- Check Render logs for errors
- Monitor cron-job.org for keep-awake pings
- Verify `/health` endpoint returns 200

### Frontend Performance

- Use Vercel Analytics to track bandwidth
- Monitor Core Web Vitals
- Check for console errors

### Database Usage

- Monitor Supabase dashboard for storage usage
- Check query performance in Supabase logs
- Verify RLS policies are not causing slow queries

---

## Cost Summary

| Service | Repo | Free Tier Limit | Monthly Cost |
|---------|------|----------------|--------------|
| Vercel | Repo 1 (Portfolio) | 100GB bandwidth | $0 |
| Vercel | Repo 2 (Dashboard) | 100GB bandwidth | $0 |
| Render | Repo 3 (Backend) | 750 hours | $0 |
| Supabase | Database | 500MB DB + 1GB storage | $0 |
| cron-job.org | Keep-awake | 50 jobs | $0 |
| **Total** | | | **$0** |

---

## Next Steps

1. Setup monitoring and alerts for all three repos
2. Implement CI/CD pipelines (GitHub Actions)
3. Add automated tests for critical flows
4. Setup staging environments
5. Document API endpoints with OpenAPI/Swagger

---

## Support Resources

- **CORS Issues**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **Supabase RLS**: https://supabase.com/docs/guides/auth/row-level-security
- **Vercel Deployment**: https://vercel.com/docs
- **Render Deployment**: https://render.com/docs
