# ETHIO AI HUB (የኢትዮጵያ አርቲፊሻል ኢንተለጀንስ መድረክ)

Production-oriented, multi-purpose AI web platform designed for Ethiopians: students, job seekers, entrepreneurs, business owners, drivers, and daily users.

Built with **HTML5, CSS3, Vanilla JavaScript, Firebase JS SDK v10 Compat, Cloudflare Workers, Google Gemini API, and Google Translate**.

---

## 1. Complete Project Structure

```text
ethio-ai-hub/
│
├── index.html                  # Full viewport entry point with navigation & modals
├── metadata.json               # Applet identity & AI Studio capabilities
├── firestore.rules             # Production Firestore Security Rules
│
├── css/
│   ├── style.css               # Global typography, color variables, buttons & toasts
│   ├── dashboard.css           # Desktop sidebar, top header, stats & mobile bottom bar
│   ├── tools.css               # Dedicated styling for all 12 AI tools
│   ├── admin-shared.css        # Admin approval tables, badges & settings layout
│   └── responsive.css          # Mobile drawer reflow & Blogger chrome hiding
│
├── js/
│   ├── translations.js         # Centralized dictionary: Amharic, English, Afaan Oromoo
│   ├── language.js             # Locale switcher & reactive DOM binding
│   ├── firebase-config.js      # Client Firebase config & Cloudflare Worker URL
│   ├── firebase.js             # Firebase SDK v10 Compat initialization & mock fallback
│   ├── auth.js                 # Email/Password authentication & user profile creation
│   ├── api.js                  # Cloudflare Worker API client with Firebase Bearer token
│   ├── subscription.js         # Free, Premium (250 ETB), Business (600 ETB) & TeleBirr
│   ├── notifications.js        # Plan-tiered delayed notification engine
│   ├── favorites.js            # Saved chats, documents & property bookmarks
│   ├── privacy.js              # Zero-tracking Privacy Policy, Data export & Deletion
│   ├── profile.js              # User account settings, payment history & theme toggle
│   ├── dashboard.js            # Main user dashboard with stats & tool cards
│   ├── router.js               # Hash-based client router (#/login, #/dashboard, etc.)
│   ├── app.js                  # Global application lifecycle orchestrator
│   │
│   └── tools/
│       ├── ai-assistant.js     # Multilingual general AI with conversation memory
│       ├── job-finder.js       # CV builder, cover letter generator & vacancies
│       ├── education-helper.js # Ethiopian curriculum helper (Grades 5-12 & ICT)
│       ├── document-writer.js  # Official letters with Word (.doc), CSV & TXT export
│       ├── translator.js       # 100+ languages with auto-detect & swap
│       ├── business-helper.js  # Business plan generator, VAT 15% & TOT tax calculator
│       ├── home-finder.js      # Real estate marketplace, scam alert & broker reporting
│       ├── money-planner.js    # ETB expense tracker & Equb (ዕቁብ) cycle management
│       ├── health-assistant.js # Educational wellness & Ethiopian emergency hotlines
│       ├── ethio-drive.js      # Official Road Transport laws, penalties & Bolo guide
│       ├── ethio-academy.js    # Structured courses with AI Teacher & certificate
│       └── ethio-verify.js     # Bank & TeleBirr transaction verification interface
│
├── cloudflare-worker/
│   └── worker.js               # Cloudflare Worker proxy for Gemini & Translate API
│
├── blogger/
│   └── blogger-template.xml    # Ready-to-paste Blogger Theme XML
│
└── README.md                   # Complete documentation & deployment guide
```

---

## 2. Correct Loading Order

### CSS Loading Order:
1. `/css/style.css`
2. `/css/dashboard.css`
3. `/css/tools.css`
4. `/css/admin-shared.css`
5. `/css/responsive.css`

### JavaScript Loading Order:
1. `firebase-app-compat.js`
2. `firebase-auth-compat.js`
3. `firebase-firestore-compat.js`
4. `/js/translations.js`
5. `/js/language.js`
6. `/js/firebase-config.js`
7. `/js/firebase.js`
8. `/js/auth.js`
9. `/js/api.js`
10. `/js/subscription.js`
11. `/js/notifications.js`
12. `/js/favorites.js`
13. `/js/privacy.js`
14. `/js/profile.js`
15. `/js/dashboard.js`
16. All tools in `/js/tools/*.js`
17. `/js/router.js`
18. `/js/app.js`

---

## 3. Three-Language System

Supported locales:
- **Amharic (`am`)** - Default. Artificial Intelligence is always translated as **"አርቲፊሻል ኢንተለጀንስ"**.
- **English (`en`)**
- **Afaan Oromoo (`om`)**
- Brand name **ETHIO AI HUB** is never translated.

All interface strings are managed in `/js/translations.js` and bound reactively via `data-i18n` attributes.

---

## 4. Subscription & TeleBirr Manual Payment

| Plan | Price | Annual (10% Off) | Daily AI Limit | Notification Speed | Academy Access |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Free** | 0 ETB | 0 ETB | 12 chats/day | 8 hours delay | Limited |
| **Premium** | 250 ETB/mo | 2,700 ETB/yr | 50 chats/day | 1 hour delay | Discounted |
| **Business** | 600 ETB/mo | 6,480 ETB/yr | Unlimited | Instant | All Courses Free |

### TeleBirr Manual Payment Workflow:
1. User views payment instructions and transfer receiver phone number (configurable in Firestore `settings/payment`).
2. User transfers money via TeleBirr App or `*127#`.
3. User submits: Plan, Period (Monthly/Annual), Transaction ID, and Receipt screenshot.
4. Saved in `paymentRequests/{requestId}` with status `pending`.
5. Admin verifies transaction and approves payment, activating the user's subscription until `endDate`.

---

## 5. Security & Cloudflare Worker Gateway

No private API secrets (Gemini API keys, Google Translate keys) are exposed in frontend code.
Requests route to `YOUR_WORKER_URL`:
- `POST /ai`: Verifies Firebase ID Token (`Authorization: Bearer <token>`), checks daily limits, calls Gemini API (`gemini-2.5-flash`), returns response.
- `GET /languages`: Returns supported Google Translate languages.
- `POST /translate`: Translates text via Google Cloud Translation API.

### Cloudflare Worker Deployment:
1. Create a Worker named `ethio-ai-worker` in [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Copy code from `/cloudflare-worker/worker.js`.
3. Add Environment Secrets:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `GOOGLE_TRANSLATE_API_KEY`: Your Google Cloud Translation API Key.
4. Deploy and copy your worker URL (e.g., `https://ethio-ai-worker.yourname.workers.dev`).
5. Update `window.WORKER_URL` in `/js/firebase-config.js`.

---

## 6. Firebase & Firestore Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com).
2. Enable **Email/Password** under Authentication > Sign-in method.
3. Create a **Cloud Firestore** database.
4. Deploy `/firestore.rules` using the Firebase CLI:
   ```bash
   firebase deploy --only firestore:rules
   ```
5. Paste your Web App credentials into `/js/firebase-config.js`.

---

## 7. Deployment Instructions (GitHub & Blogger)

### Step A: Push to GitHub Repository
1. Initialize repository named `ethio-ai-hub` on branch `main`.
2. Commit all files and push:
   ```bash
   git init
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ethio-ai-hub.git
   git add .
   git commit -m "Launch ETHIO AI HUB v1.0"
   git push -u origin main
   ```

### Step B: Access via jsDelivr CDN
Your files will be automatically accessible worldwide:
- CSS: `https://cdn.jsdelivr.net/gh/YOUR_GITHUB_USERNAME/ethio-ai-hub@main/css/style.css`
- JS: `https://cdn.jsdelivr.net/gh/YOUR_GITHUB_USERNAME/ethio-ai-hub@main/js/app.js`

### Step C: Blogger Setup (https://ethioaiapp.blogspot.com)
1. Go to Blogger Dashboard > **Theme**.
2. Click the dropdown next to **CUSTOMIZE** and select **Edit HTML**.
3. Replace the entire code with `/blogger/blogger-template.xml` (replace `YOUR_GITHUB_USERNAME` with your actual username).
4. Save the theme.
5. In Blogger Dashboard > **Theme** > click gear icon next to Mobile > choose **Desktop** to ensure fullscreen layout on all mobile devices.
6. The app will occupy 100% of the viewport with hash-based routing!
