# 🤸‍♂️ BalanceFit — Smart Nutrition & Fitness Tracker

**BalanceFit** is a web app that helps users track daily nutrition, calories, macros, and goals automatically.
It integrates with the **Nutritionix API** via a secure backend proxy — ensuring all API keys remain hidden — and is optimised for both desktop and mobile users.

🌐 **Live Website:** [https://balancefit-api.onrender.com](https://balancefit-api.onrender.com)

---

## 🚀 Features

* 📱 **Fully Responsive UI** — Works on all devices (phones, tablets, desktops).
* ⚡ **Automatic Macro Tracking** — Calculates calories, proteins, carbs, and fats instantly.
* 🎯 **Goal Tracker** — Visual goal bars that reset daily.
* 🔒 **Secure API Proxy** — Keeps API keys safe on the backend.
* 💰 **Google AdSense Integration** — Ads are styled and placed per Google’s guidelines.
* 🧠 **Smart Data Handling** — Prevents key exposure and ensures clean Nutritionix API requests.
* 🛡️ **Security Hardened** — Helmet, rate limiting, HTTPS enforcement, and controlled CORS access.

---

## 🧬 Tech Stack

| Layer       | Technology                            |
| ----------- | ------------------------------------- |
| Frontend    | HTML5, CSS3, JavaScript               |
| Backend     | Node.js (Express.js)                  |
| API         | Nutritionix API                       |
| Hosting     | Render (Web Service)                  |
| Security    | Helmet, Rate Limiter, HTTPS, CORS     |
| Environment | `.env` for secret API keys and config |

---

## ⚙️ Local Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/balancefit.git
cd balancefit
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create an `.env` File

Inside the project root, create a `.env` file with the following values:

```env
NUTRITIONIX_APP_ID=your_app_id
NUTRITIONIX_APP_KEY=your_app_key
ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
ADSENSE_SLOTS=1234567890
ALLOWED_HOSTS=localhost,127.0.0.1
NODE_ENV=development
```

> ⚠️ **Important:** Never commit your `.env` file to GitHub.
> Keep it private and use Render’s environment variable settings for production.

### 4️⃣ Start the Server

```bash
npm start
```

Then visit [http://localhost:3000](http://localhost:3000) to run the app locally.

---


## 🧱 API Architecture

```text
        ┌───────────────────────┐
        │     User Device     │
        │  (Browser / Phone)  │
        └───────┬───────┘
                  │
                  ▼
        ┌───────────────────────┐
        │  BalanceFit Frontend│
        │   (HTML, JS, CSS)   │
        └───────┬───────┘
                  │  Fetches data securely
                  ▼
        ┌───────────────────────┐
        │ BalanceFit Backend  │
        │ (Express + Helmet)  │
        │   • Uses env vars   │
        │   • Calls Nutritionix│
        │   • Hides API keys  │
        └───────┬───────┘
                  │
                  ▼
        ┌───────────────────────┐
        │  Nutritionix API    │
        │ (External Provider) │
        └───────────────────────┘
```

> 🧠 This structure ensures your API credentials are **never visible** to the frontend or end users.
> All API calls go through your secure Express proxy hosted on Render.

---

## 🧯 Future Enhancements

* 🥗 Personalized meal and macro recommendations
* 📊 Weekly nutrition analytics
* 🔐 User login and profiles
* 🤘 Integration with fitness trackers (Fitbit, Strava, etc.)

---

## 🧾 License

This project is licensed under the **MIT License**.
You’re free to use, modify, and distribute it with attribution.

---

## 👨‍💻 Author

**BalanceFit**
Developed by **[Lalit MOhan Mekap]**
🔗 GitHub: [@lalitmohan-mekap](https://github.com/lalitmohan-mekap)
🌐 Live Demo: [https://balancefit-api.onrender.com](https://balancefit-api.onrender.com)

---

### 🤸 Stay Fit. Stay Balanced. — *BalanceFit*
