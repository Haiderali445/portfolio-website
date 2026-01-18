# AI Architect Portfolio 💎

> A dedicated, high-fidelity portfolio for the modern Product Engineer.

![Project Preview](/path/to/preview-image.png)

[**View Live Demo**](https://haideraliblog.netlify.app/)

## 🚀 The Pitch
This isn't just a portfolio; it's a statement of engineering precision. Built for the 2026 industry standard, this system bridges the gap between sophisticated design and robust architecture. It features deep-dive service documentation, a vertical timeline of experience, and a dynamic bento-grid layout—all powered by a backend-ready architecture.

## ⚡ 2026 Tech Stack
- **Role**: Dynamic Frontend Architecture
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Strict Dark Mode)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) + [Lenis Scroll](https://github.com/studio-freight/lenis)
- **Routing**: [React Router DOM](https://reactrouter.com/) (v6)
- **State**: React Hooks (Context-free, Component-level)

## 🏗️ System Architecture
### 1. Service Deep-Dives
The system supports dynamic routing (`/services/:serviceId`) to render rich technical documentation for each offering.
- **Frontend**: `ServiceDetail.jsx`
- **Data Source**: `src/utils/data/services-data.js`
- **Visuals**: Architecture Stack, Implementation Roadmap

### 2. Bento-Grid Design System
We utilize a modular "Bento" layout for key sections (Skills, Experience, Solutions), ensuring responsive, content-first presentation that looks premium on any device.

### 3. Backend Readiness
The project is architected to eventually fetch data from a CMS or API.
- **Data Layer**: All static content lives in `src/utils/data/`.
- **Fetch Hooks**: Components like `Experience.jsx` contain commented-out `useEffect` hooks ready to swap local imports for `fetch('/api/...')` calls.

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/full_vite_portfolio.git

# Navigate to directory
cd full_vite_portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

## � Project Structure

This workspace is organized into a modular, multi-repo architecture to ensure separation of concerns:

* **[portfolio-backend/](portfolio-backend/)** — **Scalable Backend**. FastAPI (Python) server handling agentic memory and task processing.
* **[portfolio-dashboard/](portfolio-dashboard/)** — **Admin Control Center**. Refine.js & Puck.js visual builder for content management.
* **[shared-docs/](shared-docs/)** — **Documentation Vault**. Contains all raw artifacts and architecture blueprints.

---

## 📚 Architecture & Documentation

> [!IMPORTANT]
> This project uses a **Scale-to-Zero** architecture. To understand how the three repositories (Portfolio, Dashboard, Backend) integrate, please review the documentation below.

### 🔗 Central Integration
* **[SYSTEM_FLOW.md](SYSTEM_FLOW.md)** — **Master Integration Guide**. Details secure communication between repositories, CORS settings, and data flow.
* **[DEVOPS_OPTIMIZATION.md](DEVOPS_OPTIMIZATION.md)** — Strategies for 100% free-tier maintenance and bandwidth monitoring.

### 🏗️ Backend & Agentic AI
* **[BACKEND_ROADMAP.md](BACKEND_ROADMAP.md)** — Architectural details for pgvector, task queues, and FastAPI.
* **[portfolio-backend/BACKEND_GUIDE.md](portfolio-backend/BACKEND_GUIDE.md)** — Render.com & Supabase deployment walkthrough.

### 🎨 Dashboard & Visual Builder
* **[DASHBOARD_SPECS.md](DASHBOARD_SPECS.md)** — Product specs for the Refine.js Admin Panel and Puck.js builder.
* **[portfolio-dashboard/DASHBOARD_GUIDE.md](portfolio-dashboard/DASHBOARD_GUIDE.md)** — Dashboard setup and Refine.js configuration.

### 🚀 Operations
* **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** — Netlify/Vercel frontend deployment.
* **[walkthrough.md](walkthrough.md)** — Comprehensive project implementation summary.
* **[CHANGELOG.md](CHANGELOG.md)** — Version history and architectural updates.

### Key Features
- ✅ **100% Free Hosting** - Supabase Free Tier + Render Free Tier + Vercel Hobby Tier
- ✅ **Agentic AI Workflows** - pgvector memory system with Groq Cloud / Hugging Face integration
- ✅ **Visual Page Builder** - Drag-and-drop section reordering with Puck.js
- ✅ **Auto Keep-Awake** - Cron job pings every 14 minutes to prevent Render sleep
- ✅ **Optimized Performance** - Image compression, CDN caching, bandwidth monitoring

## 🤝 Contributing
Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests.

## 📄 License
MIT License © 2026 Haider Ali


