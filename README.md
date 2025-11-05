# 🧘‍♂️ BalanceFit — Smart Nutrition & Fitness Tracker

**BalanceFit** is a responsive web app that helps users track daily nutrition, calories, macros, and goals automatically.  
It integrates with the **Nutritionix API** via a secure backend proxy — ensuring all API keys remain hidden — and is optimized for both desktop and mobile users.

🌐 **Live Website:** [https://balancefit-api.onrender.com](https://balancefit-api.onrender.com)

---

## 🚀 Features

- 📱 **Fully Responsive UI** — Works on all devices (phones, tablets, desktops).
- ⚡ **Automatic Macro Tracking** — Calculates calories, proteins, carbs, and fats instantly.
- 🎯 **Goal Tracker** — Visual goal bars that reset daily.
- 🔒 **Secure API Proxy** — Keeps API keys safe on the backend.
- 💰 **Google AdSense Integration** — Ads are styled and placed per Google’s guidelines.
- 🧠 **Smart Data Handling** — Prevents key exposure and ensures clean Nutritionix API requests.
- 🛡️ **Security Hardened** — Helmet, rate limiting, HTTPS enforcement, and controlled CORS access.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js (Express.js) |
| API | Nutritionix API |
| Hosting | Render (Web Service) |
| Security | Helmet, Rate Limiter, HTTPS, CORS |
| Environment | `.env` for secret API keys and config |

---

## ⚙️ Local Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<lalitmohan-mekap>/balancefit.git
cd balancefit

---

## 🧱 API Architecture

           ┌─────────────────────┐
        │     User Device     │
        │  (Browser / Phone)  │
        └─────────┬───────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  BalanceFit Frontend│
        │   (HTML, JS, CSS)   │
        └─────────┬───────────┘
                  │  Fetches data securely
                  ▼
        ┌─────────────────────┐
        │ BalanceFit Backend  │
        │ (Express + Helmet)  │
        │   • Uses env vars   │
        │   • Calls Nutritionix│
        │   • Hides API keys  │
        └─────────┬───────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  Nutritionix API    │
        │ (External Provider) │
        └─────────────────────┘

**
🧠 This structure ensures your API credentials are never visible to the frontend or end users.
All API calls go through your secure Express proxy hosted on Render.




