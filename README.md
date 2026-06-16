# ClipSync

Real-time clipboard sharing across devices with private rooms. Type on one device, see it instantly on another.

![Nuxt](https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt.js&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vue.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

## Features

- **Private Rooms** — Create or join a room with any code. Only people with the code can access it.
- **Real-Time Sync** — Text syncs instantly across devices via Supabase Realtime (WebSocket).
- **Copy & Clear** — One-click copy to device clipboard and clear shared content.
- **Recent Rooms** — Quick access to previously visited rooms (stored in localStorage).
- **100% Free** — Supabase free tier with hard limits, no surprise charges.
- **Zero Configuration** — Fully integrated Nuxt 3 setup.

## Tech Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Frontend | Nuxt 3 + Vue 3                     |
| Styling  | Vanilla CSS                        |
| Realtime | Supabase Realtime (WebSocket)      |
| Database | Supabase PostgreSQL (free tier)    |
| Hosting  | Vercel (zero-config Nuxt support)  |

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

# Run development server
npm run dev
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

4. Deploy — done. Vercel automatically detects the Nuxt 3 framework and handles the build.

## Project Structure

```
real-time-clipboard/
├── app.vue            # Main Nuxt entrypoint (Vue 3 Composition API)
├── nuxt.config.ts     # Nuxt config + runtime variables
├── assets/
│   └── css/main.css   # Global styles
├── .env               # Local environment variables (gitignored)
├── package.json       # Dependencies and scripts
└── vercel.json        # Explicit Vercel build settings
```

## How It Works

1. Enter a **room code** on the landing page.
2. The frontend connects to Supabase securely via Nuxt's `runtimeConfig`.
3. A Supabase Realtime channel subscribes to `postgres_changes` for that room row.
4. When you type, the text is debounced (400ms) then written to the `rooms` table.
5. Supabase broadcasts the change via WebSocket to all other subscribed clients instantly.

## Environment Variables

| Variable           | Required | Description                        |
|--------------------|----------|------------------------------------|
| `SUPABASE_URL`     | Yes      | Supabase project URL               |
| `SUPABASE_ANON_KEY`| Yes      | Supabase anon/public key           |

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
