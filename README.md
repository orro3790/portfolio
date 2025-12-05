# Juayang Portfolio

Art portfolio built with SvelteKit and Sanity CMS, deployed on Vercel.

## Tech Stack

- **Frontend**: SvelteKit 2 + Svelte 5, TypeScript
- **CMS**: Sanity Studio v4
- **Deployment**: Vercel (adapter-vercel)
- **Smooth Scroll**: Lenis

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Sanity Studio (in separate terminal)
cd studio-art-portfolio
npm install
npm run dev
```

The portfolio runs at `http://localhost:5173` and Sanity Studio at `http://localhost:3333`.

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Sanity CMS (optional - defaults are hardcoded)
PUBLIC_SANITY_PROJECT_ID=mrcn4yss
PUBLIC_SANITY_DATASET=production

# Preview mode (optional - for draft content preview)
SANITY_API_TOKEN=your-sanity-api-token
PREVIEW_SECRET=your-random-secret-string

# Site URL (for production)
PUBLIC_SITE_URL=https://juayang.com
```

## Deployment

### 1. Deploy Portfolio to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel
```

Or connect via GitHub:

1. Push to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects SvelteKit

**Environment Variables in Vercel Dashboard:**

- `PUBLIC_SANITY_PROJECT_ID` = `mrcn4yss`
- `PUBLIC_SANITY_DATASET` = `production`
- `SANITY_API_TOKEN` = (generate from Sanity manage)
- `PREVIEW_SECRET` = (your secret string)

### 2. Deploy Sanity Studio

**Option A: Sanity Hosted (Recommended)**

```bash
cd studio-art-portfolio
npx sanity deploy
```

Choose a hostname like `art-portfolio` → Studio will be at `art-portfolio.sanity.studio`

**Option B: Self-hosted on Vercel**

```bash
cd studio-art-portfolio
vercel
```

### 3. Configure Custom Domain (Namecheap → Vercel)

In **Vercel Dashboard** → Project → Settings → Domains → Add `juayang.com`

In **Namecheap** → Domain List → Manage → Advanced DNS:

| Type  | Host | Value                | TTL       |
| ----- | ---- | -------------------- | --------- |
| A     | @    | 76.76.21.21          | Automatic |
| CNAME | www  | cname.vercel-dns.com | Automatic |

**For studio subdomain** (if self-hosting):
| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | studio | cname.vercel-dns.com | Automatic |

### 4. Update Sanity CORS

Go to [sanity.io/manage](https://sanity.io/manage) → Project → API → CORS Origins:

Add:

- `https://juayang.com`
- `https://www.juayang.com`
- `http://localhost:5173` (for local dev)

## Project Structure

```
├── src/
│   ├── lib/
│   │   ├── components/     # Shared UI components
│   │   ├── sanity/         # Sanity client & queries
│   │   └── stores/         # Svelte stores
│   └── routes/             # SvelteKit pages
├── studio-art-portfolio/   # Sanity Studio (separate npm project)
├── static/                 # Static assets
└── vercel.json             # Vercel configuration
```

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run check     # Type-check
npm run lint      # Lint & format check
```
