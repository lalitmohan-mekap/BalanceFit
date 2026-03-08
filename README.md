# BalanceFit

BalanceFit is a daily nutrition and workout tracker with:
- AI-based natural-language parsing for food and exercise
- Macro and calorie tracking
- Daily goals
- History calendar
- Light/Dark theme toggle
- Responsive UI with animated background

The app uses a backend proxy so your API key stays on the server.

## Live Demo

https://balancefit-api.onrender.com/

## Latest Updates

- Replaced Nutritionix flow with GPT-compatible API parsing
- Added dark mode toggle and saved theme preference
- Redesigned UI (paper/blue theme + animated background)
- Improved mobile layout and input/button alignment
- Improved calendar visibility/contrast in dark mode
- Removed in-page advertising blocks

## Tech Stack

- Frontend: HTML, Tailwind CDN, vanilla JavaScript
- Backend: Node.js + Express
- AI API: GPT-compatible chat completions endpoint

## Environment Variables

Create a `.env` file in the project root:

```env
GPT_20B_API_KEY=
GPT_20B_MODEL=openai/gpt-oss-20b
GPT_20B_API_BASE_URL=https://openrouter.ai/api/v1

PORT=5174
NODE_ENV=development
```

Optional (only needed if you later re-enable host-based controls):

```env
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Run Locally

```bash
npm install
npm start
```

Open: `http://localhost:5174`

## API Routes Used by Frontend

- `POST /api/gpt/natural/nutrients`
- `POST /api/gpt/natural/exercise`

Backward-compatible alias also exists:

- `POST /api/nx/natural/:endpoint`

## Notes

- If the server says `GPT_20B_API_KEY is not configured`, add your key in `.env`.
- If startup fails with `EADDRINUSE`, port `5174` is already in use. Stop the existing process or change `PORT` in `.env`.
