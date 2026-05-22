# AfrigrantPipeline — Claude Code Context

## Project Vision
Africa's Research & Innovation Infrastructure platform.
"The LinkedIn + ResearchGate + Grant Marketplace for Africa."
Connects students, researchers, universities, NGOs, industries,
and funding organizations.

---

## Infrastructure & Hosting

| Layer      | Service      | Purpose                                  |
|------------|--------------|------------------------------------------|
| Frontend   | Vercel       | Next.js hosting, edge functions, CI/CD   |
| Backend    | Railway      | Express.js REST API, background jobs     |
| Database   | MongoDB      | Primary database (NoSQL documents)       |
| CDN / DNS  | Cloudflare   | DNS, SSL, DDoS, caching, WAF             |
| Domain     | Custom       | afrigrantpipeline.com via Cloudflare DNS |
| Files      | Cloudinary   | PDFs, avatars, research documents        |
| Email      | Resend       | Transactional email, notifications       |
| AI         | OpenAI API   | Proposals, abstract improver, AI tools   |

---

## Architecture

```
[User Browser]
      │
      ▼
[Cloudflare] ← DNS + CDN + SSL + WAF + DDoS
      │
      ├──► [Vercel] ← Next.js frontend (afrigrantpipeline.com)
      │        │
      │        └──► [Railway] ← Express API (api.afrigrantpipeline.com)
      │                  │
      │                  └──► [MongoDB Atlas] ← Database
      │
      └──► [Cloudinary] ← Static files / uploads
```

### Domain Setup (Cloudflare)
- afrigrantpipeline.com       → Vercel (Next.js frontend)
- api.afrigrantpipeline.com   → Railway (Express REST API)
- Cloudflare proxy ON for all records (orange cloud)
- SSL: Full (strict) mode
- Always HTTPS: ON

---

## Tech Stack

### Frontend — Vercel
- Next.js 15 (App Router), TypeScript strict
- Tailwind CSS (custom design tokens)
- Radix UI primitives for components
- next-auth v5 for session management
- Calls Railway API via NEXT_PUBLIC_API_URL

### Backend — Railway
- Express.js REST API (Node.js 20)
- Mongoose ODM for MongoDB
- JWT authentication middleware
- api.afrigrantpipeline.com via Cloudflare

### Database — MongoDB Atlas
Collections:
  - users / profiles
  - grants / grant_bookmarks
  - articles / journals / peer_reviews
  - collaborations / collaboration_members
  - mentorships

### Security — Cloudflare
- All traffic routes through Cloudflare
- WAF blocks malicious patterns
- Rate limiting on API routes
- DDoS protection at network edge
- SSL certificates managed by Cloudflare

---

## Directory Structure

```
src/
  app/              → Next.js App Router pages
    (auth)/         → login, signup (no layout)
    (main)/         → main pages with header
    api/            → Next.js auth callbacks only
    dashboard/      → protected user pages
  components/
    ui/             → base design system
    profile/        → researcher profile components
    grants/         → grant discovery components
    articles/       → AfriPublish components
    layout/         → Header, Footer, Sidebar
  lib/
    mongodb.ts      → MongoDB connection (singleton)
    auth.ts         → next-auth config
    api.ts          → Railway API client (fetch wrapper)
    utils.ts        → Shared utilities
  models/           → Mongoose schemas
    User.ts
    Grant.ts
    Article.ts
    Journal.ts
    PeerReview.ts
    Collaboration.ts
    Mentorship.ts
  types/
    database.ts     → TypeScript interfaces

server/             → Railway Express backend
  src/
    index.ts        → Express app entry
    routes/         → API route handlers
    models/         → Mongoose models
    middleware/     → auth, rate limit, validation
    controllers/    → Business logic
```

---

## Environment Variables

### Vercel (Frontend .env.local)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/afrigrant
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
NEXTAUTH_URL=https://afrigrantpipeline.com
NEXT_PUBLIC_API_URL=https://api.afrigrantpipeline.com
NEXT_PUBLIC_APP_URL=https://afrigrantpipeline.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
OPENAI_API_KEY=sk-your-key
RESEND_API_KEY=re_your-key
RESEND_FROM_EMAIL=noreply@afrigrantpipeline.com
GOOGLE_CLIENT_ID=your-google-oauth-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
```

### Railway (Backend env vars)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/afrigrant
JWT_SECRET=your-jwt-secret-min-64-chars
OPENAI_API_KEY=sk-your-key
RESEND_API_KEY=re_your-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://afrigrantpipeline.com
PORT=8080
NODE_ENV=production
```

---

## Coding Rules
- TypeScript strict — no `any` types anywhere
- Mongoose models in src/models/ — import from there
- API calls via src/lib/api.ts — never raw fetch in components
- Server components by default; "use client" only when needed
- Tailwind only — no inline styles, no CSS modules
- Mobile-first responsive design
- Always handle loading, error, and empty states
- Railway API returns { data, error, message } consistently
- Never expose JWT secret or MongoDB URI to the browser
- Respect CF-Connecting-IP header for real IP in Railway

---

## When Building Features
1. Read CLAUDE.md first
2. Create/update Mongoose model in src/models/
3. Create Railway API route in server/src/routes/
4. Create src/lib/api.ts method to call Railway
5. Build the page/component last
