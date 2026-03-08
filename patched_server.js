import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files in project root.
app.use(express.static(__dirname));

// GPT 20B API config (leave API key empty in .env, then fill it yourself).
const GPT_20B_API_KEY = process.env.GPT_20B_API_KEY || '';
const GPT_20B_MODEL = process.env.GPT_20B_MODEL || 'openai/gpt-oss-20b';
const GPT_20B_API_BASE_URL = (process.env.GPT_20B_API_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, '');

if (!GPT_20B_API_KEY) {
  console.warn('[WARN] GPT_20B_API_KEY missing in .env');
}

const ADSENSE_CLIENT = process.env.ADSENSE_CLIENT || '';
const ADSENSE_SLOTS = (process.env.ADSENSE_SLOTS || '0000000001').split(',');
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || '').split(',').map(s => s.trim()).filter(Boolean);
const VALID_ENDPOINTS = new Set(['nutrients', 'exercise']);

function hostAllowed(req) {
  try {
    const host = (req.headers.host || '').toLowerCase();
    const referer = (req.headers.referer || '').toLowerCase();
    if (!ALLOWED_HOSTS.length) return true;
    return ALLOWED_HOSTS.some(h => host.includes(h.toLowerCase()) || referer.includes(h.toLowerCase()));
  } catch {
    return false;
  }
}

function toPositiveNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function getModelText(data) {
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(part => (typeof part?.text === 'string' ? part.text : '')).join('\n');
  }
  return '';
}

function safeJsonParse(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

function normalizeFoodResponse(parsed) {
  const source = Array.isArray(parsed?.foods)
    ? parsed.foods
    : Array.isArray(parsed?.items)
      ? parsed.items
      : (Array.isArray(parsed) ? parsed : []);

  return {
    foods: source.map((food, idx) => ({
      food_name: String(food?.food_name || food?.name || food?.item || `Food ${idx + 1}`),
      serving_qty: toPositiveNumber(food?.serving_qty, 1),
      serving_unit: String(food?.serving_unit || 'serving'),
      nf_calories: toPositiveNumber(food?.nf_calories ?? food?.calories, 0),
      nf_protein: toPositiveNumber(food?.nf_protein ?? food?.protein, 0),
      nf_total_carbohydrate: toPositiveNumber(food?.nf_total_carbohydrate ?? food?.carbs, 0),
      nf_total_fat: toPositiveNumber(food?.nf_total_fat ?? food?.fat, 0),
    })),
  };
}

function normalizeExerciseResponse(parsed) {
  const source = Array.isArray(parsed?.exercises)
    ? parsed.exercises
    : Array.isArray(parsed?.items)
      ? parsed.items
      : (Array.isArray(parsed) ? parsed : []);

  return {
    exercises: source.map((exercise, idx) => ({
      name: String(exercise?.name || exercise?.activity || `Exercise ${idx + 1}`).toLowerCase(),
      duration_min: toPositiveNumber(exercise?.duration_min ?? exercise?.duration, 0),
      nf_calories: toPositiveNumber(exercise?.nf_calories ?? exercise?.calories, 0),
    })),
  };
}

function buildMessages(endpoint, query) {
  if (endpoint === 'nutrients') {
    return [
      {
        role: 'system',
        content:
          'Extract foods from the input and return strict JSON only. Format: {"foods":[{"food_name":"string","serving_qty":number,"serving_unit":"string","nf_calories":number,"nf_protein":number,"nf_total_carbohydrate":number,"nf_total_fat":number}]}. Use realistic nutrition estimates. No markdown.',
      },
      { role: 'user', content: query },
    ];
  }

  return [
    {
      role: 'system',
      content:
        'Extract exercises from the input and return strict JSON only. Format: {"exercises":[{"name":"string","duration_min":number,"nf_calories":number}]}. Use realistic calorie burn estimates. No markdown.',
    },
    { role: 'user', content: query },
  ];
}

async function handleNaturalLanguage(req, res) {
  const { endpoint } = req.params;
  const { query } = req.body || {};

  if (!VALID_ENDPOINTS.has(endpoint)) {
    return res.status(400).json({ message: 'Endpoint must be "nutrients" or "exercise"' });
  }
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Missing "query" string in body' });
  }
  if (!GPT_20B_API_KEY) {
    return res.status(500).json({ message: 'GPT_20B_API_KEY is not configured on server' });
  }

  try {
    const upstream = await fetch(`${GPT_20B_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GPT_20B_API_KEY}`,
      },
      body: JSON.stringify({
        model: GPT_20B_MODEL,
        temperature: 0.1,
        messages: buildMessages(endpoint, query),
      }),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({ message: data?.error?.message || 'GPT 20B API error', data });
    }

    const modelText = getModelText(data);
    const parsed = safeJsonParse(modelText);
    if (!parsed) {
      return res.status(502).json({ message: 'Could not parse JSON output from GPT 20B', raw: modelText || null });
    }

    const normalized = endpoint === 'nutrients'
      ? normalizeFoodResponse(parsed)
      : normalizeExerciseResponse(parsed);
    return res.json(normalized);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Proxy error' });
  }
}

// Keep old path name for frontend compatibility.
app.post('/api/nx/natural/:endpoint', handleNaturalLanguage);
// Optional clearer alias.
app.post('/api/gpt/natural/:endpoint', handleNaturalLanguage);

// Serve index.html with optional AdSense injection.
app.get('/', (req, res) => {
  const htmlPath = path.join(process.cwd(), 'patched_index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  const allowAds = ADSENSE_CLIENT && hostAllowed(req);
  if (allowAds) {
    html = html.replace(/__ADSENSE_CLIENT__/g, ADSENSE_CLIENT);
    html = html.replace(/__ADSENSE_SLOT_1__/g, ADSENSE_SLOTS[0] || '');
    html = html.replace(
      '<!-- SERVER_INJECT:ADSENSE_SCRIPT -->',
      `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>`
    );
  } else {
    html = html.replace('<!-- SERVER_INJECT:ADSENSE_SCRIPT -->', '');
    html = html.replace(/__ADSENSE_CLIENT__/g, '');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

const port = Number(process.env.PORT || 5174);
app.listen(port, () => console.log(`BalanceFit server running at http://localhost:${port}`));
