# DevOps Optimization Guide - Free-Tier Architecture

## 1. Overview

This document provides comprehensive optimization strategies and monitoring guidelines to maximize performance, reliability, and cost-efficiency while staying within free-tier limits of **Supabase**, **Render**, and **Vercel**.

---

## 2. Supabase Storage Optimization

### 2.1 Storage Limits
*   **Free Tier**: 1GB total storage
*   **Database**: 500MB (shared with storage)
*   **Target**: Keep total usage under 800MB to avoid throttling

### 2.2 Image Compression Pipeline

#### Pre-Upload Compression (Client-Side)
```javascript
import imageCompression from 'browser-image-compression';

async function compressImage(file) {
  const options = {
    maxSizeMB: 0.2,              // Target: 200KB
    maxWidthOrHeight: 1920,      // Max dimension
    useWebWorker: true,
    fileType: 'image/webp'       // Convert to WebP
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Compression failed:', error);
    return file;
  }
}
```

#### Server-Side Optimization (FastAPI)
```python
from PIL import Image
import io

def optimize_image(image_bytes: bytes, max_size_kb: int = 200) -> bytes:
    """Optimize image to target size"""
    img = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if necessary
    if img.mode in ('RGBA', 'LA', 'P'):
        img = img.convert('RGB')
    
    # Resize if too large
    max_dimension = 1920
    if max(img.size) > max_dimension:
        img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
    
    # Save with progressive quality reduction
    output = io.BytesIO()
    quality = 85
    while quality > 20:
        output.seek(0)
        output.truncate()
        img.save(output, format='WEBP', quality=quality, optimize=True)
        if output.tell() <= max_size_kb * 1024:
            break
        quality -= 5
    
    return output.getvalue()
```

### 2.3 Storage Monitoring

#### Database Query (Run Weekly)
```sql
-- Check total storage usage
SELECT 
  pg_size_pretty(pg_database_size(current_database())) AS database_size,
  pg_size_pretty(sum(pg_total_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename)))::bigint) AS tables_size
FROM pg_tables
WHERE schemaname = 'public';

-- Check storage bucket usage (via Supabase Dashboard)
-- Navigate to: Storage > Settings > Usage
```

#### Automated Alerts
```javascript
// Run this as a Supabase Edge Function (weekly cron)
import { createClient } from '@supabase/supabase-js';

const checkStorageUsage = async () => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);
  
  // Get storage usage from Supabase API
  const { data: buckets } = await supabase.storage.listBuckets();
  
  let totalSize = 0;
  for (const bucket of buckets) {
    const { data: files } = await supabase.storage.from(bucket.name).list();
    totalSize += files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
  }
  
  const usagePercent = (totalSize / (1024 * 1024 * 1024)) * 100; // 1GB limit
  
  if (usagePercent > 80) {
    // Send email alert via Resend (free tier: 3000 emails/month)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'alerts@yourdomain.com',
        to: 'admin@yourdomain.com',
        subject: '⚠️ Supabase Storage Alert',
        html: `Storage usage is at ${usagePercent.toFixed(1)}% (${(totalSize / 1024 / 1024).toFixed(2)}MB / 1GB)`
      })
    });
  }
};
```

### 2.4 Cleanup Strategies

**Orphaned Files Detection**:
```sql
-- Find images in storage not referenced in database
-- Run monthly and delete orphaned files
SELECT name FROM storage.objects 
WHERE bucket_id = 'portfolio-images'
AND name NOT IN (
  SELECT thumbnail_url FROM projects
  UNION
  SELECT avatar_url FROM profile
  UNION
  SELECT logo_url FROM experience
);
```

---

## 3. Vercel Bandwidth Optimization

### 3.1 Bandwidth Limits
*   **Free Tier**: 100GB/month
*   **Target**: Stay under 80GB to avoid overages
*   **Monitoring**: Check Vercel Dashboard weekly

### 3.2 Static Asset Caching

#### Vite Build Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Content-based hashing for cache busting
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
});
```

#### Vercel Headers Configuration
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).webp",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### 3.3 Image Optimization

#### Lazy Loading Implementation
```javascript
// Use Intersection Observer for lazy loading
import { useEffect, useRef, useState } from 'react';

function LazyImage({ src, alt, className }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      className={className}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
    />
  );
}
```

#### Responsive Images
```javascript
// Generate srcset for different screen sizes
function ResponsiveImage({ baseUrl, alt }) {
  return (
    <img
      src={`${baseUrl}?width=800`}
      srcSet={`
        ${baseUrl}?width=400 400w,
        ${baseUrl}?width=800 800w,
        ${baseUrl}?width=1200 1200w
      `}
      sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
      alt={alt}
      loading="lazy"
    />
  );
}
```

### 3.4 API Route Caching

#### Edge Caching for Portfolio Data
```javascript
// api/portfolio.js (Vercel Serverless Function)
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const response = await fetch('https://your-api.onrender.com/api/v1/portfolio/full');
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      // Cache for 60s, serve stale for 5 minutes while revalidating
    }
  });
}
```

### 3.5 Bandwidth Monitoring

#### Vercel Analytics Integration
```javascript
// src/main.jsx
import { inject } from '@vercel/analytics';

inject(); // Auto-tracks page views and bandwidth usage
```

#### Custom Bandwidth Tracker
```javascript
// Track large asset downloads
const trackBandwidth = (url, size) => {
  fetch('/api/track-bandwidth', {
    method: 'POST',
    body: JSON.stringify({ url, size, timestamp: Date.now() })
  });
};

// Monitor image loads
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('load', () => {
    fetch(img.src, { method: 'HEAD' })
      .then(res => {
        const size = parseInt(res.headers.get('content-length'));
        trackBandwidth(img.src, size);
      });
  });
});
```

---

## 4. Render Keep-Awake System

### 4.1 Cron-Job.org Configuration

**Setup Steps**:
1.  Visit [cron-job.org](https://cron-job.org) and create free account
2.  Create new cron job:
    *   **Title**: "Portfolio API Keep-Awake"
    *   **URL**: `https://your-api.onrender.com/health`
    *   **Schedule**: Every 14 minutes (`*/14 * * * *`)
    *   **Request Method**: GET
    *   **Timeout**: 30 seconds
3.  Enable email notifications for failures

**Alternative: UptimeRobot**
*   **Free Tier**: 50 monitors, 5-minute intervals
*   **Setup**: Add HTTP(s) monitor for `/health` endpoint
*   **Alert Contacts**: Email, Slack, Discord

### 4.2 Health Endpoint Best Practices

```python
from fastapi import FastAPI
from datetime import datetime
import asyncpg

app = FastAPI()

@app.get("/health")
async def health_check():
    """Comprehensive health check with database ping"""
    try:
        # Test database connection
        async with app.state.db_pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": "portfolio-api",
        "version": "1.0.0",
        "database": db_status,
        "uptime": get_uptime_seconds()
    }

def get_uptime_seconds():
    """Calculate uptime since service start"""
    global start_time
    return int((datetime.utcnow() - start_time).total_seconds())

# Initialize start time on app startup
start_time = datetime.utcnow()
```

### 4.3 Cold Start Optimization

**Reduce Cold Start Time**:
```python
# Use lightweight dependencies
# Avoid heavy imports at module level

# Bad (loads on every cold start)
import pandas as pd
import tensorflow as tf

# Good (lazy import when needed)
def analyze_data():
    import pandas as pd  # Only load when function is called
    return pd.DataFrame(...)
```

**Connection Pooling**:
```python
# Reuse database connections across requests
from asyncpg import create_pool

@app.on_event("startup")
async def startup():
    app.state.db_pool = await create_pool(
        dsn=os.getenv("SUPABASE_DB_URL"),
        min_size=1,
        max_size=2,  # Keep low for free tier
        command_timeout=30
    )

@app.on_event("shutdown")
async def shutdown():
    await app.state.db_pool.close()
```

### 4.4 Fallback Strategy

**Graceful Degradation**:
```javascript
// Frontend: Handle API downtime gracefully
async function fetchPortfolioData() {
  try {
    const response = await fetch('/api/portfolio/full', { timeout: 5000 });
    if (!response.ok) throw new Error('API error');
    return await response.json();
  } catch (error) {
    console.warn('API unavailable, using cached data');
    // Fallback to localStorage cache
    const cached = localStorage.getItem('portfolio_cache');
    return cached ? JSON.parse(cached) : getStaticFallbackData();
  }
}
```

---

## 5. Database Query Optimization

### 5.1 Connection Pooling

**Supabase Connection Limits**:
*   **Free Tier**: 60 concurrent connections
*   **Recommended Pool Size**: 3-5 connections per service

**Configuration**:
```python
# FastAPI
db_pool = await asyncpg.create_pool(
    dsn=os.getenv("SUPABASE_DB_URL"),
    min_size=1,
    max_size=3,
    max_inactive_connection_lifetime=300  # 5 minutes
)
```

### 5.2 Query Result Caching

**Redis (Upstash Free Tier)**:
*   **Free Tier**: 10,000 commands/day, 256MB storage
*   **Use Case**: Cache expensive queries

```python
import redis.asyncio as redis

redis_client = redis.from_url(os.getenv("UPSTASH_REDIS_URL"))

async def get_portfolio_data():
    # Check cache first
    cached = await redis_client.get("portfolio:full")
    if cached:
        return json.loads(cached)
    
    # Fetch from database
    data = await fetch_from_db()
    
    # Cache for 60 seconds
    await redis_client.setex("portfolio:full", 60, json.dumps(data))
    
    return data
```

### 5.3 Index Optimization

**Essential Indexes**:
```sql
-- Projects: Frequently filtered by featured status
CREATE INDEX idx_projects_featured ON projects(featured_order) WHERE featured_order IS NOT NULL;

-- Skills: Grouped by category
CREATE INDEX idx_skills_category ON skills(category, name);

-- Experience: Sorted by date
CREATE INDEX idx_experience_dates ON experience(start_date DESC, end_date DESC);

-- Agent Memory: Semantic search
CREATE INDEX idx_agent_memory_embedding ON agent_memory USING ivfflat (embedding vector_cosine_ops);

-- Task Queue: Priority processing
CREATE INDEX idx_task_queue_processing ON task_queue(status, priority DESC, scheduled_at ASC);
```

### 5.4 Row-Level Security Performance

**Optimize RLS Policies**:
```sql
-- Bad: Function call on every row
CREATE POLICY "Admin access" ON projects
FOR ALL USING (auth.uid() = get_admin_uuid());

-- Good: Direct comparison
CREATE POLICY "Admin access" ON projects
FOR ALL USING (auth.uid() = '12345678-1234-1234-1234-123456789012');
```

---

## 6. AI API Cost Management

### 6.1 Request Deduplication

**Hash-Based Deduplication**:
```python
import hashlib

def generate_prompt_hash(prompt: str, model: str) -> str:
    """Generate unique hash for prompt + model combination"""
    content = f"{prompt}:{model}"
    return hashlib.sha256(content.encode()).hexdigest()

async def get_ai_response(prompt: str, model: str = "llama3-70b"):
    # Check cache first
    prompt_hash = generate_prompt_hash(prompt, model)
    cached = await db.fetchrow(
        "SELECT response FROM ai_response_cache WHERE prompt_hash = $1 AND created_at > NOW() - INTERVAL '24 hours'",
        prompt_hash
    )
    
    if cached:
        return cached['response']
    
    # Call AI API
    response = await groq_client.generate(prompt, model)
    
    # Cache response
    await db.execute(
        "INSERT INTO ai_response_cache (prompt_hash, response, model) VALUES ($1, $2, $3)",
        prompt_hash, response, model
    )
    
    return response
```

### 6.2 Rate Limiting

**Per-User Rate Limiting**:
```python
from fastapi import HTTPException
from datetime import datetime, timedelta

# In-memory rate limiter (use Redis for production)
rate_limit_store = {}

async def check_rate_limit(user_id: str, limit: int = 10, window: int = 60):
    """Allow 'limit' requests per 'window' seconds"""
    now = datetime.utcnow()
    key = f"rate_limit:{user_id}"
    
    if key not in rate_limit_store:
        rate_limit_store[key] = []
    
    # Remove old requests outside window
    rate_limit_store[key] = [
        ts for ts in rate_limit_store[key]
        if now - ts < timedelta(seconds=window)
    ]
    
    if len(rate_limit_store[key]) >= limit:
        raise HTTPException(429, "Rate limit exceeded")
    
    rate_limit_store[key].append(now)
```

### 6.3 Model Fallback Strategy

**Tiered Model Selection**:
```python
async def generate_with_fallback(prompt: str):
    """Try Groq first, fallback to Hugging Face"""
    try:
        # Try Groq (fastest, free tier)
        response = await groq_client.generate(prompt, model="llama3-70b")
        return response
    except Exception as groq_error:
        logger.warning(f"Groq failed: {groq_error}, falling back to HF")
        
        try:
            # Fallback to Hugging Face
            response = await hf_client.generate(prompt, model="mistralai/Mistral-7B-Instruct-v0.2")
            return response
        except Exception as hf_error:
            logger.error(f"All AI providers failed: {hf_error}")
            # Return cached generic response or error
            return "AI service temporarily unavailable. Please try again later."
```

---

## 7. Monitoring & Alerts

### 7.1 Supabase Usage Dashboard

**Custom Dashboard Query**:
```sql
-- Create view for usage metrics
CREATE VIEW usage_metrics AS
SELECT 
  'database' AS resource,
  pg_size_pretty(pg_database_size(current_database())) AS size,
  (pg_database_size(current_database())::float / (500 * 1024 * 1024) * 100)::numeric(5,2) AS usage_percent
UNION ALL
SELECT 
  'storage' AS resource,
  pg_size_pretty(sum(size)::bigint) AS size,
  (sum(size)::float / (1024 * 1024 * 1024) * 100)::numeric(5,2) AS usage_percent
FROM storage.objects;

-- Query usage metrics
SELECT * FROM usage_metrics;
```

### 7.2 Vercel Bandwidth Tracking

**Weekly Report Script**:
```javascript
// Run via GitHub Actions weekly
import { fetch } from 'undici';

async function getVercelUsage() {
  const response = await fetch('https://api.vercel.com/v1/teams/usage', {
    headers: {
      'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
    }
  });
  
  const data = await response.json();
  const bandwidthGB = data.bandwidth.total / (1024 ** 3);
  
  console.log(`Bandwidth usage: ${bandwidthGB.toFixed(2)}GB / 100GB`);
  
  if (bandwidthGB > 80) {
    // Send alert
    await sendEmailAlert(`⚠️ Vercel bandwidth at ${bandwidthGB.toFixed(1)}GB`);
  }
}
```

### 7.3 Render Uptime Monitoring

**Health Check Logs**:
```python
# Log health check responses
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/health")
async def health_check():
    logger.info(f"Health check at {datetime.utcnow().isoformat()}")
    return {"status": "healthy"}
```

### 7.4 Email Alerts Configuration

**Resend (Free Tier: 3000 emails/month)**:
```python
import httpx

async def send_alert_email(subject: str, body: str):
    """Send alert email via Resend"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'https://api.resend.com/emails',
            headers={
                'Authorization': f'Bearer {os.getenv("RESEND_API_KEY")}',
                'Content-Type': 'application/json'
            },
            json={
                'from': 'alerts@yourdomain.com',
                'to': 'admin@yourdomain.com',
                'subject': subject,
                'html': f'<p>{body}</p>'
            }
        )
        return response.status_code == 200
```

---

## 8. Free-Tier Optimization Checklist

### 8.1 Pre-Launch Checklist

- [ ] **Supabase**:
  - [ ] Enable pgvector extension
  - [ ] Configure RLS policies on all tables
  - [ ] Set up storage bucket with public read, authenticated write
  - [ ] Create indexes on frequently queried columns
  - [ ] Enable database webhooks for task queue

- [ ] **Render**:
  - [ ] Deploy FastAPI with health endpoint
  - [ ] Set environment variables (Supabase URL, keys, API keys)
  - [ ] Configure cron-job.org to ping `/health` every 14 minutes
  - [ ] Test cold start time (should be <60 seconds)

- [ ] **Vercel**:
  - [ ] Deploy React 19 portfolio + admin dashboard
  - [ ] Configure cache headers in `vercel.json`
  - [ ] Enable Vercel Analytics
  - [ ] Set up environment variables

- [ ] **AI Services**:
  - [ ] Register for Groq Cloud API (free tier)
  - [ ] Register for Hugging Face Inference API (free tier)
  - [ ] Implement response caching (24-hour TTL)
  - [ ] Set up rate limiting (10 requests/min per user)

### 8.2 Post-Launch Monitoring

- [ ] **Weekly Tasks**:
  - [ ] Check Supabase database size (target: <400MB)
  - [ ] Check Supabase storage usage (target: <800MB)
  - [ ] Check Vercel bandwidth usage (target: <80GB)
  - [ ] Review Render uptime logs (target: >99%)

- [ ] **Monthly Tasks**:
  - [ ] Run orphaned file cleanup script
  - [ ] Review AI API usage and cache hit rate
  - [ ] Optimize slow database queries
  - [ ] Update dependencies and security patches

- [ ] **Quarterly Tasks**:
  - [ ] Review and optimize RLS policies
  - [ ] Audit user access logs
  - [ ] Test disaster recovery procedures
  - [ ] Review and update documentation

### 8.3 Alert Thresholds

| Service | Metric | Warning (80%) | Critical (95%) |
|---------|--------|---------------|----------------|
| Supabase DB | Database Size | 400MB | 475MB |
| Supabase Storage | Storage Size | 800MB | 950MB |
| Vercel | Bandwidth | 80GB | 95GB |
| Render | Downtime | 1 hour/month | 4 hours/month |
| Groq API | Rate Limit Hits | 10/day | 50/day |

---

## 9. Performance Optimization Tips

### 9.1 Frontend Performance

**Code Splitting**:
```javascript
// Lazy load admin dashboard
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}
```

**Tree Shaking**:
```javascript
// Import only what you need
import { useState, useEffect } from 'react';  // Good
import React from 'react';  // Bad (imports entire library)
```

### 9.2 Backend Performance

**Async Database Queries**:
```python
# Parallel queries for portfolio data
async def get_portfolio_full():
    async with db_pool.acquire() as conn:
        profile, skills, projects = await asyncio.gather(
            conn.fetchrow("SELECT * FROM profile LIMIT 1"),
            conn.fetch("SELECT * FROM skills ORDER BY category"),
            conn.fetch("SELECT * FROM projects ORDER BY featured_order")
        )
        return {
            "personal": dict(profile),
            "skills": [dict(s) for s in skills],
            "projects": [dict(p) for p in projects]
        }
```

**Response Compression**:
```python
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
```

---

## 10. Disaster Recovery

### 10.1 Database Backups

**Supabase Automatic Backups**:
*   Free tier includes daily backups (7-day retention)
*   Access via: Supabase Dashboard > Database > Backups

**Manual Backup Script**:
```bash
#!/bin/bash
# Run weekly via cron

pg_dump $SUPABASE_DB_URL > backup_$(date +%Y%m%d).sql
# Upload to Google Drive or Dropbox (free tiers)
```

### 10.2 Rollback Procedures

**Database Rollback**:
1.  Download backup from Supabase Dashboard
2.  Restore via: `psql $SUPABASE_DB_URL < backup.sql`

**Code Rollback**:
1.  Vercel: Revert to previous deployment via dashboard
2.  Render: Redeploy previous commit from GitHub

---

## 11. Cost Monitoring Summary

| Service | Free Tier Limit | Current Usage | Status |
|---------|----------------|---------------|--------|
| Supabase DB | 500MB | Monitor weekly | ✅ |
| Supabase Storage | 1GB | Monitor weekly | ✅ |
| Render | 750 hrs/month | Keep-awake active | ✅ |
| Vercel | 100GB bandwidth | Monitor weekly | ✅ |
| Groq API | Rate-limited | Cached responses | ✅ |
| Upstash Redis | 10K commands/day | Optional caching | ✅ |
| Resend | 3000 emails/month | Alerts only | ✅ |

**Total Monthly Cost**: **$0** 🎉
