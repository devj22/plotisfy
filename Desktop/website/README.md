# Plotsify – Premium Land Investment Platform

A conversion-focused, premium land investment platform for Panvel and Khalapur, Maharashtra.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + custom components |
| Animation | Framer Motion |
| Icons | Lucide React |
| Font | Plus Jakarta Sans |
| Database | Prisma + SQLite (local) / PostgreSQL (production) |
| Storage | Cloudinary / S3/R2 |
| Hosting | Vercel |
| Maps | Google Maps API |
| Tracking | GA4, GTM, Meta Pixel |

## Brand Colors

```
Deep Navy:      #0D2F5B
Terracotta:     #B86A3C  
Off-White:      #F7F3ED
Charcoal Navy:  #162338
Muted:          #6B7B94
Border:         #E2DDD6
```

## Getting Started

```bash
# Install dependencies
npm install

# Create DB and seed sample properties + blogs (first time / after schema changes)
npx prisma db push
npm run db:seed

# Run development server
npm run dev

# Build for production
npm run build
```

Content (properties and blog posts) is stored in the database. Manage them under **Admin → Properties** and **Admin → Content → Blogs**. The public site reads from the same data via API and server components.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout (metadata, fonts)
│   ├── sitemap.ts                  # XML sitemap
│   ├── robots.ts                   # robots.txt
│   ├── properties/
│   │   ├── page.tsx                # All listings with filters
│   │   └── [slug]/page.tsx         # Property detail page
│   ├── locations/
│   │   ├── panvel/page.tsx         # Panvel location page
│   │   └── khalapur/page.tsx       # Khalapur location page
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── book-site-visit/page.tsx    # Site visit booking
│   ├── blog/                       # Public blog (from DB)
│   └── admin/
│       ├── page.tsx                # Admin dashboard
│       ├── properties/page.tsx     # Property CRUD + wizard → DB
│       ├── content/blogs/page.tsx  # Blog CRUD → DB
│       ├── leads/page.tsx          # CRM – leads management
│       └── (see app/api/)          # REST: /api/properties, /api/blogs
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Sticky top navigation
│   │   ├── Footer.tsx              # Footer with CTA
│   │   └── MobileCTA.tsx           # Sticky mobile action bar
│   ├── home/
│   │   └── HomePage.tsx            # All homepage sections
│   ├── properties/
│   │   └── PropertyCard.tsx        # Reusable listing card
│   └── admin/
│       └── AdminLayout.tsx         # Admin sidebar + layout
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── cms.ts                      # DB queries for properties & blogs
│   ├── db-mappers.ts               # DB row → app types
│   ├── api-property.ts             # Validate property payloads
│   ├── utils.ts                    # Helpers
│   └── data.ts                     # Seed source + static content (FAQs, etc.)
├── prisma/
│   ├── schema.prisma               # Property & Blog models
│   └── seed.ts                     # Initial data from data.ts
└── types/
    └── index.ts                    # TypeScript interfaces
```

## Key Features Built

### Public Website
- **Homepage**: Hero + search + featured listings + infrastructure highlights + testimonials + FAQ + enquiry form
- **Properties Page**: Filterable listing grid with sort (location, budget, status, zoning)
- **Property Detail**: Gallery, pricing, trust badges, investment reasoning, nearby landmarks, map, CTA sidebar
- **Location Pages**: Panvel and Khalapur dedicated pages with infrastructure context
- **Book Site Visit**: Full booking form with confirmation
- **About Page**: Mission, stats, contact CTAs
- **Mobile Sticky CTA Bar**: Call / WhatsApp / Site Visit / Enquire

### Admin Dashboard
- **Overview**: KPI cards, lead pipeline chart, recent leads, hot listings, quick actions
- **Property Management**: CRUD table with publish/feature toggles
- **Property Upload Wizard**: 5-step guided form (Basic → Location → Pricing → Photos → SEO)
- **CRM Leads**: Full leads list with filters, status tabs, lead scoring
- **Lead Detail Panel**: Status updates, notes, click-to-call/WhatsApp, follow-up scheduling

### SEO
- Editable metadata per page
- XML sitemap (auto-generated)
- robots.txt
- Open Graph tags
- Canonical-ready structure

## Environment Variables

Create `.env.local`:

```env
# Database — local: SQLite file (see .env.example). Serverless hosts (e.g. Vercel): use PostgreSQL.
DATABASE_URL="file:./prisma/dev.db"
# DATABASE_URL=postgresql://user:password@host:5432/plotsify

# Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_maps_key

# Tracking
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXX

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=919820000000

# Contact
NEXT_PUBLIC_PHONE=+91 98200 00000
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## 30-Day Build Milestones

| Milestone | Day | Status |
|-----------|-----|--------|
| Scope, flows, schema, wireframes | 5 | ✅ |
| Design system + technical foundation | 10 | ✅ |
| Public website working in staging | 15 | ✅ |
| Admin and CRM working | 20 | ✅ |
| Launch candidate ready | 25 | 🔄 |
| Production go-live | 30 | ⏳ |

## Launch Checklist

- [ ] Real property photos (no stock imagery)
- [ ] 10–20 listings loaded
- [ ] All forms create leads correctly
- [ ] GA4, GTM, Meta Pixel installed and tested
- [ ] Mobile conversion paths tested
- [ ] Sales team trained on CRM workflow
- [ ] Site visit booking tested end-to-end
- [ ] SEO meta tags complete for all key pages

---

*Built by Plotsify Development Team*
