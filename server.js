const express = require('express');
const path = require('path');

// Load .env for local development
try { require('dotenv').config(); } catch {}

const app = express();

// --- Config endpoint (mirrors Vercel serverless function) ---
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  });
});

// --- SPA fallback (serves index.html from root) ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running → http://localhost:${PORT}`);
});
