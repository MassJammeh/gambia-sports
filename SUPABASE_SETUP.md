# Supabase Database Setup Guide

This guide will help you create the required tables in your Supabase project for the Gambia Sports Platform Phase 1.

## Quick Start

1. Go to your Supabase project: https://app.supabase.com
2. Open the **SQL Editor** from the left sidebar
3. Copy and paste each SQL script below
4. Click **Run** on each script

---

## SQL Scripts

### 1. Create Leagues Table

```sql
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read" ON leagues FOR SELECT USING (true);
```

### 2. Create Seasons Table

```sql
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read" ON seasons FOR SELECT USING (true);
```

### 3. Create Teams Table

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  logo_url TEXT,
  home_ground TEXT,
  founded_year INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(league_id, slug)
);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read" ON teams FOR SELECT USING (true);
```

### 4. Create Players Table

```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT,
  jersey_number INTEGER,
  date_of_birth DATE,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read" ON players FOR SELECT USING (true);
```

### 5. Create Matches Table

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  home_team_id UUID NOT NULL REFERENCES teams(id),
  away_team_id UUID NOT NULL REFERENCES teams(id),
  scheduled_at TIMESTAMP NOT NULL,
  venue TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'postponed')),
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  minute INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read" ON matches FOR SELECT USING (true);
```

---

## Add Test Data

After creating the tables, add sample data to test the platform:

### 1. Create a League

```sql
INSERT INTO leagues (name, slug, logo_url) VALUES
  ('Banjul Community League', 'banjul-community', NULL);
```

### 2. Create a Season

First, get your league ID by running:
```sql
SELECT id FROM leagues LIMIT 1;
```

Then use that ID in this query:
```sql
INSERT INTO seasons (league_id, name, start_date, end_date, status) VALUES
  ('YOUR_LEAGUE_ID_HERE', '2026 Season', '2026-01-01', '2026-12-31', 'active');
```

### 3. Create Teams

Replace `YOUR_LEAGUE_ID_HERE` with your league ID:

```sql
INSERT INTO teams (league_id, name, slug, home_ground, founded_year) VALUES
  ('YOUR_LEAGUE_ID_HERE', 'Banjul United', 'banjul-united', 'Independence Stadium', 2020),
  ('YOUR_LEAGUE_ID_HERE', 'Serrekunda City', 'serrekunda-city', 'Serrekunda Field', 2018),
  ('YOUR_LEAGUE_ID_HERE', 'Bakau FC', 'bakau-fc', 'Bakau Ground', 2022),
  ('YOUR_LEAGUE_ID_HERE', 'Real Banjul', 'real-banjul', 'National Stadium', 2019);
```

### 4. Create Players

Get team IDs first:
```sql
SELECT id, name FROM teams;
```

Then add players (replace IDs):
```sql
INSERT INTO players (team_id, name, position, jersey_number) VALUES
  ('TEAM_ID_1', 'Muhammed Jallow', 'GK', 1),
  ('TEAM_ID_1', 'Omar Camara', 'DEF', 2),
  ('TEAM_ID_1', 'Ebrima Darboe', 'MID', 7),
  ('TEAM_ID_1', 'Lamin Sambou', 'FWD', 9),
  
  ('TEAM_ID_2', 'Hassan Jallow', 'GK', 1),
  ('TEAM_ID_2', 'Abdoulie Camara', 'DEF', 3),
  ('TEAM_ID_2', 'Musa Ceesay', 'MID', 8),
  ('TEAM_ID_2', 'Landing Jallow', 'FWD', 10);
```

### 5. Create Matches

Get your season and team IDs:
```sql
SELECT id FROM seasons LIMIT 1;
SELECT id, name FROM teams LIMIT 10;
```

Then create matches:
```sql
INSERT INTO matches (season_id, home_team_id, away_team_id, scheduled_at, venue, status, home_score, away_score) VALUES
  ('SEASON_ID', 'TEAM_1_ID', 'TEAM_2_ID', '2026-04-25 16:00:00', 'National Stadium', 'completed', 2, 1),
  ('SEASON_ID', 'TEAM_3_ID', 'TEAM_4_ID', '2026-04-25 18:00:00', 'Bakau Ground', 'completed', 1, 1),
  ('SEASON_ID', 'TEAM_1_ID', 'TEAM_3_ID', '2026-05-01 16:00:00', 'Independence Stadium', 'scheduled', 0, 0),
  ('SEASON_ID', 'TEAM_2_ID', 'TEAM_4_ID', '2026-05-01 18:00:00', 'Serrekunda Field', 'scheduled', 0, 0);
```

---

## Verify Your Setup

After running all scripts, test by running this query:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count records in each table
SELECT 
  (SELECT COUNT(*) FROM leagues) as leagues_count,
  (SELECT COUNT(*) FROM seasons) as seasons_count,
  (SELECT COUNT(*) FROM teams) as teams_count,
  (SELECT COUNT(*) FROM players) as players_count,
  (SELECT COUNT(*) FROM matches) as matches_count;
```

---

## Troubleshooting

### "Error loading data" on home page
- Verify your league has an active season (`status = 'active'`)
- Ensure at least one league exists
- Check that the season's `league_id` matches your league's `id`

### "No leagues available yet"
- You haven't created any leagues yet
- Run the "Create a League" SQL script above

### "No active season"
- Create a season with `status = 'active'`
- Make sure the season belongs to your league

### Can't see standings/fixtures
- Verify you have teams in your league
- Verify you have matches scheduled for your season
- Check that matches have the correct season_id

---

## Next Steps

1. ✅ Create all 5 tables using the SQL scripts
2. ✅ Add test data (1 league, 1 season, 4 teams, some matches)
3. ✅ Return to your website and refresh
4. ✅ You should see data loading properly

---

## Need Help?

Check these Supabase docs:
- [SQL Editor](https://supabase.com/docs/guides/database/sql-editor)
- [Creating Tables](https://supabase.com/docs/guides/database/tables)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

Once data is added, the website will immediately show:
- Standings table with team records
- Fixtures with upcoming matches
- Results with completed matches
- Teams directory
