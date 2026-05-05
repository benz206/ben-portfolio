# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev        # Start dev server (Turbo mode)
bun run build      # Production build (runs next-sitemap postbuild)
bun run start      # Start production server
bun run lint       # ESLint
bun run format     # Prettier format all files
```

## Architecture Overview

**Stack:** Next.js App Router, React 19, TypeScript, TailwindCSS 4, Framer Motion, GSAP

### Content

Blog posts are fetched from an external GitHub repo (`benz206/blog`) via the GitHub API (`@octokit/rest`). The `utils/blog.ts` utility fetches `.mdx` files, parses YAML frontmatter with `gray-matter`, and uses commit history for created/updated dates. Posts are rendered server-side with `next-mdx-remote`. Revalidation is set to 3600s.

### External Integrations

- **Spotify**: Token refresh flow in `utils/functions/getSpotify.ts`. Currently playing and top tracks served via `/api/getCurrent` and `/api/getTop`. Color extracted from album art using `color-thief-node`.
- **Cloudinary**: Image hosting via `next-cloudinary`. Remote patterns also allow `i.imgur.com`, `cdn.jsdelivr.net`, `i.scdn.co`.
- **Redis**: View tracking via `utils/redis.ts`. Global views at `views:global`, per-post at `views:post:[slug]`. Atomic increments via Lua script.

### API Routes

All under `app/api/`:

- `blog/public` — blog post list
- `getCurrent/public`, `getCurrent/[password]` — Spotify current track
- `getTop/public` — Spotify top tracks
- `views`, `views/[slug]` — view counting (GET/POST)
- `getColor/[hash]` — dominant color extraction from images
- `manageState/[password]/[change]` — password-protected state control
- `status/cloudinary` — Cloudinary health check
- `presence` — presence/availability status

### Static Data

Hard-coded data lives in `data/`: experience history, project previews, golden records, memorial data. Edit these files directly to update those sections.

### Styling

TailwindCSS 4 with class-based dark mode. Custom `noir-*` gradient backgrounds defined in `tailwind.config.js`. Use `cn()` from `utils/cn.ts` (clsx + tailwind-merge) for conditional class names.

### Environment Variables

Defined in `environment.d.ts`:

- `SPOTIFY_CLIENTID`, `SPOTIFY_SECRET`, `SPOTIFY_REFRESHTOKEN`
- `BLOG_PAT` — GitHub PAT for blog repo
- `REDIS_URL`
- `PASSWORD` — for protected API routes
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Path Aliases

`@/*` maps to the repo root, so `@/components/...`, `@/utils/...`, `@/data/...`, etc.

### MDX Components

Custom MDX component mappings in `mdx-components.tsx`. MDX-specific styles in `styles/mdx.module.css`. The `components/mdx/` directory contains `MDXImage` and `ResponsiveTable` used in blog posts.
