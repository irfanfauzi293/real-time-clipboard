# ClipSync

Real-time clipboard sharing across devices with private rooms. Type on one device, see it instantly on another.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-ws-blue)
![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vue.js&logoColor=white)

## Features

- **Private Rooms** — Create or join a room with any code. Only people with the code can access it.
- **Real-Time Sync** — Text syncs instantly across all connected devices via WebSocket.
- **Copy & Clear** — One-click copy to device clipboard and clear shared content.
- **Auto-Reconnect** — Seamless reconnection if the connection drops.
- **Recent Rooms** — Quick access to previously visited rooms (stored in localStorage).
- **Zero Setup** — No database, no build step, no accounts. Just run and go.

## Tech Stack

| Layer    | Technology              |
|----------|------------------------|
| Server   | Node.js + Express      |
| Realtime | WebSocket (`ws`)       |
| Frontend | Vue 3 (CDN)            |
| Styling  | Vanilla CSS (dark mode)|
| Storage  | In-memory (`Object`)   |

## Quick Start

```bash
# Clone
git clone https://github.com/irfanfauzi293/real-time-clipboard.git
cd real-time-clipboard

# Install
npm install

# Run
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
real-time-clipboard/
├── server.js          # Express + WebSocket server with room isolation
├── public/
│   └── index.html     # Single-page app (Vue 3 + CSS)
├── package.json
├── vercel.json        # Vercel deployment config
└── .gitignore
```

## How It Works

1. Enter a **room code** on the landing page (any string works).
2. A WebSocket connection is established scoped to that room.
3. Any text typed in the textarea is broadcast to all other devices in the same room.
4. Room data is stored in-memory on the server — it persists as long as the server is running.

## Deployment

> **Note:** This app uses WebSockets, which require a persistent server process. Serverless platforms (Vercel, Netlify Functions) do not support WebSockets. Use a platform that supports long-lived processes:

| Platform | Command |
|----------|---------|
| [Railway](https://railway.app) | Connect repo → auto-deploy |
| [Render](https://render.com) | Web Service → `npm start` |
| [Fly.io](https://fly.io) | `fly launch` → `fly deploy` |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT`   | `3000`  | Server port |

## License

MIT
