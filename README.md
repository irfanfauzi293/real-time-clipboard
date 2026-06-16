# ClipSync

Real-time clipboard sharing across devices with private rooms. Type on one device, see it instantly on another.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?logo=supabase&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vue.js&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

## Features

- **Private Rooms** — Create or join a room with any code. Only people with the code can access it.
- **Real-Time Sync** — Text syncs instantly across devices via Supabase Realtime (WebSocket).
- **Copy & Clear** — One-click copy to device clipboard and clear shared content.
- **Recent Rooms** — Quick access to previously visited rooms (stored in localStorage).
- **100% Free** — Supabase free tier with hard limits, no surprise charges.
- **No Build Step** — Pure static frontend with Vue 3 via CDN.

## Tech Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Frontend | Vue 3 (CDN) + Vanilla CSS          |
| Realtime | Supabase Realtime (WebSocket)      |
| Database | Supabase PostgreSQL (free tier)    |
| Hosting  | Vercel (static + serverless)       |
| Server   | Express (local dev only)           |

## Quick Start (Local)

```bash
# Clone
git clone https://github.com/irfanfauzi293/real-time-clipboard.git
cd real-time-clipboard

# Install
npm install

# Create .env with your Supabase credentials
echo SUPABASE_URL=https://your-project.supabase.co > .env
echo SUPABASE_ANON_KEY=your-anon-key >> .env

# Run
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com) (no credit card required).
2. Go to **SQL Editor** and run:

```sql
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  text TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER PUBLICATION supabase_realtime ADD TABLE rooms;

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON rooms FOR ALL USING (true) WITH CHECK (true);
```

3. Go to **Settings → API** and copy your **Project URL** and **anon/public key**.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo on [vercel.com/new](https://vercel.com/new).
3. Add environment variables in **Settings → Environment Variables**:

| Key                | Value                              |
|--------------------|------------------------------------|
| `SUPABASE_URL`     | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY`| Your anon/public key               |

4. Deploy — done.

## Project Structure

```
real-time-clipboard/
├── api/
│   └── config.js      # Serverless function — serves Supabase config from env vars
├── public/
│   └── index.html     # Single-page app (Vue 3 + Supabase Realtime client)
├── server.js          # Express static server (local dev only)
├── .env               # Local environment variables (gitignored)
├── package.json
├── vercel.json
└── .gitignore
```

## How It Works

1. Enter a **room code** on the landing page.
2. The frontend fetches Supabase credentials from `/api/config` (env vars, not hardcoded).
3. A Supabase Realtime channel subscribes to `postgres_changes` for that room row.
4. When you type, the text is debounced (400ms) then written to the `rooms` table.
5. Supabase broadcasts the change via WebSocket to all other subscribed clients instantly.

## Environment Variables

| Variable           | Required | Description                        |
|--------------------|----------|------------------------------------|
| `SUPABASE_URL`     | Yes      | Supabase project URL               |
| `SUPABASE_ANON_KEY`| Yes      | Supabase anon/public key           |
| `PORT`             | No       | Local dev server port (default: 3000) |

## Supabase Free Tier Limits

| Resource                  | Limit        |
|---------------------------|--------------|
| Database storage          | 500 MB       |
| Bandwidth                 | 5 GB / month |
| Realtime connections      | 200 concurrent |
| API requests              | Unlimited    |
| Surprise charges          | **None** (hard limit) |

## License

MIT
