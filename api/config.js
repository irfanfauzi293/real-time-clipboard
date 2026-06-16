// Vercel serverless function: returns Supabase config from env vars
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  });
};
