# JOY Recruitment Agency — Vue 3 + Vite

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── main.js                         # App entry point
├── App.vue                         # Root — mounts all components + floating WhatsApp button
├── style.css                       # ALL global styles (ported from original HTML)
├── composables/
│   └── useScrollReveal.js          # IntersectionObserver-based scroll animation composable
└── components/
    ├── Navbar.vue                  # Fixed nav with smooth scroll + scroll-shadow
    ├── Hero.vue                    # Hero section with parallax bento grid
    ├── Services.vue                # Services bento grid with staggered reveal
    ├── WhyJoy.vue                  # Dark section — 4 why cards
    ├── Process.vue                 # 4-step process cards
    ├── Testimonials.vue            # 3 testimonial cards
    ├── ContactForm.vue             # Formspree form + WhatsApp pre-fill + validation
    └── Footer.vue                  # Footer
```

## Configuration

### 1. Formspree (Contact Form)

In `src/components/ContactForm.vue`, replace:

```js
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'
```

Sign up at https://formspree.io and create a form to get your ID.

### 2. WhatsApp Phone Number

Phone number is set to `254700000000`. Search and replace across the project:

```
254700000000  →  your actual number in international format (no + sign)
```

### 3. Logo Image

Place the agency logo at `public/joy-logo.jpg`.
It is referenced as `/joy-logo.jpg` in `Navbar.vue` and `Footer.vue`.

## Deploy

### Vercel

```bash
npm run build
# Push to GitHub → import in Vercel → done
```

### Manual

```bash
npm run build
# Upload /dist folder to any static host
```

## Features

- ✅ Vue 3 Composition API
- ✅ Smooth scroll for all anchor links
- ✅ Parallax on hero bento grid (pure CSS transform, no library)
- ✅ Staggered scroll-reveal animations (IntersectionObserver, no library)
- ✅ Floating WhatsApp button (bottom-right)
- ✅ WhatsApp links with pre-filled message (form data used in ContactForm)
- ✅ Formspree contact form with loading state, success state, validation
- ✅ Responsive — all original breakpoints preserved
- ✅ Zero extra dependencies beyond Vue 3 + Vite
