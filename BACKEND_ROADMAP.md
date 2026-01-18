# System Handover & Backend Roadmap

## 1. Executive Summary
This document outlines the technical transition from the current **Client-Side Data Architecture** (Phase 3) to a fully **Server-Side Driven Architecture** (Phase 4) with **Scale-to-Zero Free-Tier Hosting**. The goal is to implement a robust, scalable backend using **Supabase** (PostgreSQL + pgvector), **FastAPI** on **Render Free Tier**, and **AI-driven agentic workflows** for dynamic content management—all at **$0 cost**.

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

#### `page_layouts`
*   **id**: UUID (Primary Key)
*   **page_name**: TEXT (e.g., "home", "about")
*   **layout_json**: JSONB
    *   *Schema*: `{ sections: [{ id: string, order: number, visible: boolean, config: object }] }`
*   **is_published**: BOOLEAN
*   **version**: INTEGER

### 2.2 Row Level Security (RLS) Policies

**Public Read Access** (for portfolio display):
```sql
-- Allow anonymous users to read published content
CREATE POLICY "Public read access" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read access" ON solutions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read access" ON page_layouts FOR SELECT USING (is_published = true);
```

**Admin Write Access** (for dashboard):
```sql
-- Only authenticated admin user can modify content
CREATE POLICY "Admin full access" ON profile FOR ALL USING (auth.uid() = '<ADMIN_UUID>');
CREATE POLICY "Admin full access" ON skills FOR ALL USING (auth.uid() = '<ADMIN_UUID>');
CREATE POLICY "Admin full access" ON projects FOR ALL USING (auth.uid() = '<ADMIN_UUID>');
CREATE POLICY "Admin full access" ON experience FOR ALL USING (auth.uid() = '<ADMIN_UUID>');
CREATE POLICY "Admin full access" ON solutions FOR ALL USING (auth.uid() = '<ADMIN_UUID>');
CREATE POLICY "Admin full access" ON testimonials FOR ALL USING (auth.uid() = '<ADMIN_UUID>');
CREATE POLICY "Admin full access" ON page_layouts FOR ALL USING (auth.uid() = '<ADMIN_UUID>');
```

---

## 3. Scale-to-Zero Hosting Architecture

### 3.1 Backend: FastAPI on Render Free Tier

**Platform**: [Render.com](https://render.com) Free Tier
*   **Specs**: 512MB RAM, sleeps after 15 minutes of inactivity
*   **Cold Start**: ~30-60 seconds on first request after sleep
*   **Monthly Limit**: 750 hours (sufficient for personal portfolio)

**Framework**: FastAPI (Python 3.11+)
*   **Advantages**: Async support, automatic OpenAPI docs, Pydantic validation, fast performance
*   **Database**: asyncpg for async PostgreSQL connections to Supabase

**Keep-Awake Strategy**:
*   **Service**: [cron-job.org](https://cron-job.org) (Free)
*   **Interval**: Every 14 minutes (to prevent 15-min sleep)
*   **Endpoint**: `GET /health`
*   **Response**: `{ "status": "healthy", "timestamp": "2026-01-18T21:27:50Z" }`
*   **Fallback**: UptimeRobot (50 monitors free) as secondary ping service

**Health Endpoint Implementation**:
```python
from fastapi import FastAPI
from datetime import datetime

app = FastAPI()

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": "portfolio-api",
        "version": "1.0.0"
    }
```

### 3.2 Frontend: Vercel Hobby Tier

**Platform**: [Vercel](https://vercel.com) Hobby Tier
*   **Specs**: 100GB bandwidth/month, unlimited deployments
*   **CDN**: Global edge network for static assets
*   **Build Time**: Unlimited (no time restrictions)

**Deployment**:
*   **Main Portfolio**: React 19 (Vite) - current repo
*   **Admin Dashboard**: Refine.js + React 19 - separate route `/admin`
*   **Environment Variables**: Supabase URL, Anon Key, API Base URL

**Optimization**:
*   Static asset caching: `Cache-Control: public, max-age=31536000, immutable`
*   Image optimization via Vercel Image Optimization (automatic WebP conversion)
*   API route caching for `/api/portfolio` with 60-second revalidation

---

## 4. Agentic Memory Architecture (pgvector)

### 4.1 Enable pgvector Extension

In Supabase SQL Editor:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 4.2 Agent Memory Tables

#### `agent_memory`
*   **id**: UUID (Primary Key)
*   **agent_id**: TEXT (e.g., "portfolio-assistant")
*   **thought_type**: TEXT (Enum: 'observation', 'reasoning', 'action', 'reflection')
*   **content**: TEXT (The actual thought/observation)
*   **embedding**: vector(1536) (OpenAI-compatible embedding dimension)
*   **metadata**: JSONB (e.g., `{ "user_query": "...", "context": "...", "confidence": 0.95 }`)
*   **created_at**: TIMESTAMPTZ

**Indexes**:
```sql
CREATE INDEX ON agent_memory USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON agent_memory (agent_id, created_at DESC);
CREATE INDEX ON agent_memory (thought_type);
```

**RLS Policy**:
```sql
-- Admin and system service role only
CREATE POLICY "Admin and service access" ON agent_memory 
FOR ALL USING (auth.uid() = '<ADMIN_UUID>' OR auth.jwt()->>'role' = 'service_role');
```

#### `agent_context`
*   **id**: UUID (Primary Key)
*   **session_id**: UUID (Groups related interactions)
*   **agent_id**: TEXT
*   **user_query**: TEXT
*   **agent_response**: TEXT
*   **memory_ids**: UUID[] (References to relevant `agent_memory` entries)
*   **created_at**: TIMESTAMPTZ

### 4.3 Semantic Search for Memory Retrieval

**Query Pattern** (using cosine similarity):
```sql
SELECT id, content, metadata, 1 - (embedding <=> $1::vector) AS similarity
FROM agent_memory
WHERE agent_id = $2
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

**Embedding Generation**:
*   **Primary**: Groq Cloud API with `nomic-embed-text` (free tier)
*   **Fallback**: Hugging Face Inference API with `sentence-transformers/all-MiniLM-L6-v2`

---

## 5. Task Queue System (Render-Optimized)

### 5.1 Task Queue Table

#### `task_queue`
*   **id**: UUID (Primary Key)
*   **task_type**: TEXT (e.g., "generate_project_description", "update_skills")
*   **priority**: INTEGER (1-10, higher = more urgent)
*   **payload**: JSONB (Task-specific data)
*   **status**: TEXT (Enum: 'pending', 'processing', 'completed', 'failed')
*   **attempts**: INTEGER (Retry counter)
*   **max_attempts**: INTEGER (Default: 3)
*   **scheduled_at**: TIMESTAMPTZ (When to execute)
*   **started_at**: TIMESTAMPTZ (Nullable)
*   **completed_at**: TIMESTAMPTZ (Nullable)
*   **error_message**: TEXT (Nullable)
*   **created_at**: TIMESTAMPTZ

**Indexes**:
```sql
CREATE INDEX ON task_queue (status, priority DESC, scheduled_at ASC);
CREATE INDEX ON task_queue (task_type, status);
```

### 5.2 Task Processing Strategy (15-Minute Window)

**Challenge**: Render Free Tier sleeps after 15 minutes of inactivity.

**Solution**: Webhook-triggered task processing
1.  **Task Creation**: Dashboard or AI agent creates task in `task_queue`
2.  **Webhook Trigger**: Supabase Database Webhook fires on INSERT to `task_queue`
3.  **Immediate Processing**: FastAPI endpoint `/tasks/process` is called
4.  **Batch Processing**: Process all pending tasks in priority order within 10-minute window
5.  **Graceful Shutdown**: If approaching 15-min mark, save progress and exit

**FastAPI Task Processor**:
```python
@app.post("/tasks/process")
async def process_tasks(background_tasks: BackgroundTasks):
    # Fetch pending tasks
    tasks = await fetch_pending_tasks(limit=10)
    
    for task in tasks:
        background_tasks.add_task(execute_task, task)
    
    return {"queued": len(tasks)}

async def execute_task(task):
    # Update status to 'processing'
    await update_task_status(task.id, "processing")
    
    try:
        # Execute based on task_type
        if task.task_type == "generate_project_description":
            result = await generate_with_groq(task.payload)
        
        # Update status to 'completed'
        await update_task_status(task.id, "completed", result=result)
    except Exception as e:
        # Retry logic
        if task.attempts < task.max_attempts:
            await retry_task(task.id)
        else:
            await update_task_status(task.id, "failed", error=str(e))
```

---

## 6. AI Model Integration

### 6.1 Groq Cloud API (Primary)

**Models**: Llama 3 (70B), Mixtral 8x7B
*   **Free Tier**: Rate-limited (varies by model, typically 30 requests/min)
*   **Speed**: 300+ tokens/second (fastest inference)
*   **Use Cases**: Project descriptions, skill extraction, content generation

**Integration**:
```python
from groq import AsyncGroq

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

async def generate_with_groq(prompt: str, model: str = "llama3-70b-8192"):
    response = await client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=1024
    )
    return response.choices[0].message.content
```

### 6.2 Hugging Face Inference API (Fallback)

**Models**: Mistral-7B-Instruct, Zephyr-7B-Beta
*   **Free Tier**: Rate-limited (1000 requests/day)
*   **Speed**: Moderate (30-50 tokens/second)
*   **Use Cases**: Backup when Groq rate limit exceeded

**Integration**:
```python
import aiohttp

async def generate_with_hf(prompt: str, model: str = "mistralai/Mistral-7B-Instruct-v0.2"):
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"https://api-inference.huggingface.co/models/{model}",
            headers={"Authorization": f"Bearer {os.getenv('HF_TOKEN')}"},
            json={"inputs": prompt, "parameters": {"max_new_tokens": 512}}
        ) as response:
            result = await response.json()
            return result[0]["generated_text"]
```

### 6.3 Response Caching Strategy

**Cache Table**: `ai_response_cache`
*   **prompt_hash**: TEXT (SHA256 of prompt + model)
*   **response**: TEXT
*   **model**: TEXT
*   **created_at**: TIMESTAMPTZ
*   **ttl**: INTERVAL (Default: 24 hours)

**Cache Logic**:
1.  Hash the prompt + model combination
2.  Check cache for existing response (within TTL)
3.  If hit, return cached response
4.  If miss, call AI API, cache response, return

**Benefits**: Reduces API calls, stays within rate limits, faster responses

---

## 7. API Layer (FastAPI)

### 7.1 Core Endpoints

#### Portfolio Data Aggregation
```python
@app.get("/api/v1/portfolio/full")
async def get_portfolio():
    """Fetch aggregated portfolio data matching usePortfolioData hook structure"""
    async with db_pool.acquire() as conn:
        profile = await conn.fetchrow("SELECT * FROM profile LIMIT 1")
        skills = await conn.fetch("SELECT * FROM skills ORDER BY category, name")
        projects = await conn.fetch("SELECT * FROM projects ORDER BY featured_order")
        experience = await conn.fetch("SELECT * FROM experience ORDER BY start_date DESC")
        solutions = await conn.fetch("SELECT * FROM solutions ORDER BY order")
        
        return {
            "personal": dict(profile),
            "skills": [dict(s) for s in skills],
            "projects": [dict(p) for p in projects],
            "experience": [dict(e) for e in experience],
            "solutions": [dict(sol) for sol in solutions]
        }
```

**Caching**: Redis (Upstash Free Tier) with 60-second TTL

#### AI Agent Update Endpoint
```python
@app.post("/api/v1/admin/update-node")
async def update_node(
    collection: str,
    id: str,
    updates: dict,
    api_key: str = Header(None)
):
    """Generic endpoint for AI agents to update content"""
    # Verify service role API key
    if api_key != os.getenv("SERVICE_API_KEY"):
        raise HTTPException(401, "Unauthorized")
    
    # Update database
    async with db_pool.acquire() as conn:
        await conn.execute(
            f"UPDATE {collection} SET {', '.join(f'{k} = ${i+2}' for i, k in enumerate(updates.keys()))} WHERE id = $1",
            id, *updates.values()
        )
    
    # Invalidate cache
    await redis.delete("portfolio:full")
    
    return {"success": True}
```

### 7.2 Database Connection Pooling

**Library**: asyncpg
```python
import asyncpg

db_pool = await asyncpg.create_pool(
    dsn=os.getenv("SUPABASE_DB_URL"),
    min_size=1,
    max_size=3,  # Render Free Tier has limited connections
    command_timeout=60
)
```

---

## 8. Migration Strategy

1.  **Setup Supabase Project**:
    *   Create new project (Free Tier)
    *   Enable pgvector extension
    *   Run schema SQL scripts
    *   Configure RLS policies

2.  **Seed Data**:
    *   Write Python script to push `src/utils/data/*.js` content into Supabase tables
    *   Use `supabase-py` client for bulk inserts
    *   Verify data integrity

3.  **Deploy FastAPI to Render**:
    *   Create new Web Service (Free Tier)
    *   Connect GitHub repo
    *   Set environment variables (Supabase URL, keys, Groq API key)
    *   Configure health check endpoint

4.  **Setup Keep-Awake Cron**:
    *   Register at cron-job.org
    *   Create job: `GET https://your-api.onrender.com/health` every 14 minutes
    *   Verify logs show successful pings

5.  **Update Client Hook**:
    *   Modify `src/hooks/usePortfolioData.js`
    *   Replace mock data with `fetch('/api/v1/portfolio/full')`
    *   Add error handling and loading states

6.  **Deploy Admin Dashboard**:
    *   Build Refine.js dashboard (see `DASHBOARD_SPECS.md`)
    *   Deploy to Vercel under `/admin` route
    *   Connect to Supabase for CRUD operations

7.  **Test Agentic Workflows**:
    *   Create test tasks in `task_queue`
    *   Verify webhook triggers FastAPI processing
    *   Validate AI-generated content quality

---

## 9. Free-Tier Monitoring
Role: Senior Full-Stack Architect (2026 AI-Specialist).
Goal: Update my Backend Roadmap and Dashboard Specs to a fully "Scale-to-Zero" architecture that is 100% free for personal use while supporting agentic workflows and drag-and-drop UI.
Constraints for the Free Hosting Stack:
Database & Auth: Use Supabase Free Tier. Enable pgvector for agentic long-term memory and RLS (Row Level Security) to protect my portfolio data.
AI Backend: Use FastAPI (Python) hosted on Render (Free Tier). Add a specification for an automated "Keep-Awake" cron job (using cron-job.org or similar) to ping the /health endpoint every 14 minutes to eliminate cold starts.
UI & Dashboard: Host the React 19 Portfolio and Refine.js Dashboard on Vercel (Hobby Tier). Leverage Vercel's global CDN for high-performance static delivery of the UI.
AI Models: Integrate Groq Cloud API or Hugging Face Inference for free, high-speed access to Llama 3/Mistral models within the agentic workflows.
Specific Updates Needed:
In Backend Roadmap: Define a "Memory Architecture" in Supabase to store agentic "thoughts" and a "Task Queue" system that respects Render's 15-minute inactivity limit.
In Dashboard Specs: Detail the integration of Puck (for drag-and-drop section reordering) and how it will save the layout JSON back to the free Supabase DB.
DevOps Section: Add a "Free-Tier Optimization" checklist including image compression for Supabase Storage (50MB limit) and API caching strategies to stay under Vercel's 100GB bandwidth limit.
Analyze my existing files and generate the updated versions to maximize speed, AI-capability, and $0 cost.
**Supabase Dashboard**:
*   Database size: Monitor approaching 500MB limit
*   Storage: Track image uploads (1GB limit)
*   Active users: Monitor MAU count

**Render Dashboard**:
*   Service uptime: Verify keep-awake is working
*   Memory usage: Ensure staying under 512MB
*   Monthly hours: Track toward 750-hour limit

**Vercel Dashboard**:
*   Bandwidth usage: Monitor toward 100GB limit
*   Function invocations: Track serverless usage
*   Build minutes: Unlimited, but track for optimization

**Alerts** (via email):
*   Supabase: 80% database size, 90% storage
*   Vercel: 80% bandwidth usage
*   Render: Service down for >5 minutes
