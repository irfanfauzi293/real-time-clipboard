# ClipSync

Real-time clipboard sharing across devices with private rooms. Type on one device, see it instantly on another.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Redis](https://img.shields.io/badge/Upstash-Redis-DC382D?logo=redis&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vue.js&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

## Features

- **Private Rooms** — Create or join a room with any code. Only people with the code can access it.
- **Real-Time Sync** — Text syncs across devices via HTTP polling (~800ms interval).
- **Copy & Clear** — One-click copy to device clipboard and clear shared content.
- **Auto-Reconnect** — Seamless reconnection on network issues.
- **Recent Rooms** — Quick access to previously visited rooms (stored in localStorage).
- **Serverless Ready** — Deploys to Vercel with Upstash Redis for persistence.
- **Auto-Expire** — Rooms auto-clean after 24 hours of inactivity.

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Server   | Node.js + Express (serverless)|
| Storage  | Upstash Redis (REST API)      |
| Frontend | Vue 3 (CDN)                   |
| Styling  | Vanilla CSS (dark mode)       |
| Hosting  | Vercel                        |

## Quick Start (Local)

```bash
# Clone
git clone https://github.com/irfanfauzi293/real-time-clipboard.git
cd real-time-clipboard

# Install
npm install

# Set environment variables
# Create a free Upstash Redis at https://console.upstash.com
set UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
set UPSTASH_REDIS_REST_TOKEN=your-token-here

# Run
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo on [vercel.com/new](https://vercel.com/new).
3. Go to **Settings → Integrations** and add **Upstash Redis** (free tier, no credit card).
4. Vercel auto-injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as environment variables.
5. Deploy — done.

## Project Structure

```
real-time-clipboard/
├── server.js          # Express API routes (GET/PUT/DELETE) + Upstash Redis
├── public/
│   └── index.html     # Single-page app (Vue 3 + CSS + HTTP polling)
├── package.json
├── vercel.json        # Vercel deployment routing config
└── .gitignore
```

## API Endpoints

| Method   | Endpoint           | Description             |
|----------|--------------------|-------------------------|
| `GET`    | `/api/rooms/:id`   | Get room text + version |
| `PUT`    | `/api/rooms/:id`   | Update room text        |
| `DELETE` | `/api/rooms/:id`   | Clear room text         |

## Environment Variables

| Variable                     | Required | Description                  |
|------------------------------|----------|------------------------------|
| `UPSTASH_REDIS_REST_URL`     | Yes      | Upstash Redis REST endpoint  |
| `UPSTASH_REDIS_REST_TOKEN`   | Yes      | Upstash Redis auth token     |
| `PORT`                       | No       | Server port (default: 3000)  |

## How It Works

1. Enter a **room code** on the landing page.
2. The frontend polls `GET /api/rooms/:id` every 800ms.
3. When you type, the text is debounced (300ms) then pushed via `PUT /api/rooms/:id`.
4. Each update increments a version number in Redis — polling clients only update their textarea when the server version is newer than their local version.
5. Rooms auto-expire after 24 hours of no updates.

## License

MIT
