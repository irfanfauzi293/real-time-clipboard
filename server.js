const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// --- Static files ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Upstash Redis via REST API (no driver needed) ---
const UPSTASH_URL = process.env.UPSTASH_KV_REST_API_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_KV_REST_API_TOKEN;

async function redisCommand(...args) {
  const res = await fetch(`${UPSTASH_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

// --- API Routes ---

// GET /api/rooms/:id — Get room text + version
app.get('/api/rooms/:id', async (req, res) => {
  try {
    const roomId = req.params.id;
    const [text, version] = await Promise.all([
      redisCommand('GET', `room:${roomId}:text`),
      redisCommand('GET', `room:${roomId}:version`),
    ]);
    res.json({
      text: text || '',
      version: parseInt(version) || 0,
    });
  } catch (err) {
    console.error('GET room error:', err.message);
    res.status(500).json({ error: 'Failed to fetch room data' });
  }
});

// PUT /api/rooms/:id — Update room text
app.put('/api/rooms/:id', async (req, res) => {
  try {
    const roomId = req.params.id;
    const { text } = req.body;
    if (text === undefined) return res.status(400).json({ error: 'text is required' });

    const version = await redisCommand('INCR', `room:${roomId}:version`);
    await Promise.all([
      redisCommand('SET', `room:${roomId}:text`, text),
      // Auto-expire rooms after 24 hours of no updates
      redisCommand('EXPIRE', `room:${roomId}:text`, 86400),
      redisCommand('EXPIRE', `room:${roomId}:version`, 86400),
    ]);
    res.json({ version });
  } catch (err) {
    console.error('PUT room error:', err.message);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// DELETE /api/rooms/:id — Clear room text
app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const roomId = req.params.id;
    const version = await redisCommand('INCR', `room:${roomId}:version`);
    await redisCommand('SET', `room:${roomId}:text`, '');
    res.json({ version });
  } catch (err) {
    console.error('DELETE room error:', err.message);
    res.status(500).json({ error: 'Failed to clear room' });
  }
});

// --- Fallback: serve index.html for SPA ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start (local dev only — Vercel uses serverless export) ---
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✓ Server running → http://localhost:${PORT}`);
  });
}

module.exports = app;
