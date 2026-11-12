-- ============================================================
--  AI Virtual Real Estate Platform — Supabase Schema
--  Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name       TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer','seller','agent','admin')),
  phone           TEXT,
  avatar_url      TEXT,
  bio             TEXT,
  is_verified     BOOLEAN DEFAULT FALSE,
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ
);

-- ── Properties ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title               TEXT NOT NULL,
  description         TEXT,
  type                TEXT NOT NULL CHECK (type IN ('land','house','apartment','villa','shop','office','commercial')),
  status              TEXT NOT NULL CHECK (status IN ('sale','rent')),
  price               NUMERIC(15,2) NOT NULL,
  area_sqft           NUMERIC(10,2),
  bedrooms            INTEGER,
  bathrooms           INTEGER,
  floors              INTEGER,
  year_built          INTEGER,
  -- Location
  address             TEXT,
  city                TEXT,
  state               TEXT,
  country             TEXT DEFAULT 'India',
  zip_code            TEXT,
  latitude            NUMERIC(10,7),
  longitude           NUMERIC(10,7),
  -- Media
  images              TEXT[]   DEFAULT '{}',
  thumbnail           TEXT,
  video_url           TEXT,
  virtual_tour_url    TEXT,
  -- Features
  amenities           TEXT[]   DEFAULT '{}',
  nearby_facilities   JSONB    DEFAULT '[]',
  furnished           BOOLEAN  DEFAULT FALSE,
  parking             BOOLEAN  DEFAULT FALSE,
  construction_status TEXT     DEFAULT 'ready' CHECK (construction_status IN ('ready','under_construction','pre_launch')),
  ownership_type      TEXT     DEFAULT 'freehold' CHECK (ownership_type IN ('freehold','leasehold','cooperative')),
  -- Meta
  owner_id            UUID     REFERENCES users(id) ON DELETE CASCADE,
  is_active           BOOLEAN  DEFAULT TRUE,
  is_featured         BOOLEAN  DEFAULT FALSE,
  is_verified         BOOLEAN  DEFAULT FALSE,
  views               INTEGER  DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ,
  deleted_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_properties_city     ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_type     ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status   ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price    ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_owner    ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_active   ON properties(is_active);

-- ── Bookings ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id       UUID REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id          UUID REFERENCES users(id) ON DELETE CASCADE,
  seller_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_type      TEXT DEFAULT 'visit' CHECK (booking_type IN ('visit','virtual','inquiry')),
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  visit_date        DATE,
  visit_time        TEXT,
  message           TEXT,
  response_message  TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_bookings_buyer    ON bookings(buyer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_seller   ON bookings(seller_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);

-- ── Favorites ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- ── Notifications ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  message       TEXT NOT NULL,
  type          TEXT DEFAULT 'general' CHECK (type IN ('general','booking','property','system')),
  reference_id  UUID,
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user   ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- ── Row Level Security (RLS) ──────────────────────────────────────────────
-- Enable RLS (your backend uses service role key which bypasses RLS)
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties     ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites      ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;

-- Public can read active properties
CREATE POLICY "Public read properties"
  ON properties FOR SELECT
  USING (is_active = TRUE);

-- ── Storage bucket (run after creating bucket in Supabase UI) ─────────────
-- Bucket name: property-images (set to public)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);
