/**
 * pathwise-config.js
 *
 * Central configuration for all Pathwise HTML pages.
 *
 * Priority order:
 *  1. window.__ENV  — injected by Express/server at runtime (production)
 *  2. LOCAL_DEV     — values set directly below (for file:// / local dev)
 *
 * TO USE LOCALLY: paste your Gemini API key into LOCAL_DEV.GEMINI_API_KEY below.
 *
 * Server-side injection example (Express):
 *   res.send(html.replace('</head>',
 *     `<script>window.__ENV=${JSON.stringify(envVars)}</script></head>`));
 */

(function () {
  // ── LOCAL DEV FALLBACKS ──────────────────────────────────────
  // Fill these in when running HTML files directly from disk (file://).
  // When deployed, window.__ENV from the server takes priority.
  const LOCAL_DEV = {
    GEMINI_API_KEY:  'AIzaSyDAuDR9886qV_EmKpBkuPny2T4umujsj-4', // ← your key
    GEMINI_MODEL:    'gemini-2.5-flash',
    GEMINI_API_BASE: 'https://generativelanguage.googleapis.com/v1beta/models',
    API_BASE_URL:    'http://localhost:5000/api/v1',
    APP_NAME:        'Pathwise',
    APP_ENV:         'development',
  };
  // ─────────────────────────────────────────────────────────────

  // Merge: server env wins over local fallbacks
  const env = Object.assign({}, LOCAL_DEV, window.__ENV || {});

  const GEMINI_KEY   = env.GEMINI_API_KEY;
  const GEMINI_MODEL = env.GEMINI_MODEL;
  const GEMINI_BASE  = env.GEMINI_API_BASE;

  window.PathwiseConfig = Object.freeze({
    GEMINI_KEY,
    GEMINI_MODEL,
    GEMINI_URL: `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    API:        env.API_BASE_URL,
    APP_NAME:   env.APP_NAME,
    APP_ENV:    env.APP_ENV,
  });

  if (!GEMINI_KEY) {
    console.warn('[Pathwise] GEMINI_API_KEY is not set. AI features will not work.');
  }
})();