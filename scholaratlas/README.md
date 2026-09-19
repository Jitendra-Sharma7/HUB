# ScholarAtlas - Global Scholarship Discovery Platform

A comprehensive, production-ready scholarship discovery platform built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Prisma.

## 🚀 Features

### Core Platform
- **50+ Verified Demo Scholarships** with full metadata (DAAD, Fulbright, Chevening, Gates Cambridge, etc.)
- **20+ Country Profiles** with living costs, visa info, and scholarship counts
- **22 Fields of Study** with career paths and salary data
- **20 Top Global Universities** with rankings and program details
- **Rich Scholarship Search** - Natural language queries, multi-criteria filtering, sorting, pagination
- **AI Scholarship Finder** - 10-step interactive questionnaire with algorithmic matching (shows match % and reasons)
- **Scholarship Comparison** - Side-by-side comparison tool (up to 4 scholarships)
- **Application Tracker** - Kanban-style status management with deadline reminders
- **Deadline Calendar** - Urgency-based filtering and visualization
- **User Dashboard** - Saved scholarships, recommendations, profile completion tracker
- **Admin Panel** - Scholarship management, verification queue, analytics preview

### Trust & Verification
- Every scholarship displays: Source, Last Verified Date, Official Links, Verification Status
- Clear disclaimer: "Algorithmic matches are informational, not guaranteed eligibility"
- Public submission form enters moderation queue (never auto-published)

### Architecture
- **Data Layer**: Robust in-memory mock database (`src/lib/data/`) - easily replaceable with Prisma when PostgreSQL is connected
- **State Management**: Zustand with localStorage persistence for saved scholarships, tracker, comparison
- **Authentication**: Demo auth system (any email/password works for MVP)
- **Responsive Design**: Mobile-first, accessible, optimized for all screen sizes

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database ORM**: Prisma (PostgreSQL schema ready)
- **State**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Toasts**: React Hot Toast

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL (optional for MVP - app works with mock data)

### Installation

```bash
# Navigate to project directory
cd scholaratlas

# Install dependencies
npm install

# (Optional) Set up PostgreSQL database
# 1. Create a PostgreSQL database named 'scholaratlas'
# 2. Update DATABASE_URL in .env
# 3. Run Prisma migrations:
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

```env
# Database (optional for MVP)
DATABASE_URL="postgresql://localhost:5432/scholaratlas"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

## 📂 Project Structure

```
scholaratlas/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx              # Homepage
│   │   ├── scholarships/         # Search & details pages
│   │   ├── finder/               # AI Scholarship Finder
│   │   ├── dashboard/            # User dashboard
│   │   ├── tracker/              # Application tracker
│   │   ├── compare/              # Comparison tool
│   │   ├── deadlines/            # Deadline calendar
│   │   ├── countries/            # Country directory
│   │   ├── universities/         # University directory
│   │   ├── fields/               # Fields of study
│   │   ├── fully-funded/         # Curated fully-funded list
│   │   ├── auth/                 # Login & register
│   │   ├── admin/                # Admin dashboard
│   │   └── ...                   # Other pages
│   ├── components/
│   │   ├── scholarships/         # ScholarshipCard, SearchFilters
│   │   ├── layout/               # Header, Footer, Layout components
│   │   └── ui/                   # Reusable UI components
│   ├── lib/
│   │   ├── data/                 # Mock data layer
│   │   │   ├── mock-scholarships.ts  # 50+ demo scholarships
│   │   │   ├── mock-countries.ts     # 20 country profiles
│   │   │   ├── mock-fields.ts        # 22 fields of study
│   │   │   ├── mock-universities.ts  # 20 universities
│   │   │   ├── mock-providers.ts     # 15 providers
│   │   │   └── store.ts              # Data access API
│   │   ├── store/                # Zustand client state
│   │   │   └── useStore.ts       # Global app state
│   │   ├── auth.ts               # Auth utilities
│   │   ├── prisma.ts             # Prisma client
│   │   └── utils.ts              # Helper functions
│   └── prisma/
│       └── schema.prisma         # Complete database schema
```

## 🎯 Key Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, search, featured scholarships |
| `/scholarships` | Global search with filters & sorting |
| `/scholarships/[id]` | Detailed scholarship page |
| `/finder` | 10-step AI matching questionnaire |
| `/dashboard` | User dashboard (requires login) |
| `/tracker` | Application tracker (requires login) |
| `/compare` | Side-by-side comparison |
| `/deadlines` | Deadline calendar |
| `/countries` | Country directory |
| `/universities` | University directory |
| `/fields` | Fields of study |
| `/fully-funded` | Curated fully-funded list |
| `/submit-scholarship` | Public submission form |
| `/admin` | Admin dashboard |

## 🔐 Authentication

For MVP demonstration, any email and password combination will work:
- Try: `student@example.com` / `password123`

## 🗄️ Database

The Prisma schema is production-ready with models for:
- Users (with profile fields)
- Scholarships (comprehensive fields)
- Countries, Universities, Fields, Providers
- SavedScholarships, Applications, Notifications, Alerts
- Documents, Guides, FAQs, Blog Posts

**Current Mode**: Mock data (no database required)
**Production Mode**: Connect PostgreSQL and run `npm run db:push`

## 🎨 Design Philosophy

- **Trustworthy**: Every scholarship shows source and verification status
- **Transparent**: Clear match explanations, never guarantee eligibility
- **Student-First**: Zero fees, no deceptive SEO tactics
- **Accessible**: WCAG-compliant, keyboard navigable
- **Fast**: Optimized Core Web Vitals, efficient caching

## 📊 Demo Data

The platform includes:
- **50+ Realistic Scholarships** (Chevening, Fulbright, DAAD, Gates Cambridge, Rhodes, etc.)
- **20 Countries** with flags, living costs, visa requirements
- **22 Academic Fields** with career paths and salaries
- **20 Top Universities** (Harvard, MIT, Oxford, Cambridge, Stanford, etc.)
- **15 Scholarship Providers** (government agencies, foundations)

## 🚢 Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

Deploy to Vercel, AWS, or any Node.js hosting platform.

## 📝 License

This is a demonstration project built per specification.

## 🤝 Contributing

This is an MVP. For production:
1. Connect real PostgreSQL database
2. Replace mock auth with NextAuth.js or similar
3. Implement real scholarship verification workflow
4. Add rate limiting and security middleware
5. Set up email notification system
6. Integrate analytics (privacy-conscious)

## ⚠️ Important Disclaimers

- **Demo Data**: All scholarships are examples with realistic metadata
- **Verification**: Production system requires human verification workflow
- **No Guarantees**: Platform provides information only, not eligibility determination
- **Official Sources**: Users must always verify with official provider websites

---

**Built with ❤️ for global student opportunity**
