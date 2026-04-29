# Gambia Sports Platform

**The definitive home for Gambian football statistics, live scores, league management, and sports news.**

Phase 1 foundation: One pilot league with full public website and admin dashboard.

---

## 🎯 What This Is

The Gambia Sports Platform is a Next.js web application that:

- 📊 **Manages football leagues** — Teams, players, matches, standings
- 📱 **Shows live scores** — Fixtures, results, player statistics
- 👨‍💼 **Provides admin tools** — League administrators can enter results, register teams/players, schedule fixtures
- 👥 **Serves fans** — Public website with standings, fixtures, team pages, player info

Currently in **Phase 1** with one pilot league fully operational.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (credentials in `.env.local`)

### Installation

```bash
# Clone repository
git clone https://github.com/nfamaraceesay2018-svg/gambia-sports.git
cd gambia-sports

# Install dependencies
npm install

# Copy environment variables
# (Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the public home page.

### Key Routes

**Public (Anyone can view):**

- `/` — Home page with latest results and fixtures
- `/standings` — League standings table
- `/fixtures` — Upcoming matches
- `/results` — Completed matches
- `/teams` — All teams in the league
- `/teams/[slug]` — Individual team with squad

**Admin (Login required):**

- `/admin/login` — Admin authentication
- `/admin` — Admin dashboard
- `/admin/teams` — Manage teams
- `/admin/players` — Register players
- `/admin/matches` — View and manage matches
- `/admin/matches/[id]` — Enter match results
- `/admin/fixtures/new` — Schedule upcoming matches

---

## 🛠 Development

### Build for Production

```bash
npm run build   # TypeScript compilation + optimization
npm run start   # Start production server
npm run lint    # Run ESLint
```

### Project Structure

```
src/
├── app/(public)/        # Public pages (standings, fixtures, teams, results)
├── app/admin/           # Admin pages (login, dashboard, management)
├── lib/queries/         # Database query functions
├── lib/supabase/        # Supabase client setup
├── middleware.ts        # Auth protection for /admin routes
└── app/layout.tsx       # Root layout with navigation
```

### Tech Stack

- **Framework:** Next.js 16 with App Router
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **Language:** TypeScript (strict mode)
- **Hosting:** Vercel (auto-deploy on git push)

---

## 📊 Features (Phase 1)

✅ **Public Website**

- League standings with auto-calculated W/D/L/Goals/Points
- Upcoming fixtures with date, time, venue
- Completed match results
- Team directory with squad information
- Mobile-responsive design
- SEO-optimized pages

✅ **Admin Dashboard**

- Secure email/password login
- Team management (add, edit, view)
- Player management (register per team)
- Match scheduling (create upcoming fixtures)
- Result entry (enter home/away scores)
- Protected routes with middleware

✅ **Backend**

- Supabase PostgreSQL database
- Real-time data sync
- Row-level security ready
- Automatic standings calculation
- Error handling and validation

---

## 🔐 Admin Login

Admin credentials are managed via Supabase Auth. To set up an admin account:

1. Go to Supabase console
2. Create new user in Authentication section
3. Use email/password to login at `/admin/login`
4. Access admin dashboard at `/admin`

---

## 📈 Performance

- **Build Time:** ~5.4s (TypeScript) + ~12.3s (page generation)
- **Pages:** All 14 pages pre-rendered and optimized
- **Type Safety:** 0 implicit 'any' errors, strict TypeScript enabled
- **Bundle:** Optimized with Turbopack

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel project
3. Auto-deployment on every git push
4. Custom domain configuration in Vercel dashboard

### Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 📚 Documentation

- **[PHASE_1_STATUS.md](PHASE_1_STATUS.md)** — Complete Phase 1 implementation status
- **[project.md](project.md)** — Full product blueprint (all 4 phases)
- **[context.md](context.md)** — Development context and decisions

---

## 🐛 Troubleshooting

### Build fails

```bash
rm -rf .next && npm install && npm run build
```

### Connection to Supabase fails

- Verify `.env.local` has correct API keys
- Check Supabase project is active in dashboard
- Confirm network allows Supabase connections

### Admin login not working

- Ensure user exists in Supabase Authentication
- Check email/password is correct
- Verify cookies/browser storage is enabled

---

## 🤝 Contributing

This is a Tech Palz project. All code changes should:

1. Be committed to GitHub
2. Follow TypeScript strict mode
3. Include proper error handling
4. Be tested locally before pushing

---

## 📋 License

Proprietary — Tech Palz 2026

---

## 🎯 Next Phase

Phase 2 (Months 4-7) will add:

- Multi-league support
- Sports news platform
- Player statistics and career tracking
- Season history and archives

See [project.md](project.md) for complete roadmap.

---

**Status:** ✅ Phase 1 Complete  
**Last Updated:** April 29, 2026  
**Deployed:** Vercel (auto-deploy enabled)
