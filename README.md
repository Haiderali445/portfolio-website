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

## 📁 Backend Integration Guide
To connect a real backend:
1. Navigate to `src/components/experience/Experience.jsx`.
2. Uncomment the `useEffect` hook.
3. Replace `initialData` with the `experiences` state.
4. Update `.env` with your API endpoints.

## 🤝 Contributing
Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests.

## 📄 License
MIT License © 2026 Haider Ali


