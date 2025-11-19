# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Tech Stack

## Core Framework & Language
- **Next.js**: `canary` - Using bleeding-edge Next.js features with App Router
- **React**: `18.2.0` - Functional components only, server components by default
- **TypeScript**: `5.3.3` - Configured with `strict: false` but `strictNullChecks: true`
- **Node Types**: `@types/node@20.11.17`, `@types/react@18.2.55`, `@types/react-dom@18.2.19`

## Styling & UI
- **Tailwind CSS**: `4.0.0-alpha.13` - Alpha version with new architecture
- **PostCSS**: `^8.4.35` with `@tailwindcss/postcss@4.0.0-alpha.13`
- **Fonts**: `geist@1.2.2` - Vercel's Geist Sans and Geist Mono font family

## Content & Rendering
- **next-mdx-remote**: `^4.4.1` - Server-side MDX rendering with RSC support
- **sugar-high**: `^0.6.0` - Lightweight syntax highlighter for code blocks (no Prism/Highlight.js)

## Analytics & Performance
- **@vercel/analytics**: `^1.1.3` - Vercel Analytics integration
- **@vercel/speed-insights**: `^1.0.9` - Core Web Vitals tracking

## Build & Development Tools
- **Package Manager**: `pnpm` (evidenced by pnpm-lock.yaml)
- **TypeScript Config**: Absolute imports enabled via `baseUrl: "."`

---

# Development Commands

```bash
# Start development server at http://localhost:3000
pnpm dev

# Production build (required before deployment or after content changes)
pnpm build

# Start production server (must run build first)
pnpm start
```

**Important**: This is a statically-generated site. Content changes require a full rebuild to take effect.

---

# Content & Data Structure

## Blog Post Location
All blog content lives in: `app/blog/posts/*.mdx`

## MDX Frontmatter Structure

Every MDX file MUST include YAML frontmatter with this exact structure:

```yaml
---
title: 'Your Post Title Here'
publishedAt: '2024-04-09'
summary: 'A brief summary of the post that appears in listings and SEO metadata.'
image: '/optional-custom-og-image.jpg'  # Optional: custom OG image path
---
```

### Frontmatter Fields (from `app/blog/utils.ts:4-9`)

```typescript
type Metadata = {
  title: string        // Required: Post title (used in <h1>, metadata, OG tags)
  publishedAt: string  // Required: Date in 'YYYY-MM-DD' format
  summary: string      // Required: Brief description (SEO + RSS)
  image?: string       // Optional: Custom OG image (falls back to /og dynamic generation)
}
```

### Real Example (from `app/blog/posts/vim.mdx`)

```markdown
---
title: 'Embracing Vim: The Unsung Hero of Code Editors'
publishedAt: '2024-04-09'
summary: 'Discover why Vim, with its steep learning curve, remains a beloved tool among developers for editing code efficiently and effectively.'
---

## Your Content Here

Regular markdown/MDX content follows after frontmatter...
```

## Content Parsing Pipeline (app/blog/utils.ts)

1. **`getMDXFiles(dir)`** (L29-31): Reads directory, filters `.mdx` files
2. **`readMDXFile(filePath)`** (L33-36): Reads file content, calls `parseFrontmatter()`
3. **`parseFrontmatter(fileContent)`** (L11-27):
   - Extracts YAML between `---` delimiters using regex
   - Parses key-value pairs (splits on `: `)
   - Strips quotes from values
   - Returns `{ metadata, content }` object
4. **`getBlogPosts()`** (L52-54):
   - Main export used throughout the app
   - Returns array of `{ metadata, slug, content }` objects
   - Slug = filename without `.mdx` extension

**Critical**: Frontmatter parsing assumes `---` delimiters exist and will throw if missing. No validation errors—just crashes.

---

# Code Style & Conventions

## Component Patterns

### 1. Function Declaration Styles (Observed Pattern)

The codebase uses TWO distinct export patterns:

**Pattern A: Named Export Function** (preferred for reusable components)
```tsx
// app/components/nav.tsx, app/components/posts.tsx, app/components/mdx.tsx
export function ComponentName() {
  return <div>...</div>
}
```

**Pattern B: Default Export Function** (for page components)
```tsx
// app/page.tsx, app/blog/page.tsx, app/blog/[slug]/page.tsx
export default function Page() {
  return <section>...</section>
}

// Also used for layout
export default function RootLayout({ children }) {
  return <html>...</html>
}
```

**Exception**: `app/components/footer.tsx` uses default export despite being a component (not a page).

### 2. Component Composition

- **No class components** - 100% functional components
- **Server Components by default** - No `'use client'` directives found
- **Direct data fetching** - Server components call `getBlogPosts()` directly (no props drilling)
- **Inline type definitions** - Types defined inline, not in separate `.d.ts` files

Example:
```tsx
// app/layout.tsx:41-45
export default function RootLayout({
  children,
}: {
  children: React.ReactNode  // Inline type definition
}) {
  return (...)
}
```

## Styling Conventions

### Tailwind CSS Usage

**Class Application Pattern**:
```tsx
// Direct className prop with space-separated utilities
<div className="flex flex-col space-y-1 mb-4">
  <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
    {formatDate(post.metadata.publishedAt, false)}
  </p>
</div>
```

**Dark Mode Pattern**: Use `dark:` prefix for dark mode variants
```tsx
className="text-black bg-white dark:text-white dark:bg-black"
```

**Common Patterns Found**:
- **Spacing**: `space-x-*`, `space-y-*` for flex gap
- **Typography**: `tracking-tight`, `tracking-tighter` for condensed text
- **Colors**: `neutral-*` scale (not `gray-*`)
- **Responsive**: `md:`, `lg:` prefixes for breakpoints
- **Hover states**: `hover:text-neutral-800 dark:hover:text-neutral-200`

### Global Styles (app/global.css)

**Do NOT use Tailwind's `@apply` in components**—only in `global.css` for `.prose` styles:

```css
/* app/global.css:36-44 */
.prose .anchor {
  @apply absolute invisible no-underline;

  margin-left: -1em;
  padding-right: 0.5em;
  /* ... */
}
```

**Prose Class Usage**: MDX content MUST be wrapped in `<article className="prose">` to inherit typography styles.

### Custom CSS Variables (for Syntax Highlighting)

Sugar-high tokens are styled via CSS variables (NOT Tailwind classes):

```css
/* app/global.css:8-17 */
:root {
  --sh-class: #2d5e9d;
  --sh-identifier: #354150;
  --sh-sign: #8996a3;
  --sh-string: #007f7a;
  --sh-keyword: #e02518;
  /* ... */
}
```

## UI Component Guidelines

**All new UI elements MUST use Tailwind CSS utility classes.** Do not introduce external component libraries (MUI, Chakra, etc.) that conflict with the existing Tailwind-based design system.

### Required Patterns for New Components:

1. **Styling Approach**: Direct `className` prop with Tailwind utilities
   ```tsx
   // ✅ Correct
   <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800">
     Click me
   </button>

   // ❌ Wrong - no external component libraries
   <MuiButton variant="contained">Click me</MuiButton>
   ```

2. **Color Palette**: Use `neutral-*` scale (not `gray-*`, `slate-*`, etc.)
   ```tsx
   // ✅ Correct
   className="text-neutral-600 dark:text-neutral-400"

   // ❌ Wrong
   className="text-gray-600 dark:text-gray-400"
   ```

3. **Dark Mode Support**: Always include `dark:` variants
   ```tsx
   // ✅ Correct - supports both modes
   className="bg-white dark:bg-black text-black dark:text-white"

   // ❌ Wrong - light mode only
   className="bg-white text-black"
   ```

4. **Spacing Consistency**: Use established patterns
   - `space-x-*` / `space-y-*` for flex gap between children
   - `px-*` / `py-*` for padding
   - `mb-*` / `mt-*` for margin (prefer `mb` over `mt` when possible)

5. **Typography**: Follow existing conventions
   - `tracking-tight` or `tracking-tighter` for headings
   - `font-semibold` for emphasis (not `font-bold`)
   - Use `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` scale

6. **Responsive Design**: Mobile-first with `md:` and `lg:` breakpoints
   ```tsx
   // ✅ Correct - mobile first, then larger screens
   className="flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4"
   ```

### When to Extract Reusable Components:

If a UI pattern appears **3+ times**, extract it into `app/components/`:

```tsx
// app/components/button.tsx
export function Button({
  children,
  variant = 'primary'
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}) {
  const baseClasses = "px-4 py-2 rounded-lg transition-all"
  const variantClasses = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-200",
    secondary: "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  )
}
```

**Do NOT create a component for one-off use cases.** Inline Tailwind classes are preferred for unique elements.

## Data Rendering Patterns

### Server-Side Data Fetching

```tsx
// app/components/posts.tsx:4-6
export function BlogPosts() {
  let allBlogs = getBlogPosts()  // Direct call in server component

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
            return -1  // Descending order (newest first)
          }
          return 1
        })
        .map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            {/* ... */}
          </Link>
        ))}
    </div>
  )
}
```

**Sorting Convention**: Always sort posts by `publishedAt` in descending order (newest first).

### MDX Rendering Pattern

```tsx
// app/blog/[slug]/page.tsx:93-94
<article className="prose">
  <CustomMDX source={post.content} />
</article>
```

**CustomMDX Component** (app/components/mdx.tsx:102-109):
- Uses `next-mdx-remote/rsc` for RSC rendering
- Provides custom component mappings (h1-h6, Image, a, code, Table)
- Code blocks use sugar-high's `highlight()` function with `dangerouslySetInnerHTML`

### Metadata Generation Pattern

```tsx
// app/blog/[slug]/page.tsx:14-52
export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug)
  if (!post) return  // Early return if not found

  let { title, publishedAt: publishedTime, summary: description, image } = post.metadata
  let ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: { title, description, type: 'article', publishedTime, url: `${baseUrl}/blog/${post.slug}`, images: [{ url: ogImage }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}
```

**Pattern**: Destructure metadata, fallback to dynamic OG image if no custom image provided.

---

# SEO Principles

This project implements a comprehensive SEO strategy across multiple layers:

## 1. Sitemap Generation (app/sitemap.ts)

```typescript
export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let routes = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
```

- **Auto-generated** at `/sitemap.xml`
- **Dynamic**: Includes all blog posts + static routes
- **Last Modified**: Uses `publishedAt` for posts, current date for static pages

## 2. Robots.txt (app/robots.ts)

```typescript
export default function robots() {
  return {
    rules: [{ userAgent: '*' }],  // Allow all bots
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

- **Accessible** at `/robots.txt`
- **Permissive**: No disallow rules

## 3. Dynamic OG Image Generation (app/og/route.tsx)

```tsx
import { ImageResponse } from 'next/og'

export function GET(request: Request) {
  let url = new URL(request.url)
  let title = url.searchParams.get('title') || 'Next.js Portfolio Starter'

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
        <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
          <h2 tw="flex flex-col text-4xl font-bold tracking-tight text-left">
            {title}
          </h2>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }  // Standard OG image size
  )
}
```

- **Route**: `/og?title=Your+Post+Title`
- **Technology**: Next.js's `next/og` (uses Vercel's OG Image Generation)
- **Styling**: Uses `tw` prop (Tailwind-like syntax for Satori)
- **Fallback**: If no custom `image` in frontmatter, blog posts use this

## 4. JSON-LD Structured Data (app/blog/[slug]/page.tsx:63-84)

```tsx
<script
  type="application/ld+json"
  suppressHydrationWarning
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.metadata.title,
      datePublished: post.metadata.publishedAt,
      dateModified: post.metadata.publishedAt,
      description: post.metadata.summary,
      image: post.metadata.image
        ? `${baseUrl}${post.metadata.image}`
        : `/og?title=${encodeURIComponent(post.metadata.title)}`,
      url: `${baseUrl}/blog/${post.slug}`,
      author: {
        '@type': 'Person',
        name: 'My Portfolio',
      },
    }),
  }}
/>
```

- **Schema**: BlogPosting (Google-friendly article markup)
- **Placement**: Inside each blog post page
- **suppressHydrationWarning**: Prevents React hydration mismatch (server-generated JSON)

## 5. RSS Feed (app/rss/route.ts)

```typescript
export async function GET() {
  let allBlogs = await getBlogPosts()

  const itemsXml = allBlogs
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1
      }
      return 1
    })
    .map((post) => `<item>
      <title>${post.metadata.title}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description>${post.metadata.summary || ''}</description>
      <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
    </item>`)
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>My Portfolio</title>
        <link>${baseUrl}</link>
        <description>This is my portfolio RSS feed</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: { 'Content-Type': 'text/xml' },
  })
}
```

- **Route**: `/rss`
- **Format**: RSS 2.0
- **Sorting**: Newest first (same as blog list)
- **Date Format**: UTC string (`toUTCString()`)

## 6. Root Layout Metadata (app/layout.tsx:11-37)

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Next.js Portfolio Starter',
    template: '%s | Next.js Portfolio Starter',  // Page title | Site title
  },
  description: 'This is my portfolio.',
  openGraph: {
    title: 'My Portfolio',
    description: 'This is my portfolio.',
    url: baseUrl,
    siteName: 'My Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

- **Title Template**: Enables per-page titles via `export const metadata = { title: 'Blog' }`
- **metadataBase**: Required for relative OG image paths
- **Robots**: Explicitly allows indexing (best practice)

---

# Critical Configuration Points

## Base URL (Must Update for Production)

**Location**: `app/sitemap.ts:3`

```typescript
export const baseUrl = 'https://portfolio-blog-starter.vercel.app'
```

**Used by**:
- `app/sitemap.ts` - Sitemap URLs
- `app/rss/route.ts` - RSS feed links
- `app/robots.ts` - Sitemap reference
- `app/layout.tsx` - metadataBase
- `app/blog/[slug]/page.tsx` - OG URLs, JSON-LD

**Action Required**: Change this to your actual domain before deployment.

## TypeScript Absolute Imports

**Location**: `tsconfig.json:20`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "strict": false,
    "strictNullChecks": true
  }
}
```

**Effect**: Import from project root without `../../` hell:

```tsx
import { getBlogPosts } from 'app/blog/utils'  // ✅ Not '../blog/utils'
import { Navbar } from 'app/components/nav'     // ✅ Not '../../components/nav'
```

## PostCSS Configuration

**Location**: `postcss.config.js`

```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // Tailwind v4 plugin (not 'tailwindcss')
  },
}
```

**Important**: Tailwind v4 uses a different PostCSS plugin name.

---

# Architecture Deep Dive

## Static Site Generation Flow

1. **Build Time**: `pnpm build` runs
2. **generateStaticParams()** in `app/blog/[slug]/page.tsx:6-12` executes:
   ```tsx
   export async function generateStaticParams() {
     let posts = getBlogPosts()
     return posts.map((post) => ({ slug: post.slug }))
   }
   ```
3. Next.js pre-renders each `/blog/[slug]` route
4. **Result**: Fully static HTML files in `.next/` directory

**Consequence**: New blog posts require `pnpm build` to appear on site.

## MDX Component Customization

Custom components are injected via `app/components/mdx.tsx:89-100`:

```tsx
let components = {
  h1: createHeading(1),  // Auto-generates anchor links
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,   // Next.js Image with rounded-lg class
  a: CustomLink,         // External links open in new tab
  code: Code,            // Sugar-high syntax highlighting
  Table,                 // Custom table component
}
```

### Heading Behavior (app/components/mdx.tsx:67-87)

```tsx
function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children)  // "My Heading" → "my-heading"
    return React.createElement(
      `h${level}`,
      { id: slug },  // <h2 id="my-heading">
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',  // Invisible anchor link
        }),
      ],
      children
    )
  }
  return Heading
}
```

**Effect**: All MDX headings become linkable anchors (e.g., `/blog/vim#efficiency-and-speed`).

### Code Highlighting (app/components/mdx.tsx:51-54)

```tsx
function Code({ children, ...props }) {
  let codeHTML = highlight(children)  // sugar-high's highlight()
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}
```

**Important**: Inline code (`text`) is NOT highlighted—only fenced code blocks.

## Link Handling (app/components/mdx.tsx:29-45)

```tsx
function CustomLink(props) {
  let href = props.href

  if (href.startsWith('/')) {
    return <Link href={href} {...props}>{props.children}</Link>  // Next.js Link
  }

  if (href.startsWith('#')) {
    return <a {...props} />  // Anchor link (same page)
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />  // External link
}
```

**Security**: External links automatically get `rel="noopener noreferrer"`.

---

# Adding New Blog Posts

## Step-by-Step Process

1. **Create file**: `app/blog/posts/my-new-post.mdx`

2. **Add frontmatter** (required):
   ```yaml
   ---
   title: 'My Awesome Post Title'
   publishedAt: '2024-11-19'
   summary: 'A compelling summary for SEO and RSS feeds.'
   ---
   ```

3. **Write content** (standard Markdown/MDX):
   ```markdown
   ## Introduction

   Your content here...

   ```ts
   const code = 'will be highlighted'
   ```
   ```

4. **Rebuild**: `pnpm build`

5. **Verify**: Check these auto-updated:
   - Home page (`/`)
   - Blog index (`/blog`)
   - RSS feed (`/rss`)
   - Sitemap (`/sitemap.xml`)
   - New post page (`/blog/my-new-post`)

## Auto-Generated Elements

✅ **Automatic**:
- Slug from filename (`my-new-post.mdx` → `/blog/my-new-post`)
- OG image at `/og?title=My+Awesome+Post+Title`
- JSON-LD structured data
- RSS feed entry
- Sitemap entry
- Heading anchor links

❌ **Manual** (if needed):
- Custom OG image (set `image: '/custom-og.jpg'` in frontmatter)

---

# Common Pitfalls & Gotchas

## ⚠️ Missing Frontmatter = Runtime Error

`app/blog/utils.ts:14` assumes frontmatter exists:

```typescript
let frontMatterBlock = match![1]  // ❌ Will crash if no frontmatter
```

**Solution**: Always include `---` delimiters, even for empty frontmatter.

## ⚠️ Date Format Matters

`publishedAt` MUST be `'YYYY-MM-DD'` string format:

```yaml
publishedAt: '2024-04-09'  # ✅ Correct
publishedAt: 2024-04-09    # ❌ Wrong (parsed as number)
publishedAt: 'April 9, 2024'  # ❌ Wrong (formatDate expects ISO-like)
```

## ⚠️ Base URL Not Updated

If you deploy without changing `baseUrl` in `app/sitemap.ts`, your SEO metadata will point to the wrong domain.

## ⚠️ Code in MDX Needs Language Specifier

```markdown
```ts  ← Language identifier required for syntax highlighting
const code = 'highlighted'
```
```

Without language identifier, code will render but won't be highlighted.

## ⚠️ Dark Mode Requires System Preference

No manual toggle exists. Dark mode activates via:

```css
@media (prefers-color-scheme: dark) { /* ... */ }
```

Users must change OS settings to see dark mode.

---

# File Structure Reference

```
app/
├── blog/
│   ├── posts/           # ← MDX content files live here
│   │   ├── vim.mdx
│   │   ├── static-typing.mdx
│   │   └── spaces-vs-tabs.mdx
│   ├── [slug]/
│   │   └── page.tsx     # Dynamic blog post pages
│   ├── page.tsx         # Blog index (/blog)
│   └── utils.ts         # ← Content parsing logic
├── components/
│   ├── mdx.tsx          # ← MDX component overrides
│   ├── nav.tsx
│   ├── footer.tsx
│   └── posts.tsx        # BlogPosts list component
├── og/
│   └── route.tsx        # ← Dynamic OG image generation
├── rss/
│   └── route.ts         # ← RSS feed endpoint
├── global.css           # ← Tailwind import + prose styles
├── layout.tsx           # Root layout + metadata
├── page.tsx             # Home page
├── sitemap.ts           # ← Sitemap generation
├── robots.ts            # ← Robots.txt generation
└── not-found.tsx        # 404 page

package.json
tsconfig.json
postcss.config.js
pnpm-lock.yaml
```

---

# Summary: Key Takeaways for New Contributors

1. **Content = MDX files in `app/blog/posts/`** with strict frontmatter requirements
2. **Build required after content changes** (`pnpm build`)
3. **Server components everywhere** - no client-side data fetching
4. **Tailwind v4 alpha** - different plugin name in PostCSS
5. **SEO is comprehensive** - sitemap, RSS, OG images, JSON-LD all auto-generated
6. **TypeScript uses absolute imports** - import from `app/*`, not `../..`
7. **Dark mode is system-preference only** - no manual toggle
8. **Update `baseUrl` before deployment** - critical for SEO metadata

Read the code, follow the patterns, and you'll contribute successfully. 🚀
