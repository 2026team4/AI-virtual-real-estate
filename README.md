# 🏠 AI Virtual Real Estate Platform

A full-stack, AI-powered property marketplace built with the **MERN stack + Supabase**. Users can search, explore, buy, sell, and rent properties with 360° virtual tours, AI price estimation, smart search, interactive maps, and an AI chatbot.

---

## ✨ Features

| Category | Features |
|---|---|
| **Search & Discovery** | Smart search, 20+ filters, sort, pagination, URL-driven state |
| **Property Details** | Photo gallery, 360° virtual tours, interactive map (Leaflet), nearby facilities |
| **AI Features** | Price estimation (market data + city fallback), chatbot (keyword + OpenAI), recommendations |
| **User Roles** | Buyer, Seller, Agent, Admin |
| **Auth** | JWT-based auth, register/login, role selector, password strength |
| **Dashboard** | Listings management, booking confirm/decline, profile edit |
| **Listings** | 5-step wizard, image upload → Supabase Storage, 360° tour URL |
| **Favorites** | Toggle, save, sync across sessions |
| **Compare** | Side-by-side comparison of up to 3 properties, 14 data points, best-value highlights |
| **Bookings** | Physical visit, virtual meeting, general inquiry requests |
| **Notifications** | Real-time in-app notifications with unread count |
| **Chatbot** | Floating widget, suggestion chips, typing indicator, OpenAI optional |

---

## 🛠️ Tech Stack

```
Frontend:  React 18 + Vite, Tailwind CSS, React Router v6, Leaflet, Framer Motion
Backend:   Node.js, Express.js, Supabase JS Client, JWT, bcryptjs
Database:  Supabase (PostgreSQL) — tables: users, properties, bookings, favorites, notifications
Storage:   Supabase Storage (property-images bucket)
AI:        Built-in keyword engine + optional OpenAI GPT-3.5 for chatbot
Maps:      OpenStreetMap via React-Leaflet (free, no API key)
```

---

## 📁 Project Structure

```
team 4 mech/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js          # Supabase client (public + admin)
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── propertyController.js
│   │   │   ├── bookingController.js
│   │   │   ├── favoriteController.js
│   │   │   ├── chatbotController.js
│   │   │   ├── notificationController.js
│   │   │   └── uploadController.js
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT protect + authorize
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── properties.js
│   │   │   ├── bookings.js
│   │   │   ├── favorites.js
│   │   │   ├── chatbot.js
│   │   │   ├── notifications.js
│   │   │   └── upload.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── response.js
│   │   └── server.js
│   ├── supabase_schema.sql          # ⬅ Run this in Supabase SQL Editor
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Layout, Navbar, Footer, Modal, Spinner…
│   │   │   ├── home/                # Hero, Stats, FeaturedProperties, AIFeatures…
│   │   │   ├── property/            # PropertyCard, Filters, Map, VirtualTour, Booking…
│   │   │   └── chatbot/             # ChatbotWidget
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── PropertyContext.jsx  # Favorites + Compare state
│   │   ├── hooks/
│   │   │   └── useProperties.js
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── PropertiesPage.jsx
│   │   │   ├── PropertyDetailPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AddListingPage.jsx
│   │   │   ├── FavoritesPage.jsx
│   │   │   ├── ComparePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + all API helpers
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
├── package.json                     # Root scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works perfectly)

---

### 1. Clone the project

```bash
git clone <your-repo-url>
cd "team 4 mech"
```

---

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Open the **SQL Editor** and run the entire contents of:
   ```
   backend/supabase_schema.sql
   ```
3. Go to **Storage** → **New Bucket** → name it `property-images` → set it to **Public**
4. Note down your credentials from **Settings → API**:
   - Project URL
   - `anon` public key
   - `service_role` secret key

---

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

JWT_SECRET=your-long-random-secret-here
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional — enables GPT-3.5 chatbot (falls back to keyword mode without it)
OPENAI_API_KEY=sk-...
```

Install dependencies:

```bash
npm install
```

---

### 4. Configure Frontend

```bash
cd frontend
cp .env.example .env
```

The default `.env` works out of the box with the Vite proxy (no changes needed for local dev).

Install dependencies:

```bash
npm install
```

---

### 5. Run the Platform

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# API running at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```

Or from the root directory (if npm workspaces supported):
```bash
npm run dev:backend   # in one terminal
npm run dev:frontend  # in another
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, get JWT |
| GET  | `/api/auth/me` | ✅ | Get current user |
| PUT  | `/api/auth/profile` | ✅ | Update profile |
| GET  | `/api/properties` | — | List/search/filter properties |
| GET  | `/api/properties/featured` | — | Featured listings |
| GET  | `/api/properties/stats` | — | Platform statistics |
| GET  | `/api/properties/:id` | — | Property detail + similar |
| POST | `/api/properties` | ✅ Seller | Create listing |
| PUT  | `/api/properties/:id` | ✅ Owner | Update listing |
| DELETE | `/api/properties/:id` | ✅ Owner | Soft delete listing |
| POST | `/api/properties/ai-estimate` | — | AI price estimation |
| GET  | `/api/properties/user/my-listings` | ✅ | My listings |
| POST | `/api/bookings` | ✅ | Create booking request |
| GET  | `/api/bookings/my` | ✅ | My bookings |
| PATCH | `/api/bookings/:id/status` | ✅ | Confirm/cancel booking |
| GET  | `/api/favorites` | ✅ | Get favorites |
| POST | `/api/favorites/toggle` | ✅ | Add/remove favorite |
| POST | `/api/chatbot/message` | — | Send chatbot message |
| GET  | `/api/chatbot/suggestions` | — | Get quick suggestions |
| GET  | `/api/notifications` | ✅ | Get notifications |
| PATCH | `/api/notifications/:id/read` | ✅ | Mark read |
| POST | `/api/upload/image` | ✅ | Upload image (base64) |

---

## 🗄️ Database Tables

| Table | Description |
|-------|-------------|
| `users` | Buyers, sellers, agents, admins |
| `properties` | All listing data, media, location, features |
| `bookings` | Visit / virtual meeting / inquiry requests |
| `favorites` | User ↔ property saved relationships |
| `notifications` | In-app alerts for bookings, updates |

---

## 🤖 AI Features Details

### AI Price Estimation
- Fetches comparable properties from the same city and type
- Calculates average price-per-sqft from real data
- Adjusts for bedrooms, furnishing, and property age
- Falls back to city-tier base rates when data is sparse
- Returns estimated price + confidence level (high/medium/low) + range

### AI Chatbot
- **Without OpenAI key**: keyword-based intent matching for 11 real estate topics
- **With OpenAI key**: GPT-3.5-turbo with a real estate system prompt
- Topics covered: buying, selling, renting, prices, loans, virtual tours, documents, fraud, nearby facilities, comparing, contact

---

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiry
- Supabase service role key never exposed to frontend
- Row-Level Security (RLS) enabled on all tables
- Rate limiting: 200 requests / 15 minutes per IP
- Helmet.js for HTTP security headers
- Input validation on all endpoints

---

## 🎨 Design System

- **Primary color**: Blue (`#2563eb`)
- **Accent**: Orange (`#f97316`)
- **Typography**: Inter (body) + Poppins (headings)
- **Components**: `btn-primary`, `btn-secondary`, `btn-accent`, `card`, `input-field`, `badge`, `badge-sale`, `badge-rent`
- **Animations**: `fade-in`, `slide-up`, `bounce-slow`

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Database + Storage client |
| `express` | Backend framework |
| `jsonwebtoken` | JWT auth |
| `bcryptjs` | Password hashing |
| `react-leaflet` + `leaflet` | Interactive maps |
| `react-hot-toast` | Toast notifications |
| `lucide-react` | Icon library |
| `axios` | HTTP client |
| `tailwindcss` | Utility-first CSS |

---

## 🔮 Adding Supabase Credentials

When you're ready, update `backend/.env` with your real Supabase values:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The backend will fail to start with a clear error message if these are missing, so you'll know immediately.

---

## 👥 Team 4

Built with ❤️ — AI Virtual Real Estate Platform
