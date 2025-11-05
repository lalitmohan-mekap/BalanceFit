

import express from 'express';
  import cors from 'cors';
  import dotenv from 'dotenv';
  import path from 'path';
  import { fileURLToPath } from 'url';

  dotenv.config();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Serve static files (so / serves index.html in the same folder)
  app.use(express.static(__dirname));

  const APP_ID = process.env.NUTRITIONIX_APP_ID;
  const APP_KEY = process.env.NUTRITIONIX_APP_KEY;
  if (!APP_ID || !APP_KEY) {
    console.warn('[WARN] NUTRITIONIX_APP_ID or NUTRITIONIX_APP_KEY missing in .env');
  }

  // Proxy to Nutritionix Natural Language endpoints
  app.post('/api/nx/natural/:endpoint', async (req, res) => {
    const { endpoint } = req.params; // 'nutrients' or 'exercise'
    const { query } = req.body || {};

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Missing "query" string in body' });
    }

    try {
      const upstream = await fetch(`https://trackapi.nutritionix.com/v2/natural/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': APP_ID || '',
          'x-app-key': APP_KEY || ''
        },
        body: JSON.stringify({ query })
      });

      const data = await upstream.json();
      if (!upstream.ok) {
        return res.status(upstream.status).json({ message: data?.message || 'Nutritionix error', data });
      }
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Proxy error' });
    }
  });

  const port = Number(process.env.PORT || 5174);
  app.listen(port, () => console.log(`BalanceFit server running at http://localhost:${port}`));
  

// SERVER_INJECT_ADSENSE_HANDLER
import fs from 'fs';

const ADSENSE_CLIENT = process.env.ADSENSE_CLIENT || '';
const ADSENSE_SLOTS = (process.env.ADSENSE_SLOTS || '0000000001').split(',');
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || '').split(',').map(s => s.trim()).filter(Boolean);

function hostAllowed(req) {
  try {
    const host = (req.headers.host || '').toLowerCase();
    const referer = (req.headers.referer || '').toLowerCase();
    if (!ALLOWED_HOSTS.length) return true; // permissive if no list provided
    return ALLOWED_HOSTS.some(h => host.includes(h.toLowerCase()) || referer.includes(h.toLowerCase()));
  } catch (e) {
    return false;
  }
}

// Serve index.html with optional AdSense injection
app.get('/', (req, res) => {
  const htmlPath = path.join(process.cwd(), 'patched_index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  const allowAds = ADSENSE_CLIENT && hostAllowed(req);
  if (allowAds) {
    // replace placeholders
    html = html.replace(/__ADSENSE_CLIENT__/g, ADSENSE_CLIENT);
    html = html.replace(/__ADSENSE_SLOT_1__/g, ADSENSE_SLOTS[0] || '');
    // inject script tag where marker exists
    html = html.replace('<!-- SERVER_INJECT:ADSENSE_SCRIPT -->',
      `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>`);
  } else {
    // Remove marker and clear client placeholders
    html = html.replace('<!-- SERVER_INJECT:ADSENSE_SCRIPT -->', '');
    html = html.replace(/__ADSENSE_CLIENT__/g, '');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});
