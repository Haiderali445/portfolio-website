# ⚡ Ego Web

> **Production-grade cinematic portfolio** — an interactive engineering showcase built with strict architecture, not a template.

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Production-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-3--Tier-10B981?style=for-the-badge&logo=codeforces&logoColor=white)
![Terminal](https://img.shields.io/badge/Terminal-Interactive-22C55E?style=for-the-badge&logo=linux&logoColor=white)
![Netlify](https://img.shields.io/badge/Deployment-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

</div>

> [!IMPORTANT]
> This repository is **closed for public contributions**. You may fork, clone, customize, and self-host for personal use or inspiration.

---

## 🧭 What This Is

Ego Web is a personal portfolio engineered as a production-grade frontend system. It demonstrates not just **what** the engineer has built, but **how** they think about software systems.

Key engineering decisions driving the project:

- **3-tier frontend architecture** — Presentation → Service → Data, strictly enforced with no layer bypassing
- **Normalized domain data** — 11 content domains, each isolated and independently composable
- **Service/repository abstraction** — the UI is fully decoupled from its data source; swapping static files for a backend requires zero UI rewrites
- **Interactive command terminal** — guest/root session model, masked authentication, and protected commands
- **Backend-ready from day one** — the entire frontend points toward a clean NestJS + PostgreSQL migration

---

## 🎯 Core Experiences

| # | Section | Description |
|---|---------|-------------|
| 1 | 🏠 Hero | Personal introduction with animated typewriter titles |
| 2 | 👤 About | Biography, capabilities, engineering interests |
| 3 | 🛠️ Skills | Full technology stack and skill matrix |
| 4 | 💼 Experience | Interactive timeline of roles and contributions |
| 5 | 🎓 Education | Academic and certification history |
| 6 | 🧩 Services | Service catalog with individual detail pages |
| 7 | 🗂️ Projects | Gallery with live demo and source code links |
| 8 | 🖥️ Terminal | Interactive Linux-inspired developer interface |
| 9 | 📬 Contact | Validated form with EmailJS delivery |
| 10 | 🔎 SEO | Route-level metadata via React Helmet Async |
| 11 | 📱 Responsive | Full layout support from mobile to wide desktop |
| 12 | ♿ Accessible | Keyboard nav, ARIA, visible focus, reduced-motion support |

---

## 🏗️ Architecture

### Three-Tier System

```mermaid
flowchart TD
    P["🖥️ PRESENTATION\nReact · Pages · Components · Routing · Animations"]
    S["⚙️ SERVICE\nDomain Services · Repository · apiClient · Integrations"]
    D["📦 DATA\nNormalized Modules · Site Config · Portfolio Content"]

    P --> S --> D

    style P fill:#0f172a,stroke:#61DAFB,color:#e2e8f0
    style S fill:#0f172a,stroke:#10B981,color:#e2e8f0
    style D fill:#0f172a,stroke:#F59E0B,color:#e2e8f0
```

**Core rule:** UI components must never access raw data files directly. All data flows through the service layer.

---

### The Helper Layer

`CommandTerminal.jsx`, `ErrorScreen.jsx`, and `LoadingScreen.jsx` live in the **helper layer**. This is not a fourth architectural tier — helpers still access data exclusively through services.

```mermaid
flowchart TD
    H["🧰 HELPER\nCommandTerminal · ErrorScreen · LoadingScreen"]
    S["⚙️ SERVICE"]
    D["📦 DATA"]

    H --> S --> D

    style H fill:#0f172a,stroke:#A855F7,color:#e2e8f0
    style S fill:#0f172a,stroke:#10B981,color:#e2e8f0
    style D fill:#0f172a,stroke:#F59E0B,color:#e2e8f0
```

---

### Full System Flow

```mermaid
flowchart TD
    V["👤 Visitor"]
    UI["React Presentation Layer"]
    HOOK["usePortfolioData Hook"]
    PS["portfolioService\nPromise.allSettled"]
    DS["Domain Services\nprojects · skills · experience · services · ..."]
    BR["BaseRepository"]
    ND["📦 Normalized Data\n11 Isolated Domains"]
    FE["🎬 Cinematic UI"]

    V --> UI --> HOOK --> PS --> DS --> BR --> ND --> FE

    style V fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
    style PS fill:#0f172a,stroke:#10B981,color:#e2e8f0
    style ND fill:#0f172a,stroke:#F59E0B,color:#e2e8f0
    style FE fill:#0f172a,stroke:#61DAFB,color:#e2e8f0
```

`portfolioService` uses `Promise.allSettled` so an optional domain failure (e.g. testimonials) never blocks the full portfolio load.

---

## 📦 Data Architecture

### Domain Map

| Domain | Location | Purpose |
|--------|----------|---------|
| 👤 Profile | `personal-data.js` | Identity, bio, contact, social links, typewriter titles |
| ⚙️ Site Config | `site-config.js` | Branding, badges, subtitles, section config, feature flags |
| 🖥️ Terminal | `terminalData.js` | Commands, auth config, terminal interaction data |
| 🗂️ Projects | `data/projects/` | Project records with links and tags |
| 💼 Experience | `data/experience/` | Role and contribution timeline |
| 🎓 Education | `data/education/` | Academic and certification history |
| 🧩 Services | `data/services/` | Service catalog entries |
| 🛠️ Skills | `data/skills/` | Technology matrix |
| 💬 Testimonials | `data/testimonials/` | Client and peer testimonials |
| 💡 Solutions | `data/solutions/` | Packaged solution offerings |
| 💰 Pricing | `data/pricing/` | Pricing tier definitions |

### Repository Pattern

```mermaid
flowchart TD
    UI["React Components"]
    SVC["Domain Service"]
    REPO["BaseRepository"]
    LOCAL["Local Static Data\n✅ Current"]
    API["apiClient.js"]
    BACKEND["NestJS API\n🔜 Future"]

    UI --> SVC --> REPO
    REPO --> LOCAL
    REPO -.->|"Migration"| API -.-> BACKEND

    style LOCAL fill:#064e3b,stroke:#10B981,color:#e2e8f0
    style API fill:#1c1917,stroke:#6b7280,color:#9ca3af,stroke-dasharray:5 5
    style BACKEND fill:#1c1917,stroke:#6b7280,color:#9ca3af,stroke-dasharray:5 5
```

Swapping the data source is a `BaseRepository`-level change. No UI rewrites required.

---

## 🖥️ Interactive Terminal

A floating `CommandTerminal.jsx` provides a Linux-inspired developer interface, toggled via `Ctrl + \``.

### Capabilities

| Feature | Detail |
|---------|--------|
| 🔼 Command History | Up/Down arrow navigation through previous inputs |
| 📜 Auto-scroll | Output always scrolls to the latest log entry |
| 🔐 Session Auth | Masked password input with guest/root state management |
| ⌨️ Keyboard-first | Fully navigable via keyboard, no mouse required |
| 📱 Mobile-safe | Usable on small screens without layout breakage |

### Protected Commands

These commands require an active root session:

```
health    check    siteconfig    matrix    sudo hire    coffee
```

### Authentication Flow

```mermaid
flowchart TD
    CMD["⌨️ User Types Command"]
    PROT{"Protected?"}
    EXEC["✅ Execute"]
    ROOT{"Root Active?"}
    PASS["🔒 Prompt Password\ninput masked"]
    VALID{"Credentials Valid?"}
    GRANT["🟢 Grant Root\nExecute Command"]
    DENY["🔴 Access Denied\nRemain Guest"]

    CMD --> PROT
    PROT -- No --> EXEC
    PROT -- Yes --> ROOT
    ROOT -- Yes --> EXEC
    ROOT -- No --> PASS --> VALID
    VALID -- Valid --> GRANT
    VALID -- Invalid --> DENY

    style GRANT fill:#064e3b,stroke:#10B981,color:#e2e8f0
    style DENY fill:#450a0a,stroke:#ef4444,color:#e2e8f0
    style PASS fill:#1e1b4b,stroke:#818cf8,color:#e2e8f0
```

### Credential Retrieval Path

Credentials are never hardcoded in the presentation layer. They are retrieved through the standard service chain:

```mermaid
flowchart LR
    T["CommandTerminal.jsx"]
    TS["terminal.service.js"]
    PDS["Domain Services"]
    DL["Data Layer"]
    AG["🔑 Auth Gatekeeper"]
    SESS["Guest / Root State"]

    T --> TS --> PDS --> DL --> AG --> SESS

    style AG fill:#1e1b4b,stroke:#F59E0B,color:#e2e8f0
    style SESS fill:#064e3b,stroke:#10B981,color:#e2e8f0
```

### Session Lifecycle

| State | Description |
|-------|-------------|
| 🟡 Guest | Public commands only, no privileges |
| 🔵 Authenticating | Password prompt active, input fully masked |
| 🟢 Root | All protected commands available |

| Command | Behavior |
|---------|----------|
| `logout` | Revoke root → clear auth state → return to Guest (terminal stays open) |
| `exit` | Revoke root → clear auth state → close terminal |

> [!WARNING]
> Terminal authentication is an **interactive portfolio feature only**, not a real authorization mechanism. Privileged operations must always be enforced server-side. Never place production credentials in frontend source code.

---

## 📁 Project Structure

```
apps/
└── ego-web/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   │
    │   ├── api/
    │   │   └── core/
    │   │       ├── apiClient.js           ← Axios HTTP client
    │   │       └── base.repository.js     ← Data access abstraction
    │   │
    │   ├── services/                      ← All domain logic lives here
    │   │   ├── contact.service.js
    │   │   ├── education.service.js
    │   │   ├── experience.service.js
    │   │   ├── offerings.service.js
    │   │   ├── portfolio.service.js       ← Aggregation via Promise.allSettled
    │   │   ├── pricing.service.js
    │   │   ├── profile.service.js
    │   │   ├── projects.service.js
    │   │   ├── site.service.js
    │   │   ├── skills.service.js
    │   │   ├── solutions.service.js
    │   │   ├── terminal.service.js
    │   │   └── testimonials.service.js
    │   │
    │   ├── components/
    │   │   ├── helper/                    ← Helper layer (not a 4th tier)
    │   │   │   ├── CommandTerminal.jsx
    │   │   │   ├── ErrorScreen.jsx
    │   │   │   └── LoadingScreen.jsx
    │   │   ├── about/
    │   │   ├── common/
    │   │   ├── contact/
    │   │   ├── experience/
    │   │   ├── footer/
    │   │   ├── home/
    │   │   ├── layout/
    │   │   ├── nav/
    │   │   ├── projects/
    │   │   ├── services/
    │   │   └── skills/
    │   │
    │   ├── hooks/
    │   │   ├── useLenis.js
    │   │   └── usePortfolioData.js
    │   │
    │   └── utils/
    │       ├── images/
    │       └── data/
    │           ├── personal-data.js
    │           ├── site-config.js
    │           ├── terminalData.js
    │           ├── projects/
    │           ├── experience/
    │           ├── education/
    │           ├── services/
    │           ├── skills/
    │           ├── testimonials/
    │           └── pricing/
    │
    ├── docs/
    │   └── SYSTEM_FLOW.md
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── netlify.toml
```

---

## 🔌 External Integrations

All third-party services are abstracted behind the service layer. No React component ever calls an external SDK directly.

| Integration | Abstracted Through | Purpose |
|-------------|-------------------|---------|
| 🌐 Axios | `api/core/apiClient.js` | HTTP network client |
| 📧 EmailJS | `contact.service.js` | Contact form delivery |
| 🍞 React Hot Toast | UI layer | Non-blocking success/error feedback |
| 🔍 React Helmet Async | Page components | Dynamic per-route SEO metadata |

---

## ✨ UI / UX & Performance

### Design Stack

| Element | Technology |
|---------|-----------|
| 🎨 Styling | Tailwind CSS 3.x |
| 🎬 Animations | Framer Motion |
| 📜 Smooth Scroll | Lenis |
| ⚛️ Framework | React 18 |
| 🚀 Build | Vite |
| 🗺️ Routing | React Router DOM |

Design language: dark modern · glassmorphism surfaces · strong typography · cinematic transitions · layered visual depth.

### Performance Principles

| Approach | Detail |
|----------|--------|
| ⚡ Vite build | Tree-shaking and code splitting by default |
| 🔄 Concurrent data | `Promise.allSettled` across all domain services |
| 🧠 Memoization | Only applied where render cost clearly justifies it |
| 🛣️ Lazy routes | Applied where appropriate for initial load speed |
| 🖼️ Optimized images | Compressed, correct formats |
| 🎞️ Safe animations | Never compromise usability or cause layout thrash |

---

## 🛡️ Security

| Practice | Applied Where |
|----------|--------------|
| 🔒 No hardcoded credentials | Terminal uses service-driven credential retrieval |
| 🚫 No real secrets in source | Sensitive values live in `.env` only |
| ✅ Input validation | Contact form validated before any submission |
| 🧹 No unsafe HTML injection | Dynamic content sanitized at render |
| 🗃️ No sensitive browser storage | Auth state lives in React state only (never localStorage) |
| ⚠️ Client auth = feature only | Clearly scoped; real authorization must be server-side |

---

## ♿ Accessibility & 📱 Responsive Design

**Responsive:** Full support from 320px mobile to wide desktop. The terminal remains usable on small screens with no horizontal overflow, broken layouts, or overlapping UI elements.

**Accessible:** Semantic HTML, full keyboard navigation, visible focus states, ARIA attributes, sufficient contrast, and reduced-motion consideration throughout. The terminal is fully keyboard-accessible.

---

## 📬 Contact System

```mermaid
flowchart LR
    FORM["📝 Contact Form\nvalidated before submit"]
    SVC["contact.service.js"]
    EJS["📧 EmailJS"]
    TOAST["🍞 React Hot Toast\n✓ Success / ✗ Error"]

    FORM --> SVC --> EJS
    SVC --> TOAST

    style EJS fill:#0f172a,stroke:#10B981,color:#e2e8f0
    style TOAST fill:#0f172a,stroke:#F59E0B,color:#e2e8f0
```

EmailJS logic is fully contained in `contact.service.js`. The React component only calls the service and handles the toast response.

---

## 🔌 Backend Design Guide

This section documents the full architecture for migrating Ego Web from static local data to a live NestJS + PostgreSQL backend — the system's designed future state.

---

### 🧱 Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| API Framework | NestJS | Module-based; mirrors the frontend's domain structure exactly |
| ORM | TypeORM | Entity-first design, built-in migration support |
| Database | PostgreSQL | Relational, stable, production-proven |
| Auth | JWT + bcrypt | Short-lived tokens, properly hashed credentials |
| Validation | class-validator | DTO-level request validation |
| API Docs | Swagger | Auto-generated from NestJS decorators |
| Email | Nodemailer | Move contact delivery fully server-side |

---

### 📐 Module Structure

NestJS modules mirror the frontend's 11 content domains directly. Each module owns its own controller, service, entity, DTO, and repository.

```
src/
├── profile/
├── projects/
├── experience/
├── education/
├── services/
├── skills/
├── testimonials/
├── solutions/
├── pricing/
├── site-config/
└── terminal/
    └── auth/              ← JWT-based terminal session management
```

---

### 🗄️ Database Schema

Each domain maps to a PostgreSQL table. Use this entity pattern consistently:

```typescript
// projects.entity.ts
@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  tags: string[];

  @Column({ nullable: true })
  liveUrl: string;

  @Column({ nullable: true })
  repoUrl: string;

  @Column({ default: 0 })
  sortIndex: number;

  @Column({ default: true })
  featured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

Apply the same pattern — with domain-appropriate columns — to: `Experience`, `Education`, `Service`, `Skill`, `Testimonial`, `Solution`, `Pricing`, and `SiteConfig`.

**Seed initial data directly from the existing static data files.** The static files become the source of truth for the first migration.

---

### 🌐 API Endpoint Design

All endpoints are prefixed with `/api` and follow standard REST conventions.

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/profile` | ❌ | Personal info and bio |
| `GET` | `/api/projects` | ❌ | All projects |
| `GET` | `/api/projects/:id` | ❌ | Single project detail |
| `GET` | `/api/experience` | ❌ | Experience timeline |
| `GET` | `/api/education` | ❌ | Education history |
| `GET` | `/api/services` | ❌ | Service catalog |
| `GET` | `/api/services/:id` | ❌ | Service detail |
| `GET` | `/api/skills` | ❌ | Skills matrix |
| `GET` | `/api/testimonials` | ❌ | Testimonials |
| `GET` | `/api/solutions` | ❌ | Solution packages |
| `GET` | `/api/pricing` | ❌ | Pricing tiers |
| `GET` | `/api/site-config` | ❌ | Site configuration |
| `POST` | `/api/contact` | ❌ | Submit contact form |
| `POST` | `/api/terminal/auth` | ❌ | Authenticate terminal session |
| `DELETE` | `/api/terminal/auth` | 🔐 JWT | Revoke terminal session (logout) |

---

### 🔐 Terminal Authentication — Backend Flow

Move terminal credentials entirely out of the frontend. The password is stored as a bcrypt hash server-side.

```mermaid
sequenceDiagram
    participant T as Terminal UI
    participant A as NestJS /terminal/auth
    participant DB as PostgreSQL

    T->>A: POST /terminal/auth { password }
    A->>DB: Fetch terminal credential record
    DB-->>A: { passwordHash }
    A->>A: bcrypt.compare(input, hash)

    alt ✅ Valid credentials
        A-->>T: 200 OK — { token: JWT, ttl: 900s }
    else ❌ Invalid
        A-->>T: 401 Unauthorized
    end

    Note over T: Store token in React state only<br/>Never persist to localStorage or sessionStorage
```

JWT tokens must have a short TTL (15 minutes recommended) and must not be persisted to any browser storage.

---

### ⚙️ Environment Variables

```env
# ─── Backend (.env) ─────────────────────────────────────
DATABASE_URL=postgresql://user:password@host:5432/egoweb
JWT_SECRET=your-jwt-secret-minimum-32-characters
JWT_TTL=900s
TERMINAL_PASSWORD_HASH=$2b$10$...     # bcrypt hash of terminal password
SMTP_HOST=smtp.example.com
SMTP_USER=your@email.com
SMTP_PASS=your-smtp-password
CONTACT_TO_EMAIL=rajahaider7896@gmail.com
PORT=3000

# ─── Frontend (.env) ─────────────────────────────────────
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

### 🔗 Frontend Connection Point

The migration surface is deliberately small. Only `BaseRepository` and `apiClient.js` change. No React component is touched.

```javascript
// BaseRepository — Before (static local data)
async findAll() {
  return localDomainData;
}

// BaseRepository — After (backend API)
async findAll() {
  const response = await apiClient.get(this.endpoint);
  return response.data;
}
```

Set `VITE_API_BASE_URL`, update the `apiClient` base URL, and update `BaseRepository.findAll()`. That is the complete migration surface at the frontend layer.

---

### 🚀 Backend Deployment

| Service | Purpose |
|---------|---------|
| Railway / Render | NestJS API hosting |
| Supabase / Neon | Managed PostgreSQL |
| Netlify | Frontend (completely unchanged) |
| GitHub Actions | CI/CD — test, build, deploy pipeline |

Configure CORS to allow requests only from your Netlify domain:

```typescript
// main.ts
app.enableCors({
  origin: ['https://yourdomain.netlify.app'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

### ✅ Backend Migration Checklist

- [ ] Initialize NestJS project with TypeORM and PostgreSQL connection
- [ ] Create entities for all 11 domains
- [ ] Write initial migration and seed from existing static data files
- [ ] Implement `terminal/auth` module with JWT guard and bcrypt comparison
- [ ] Move contact delivery to backend with Nodemailer
- [ ] Set `VITE_API_BASE_URL` in frontend `.env`
- [ ] Update `BaseRepository` to route through `apiClient`
- [ ] Add `@UseGuards(JwtAuthGuard)` to terminal logout endpoint
- [ ] Configure CORS for the Netlify production domain
- [ ] Enable Swagger at `/api/docs` for auto-generated API documentation
- [ ] Deploy backend and smoke-test every frontend route against the live API
- [ ] Remove all credential-related data from frontend static files

---

## 🚀 Local Development

### Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ |
| npm / pnpm | Latest stable |

### Commands

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Production build (must pass cleanly before any deployment)
npm run build
```

The application must produce a clean `npm run build` with zero console errors before any production deployment.

---

## 🌐 Deployment

Deployed on **Netlify**. The `netlify.toml` configuration handles SPA routing (all paths redirect to `index.html`), production build settings, and security headers. Maintain this file whenever routing or build behavior changes.

---

## 📋 Production Rules

Every change to the codebase must follow these rules:

| # | Rule |
|---|------|
| 1 | 🏗️ Preserve **Presentation → Service → Data**. Never bypass a layer. |
| 2 | 🧩 Keep domain logic outside presentation components. |
| 3 | 📦 Keep all portfolio data normalized in its domain files. |
| 4 | ⚙️ Centralize site configuration in `site-config.js`. |
| 5 | 🖥️ All terminal logic stays in the helper layer, accessed via `terminal.service.js`. |
| 6 | 🔐 Protected commands must pass through the authentication gatekeeper. |
| 7 | 🚪 Explicitly clear root privileges on every `logout` and `exit`. |
| 8 | 🚫 Never expose real credentials in frontend source code. |
| 9 | ⚠️ Treat frontend auth as an interactive feature, not real authorization. |
| 10 | 🔌 Keep all external integrations behind service abstractions. |
| 11 | 🔜 Every architectural decision must preserve backend migration compatibility. |
| 12 | 📱 Preserve responsive behavior and accessibility on every change. |
| 13 | 💀 Maintain loading and error states throughout — no blank screens. |
| 14 | ✅ Verify `npm run build` passes cleanly after significant changes. |
| 15 | 📝 Update `docs/SYSTEM_FLOW.md` when architecture changes. |

---

## 📬 Contact & Links

| Channel | Link |
|---------|------|
| 📧 Email | [rajahaider7896@gmail.com](mailto:rajahaider7896@gmail.com) |
| 💬 WhatsApp | +92 322 5629058 |
| 🐙 GitHub | [Haiderali445](https://github.com/Haiderali445) |
| 💼 LinkedIn | [haider-ali-8a025b290](https://www.linkedin.com/in/haider-ali-8a025b290/) |
| 📸 Instagram | [hayder_alyy__](https://www.instagram.com/hayder_alyy__/) |
| 🌐 Live Site | [haideraliblog.netlify.app](https://haideraliblog.netlify.app/) |

---

## 📜 License

**Personal Use Only.**

You may download, clone, fork, customize, and self-host. Pull requests and public collaboration are not accepted.

---

<div align="center">

**Ego Web** is not a portfolio template. It is an engineering system that demonstrates **how the engineer thinks about software** — and where it's going next.

</div>