TECHPALZ
Gambia Sports Platform

Solo Developer Implementation Guide

A complete, step-by-step guide to building this platform alone —
from creating your first account to going live with a real league.

Document Value
Version 1.0
Based on Blueprint TechPalz Blueprint v1.0 — April 2026
Intended reader Solo developer, new to this stack
Phases covered Phase 1 (Foundation) in full detail + setup for Phases 2–4

 
Part 0 — What You Are Building & How to Read This Guide
Before you touch a single line of code, read this part completely. It will save you hours of confusion.

0.1 The Big Picture
You are building a website for Gambian football. Think of it as a simpler version of BBC Sport or ESPN, but built specifically for local leagues. It has three types of users:

User type What they do How they access the platform
Fans (public) Visit the site to check scores, standings, fixtures, news. No login needed. Any web browser — mostly mobile.
League Admin Log in to add teams, players, enter match results, schedule fixtures. Login page. Password protected.
Match Reporter At the ground during a match. Taps buttons to record goals, cards, substitutions in real time. Special mobile page. Login protected.

0.2 The Technology Stack — Plain English
You will use exactly 5 tools for Phase 1. Here is what each one does in plain language:

Tool What it is Your mental model
Next.js 14 The main programming framework. You write your website in it. Think of it as the engine of your car.
Supabase Your database + login system. All your data (teams, players, matches) lives here. Think of it as your filing cabinet in the cloud.
Tailwind CSS A way to style your website. You write short class names instead of CSS files. Think of it as pre-made Lego bricks for design.
Vercel Where your website lives on the internet. Automatically publishes your code. Think of it as your website's home address.
GitHub Where your code is stored. Like Google Drive but for code. Think of it as saving your work to the cloud.

KEY RULE Never skip ahead. Each step assumes the previous one is complete. If something does not work, re-read the step you just did — do not move forward.

0.3 Phase Overview
Phase What gets built Time estimate
Phase 1 (this guide) One live league with standings, fixtures, team pages, and an admin dashboard. 8–12 weeks working part-time
Phase 2 Multiple leagues, news articles, player statistics, top scorers. 4 months
Phase 3 Live scores in real time, mobile reporter tool, first revenue (ads + subscriptions). 6 months
Phase 4 Android app, fan accounts, multi-sport, public API. 10 months

 
Part 1 — Create Your Accounts & Install Your Tools
This part is entirely about setup. You will not write any code here. At the end of Part 1, you will have all accounts created and all tools installed on your computer.

Step 1 — Create a GitHub Account
GitHub is where all your code lives. It is free.

1. Go to https://github.com and click Sign up
2. Choose a username (suggestion: use your name or techpalz)
3. Verify your email address
4. Choose the Free plan

WHAT IS GITHUB? GitHub stores your code the same way Google Drive stores your documents. Every time you save (called a 'commit'), GitHub keeps a history so you can undo mistakes. Every time you push to GitHub, Vercel automatically publishes your website.

Step 2 — Create a Supabase Account
Supabase is your database and login system. It is free for small projects.

5. Go to https://supabase.com and click Start for free
6. Sign up with your GitHub account (click 'Continue with GitHub')
7. Once logged in, click New Project
8. Name your project: gambia-sports
9. Choose a database password — write it down somewhere safe
10. Region: choose West US or West Europe (closest available to Gambia)
11. Click Create new project and wait 2–3 minutes for it to set up

WHAT IS SUPABASE? Supabase is like a spreadsheet that your website can read and write to. Instead of Excel, it uses PostgreSQL (a professional database). It also handles user login so you do not have to build that from scratch.

Step 3 — Create a Vercel Account
Vercel hosts your website on the internet and automatically publishes it every time you push code to GitHub.

12. Go to https://vercel.com and click Sign Up
13. Choose: Continue with GitHub
14. Authorize Vercel to access your GitHub
15. Select the Hobby (free) plan

Step 4 — Install Node.js on Your Computer
Node.js is the runtime that makes JavaScript work on your computer (not just in the browser). Next.js requires it.

16. Go to https://nodejs.org
17. Download the LTS version (the button that says 'Recommended for most users')
18. Run the installer — click Next on every screen
19. When done, open your terminal (Command Prompt on Windows, Terminal on Mac) and type:
    node --version
20. You should see something like: v20.x.x — that means it worked

WHAT IS A TERMINAL? The terminal is a text-based way to give commands to your computer. On Windows: press Windows key, type 'cmd', press Enter. On Mac: press Cmd+Space, type 'terminal', press Enter. You will use the terminal a lot throughout this guide.

Step 5 — Install VS Code (Your Code Editor)
VS Code is where you write code. Think of it as Microsoft Word but for programming.

21. Go to https://code.visualstudio.com
22. Download and install VS Code for your operating system
23. Open VS Code
24. Install these extensions — click the four squares icon on the left sidebar, search for each:
    • Tailwind CSS IntelliSense (by Tailwind Labs)
    • ESLint (by Microsoft)
    • Prettier – Code formatter (by Prettier)
    • GitLens (by GitKraken)

Step 6 — Install Git
Git is what connects your code to GitHub. Node.js does not include it automatically.

25. Go to https://git-scm.com/downloads
26. Download Git for your operating system
27. Install it (click Next on every screen — defaults are fine)
28. Open your terminal and type:
    git --version
29. You should see: git version 2.x.x
30. Now configure Git with your name and email (use the same email as your GitHub account):
    git config --global user.name "Your Name"
    git config --global user.email "you@example.com"

Step 7 — Create Your GitHub Repository
A repository (repo) is a folder on GitHub that holds all your code.

31. Log into GitHub
32. Click the + icon (top right) and choose New repository
33. Repository name: gambia-sports
34. Set visibility to Private
35. Check the box: Add a README file
36. Click Create repository

CHECKPOINT At the end of Part 1 you should have: a GitHub account, a Supabase project called 'gambia-sports', a Vercel account, Node.js installed, VS Code installed, and a GitHub repo. Confirm all six before continuing.

 
Part 2 — Create the Next.js Project
Now you will create the actual project on your computer. This is the codebase that everything gets built in.

Step 8 — Create the Project
Open your terminal and navigate to where you want to store your projects (e.g. your Desktop or a Projects folder), then run:

HOW TO NAVIGATE IN THE TERMINAL Type 'cd Desktop' to go to your Desktop folder. Type 'cd ..' to go up one level. Type 'ls' (Mac) or 'dir' (Windows) to see what is in the current folder.

npx create-next-app@latest gambia-sports
The installer will ask you questions. Answer exactly like this:

Question Your answer
Would you like to use TypeScript? Yes
Would you like to use ESLint? Yes
Would you like to use Tailwind CSS? Yes
Would you like to use `src/` directory? Yes
Would you like to use App Router? Yes
Would you like to customize the default import alias? No

When it finishes, navigate into the project folder and open it in VS Code:
cd gambia-sports
code .

Step 9 — Understand the Folder Structure
Your project will have this structure. You only need to know these key folders right now:

Folder / File What it is Do you touch it?
src/app/ Where all your pages live. Each folder = one URL. Yes — constantly
src/app/page.tsx Your home page (the / route). Yes
src/app/layout.tsx The wrapper around every page. Contains the header and footer. Yes
public/ Static files like images and icons. Yes
tailwind.config.ts Tailwind configuration. Occasionally
next.config.js Next.js configuration. Occasionally
package.json Lists all your project's dependencies. Rarely
node_modules/ Installed packages. Never touch this folder. Never

Step 10 — Install Required Packages
Your project needs extra packages. Run these commands in your terminal (make sure you are inside the gambia-sports folder):

npm install @supabase/supabase-js @supabase/ssr
This installs the Supabase libraries that let your Next.js app talk to your Supabase database.

Step 11 — Connect Your Project to GitHub
Push your new project to the GitHub repo you created earlier:

git init
git remote add origin https://github.com/YOUR_USERNAME/gambia-sports.git
git add .
git commit -m "Initial Next.js project setup"
git push -u origin main
Replace YOUR_USERNAME with your actual GitHub username.

WHAT IS GIT PUSH? Pushing means sending your code from your computer to GitHub. From now on, every time you finish a feature, you will run: git add . — git commit -m 'description' — git push. This saves your work and automatically deploys to Vercel.

Step 12 — Connect to Vercel
This is a one-time setup that makes Vercel automatically publish your site whenever you push to GitHub.

37. Go to https://vercel.com and log in
38. Click Add New Project
39. Find and click on your gambia-sports repository
40. Click Deploy (do not change any settings)
41. Wait 1–2 minutes for the build to complete
42. Vercel will give you a URL like gambia-sports-abc.vercel.app — open it in your browser
43. You should see the default Next.js welcome page — that means everything is connected

CHECKPOINT Your code is now live on the internet. Every time you git push from now on, Vercel will automatically update the live site within 1–2 minutes. This is your deployment pipeline.

 
Part 3 — Set Up Your Database in Supabase
Your database is the backbone of the platform. Every team, player, match, and result is stored here. You will now create all the tables defined in the blueprint.

Step 13 — Get Your Supabase API Keys
Your Next.js app needs two pieces of information to connect to Supabase: the project URL and the anonymous key.

44. Go to https://supabase.com and open your gambia-sports project
45. Click Settings (gear icon) in the left sidebar
46. Click API
47. Copy: Project URL — it looks like https://abcdefgh.supabase.co
48. Copy: anon public key — a long string starting with eyJ...

Step 14 — Add Environment Variables
Environment variables are secret settings your app reads but never exposes to the public. Create a file called .env.local in the root of your project (next to package.json):

# .env.local

NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

IMPORTANT The .env.local file is NEVER pushed to GitHub. Next.js automatically ignores it. Your secret keys stay on your machine and in Vercel's settings only.
Also add these environment variables to Vercel: 49. Go to your project on vercel.com 50. Click Settings > Environment Variables 51. Add both variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) with the same values

Step 15 — Create the Supabase Client
Create a file at src/lib/supabase/client.ts with this content:

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
return createBrowserClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
}
This file is a reusable function that creates a connection to your database. You will import and call it whenever you need to read or write data.

Step 16 — Create the Phase 1 Database Tables
Go to your Supabase project dashboard, click SQL Editor in the left sidebar, and run the following SQL. You can paste the whole block at once and click Run.

WHAT IS SQL? SQL (Structured Query Language) is the language used to create and query databases. The code below creates the tables (like spreadsheet tabs) that store your data. You paste it into Supabase's SQL editor and click Run — you do not need to understand every line to start.

leagues table
CREATE TABLE leagues (
id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
name text NOT NULL,
slug text UNIQUE NOT NULL,
logo_url text,
created_at timestamp DEFAULT now()
);

seasons table
CREATE TABLE seasons (
id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
league_id uuid REFERENCES leagues(id) ON DELETE CASCADE,
name text NOT NULL,
start_date date,
end_date date,
status text DEFAULT 'upcoming'
);

teams table
CREATE TABLE teams (
id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
league_id uuid REFERENCES leagues(id) ON DELETE CASCADE,
name text NOT NULL,
slug text UNIQUE NOT NULL,
logo_url text,
home_ground text,
founded_year integer
);

players table
CREATE TABLE players (
id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
name text NOT NULL,
position text,
jersey_number integer,
date_of_birth date,
photo_url text
);

matches table
CREATE TABLE matches (
id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
season_id uuid REFERENCES seasons(id) ON DELETE CASCADE,
home_team_id uuid REFERENCES teams(id),
away_team_id uuid REFERENCES teams(id),
scheduled_at timestamp,
venue text,
status text DEFAULT 'scheduled',
home_score integer DEFAULT 0,
away_score integer DEFAULT 0,
minute integer
);

profiles table (for admin users)
CREATE TABLE profiles (
id uuid REFERENCES auth.users(id) PRIMARY KEY,
role text DEFAULT 'fan',
league_id uuid REFERENCES leagues(id),
display_name text
);

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
INSERT INTO public.profiles (id, display_name)
VALUES (new.id, new.email);
RETURN new;
END;

$$
LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

Enable Row Level Security
Run this to make sure data is protected. This means users can only see data they are allowed to see:
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read public data
CREATE POLICY 'Public read leagues' ON leagues FOR SELECT USING (true);
CREATE POLICY 'Public read seasons' ON seasons FOR SELECT USING (true);
CREATE POLICY 'Public read teams' ON teams FOR SELECT USING (true);
CREATE POLICY 'Public read players' ON players FOR SELECT USING (true);
CREATE POLICY 'Public read matches' ON matches FOR SELECT USING (true);

-- Allow authenticated users to write
CREATE POLICY 'Auth insert leagues' ON leagues FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY 'Auth update leagues' ON leagues FOR UPDATE TO authenticated USING (true);
CREATE POLICY 'Auth insert teams' ON teams FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY 'Auth update teams' ON teams FOR UPDATE TO authenticated USING (true);
CREATE POLICY 'Auth insert players' ON players FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY 'Auth update players' ON players FOR UPDATE TO authenticated USING (true);
CREATE POLICY 'Auth insert matches' ON matches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY 'Auth update matches' ON matches FOR UPDATE TO authenticated USING (true);
CREATE POLICY 'Auth insert seasons' ON seasons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY 'Auth update seasons' ON seasons FOR UPDATE TO authenticated USING (true);

Step 17 — Add Your First Admin User
52.	In Supabase, click Authentication in the left sidebar
53.	Click Users > Invite User
54.	Enter your email address and click Invite
55.	Check your email and click the link to set your password
56.	Now go to your SQL Editor and run:
-- Replace 'your-email@example.com' with your actual email
UPDATE profiles
SET role = 'super_admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');

CHECKPOINT	Your database is now set up with all Phase 1 tables. You have an admin account. Every time you visit the Supabase dashboard you can see all your data in the Table Editor section.
 
Part 4 — Build the Public Pages
Now you build the pages that any fan can visit without logging in. Start with these in order — each one is simpler than it looks.

HOW NEXT.JS PAGES WORK	In Next.js App Router, every file called page.tsx inside a folder becomes a web page. For example: src/app/standings/page.tsx becomes the URL /standings. Folders in parentheses like (public) are just organisation — they do not change the URL.

Step 18 — Create the Database Query Functions
Before building pages, create one file that holds all your database queries. This keeps your code organised. Create src/lib/queries/index.ts:

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Get all leagues
export async function getLeagues() {
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
  if (error) throw error
  return data
}

// Get active season for a league
export async function getActiveSeason(leagueId: string) {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('league_id', leagueId)
    .eq('status', 'active')
    .single()
  if (error) throw error
  return data
}

// Get standings (all teams with match record)
export async function getStandings(seasonId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(id,name,slug,logo_url), away_team:teams!away_team_id(id,name,slug,logo_url)')
    .eq('season_id', seasonId)
    .eq('status', 'completed')
  if (error) throw error
  return data
}

// Get upcoming fixtures
export async function getFixtures(seasonId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(id,name,slug), away_team:teams!away_team_id(id,name,slug)')
    .eq('season_id', seasonId)
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })
  if (error) throw error
  return data
}

// Get completed results
export async function getResults(seasonId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(id,name,slug), away_team:teams!away_team_id(id,name,slug)')
    .eq('season_id', seasonId)
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false })
  if (error) throw error
  return data
}

// Get team by slug
export async function getTeamBySlug(slug: string) {
  const { data, error } = await supabase
    .from('teams')
    .select('*, players(*)')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

// Get all teams in a league
export async function getTeams(leagueId: string) {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('league_id', leagueId)
  if (error) throw error
  return data
}

Step 19 — Build the Standings Page
Create the file src/app/(public)/standings/page.tsx. This page calculates and displays the league table.

The standings calculation logic works like this:
•	Loop through all completed matches
•	For each match, add points to the home team (3 for win, 1 for draw, 0 for loss) and the same for away team
•	Sort teams by points, then goal difference, then goals scored

// src/app/(public)/standings/page.tsx
import { getStandings, getActiveSeason, getLeagues } from '@/lib/queries'

// This function builds the standings table from raw match data
function calculateStandings(matches: any[]) {
  const table: Record<string, any> = {}

  for (const match of matches) {
    const { home_team, away_team, home_score, away_score } = match

    // Initialise team entry if it does not exist yet
    if (!table[home_team.id]) table[home_team.id] = { team: home_team, p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0 }
    if (!table[away_team.id]) table[away_team.id] = { team: away_team, p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0 }

    table[home_team.id].p++
    table[away_team.id].p++
    table[home_team.id].gf += home_score
    table[home_team.id].ga += away_score
    table[away_team.id].gf += away_score
    table[away_team.id].ga += home_score

    if (home_score > away_score) {
      table[home_team.id].w++; table[home_team.id].pts += 3
      table[away_team.id].l++
    } else if (home_score < away_score) {
      table[away_team.id].w++; table[away_team.id].pts += 3
      table[home_team.id].l++
    } else {
      table[home_team.id].d++; table[home_team.id].pts += 1
      table[away_team.id].d++; table[away_team.id].pts += 1
    }
  }

  return Object.values(table).sort((a, b) =>
    b.pts - a.pts || (b.gf-b.ga) - (a.gf-a.ga) || b.gf - a.gf
  )
}

export default async function StandingsPage() {
  const leagues = await getLeagues()
  const league = leagues[0]  // Use first league for Phase 1
  const season = await getActiveSeason(league.id)
  const matches = await getStandings(season.id)
  const standings = calculateStandings(matches)

  return (
    <main className='max-w-3xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>League Standings</h1>
      <table className='w-full text-sm'>
        <thead>
          <tr className='bg-blue-800 text-white'>
            <th className='p-2 text-left'>#</th>
            <th className='p-2 text-left'>Team</th>
            <th className='p-2'>P</th>
            <th className='p-2'>W</th>
            <th className='p-2'>D</th>
            <th className='p-2'>L</th>
            <th className='p-2'>GD</th>
            <th className='p-2'>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => (
            <tr key={row.team.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className='p-2'>{i + 1}</td>
              <td className='p-2 font-medium'>{row.team.name}</td>
              <td className='p-2 text-center'>{row.p}</td>
              <td className='p-2 text-center'>{row.w}</td>
              <td className='p-2 text-center'>{row.d}</td>
              <td className='p-2 text-center'>{row.l}</td>
              <td className='p-2 text-center'>{row.gf - row.ga}</td>
              <td className='p-2 text-center font-bold'>{row.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

Step 20 — Build the Fixtures Page
Create src/app/(public)/fixtures/page.tsx. This shows upcoming matches.

// src/app/(public)/fixtures/page.tsx
import { getFixtures, getActiveSeason, getLeagues } from '@/lib/queries'

export default async function FixturesPage() {
  const leagues = await getLeagues()
  const season = await getActiveSeason(leagues[0].id)
  const fixtures = await getFixtures(season.id)

  return (
    <main className='max-w-3xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Fixtures</h1>
      <div className='space-y-3'>
        {fixtures.map(match => (
          <div key={match.id} className='bg-white rounded-lg shadow p-4 flex justify-between items-center'>
            <span className='font-medium'>{match.home_team.name}</span>
            <div className='text-center text-sm text-gray-500'>
              <div>{new Date(match.scheduled_at).toLocaleDateString()}</div>
              <div>{new Date(match.scheduled_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
              <div className='text-xs'>{match.venue}</div>
            </div>
            <span className='font-medium'>{match.away_team.name}</span>
          </div>
        ))}
      </div>
    </main>
  )
}

Step 21 — Build the Results Page
Create src/app/(public)/results/page.tsx. This shows completed matches with scores.
// src/app/(public)/results/page.tsx
import { getResults, getActiveSeason, getLeagues } from '@/lib/queries'

export default async function ResultsPage() {
  const leagues = await getLeagues()
  const season = await getActiveSeason(leagues[0].id)
  const results = await getResults(season.id)

  return (
    <main className='max-w-3xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Results</h1>
      <div className='space-y-3'>
        {results.map(match => (
          <div key={match.id} className='bg-white rounded-lg shadow p-4'>
            <div className='flex justify-between items-center'>
              <span className='font-medium w-2/5 text-right'>{match.home_team.name}</span>
              <span className='text-2xl font-bold mx-4'>
                {match.home_score} - {match.away_score}
              </span>
              <span className='font-medium w-2/5'>{match.away_team.name}</span>
            </div>
            <p className='text-center text-xs text-gray-400 mt-1'>
              {new Date(match.scheduled_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

Step 22 — Build the Teams List and Team Pages
Create src/app/(public)/teams/page.tsx for the list, and src/app/(public)/teams/[slug]/page.tsx for individual team profiles.

WHAT IS [slug]?	The square brackets mean this is a dynamic route. When someone visits /teams/banjul-united, Next.js passes 'banjul-united' as the slug parameter to your page. This lets you have one file that handles any team page.

// src/app/(public)/teams/[slug]/page.tsx
import { getTeamBySlug } from '@/lib/queries'

export default async function TeamPage({ params }: { params: { slug: string } }) {
  const team = await getTeamBySlug(params.slug)

  return (
    <main className='max-w-3xl mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-2'>{team.name}</h1>
      {team.home_ground && <p className='text-gray-500 mb-6'>Home: {team.home_ground}</p>}
      <h2 className='text-xl font-semibold mb-3'>Squad</h2>
      <div className='space-y-2'>
        {team.players.map((player: any) => (
          <div key={player.id} className='bg-white rounded p-3 flex items-center gap-4'>
            <span className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700'>
              {player.jersey_number ?? '-'}
            </span>
            <div>
              <p className='font-medium'>{player.name}</p>
              <p className='text-sm text-gray-400'>{player.position}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

CHECKPOINT	You now have four working public pages: /standings, /fixtures, /results, and /teams/[slug]. Push to GitHub and check them on your Vercel URL. They will show empty data until you add a league and some teams in the next part.
 
Part 5 — Build the Admin Dashboard
The admin dashboard is the control panel for league officials. It is protected by login — only authenticated users with the right role can access it.

Step 23 — Set Up Authentication Middleware
Middleware runs before every page loads and checks if the user is logged in. Create src/middleware.ts in the root of your project:

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) { response.cookies.set({ name, value, ...options }) },
        remove(name, options) { response.cookies.set({ name, value: '', ...options }) },
    }}
  )

  const { data: { user } } = await supabase.auth.getUser()

  // If user is not logged in and tries to access /admin, redirect to login
  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*']
}

Step 24 — Build the Login Page
Create src/app/admin/login/page.tsx. This is the login form for admins.

'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Invalid email or password')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <form onSubmit={handleLogin} className='bg-white p-8 rounded-lg shadow w-full max-w-sm'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Admin Login</h1>
        {error && <p className='text-red-500 mb-4 text-sm'>{error}</p>}
        <input type='email' placeholder='Email' value={email}
          onChange={e => setEmail(e.target.value)}
          className='w-full border p-3 rounded mb-3' required />
        <input type='password' placeholder='Password' value={password}
          onChange={e => setPassword(e.target.value)}
          className='w-full border p-3 rounded mb-4' required />
        <button type='submit' className='w-full bg-blue-700 text-white p-3 rounded font-semibold'>
          Login
        </button>
      </form>
    </div>
  )
}

Step 25 — Build the Admin Dashboard Home
Create src/app/admin/page.tsx. This is the first page admins see after login.
// src/app/admin/page.tsx
export default function AdminDashboard() {
  return (
    <main className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Admin Dashboard</h1>
      <div className='grid grid-cols-2 gap-4 max-w-2xl'>
        <a href='/admin/teams' className='bg-white rounded-lg shadow p-6 hover:shadow-md'>
          <h2 className='font-bold text-lg mb-1'>Teams</h2>
          <p className='text-gray-500 text-sm'>Add and manage teams</p>
        </a>
        <a href='/admin/players' className='bg-white rounded-lg shadow p-6 hover:shadow-md'>
          <h2 className='font-bold text-lg mb-1'>Players</h2>
          <p className='text-gray-500 text-sm'>Register and manage players</p>
        </a>
        <a href='/admin/matches' className='bg-white rounded-lg shadow p-6 hover:shadow-md'>
          <h2 className='font-bold text-lg mb-1'>Matches</h2>
          <p className='text-gray-500 text-sm'>Enter results and schedule fixtures</p>
        </a>
        <a href='/admin/fixtures/new' className='bg-white rounded-lg shadow p-6 hover:shadow-md'>
          <h2 className='font-bold text-lg mb-1'>Schedule Fixture</h2>
          <p className='text-gray-500 text-sm'>Create a new upcoming match</p>
        </a>
      </div>
    </main>
  )
}

Step 26 — Build the Result Entry Form
This is the most important admin feature. Create src/app/admin/matches/[id]/page.tsx. It lets admins enter the score for a completed match.
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function EnterResultPage({ params }: { params: { id: string } }) {
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function saveResult() {
    setSaving(true)
    await supabase
      .from('matches')
      .update({ home_score: homeScore, away_score: awayScore, status: 'completed' })
      .eq('id', params.id)
    setSaving(false)
    router.push('/admin/matches')
  }

  return (
    <main className='p-6 max-w-md'>
      <h1 className='text-xl font-bold mb-6'>Enter Match Result</h1>
      <div className='flex items-center gap-4 mb-6'>
        <div className='flex-1'>
          <label className='block text-sm text-gray-600 mb-1'>Home Score</label>
          <input type='number' min='0' value={homeScore}
            onChange={e => setHomeScore(Number(e.target.value))}
            className='w-full border-2 text-center text-3xl p-3 rounded' />
        </div>
        <span className='text-2xl font-bold mt-5'>-</span>
        <div className='flex-1'>
          <label className='block text-sm text-gray-600 mb-1'>Away Score</label>
          <input type='number' min='0' value={awayScore}
            onChange={e => setAwayScore(Number(e.target.value))}
            className='w-full border-2 text-center text-3xl p-3 rounded' />
        </div>
      </div>
      <button onClick={saveResult} disabled={saving}
        className='w-full bg-green-600 text-white py-3 rounded font-semibold'>
        {saving ? 'Saving...' : 'Save Result'}
      </button>
    </main>
  )
}

Step 27 — Build the Schedule Fixture Form
Create src/app/admin/fixtures/new/page.tsx. Admins use this to create upcoming matches.
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function NewFixturePage() {
  const [teams, setTeams] = useState<any[]>([])
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [venue, setVenue] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.from('teams').select('*').then(({ data }) => setTeams(data ?? []))
  }, [])

  async function createFixture() {
    // Get the active season first
    const { data: leagues } = await supabase.from('leagues').select('id').limit(1)
    const { data: season } = await supabase.from('seasons')
      .select('id').eq('league_id', leagues![0].id).eq('status', 'active').single()

    await supabase.from('matches').insert({
      season_id: season!.id,
      home_team_id: homeTeam,
      away_team_id: awayTeam,
      scheduled_at: `${date}T${time}:00`,
      venue,
      status: 'scheduled'
    })
    router.push('/admin/matches')
  }

  return (
    <main className='p-6 max-w-md'>
      <h1 className='text-xl font-bold mb-6'>Schedule New Fixture</h1>
      <div className='space-y-4'>
        <select value={homeTeam} onChange={e => setHomeTeam(e.target.value)}
          className='w-full border p-3 rounded'>
          <option value=''>Select Home Team</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select value={awayTeam} onChange={e => setAwayTeam(e.target.value)}
          className='w-full border p-3 rounded'>
          <option value=''>Select Away Team</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <input type='date' value={date} onChange={e => setDate(e.target.value)}
          className='w-full border p-3 rounded' />
        <input type='time' value={time} onChange={e => setTime(e.target.value)}
          className='w-full border p-3 rounded' />
        <input type='text' placeholder='Venue name' value={venue}
          onChange={e => setVenue(e.target.value)}
          className='w-full border p-3 rounded' />
        <button onClick={createFixture}
          className='w-full bg-blue-700 text-white py-3 rounded font-semibold'>
          Create Fixture
        </button>
      </div>
    </main>
  )
}

CHECKPOINT	Your admin dashboard is now functional. Test the full flow: login at /admin/login, create a team, add players to it, schedule a fixture, then enter a result. Check that the standings page updates after entering a result.
 
Part 6 — Add Navigation, Layout, and Polish

Step 28 — Build the Main Navigation
Edit src/app/layout.tsx to add a navigation bar across all pages:
// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gambia Sports Platform',
  description: 'Your home for Gambian football',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='bg-gray-100 min-h-screen'>
        <nav className='bg-blue-800 text-white py-3 px-4'>
          <div className='max-w-4xl mx-auto flex items-center justify-between'>
            <a href='/' className='font-bold text-xl'>Gambia Sports</a>
            <div className='flex gap-6 text-sm font-medium'>
              <a href='/standings' className='hover:text-blue-200'>Standings</a>
              <a href='/fixtures' className='hover:text-blue-200'>Fixtures</a>
              <a href='/results' className='hover:text-blue-200'>Results</a>
              <a href='/teams' className='hover:text-blue-200'>Teams</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

Step 29 — Add Your Custom Domain
57.	Purchase a domain (recommendation: use Cloudflare Registrar or Namecheap — search for a .gm or .com domain)
58.	Go to your Vercel project settings
59.	Click Domains > Add Domain
60.	Enter your domain name (e.g. gambiasports.gm)
61.	Follow Vercel's instructions to point your domain's DNS to Vercel
62.	Vercel automatically provides a free SSL certificate (the padlock icon in the browser)

Step 30 — Add Your First Real Data
Now add a real league, season, and some teams so the site shows actual data:
63.	Go to Supabase Table Editor
64.	Click on the leagues table and add a row:
•	name: Banjul Community League
•	slug: banjul-community-league
65.	Click on the seasons table and add a row:
•	league_id: (copy the id from the league you just created)
•	name: 2026 Season
•	status: active
66.	Add teams to the teams table, setting league_id for each
67.	Add players to the players table, setting team_id for each
68.	Go to your live site and verify the pages show your data

CHECKPOINT — PHASE 1 COMPLETE	Your platform is live. A fan can visit your domain and see standings, fixtures, results, and team pages. An admin can log in and manage everything. This is your Phase 1 milestone.
 
Part 7 — Deploying, Updating, and Maintaining

Your Daily Workflow
Every time you work on the project, follow this cycle:

69.	Make changes in VS Code
70.	Test locally by running: npm run dev (in your terminal, in the project folder)
71.	Open http://localhost:3000 in your browser to see your changes
72.	When happy, save your work to GitHub:
git add .
git commit -m "Short description of what you changed"
git push
73.	Wait 1–2 minutes and your live Vercel site will update automatically

LOCAL VS LIVE	npm run dev runs the site on your own computer only (localhost:3000). Only you can see it. When you git push, it goes to Vercel and everyone on the internet can see it. Always test locally first.

Common Commands Reference

Command	What it does	When to use it
npm run dev	Starts the local development server	Every time you start working
npm run build	Builds the production version locally	To test for build errors before pushing
git add .	Stages all changed files for commit	Before every commit
git commit -m "message"	Saves a snapshot of your code	After completing a feature or fix
git push	Sends your commits to GitHub	After committing
git pull	Downloads latest code from GitHub	If working on multiple computers
npm install package-name	Installs a new library	When adding new features

Troubleshooting Common Errors

Error message	What it means	How to fix it
Module not found	You imported something that does not exist or is misspelled	Check the import path at the top of the file. Make sure the file exists.
TypeError: Cannot read properties of undefined	You are trying to use data that has not loaded yet	Add a loading check: if (!data) return <p>Loading...</p>
Error: relation X does not exist	The database table does not exist in Supabase	Re-run the SQL from Step 16 in the Supabase SQL editor
401 Unauthorized from Supabase	Your API keys are wrong or missing	Check your .env.local file and Vercel environment variables
Page not found (404)	The URL does not match any page file	Check the file path in src/app/ — folders must match URL segments
Build failed on Vercel	TypeScript or syntax error in your code	Run npm run build locally first to see the exact error
 
Part 8 — What Comes Next (Phase 2–4 Overview)
Once Phase 1 is live and being used by a real league, start Phase 2. This section gives you the key additions for each phase.

Phase 2 — Sports News & Multi-League (Months 4–7)
Phase 2 adds three major capabilities:

1. Multiple Leagues
•	Add a league selector in the navigation
•	Update all queries to filter by league_id (the database is already designed for this)
•	Create a /leagues/[slug] route for each league's homepage

2. News Articles
•	Install Tiptap: npm install @tiptap/react @tiptap/starter-kit
•	Create an articles table in Supabase (SQL is in the blueprint, Section 3.2)
•	Build an article editor at /admin/news/new
•	Build the public articles listing at /news and individual article pages at /news/[slug]

3. Player Statistics
•	Create the match_events table (SQL in blueprint Section 3.2)
•	Build the event entry form at /admin/events/[matchId]
•	Create SQL views in Supabase to aggregate goals per player per season
•	Build the top scorers page at /stats/top-scorers

Phase 3 — Live Scores & First Revenue (Months 8–14)
Phase 3 is about real-time updates and turning the platform into a business:

Live Scores with Supabase Realtime
•	Supabase Realtime is already included — you just need to subscribe to it in your React components
•	Create the /match/[id] page with a useEffect that subscribes to changes on the matches and match_events tables
•	Build the reporter tool at /reporter/[matchId] — a simple mobile page with large tap buttons for each event type

Revenue Setup
•	Create an ads table in Supabase and render ad components in your layout.tsx
•	Use Wave App (free) to invoice league partners manually
•	Install Paystack when ready for online payments: npm install @paystack/inline-js

Phase 4 — Mobile App & Full Product (Months 15–24)
Phase 4 extends the platform to mobile and advanced analytics:

React Native Mobile App
•	Install Expo: npm install -g @expo/cli
•	Create a new mobile project: npx create-expo-app gambia-sports-app
•	The mobile app calls the same Supabase database as your web app — no duplicate work
•	Most of your query functions from src/lib/queries can be reused directly

Fan Accounts
•	Enable email sign-up in Supabase Auth (currently restricted to admin invites only)
•	Add a follows table for team following
•	Build personalised feed at /feed

IMPORTANT RULE FOR ALL PHASES	Never throw away working code to add a new feature. Always add on top. The blueprint is designed so that every Phase 1 table, component, and query is still used in Phase 4. Adding a column to a table is always better than creating a new one.
 
Part 9 — Complete File & Folder Reference
This is the complete file structure you will build across all phases. Phase 1 files are the ones you build in this guide. Phase 2+ files are created later.

File path	Phase	What it does
src/app/layout.tsx	1	Root layout — navigation bar wraps all pages
src/app/page.tsx	1	Home page — latest results and upcoming fixtures
src/app/(public)/standings/page.tsx	1	Public standings table
src/app/(public)/fixtures/page.tsx	1	Upcoming fixtures list
src/app/(public)/results/page.tsx	1	Completed results list
src/app/(public)/teams/page.tsx	1	All teams list
src/app/(public)/teams/[slug]/page.tsx	1	Individual team page
src/app/(public)/players/[id]/page.tsx	1	Individual player page
src/app/admin/login/page.tsx	1	Admin login form
src/app/admin/page.tsx	1	Admin dashboard home
src/app/admin/matches/page.tsx	1	List all matches
src/app/admin/matches/[id]/page.tsx	1	Enter result for a match
src/app/admin/teams/page.tsx	1	Manage teams
src/app/admin/players/page.tsx	1	Manage players
src/app/admin/fixtures/new/page.tsx	1	Schedule new fixture
src/middleware.ts	1	Protects all /admin routes
src/lib/supabase/client.ts	1	Supabase browser client
src/lib/queries/index.ts	1	All database query functions
src/types/database.ts	1	TypeScript types for all tables
.env.local	1	Secret API keys (never pushed to GitHub)
src/app/(public)/news/page.tsx	2	News articles list
src/app/(public)/news/[slug]/page.tsx	2	Individual article page
src/app/admin/news/new/page.tsx	2	Rich text article editor
src/app/admin/events/[matchId]/page.tsx	2	Record match events (goals, cards)
src/app/(public)/leagues/[slug]/page.tsx	2	Per-league home page
src/app/(public)/stats/top-scorers/page.tsx	2	Goal leaderboard
src/app/match/[id]/page.tsx	3	Live match page with real-time score
src/app/reporter/[matchId]/page.tsx	3	Mobile reporter event entry tool
src/app/cups/[slug]/page.tsx	3	Knockout cup bracket
src/app/admin/ads/page.tsx	3	Manage advertisement placements
src/app/feed/page.tsx	4	Personalised fan news feed
src/app/analytics/player/[id]/page.tsx	4	Player stats charts
src/app/api/v1/[...route]/route.ts	4	Public JSON API endpoints
 
Part 10 — Quick Reference & Useful Links

All the URLs You Need

Service	URL	What you do there
Your Supabase project	supabase.com/dashboard	View data, run SQL, manage users, check logs
Your Vercel dashboard	vercel.com/dashboard	See deployment status, add env variables, view build logs
Your GitHub repo	github.com/YOUR_USERNAME/gambia-sports	View code history, see pushes, manage collaborators
Your live site	your-domain.com	What fans see
Local development	localhost:3000	What you see when running npm run dev
Admin dashboard	your-domain.com/admin	What the league admin sees after login

Documentation Links
•	Next.js docs: https://nextjs.org/docs
•	Supabase docs: https://supabase.com/docs
•	Tailwind CSS docs: https://tailwindcss.com/docs
•	Vercel docs: https://vercel.com/docs
•	Supabase Auth (login): https://supabase.com/docs/guides/auth
•	Supabase Realtime (Phase 3): https://supabase.com/docs/guides/realtime
•	Tiptap editor (Phase 2): https://tiptap.dev/docs
•	Paystack (Phase 3): https://paystack.com/docs
•	Expo / React Native (Phase 4): https://docs.expo.dev

TypeScript Basics You Need to Know
You do not need to be a TypeScript expert. You only need to understand three things:

Concept	What it means	Example
string	Text data	const name: string = 'Banjul FC'
number	Numeric data	const goals: number = 3
boolean	True or false	const isLive: boolean = false
interface	Shape of an object	interface Team { id: string; name: string }
?	Optional field (may be undefined)	logo_url?: string
any	Ignore type checking (use sparingly)	const data: any = response
async/await	Wait for data to load before continuing	const data = await getTeams()



TechPalz — Gambia Sports Platform
Solo Developer Implementation Guide  |  Version 1.0  |  April 2026
Based on TechPalz Blueprint v1.0
$$
