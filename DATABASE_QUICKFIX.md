# Quick Fix: Database Errors

## The Problem

You're seeing "Error loading data. Please try again later." This means the Supabase database tables don't exist yet or have no data.

## The Solution (5 Minutes)

### Step 1: Open Supabase Console
Go to: https://app.supabase.com → Select your project

### Step 2: Go to SQL Editor
Click **SQL Editor** in the left sidebar

### Step 3: Run Setup Scripts
Copy the scripts from [SUPABASE_SETUP.md](SUPABASE_SETUP.md) and run them one by one:

1. **Create Leagues Table** (Script 1)
2. **Create Seasons Table** (Script 2)
3. **Create Teams Table** (Script 3)
4. **Create Players Table** (Script 4)
5. **Create Matches Table** (Script 5)

**Each time:** Paste → Click Run ✓

### Step 4: Add Test Data
Run these in order (from SUPABASE_SETUP.md):

1. Create a League
2. Create a Season (use the league ID)
3. Create Teams (use the league ID)
4. Create Players (use team IDs)
5. Create Matches (use season and team IDs)

### Step 5: Refresh Website
Go back to your Gambia Sports site and refresh the page.

✅ You should now see:
- Standings table with your teams
- Upcoming fixtures
- Completed results
- Team directory

---

## Step-by-Step with Screenshots

### Finding Your IDs

After running "Create a League", find the ID:

```sql
SELECT id, name FROM leagues;
```

Copy the UUID that appears in the `id` column. Use this everywhere it says `YOUR_LEAGUE_ID_HERE`.

Same for teams:

```sql
SELECT id, name FROM teams;
```

---

## Common Issues

| Error | Cause | Fix |
|-------|-------|-----|
| "Error loading data" | Tables don't exist | Run all 5 Create Table scripts |
| "No leagues available yet" | No leagues in database | Run "Create a League" script |
| "No active season" | Season status isn't 'active' | Check season status is 'active' |
| "No teams" on standings | No teams in league | Create teams with correct league_id |

---

## Verify Everything Works

Run this to check:

```sql
-- Shows if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Shows data counts
SELECT 
  (SELECT COUNT(*) FROM leagues) as leagues,
  (SELECT COUNT(*) FROM seasons) as seasons,
  (SELECT COUNT(*) FROM teams) as teams,
  (SELECT COUNT(*) FROM players) as players,
  (SELECT COUNT(*) FROM matches) as matches;
```

You should see:
```
leagues: 1
seasons: 1  
teams: 4 (or more)
players: 8+ (or more)
matches: 2+ (or more)
```

---

## Full Details

See **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** for:
- Complete SQL scripts with explanations
- How to add multiple teams and players
- How to create realistic match data
- How to set match status (scheduled, completed, etc.)

---

## Still Not Working?

Check:
1. ✅ Supabase project is active (check https://app.supabase.com)
2. ✅ Your `.env.local` has correct API keys
3. ✅ All 5 tables were created (check in Supabase Editor)
4. ✅ At least 1 league + 1 active season exist
5. ✅ Teams belong to your league
6. ✅ Browser cache cleared (Ctrl+Shift+Del)

---

**Once data is added, the website works instantly!** 🚀
