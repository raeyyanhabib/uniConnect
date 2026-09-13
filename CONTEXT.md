---
# UniConnect — Active Development Context

## Project Identity
- App: UniConnect — University hub for study groups, resource sharing, campus life
- Stack: React 19 (Vite + TypeScript) + Node/Express 5.x + Prisma ORM + PostgreSQL
- Monorepo: Frontend in /src, Backend in /server, Prisma schema in /server/prisma
- Source reference (DO NOT modify): sda-uniconnect/
- Active build: uniConnect/
- Database: PostgreSQL hosted on Supabase (free — data persists permanently)
- Deployment: Render.com (free web service — Express serves /dist in production)

## Author
Raeyyan Habib — CS Undergrad

## Why This Rebuild Exists
The previous sda-uniconnect/ draft used SQLite (file-based). SQLite is wiped on
every Render redeploy since Render free tier has an ephemeral filesystem. This
rebuild uses Supabase-hosted PostgreSQL via Prisma ORM. Data survives all
deployments, all restarts, and all server-side events permanently.

## Coding Conventions
- Braces: Standard JS style (opening brace on same line) — no Allman style
- File naming: camelCase (except React components = PascalCase)
- Exports: Named exports preferred over default everywhere
- DB access: ONLY through /server/models/*.js using Prisma client
- Secrets: Always from process.env — zero hardcoded values
- Email domain rule: FAST-NU format enforced on registration (backend + frontend)

## Current Phase
Phase 0 — COMPLETED (update this line each session)

## Completed Phases
- [x] Phase 0: Scaffold, Prisma init, Supabase connection, CONTEXT.md
- [ ] Phase 1: Prisma Schema, Migrations, Models
- [ ] Phase 2: Backend API (Controllers, Routes, Middleware)
- [ ] Phase 3: Frontend Shell (Router, Auth Context, API Service)
- [ ] Phase 4: Feature Implementation (UC 1-38)
- [ ] Phase 5: Integration and Polish
- [ ] Phase 6: Deployment to Render + Supabase

## Environment Variables Required
- DATABASE_URL: Supabase PostgreSQL connection string
- JWT_SECRET: Strong random string (min 32 chars)
- PORT: Express server port (5000 local, 10000 on Render)
- NODE_ENV: 'development' or 'production'
- CLIENT_URL: Frontend origin for CORS

## Supabase Project
- Project name: uniconnect
- Dashboard URL: https://app.supabase.com/project/[REF]
- Connection string: stored in .env only — never committed to git

## Render Deployment
- Service URL: (fill in after first deploy)
- Build command: npm install && npm run generate && npm run migrate && npm run build
- Start command: npm start

## Prisma Schema State
- Models defined: User, PartnerRequest, StudyGroup, GroupMember, GroupAnnouncement, Resource, Transaction, Conversation, Message, Notification, LostAndFound, Report, News, UserTodo, UserEvent
- Last migration run: (none yet - waiting for real DATABASE_URL)

## API Endpoints Implemented
- (none yet)

## UC Completion Status
- UC 1  (Registration): [ ]
- UC 2  (Login/JWT): [ ]
- UC 3  (Password Reset): [ ]
- UC 4  (Profile View/Update): [ ]
- UC 6  (Privacy Settings): [ ]
- UC 7  (Search Students): [ ]
- UC 8  (Send Partner Request): [ ]
- UC 9  (Process Partner Request): [ ]
- UC 10 (Create Study Group): [ ]
- UC 11 (Discover/Join Groups): [ ]
- UC 12 (Leave Group): [ ]
- UC 13 (Moderate Group Members): [ ]
- UC 14 (Group Announcements): [ ]
- UC 15 (List Resource): [ ]
- UC 16 (Browse Resources): [ ]
- UC 17 (Borrow Request): [ ]
- UC 18 (Evaluate Borrow Request): [ ]
- UC 19 (Confirm Handover - Owner): [ ]
- UC 20 (Confirm Receipt - Borrower): [ ]
- UC 21 (Initiate Return - Borrower): [ ]
- UC 22 (Confirm Return - Owner): [ ]
- UC 23 (Rate Borrower): [ ]
- UC 24 (Dispute/Damage Report): [ ]
- UC 25 (Flag Resource): [ ]
- UC 26 (Pause/Resume Listing): [ ]
- UC 27 (Delete Listing): [ ]
- UC 28 (Messaging): [ ]
- UC 29 (Notifications): [ ]
- UC 30 (Submit Lost and Found): [ ]
- UC 31 (Resolve Lost Item): [ ]
- UC 32 (Admin Metrics): [ ]
- UC 33 (User Governance): [ ]
- UC 34 (Moderation): [ ]
- UC 35 (News/Lost Found Widgets): [ ]
- UC 36 (Personal To-Do): [ ]
- UC 37 (Events Calendar): [ ]
- UC 38 (Unread Message Counts): [ ]

## Known Issues / Blockers
- Real `DATABASE_URL` needed from Supabase to run migrations and generate client.
---
