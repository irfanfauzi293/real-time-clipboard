// Vercel serverless function: returns Supabase config from env vars
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0'); // Prevent caching during setup
  
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  
  const missing = [];
  if (!url) missing.push('SUPABASE_URL');
  if (!key) missing.push('SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    return res.status(500).json({ error: `Missing Vercel env vars: ${missing.join(' and ')}` });
  }

  res.json({
    supabaseUrl: url,
    supabaseKey: key,
  });
};
