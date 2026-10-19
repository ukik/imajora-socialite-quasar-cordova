# Quasar environment configuration

The sample page reads process.env.API_BASE_URL and process.env.GOOGLE_OAUTH_START_URL. In your project's quasar.config.js, expose these two public values through the build.env configuration supported by your installed Quasar version, or replace the two fallbacks in the page with your public API URLs.

Example config fragment to merge into the existing config (keep other options):

    build: {
      env: {
        API_BASE_URL: JSON.stringify(process.env.API_BASE_URL || 'https://your-api.example.com/api'),
        GOOGLE_OAUTH_START_URL: JSON.stringify(process.env.GOOGLE_OAUTH_START_URL || 'https://your-api.example.com/auth/google/mobile')
      }
    }

Do not define GOOGLE_CLIENT_SECRET in the Quasar project. Anything bundled into the client is public.
