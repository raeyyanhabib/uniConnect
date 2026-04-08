# UniConnect — Full-Stack Migration Mission File

> **Goal:** Turn the current single-file React prototype (mock data) into a production-ready full-stack app with a real backend, database, and authentication.

---

## Recommended Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React + TypeScript (Vite) | Already built |
| **Backend** | Node.js + Express.js | JS everywhere, huge ecosystem |
| **Database** | PostgreSQL | Relational, great for structured university data |
| **ORM** | Prisma | Type-safe queries, auto-generated types, easy migrations |
| **Auth** | JWT + bcrypt | Stateless tokens, password hashing |
| **File Uploads** | Multer + Cloudinary (or S3) | Resource/lost-found images |
| **Realtime** | Socket.io | Live messaging (UC 28) & notifications (UC 29) |
| **Validation** | Zod | Shared validation between frontend & backend |

---

## Database Schema (PostgreSQL + Prisma)

### Core Tables

```prisma
model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique          // university email
  passwordHash  String
  department    String?
  semester      Int?
  bio           String?
  studentId     String?  @unique
  role          Role     @default(STUDENT) // STUDENT | ADMIN
  status        Status   @default(ACTIVE)  // ACTIVE | BLOCKED
  isVerified    Boolean  @default(false)
  averageRating Float    @default(0)
  createdAt     DateTime @default(now())

  // Privacy settings
  showEmail     Boolean @default(false)
  showDept      Boolean @default(true)
  showSemester  Boolean @default(true)
  showRating    Boolean @default(true)
  allowRequests Boolean @default(true)
  visibility    String  @default("public") // public | partners | private

  // Relations
  resources         Resource[]
  sentRequests      PartnerRequest[]   @relation("sender")
  receivedRequests  PartnerRequest[]   @relation("receiver")
  groupMemberships  GroupMember[]
  sentMessages      Message[]
  notifications     Notification[]
  lostFoundItems    LostFoundItem[]
  borrowRequests    BorrowRequest[]    @relation("requester")
  ownedRequests     BorrowRequest[]    @relation("owner")
  transactions      LendingTransaction[]
  reviews           Review[]           @relation("reviewer")
  reviewsReceived   Review[]           @relation("reviewed")
  reportsFiled      Report[]           @relation("reporter")
  reportsAgainst    Report[]           @relation("reported")
}
```

### Study Partners & Groups

```prisma
model PartnerRequest {
  id         String   @id @default(uuid())
  fromId     String
  toId       String
  status     String   @default("pending") // pending | accepted | declined
  createdAt  DateTime @default(now())
  from       User     @relation("sender", fields: [fromId], references: [id])
  to         User     @relation("receiver", fields: [toId], references: [id])
}

model StudyGroup {
  id           String   @id @default(uuid())
  name         String
  description  String?
  courseCode    String?
  maxMembers   Int      @default(8)
  visibility   String   @default("public") // public | private
  creatorId    String
  createdAt    DateTime @default(now())
  members      GroupMember[]
  announcements GroupAnnouncement[]
}

model GroupMember {
  id       String @id @default(uuid())
  userId   String
  groupId  String
  role     String @default("member") // creator | member
  user     User       @relation(fields: [userId], references: [id])
  group    StudyGroup @relation(fields: [groupId], references: [id])
  @@unique([userId, groupId])
}

model GroupAnnouncement {
  id        String   @id @default(uuid())
  groupId   String
  authorId  String
  content   String
  createdAt DateTime @default(now())
  group     StudyGroup @relation(fields: [groupId], references: [id])
}
```

### Resource Sharing & Lending

```prisma
model Resource {
  id               String   @id @default(uuid())
  title            String
  category         String   // Book | Equipment | Notes | Other
  condition        String   // Excellent | Good | Fair | Poor
  description      String?
  imageUrl         String?
  maxBorrowDuration Int     @default(7)
  status           String   @default("available") // available | borrowed | paused
  ownerId          String
  createdAt        DateTime @default(now())
  owner            User     @relation(fields: [ownerId], references: [id])
  borrowRequests   BorrowRequest[]
  transactions     LendingTransaction[]
}

model BorrowRequest {
  id              String   @id @default(uuid())
  resourceId      String
  requesterId     String
  ownerId         String
  duration        Int
  status          String   @default("pending") // pending | approved | rejected
  handoverLocation String?
  handoverDate    DateTime?
  createdAt       DateTime @default(now())
  resource        Resource @relation(fields: [resourceId], references: [id])
  requester       User     @relation("requester", fields: [requesterId], references: [id])
  owner           User     @relation("owner", fields: [ownerId], references: [id])
}

model LendingTransaction {
  id            String    @id @default(uuid())
  resourceId    String
  borrowerId    String
  startDate     DateTime  @default(now())
  dueDate       DateTime
  returnDate    DateTime?
  status        String    @default("active") // active | returned | overdue
  resource      Resource  @relation(fields: [resourceId], references: [id])
  borrower      User      @relation(fields: [borrowerId], references: [id])
  review        Review?
}

model Review {
  id            String   @id @default(uuid())
  transactionId String   @unique
  reviewerId    String
  reviewedId    String
  rating        Int      // 1-5
  comment       String?
  createdAt     DateTime @default(now())
  transaction   LendingTransaction @relation(fields: [transactionId], references: [id])
  reviewer      User     @relation("reviewer", fields: [reviewerId], references: [id])
  reviewed      User     @relation("reviewed", fields: [reviewedId], references: [id])
}
```

### Communication & Extras

```prisma
model Conversation {
  id        String   @id @default(uuid())
  user1Id   String
  user2Id   String
  createdAt DateTime @default(now())
  messages  Message[]
  @@unique([user1Id, user2Id])
}

model Message {
  id             String   @id @default(uuid())
  conversationId String
  senderId       String
  text           String
  createdAt      DateTime @default(now())
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  sender         User         @relation(fields: [senderId], references: [id])
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  content   String
  type      String   // partner | borrow | group | return | message | reminder
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model LostFoundItem {
  id           String   @id @default(uuid())
  type         String   // Lost | Found
  description  String
  location     String
  imageUrl     String?
  status       String   @default("open") // open | resolved
  reporterId   String
  createdAt    DateTime @default(now())
  reporter     User     @relation(fields: [reporterId], references: [id])
}

model Report {
  id         String   @id @default(uuid())
  type       String   // User | Resource | Content
  desc       String
  reportedId String
  reporterId String
  status     String   @default("pending") // pending | investigating | resolved
  createdAt  DateTime @default(now())
  reported   User     @relation("reported", fields: [reportedId], references: [id])
  reporter   User     @relation("reporter", fields: [reporterId], references: [id])
}
```

---

## API Endpoints (REST)

### Auth (UC 1–3, 5)
| Method | Endpoint | UC | Description |
|--------|----------|-----|------------|
| POST | `/api/auth/register` | 1 | Create account |
| POST | `/api/auth/verify` | 2 | Verify student code |
| POST | `/api/auth/login` | 3 | Login, returns JWT |
| POST | `/api/auth/reset-password` | 5 | Send reset email |
| POST | `/api/auth/reset-password/confirm` | 5 | Set new password |

### Profile (UC 4, 6)
| Method | Endpoint | UC | Description |
|--------|----------|-----|------------|
| GET | `/api/users/me` | 4 | Get own profile |
| PUT | `/api/users/me` | 4 | Update profile |
| PUT | `/api/users/me/privacy` | 6 | Update privacy settings |

### Study Partners (UC 7–9)
| Method | Endpoint | UC | Description |
|--------|----------|-----|------------|
| GET | `/api/partners/search?dept=&q=` | 7 | Search students |
| POST | `/api/partners/requests` | 8 | Send partner request |
| PUT | `/api/partners/requests/:id` | 9 | Accept/decline |
| GET | `/api/partners` | — | List my partners |

### Study Groups (UC 10–14)
| Method | Endpoint | UC | Description |
|--------|----------|-----|------------|
| POST | `/api/groups` | 10 | Create group |
| POST | `/api/groups/:id/join` | 11 | Join group |
| DELETE | `/api/groups/:id/leave` | 12 | Leave group |
| DELETE | `/api/groups/:id/members/:userId` | 13 | Remove member |
| POST | `/api/groups/:id/announcements` | 14 | Post announcement |
| GET | `/api/groups` | — | List/discover groups |

### Resources (UC 15–27)
| Method | Endpoint | UC | Description |
|--------|----------|-----|------------|
| POST | `/api/resources` | 15 | Post resource |
| PUT | `/api/resources/:id` | 16 | Edit listing |
| DELETE | `/api/resources/:id` | 16 | Remove listing |
| PATCH | `/api/resources/:id/toggle` | 17 | Pause/resume |
| GET | `/api/resources?q=&cat=` | 18,19 | Browse/search |
| POST | `/api/resources/:id/borrow` | 20 | Send borrow request |
| PUT | `/api/borrow-requests/:id` | 21 | Approve/reject |
| PUT | `/api/borrow-requests/:id/handover` | 22 | Schedule handover |
| PUT | `/api/transactions/:id/receipt` | 23 | Confirm receipt |
| PUT | `/api/transactions/:id/return` | 24 | Confirm return |
| POST | `/api/transactions/:id/dispute` | 25 | Report dispute |
| GET | `/api/transactions/history` | 26 | Lending history |
| POST | `/api/transactions/:id/review` | 27 | Rate/review |

### Communication (UC 28–30)
| Method | Endpoint | UC | Description |
|--------|----------|-----|------------|
| GET | `/api/conversations` | 28 | List conversations |
| POST | `/api/conversations/:id/messages` | 28 | Send message |
| WS | `/ws` | 28 | Realtime messages |
| GET | `/api/notifications` | 29 | List notifications |
| PUT | `/api/notifications/read-all` | 29 | Mark all read |
| POST | `/api/lost-found` | 30 | Report item |
| GET | `/api/lost-found` | 30 | Browse items |

### Admin (UC 31–34)
| Method | Endpoint | UC | Description |
|--------|----------|-----|------------|
| GET | `/api/admin/dashboard` | 31 | Platform stats |
| GET | `/api/admin/users` | 32 | List users |
| PUT | `/api/admin/users/:id/block` | 32 | Block/unblock |
| GET | `/api/admin/resources` | 33 | Flagged resources |
| PUT | `/api/admin/resources/:id` | 33 | Approve/remove |
| GET | `/api/admin/reports` | 34 | Platform reports |
| PUT | `/api/admin/reports/:id` | 34 | Update status |

---

## Project Structure (After Migration)

```
uniconnect/
├── client/                    # React frontend (move current code here)
│   ├── src/
│   │   ├── api/               # API client (axios/fetch wrappers)
│   │   ├── hooks/             # useAuth, useResources, useGroups, etc.
│   │   ├── components/        # Split App.tsx into component files
│   │   ├── pages/             # One file per page
│   │   ├── context/           # AuthContext, NotificationContext
│   │   └── App.tsx            # Router only
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── routes/            # auth, users, partners, groups, resources, etc.
│   │   ├── middleware/        # auth.ts, admin.ts, validation.ts
│   │   ├── services/          # Business logic layer
│   │   ├── utils/             # email sender, token helpers
│   │   └── index.ts           # Express app entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema (above)
│   └── package.json
│
└── package.json               # Root workspace config
```

---

## Implementation Phases

### Phase 1 — Project Setup & Auth (Week 1)
- [ ] Initialize monorepo (`client/` + `server/`)
- [ ] Set up Express + Prisma + PostgreSQL
- [ ] Implement auth routes (register, verify, login, reset password)
- [ ] Add JWT middleware
- [ ] Create `AuthContext` in frontend, replace mock login
- [ ] **Delivers:** UC 1, 2, 3, 5

### Phase 2 — Profile & Partners (Week 2)
- [ ] Profile CRUD endpoints
- [ ] Privacy settings endpoints
- [ ] Partner search, request, accept/decline endpoints
- [ ] Frontend: replace mock data with API calls using custom hooks
- [ ] **Delivers:** UC 4, 6, 7, 8, 9

### Phase 3 — Study Groups (Week 2–3)
- [ ] Group CRUD, join/leave, member management endpoints
- [ ] Announcements endpoint
- [ ] Frontend: wire up StudyGroupsPage to API
- [ ] **Delivers:** UC 10, 11, 12, 13, 14

### Phase 4 — Resource Sharing (Week 3–4)
- [ ] Resource CRUD + image upload (Multer/Cloudinary)
- [ ] Borrow request flow (request → approve → handover → receipt → return)
- [ ] Dispute reporting + review/rating system
- [ ] Lending history endpoint
- [ ] Frontend: wire up ResourcesPage to API
- [ ] **Delivers:** UC 15–27

### Phase 5 — Communication (Week 4–5)
- [ ] Conversation + message CRUD
- [ ] Socket.io for realtime messaging
- [ ] Notification system (create on events, deliver via socket)
- [ ] Lost & Found CRUD
- [ ] Frontend: wire up Messages, Notifications, LostFound pages
- [ ] **Delivers:** UC 28, 29, 30

### Phase 6 — Admin & Polish (Week 5–6)
- [ ] Admin middleware (role check)
- [ ] Admin dashboard stats (aggregation queries)
- [ ] User management (block/unblock)
- [ ] Resource moderation + report management
- [ ] Frontend: wire up admin pages
- [ ] End-to-end testing
- [ ] **Delivers:** UC 31, 32, 33, 34

---

## Quick-Start Commands (When Ready)

```bash
# 1. Initialize server
mkdir server && cd server
npm init -y
npm i express cors dotenv bcryptjs jsonwebtoken prisma @prisma/client socket.io multer zod
npm i -D typescript @types/express @types/cors @types/bcryptjs @types/jsonwebtoken ts-node nodemon
npx prisma init

# 2. Set up database
# Add DATABASE_URL to server/.env
npx prisma db push        # Create tables
npx prisma generate       # Generate client

# 3. Move frontend
# Move current AG Projects → client/
# Update vite.config.ts to proxy /api → localhost:3001
```
