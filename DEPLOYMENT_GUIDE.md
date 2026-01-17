# Deployment Guide & Production Checklist

## 1. Environment Configuration
Before deploying, ensure the following Environment Variables are set in your CI/CD provider (Vercel/Netlify):

```env
# Core
VITE_APP_ENV="production"
VITE_SITE_URL="https://your-portfolio-domain.com"

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID="G-XXXXXXXX"

# Email Services (EmailJS)
VITE_EMAILJS_SERVICE_ID="service_xxx"
VITE_EMAILJS_TEMPLATE_ID="template_xxx"
VITE_EMAILJS_PUBLIC_KEY="public_xxx"

# Supabase (Phase 4 Integration)
VITE_SUPABASE_URL="https://xxx.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJxhbGci..."
```

---

## 2. Production Build Checklist

### 2.1 Code Quality
*   [ ] Run `npm run lint` to catch any lingering ESLint errors.
*   [ ] Check console logs in `dev` mode; ensure no "Key prop missing" warnings.
*   [ ] Verify all `<a>` tags to external links have `rel="noopener noreferrer"`.

### 2.2 Asset Optimization
*   [ ] Ensure all images in `src/Assets` are compressed (WebP format recommended).
*   [ ] Lazy loading is implemented for below-the-fold images (`loading="lazy"`).

### 2.3 SEO Verification
*   [ ] `src/components/Helmet/MetaTags.jsx` is correctly populated with default Open Graph data.
*   [ ] `robots.txt` and `sitemap.xml` are present in the `public/` directory (if static) or generated.

---

## 3. Netlify Deployment (Recommended)

1.  **Connect Repo**: Link your GitHub repository to Netlify.
2.  **Build Settings**:
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
3.  **Redirects**:
    *   Create a `public/_redirects` file for Single Page App (SPA) routing:
        ```
        /*  /index.html  200
        ```
    *   *Note*: This prevents 404 errors when refreshing a route like `/services/1`.

---

## 4. Vercel Deployment (Alternative)

1.  **Import Project**: Select the GitHub Repo.
2.  **Framework Preset**: Vite.
3.  **Deploy**: Vercel handles SPA routing automatically.

---

## 5. Post-Deployment Verification
*   **Lighthouse Score**: Run a Lighthouse audit. Target >90 in Performance and Accessibility.
*   **Form Test**: Send a test message via the Contact Form to verify EmailJS configuration.
*   **Mobile Test**: Open on actual iOS and Android devices to verify "Galaxy Box" and Marquee rendering.
