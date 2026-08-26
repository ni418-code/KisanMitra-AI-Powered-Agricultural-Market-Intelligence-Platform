# KisanMitra Backend

A Node.js/Express + MongoDB API for your KisanMitra frontend. It covers **Phase 1–3** of a
realistic build order: authentication, the live market-price pipeline, and the core
marketplace (listings, requirements, orders, payments-simulation, notifications).

## What's already true about your project (read this first)

I reviewed your frontend repo. It's a solid, fully-built React + TypeScript app — login,
farmer dashboard, buyer dashboard, chat UI, order timeline, language switcher (English/
Telugu/Hindi/Tamil/Marathi already wired up in `LanguageContext.tsx`) — but **every piece of
data currently lives in `localStorage` and mock files** (`AuthContext.tsx`, `data/mock*.ts`).
Nothing calls a server yet.

Everything you asked for — real payments, live government data, AI voice in five languages,
turn-by-turn maps, escrow, fraud detection — is realistically **a multi-week build**, not one
message. Trying to fake all of it at once in one huge file dump would give you code you can't
debug or explain in a demo. So I built the **foundation** for real, matching your existing
frontend's data shapes exactly, and left clear seams for the rest. Tell me which piece you
want next and I'll build that one properly.

## What's included right now

| Feature                                                          | Status                                                                                                      |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Phone + OTP login/registration, JWT sessions                     | ✅ Working (OTP prints to your terminal in dev — swap for a real SMS provider later)                        |
| MongoDB models matching your frontend's TypeScript types exactly | ✅ `User`, `CropMaster`, `FarmerListing`, `BuyerRequirement`, `Order`, `Notification`, `MarketPrice`        |
| Live market-price sync from data.gov.in (AGMARKNET)              | ✅ Cron job, only re-processes when the government's own date changes                                       |
| Price history for charts                                         | ✅ `/api/market/history`                                                                                    |
| Farmer listings CRUD                                             | ✅                                                                                                          |
| Buyer requirements CRUD + accept/reject                          | ✅                                                                                                          |
| Orders + status timeline + pickup details                        | ✅                                                                                                          |
| "Best market" net-profit calculator                              | ✅ Deterministic math, matches the logic from your planning notes                                           |
| Payments                                                         | ⚠️ **Simulated** (`/api/orders/:id/pay`) — real Razorpay/UPI integration is a separate next step, see below |
| Notifications                                                    | ✅ Basic feed, no push notifications yet                                                                    |
| Multilingual AI voice assistant                                  | ❌ Not started — needs speech-to-text + LLM + text-to-speech, its own phase                                 |
| Google Maps routing / live location                              | ❌ Not started — frontend needs a Maps API key, backend just needs to store lat/lng (already does)          |
| Government schemes page                                          | ❌ Not started — simple content page, can add quickly next                                                  |
| Escrow / fraud detection                                         | ❌ Not started — advanced phase                                                                             |

---

## Step 1 — Install prerequisites (one-time)

✅ 1. **Node.js** (v18 or newer): download from nodejs.org. Check it worked: `node -v`
✅ 2. **MongoDB Atlas account** (free tier is fine): sign up at mongodb.com/cloud/atlas

- Create a free cluster
- Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) while developing
- Under **Database Access**, create a user + password
- Click **Connect → Drivers**, copy the connection string — this is your `MONGODB_URI`
  ✅ 3. **data.gov.in API key** (free): register at data.gov.in → your account → "My Account" →
  copy your API key. This is your `DATA_GOV_IN_API_KEY`.

## Step 2 — Set up the project

✅ ```bash
cd kisanmitra-backend
npm install
cp .env.example .env

````

✅ Now open `.env` in a text editor and fill in:
- `MONGODB_URI` — from Atlas step above
- `JWT_SECRET` — any long random string (e.g. mash your keyboard for 40 characters)
- `DATA_GOV_IN_API_KEY` — from data.gov.in


✅ ## Step 3 — Seed starter crop data (one-time)

```bash
npm run seed
````

This creates the initial `CropMaster` entries (tomato, onion, potato, chilli, paddy) your
frontend already expects to see.

✅ ## Step 4 — Run the server

```bash
npm run dev
```

You should see:

```
MongoDB connected: <your-cluster-host>
KisanMitra API running on http://localhost:5000
Market data sync scheduled: "*/30 * * * *"
```

Test it worked: open `http://localhost:5000/api/health` in a browser — you should see
`{"status":"ok", ...}`.

## Step 5 — Connect your frontend

Your frontend currently reads everything from `AppStateContext.tsx` / `AuthContext.tsx` using
mock data and `localStorage`. To wire it to this API:

1. Add to your frontend's `.env`: `VITE_API_URL=http://localhost:5000/api`
2. Create `src/services/api.ts` with a small fetch wrapper, e.g.:

```ts
const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("km_token");
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}
```

3. Replace, one screen at a time, a mock-data read with a real call. Example — the farmer
   home screen's crop prices, instead of importing `MOCK_CROPS`:

```ts
const { crops } = await apiFetch("/market/crops");
```

4. Do the same pattern for listings (`/listings`), requirements (`/requirements`), orders
   (`/orders`), and notifications (`/notifications`). Keep `AuthContext`'s shape the same but
   have `loginWithCredentials` call `POST /auth/request-otp` then `POST /auth/verify-otp`
   instead of checking `registeredUsers` in `localStorage`.

I'd recommend doing this migration one page at a time (start with the crop price dashboard,
since it has no auth dependency) rather than rewriting the whole frontend in one sitting.

---

## Troubleshooting (what to do if something breaks)

**"MongoDB connection failed"**

- Double check the username/password in `MONGODB_URI` — special characters in the password
  need to be URL-encoded (e.g. `@` becomes `%40`).
- Confirm Atlas → Network Access allows your current IP (or `0.0.0.0/0` for dev).

**"DATA_GOV_IN_API_KEY is not set" / sync job errors**

- Make sure `.env` has a real key, not the placeholder text.
- The free data.gov.in tier rate-limits you — if you see 429 errors, slow down
  `MARKET_SYNC_CRON` (e.g. `0 */2 * * *` = every 2 hours) while testing.

**"Market sync: no new government data date since last check"**

- This is normal, not an error — AGMARKNET publishes once a day, so most sync runs will find
  nothing new. Use `POST /api/market/sync` to force a run while testing.

**Frontend gets CORS errors in the browser console**

- Make sure `CORS_ORIGIN` in the backend `.env` matches your frontend's exact URL (including
  port), e.g. `http://localhost:5173`.

**"Session expired or invalid" on API calls**

- Your JWT token expired (30-day default) or `JWT_SECRET` changed. Log in again.

**Port 5000 already in use**

- Change `PORT` in `.env`, or stop whatever else is using that port.

---

## Recommended next phases (in order)

1. **Wire the frontend to this API** (Step 5 above) — start with the crop dashboard.
2. **Government schemes page** — a static/CMS-driven content page; quick to add.
3. **Real payments** — integrate Razorpay or a UPI deep-link; the `paymentDetails.breakdown`
   fields already model this, only `simulatePayment` needs replacing.
4. **Maps** — add a Google Maps or Mapbox API key to the frontend, and compute real
   `distanceKm` server-side via the Directions/Distance Matrix API instead of the placeholder
   values you pass in manually today.
5. **Multilingual AI voice assistant** — speech-to-text → LLM (with function-calling into
   these same APIs) → text-to-speech. This is its own backend service; happy to scaffold it
   once the core marketplace is working end-to-end.
6. **Buyer reliability scoring, fraud flags, escrow** — build once you have real order volume
   to score against.

Tell me which one to build next and I'll do that piece properly rather than stub it.
