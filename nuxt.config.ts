// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  supabase: {
    // These tell the Supabase module to use the Vercel-injected env vars automatically.
    // If they are missing, it throws an error at build time.
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirect: false // Don't redirect unauthenticated users since we use anon rooms
  },
  app: {
    head: {
      title: 'ClipSync — Real-Time Clipboard',
      meta: [
        { name: 'description', content: 'Share text instantly across devices with private room-based real-time clipboard sync.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap' }
      ]
    }
  }
})
