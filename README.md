<p align="center">
  <img src="frontend/public/logo.svg" alt="OneSeven 17 logo" width="80" />
</p>

# OneSeven 17 — Full-Stack MERN E-Commerce

A complete e-commerce site for selling Borkha / Abaya / Modest wear online, built with **MongoDB, Express, React (Vite), and Node.js**.

## Features

- **Branding**: OneSeven 17 logo and identity applied across navbar, footer, and favicon
- **Auth**: signup, login, JWT-protected routes, persisted sessions
- **Homepage**: hero banner, auto-rotating image carousel of featured borkha, product grid, contact info in footer
- **Product browse**: list, category filters, search, detail view with size/quantity selection
- **Cart**: add to cart (works for guests via localStorage; merges to DB on login), update quantity, remove items
- **Checkout**: shipping form, payment method (COD / bKash / Card), server-side price recompute, stock decrement
- **Orders**: order history, order detail, mark paid endpoint
- **Admin role** (seeded): create/update/delete products, view all orders

## Project Structure

```
oneseven17-ecommerce/
├── backend/        Express + Mongoose REST API
└── frontend/       React (Vite) SPA
```

## Prerequisites

- Node.js 18+
- MongoDB running locally OR a MongoDB Atlas connection string

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env       # then edit values
npm run seed             
npm run dev                
```

Default seeded admin:
- Email: `admin@oneseven17.com`
- Password: `admin123`

### 2. Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev                # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend at `http://localhost:5000`, so no extra config is needed.

## Environment Variables (backend/.env)

| Var | Description |
|---|---|
| `PORT` | API port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `CLIENT_URL` | Frontend URL for CORS (default `http://localhost:5173`) |

## API Endpoints

### Auth
- `POST /api/auth/signup` — register
- `POST /api/auth/login` — login
- `GET /api/auth/me` — current user (protected)

### Products
- `GET /api/products?search=&category=&featured=` — list
- `GET /api/products/:id` — single product
- `POST /api/products` — create (admin)
- `PUT /api/products/:id` — update (admin)
- `DELETE /api/products/:id` — delete (admin)

### Cart (all protected)
- `GET /api/cart` — get cart
- `POST /api/cart` — `{ productId, quantity }`
- `PUT /api/cart/:productId` — update quantity
- `DELETE /api/cart/:productId` — remove
- `DELETE /api/cart` — clear

### Orders (all protected)
- `POST /api/orders` — place order
- `GET /api/orders/my` — my orders
- `GET /api/orders/:id` — order detail
- `PUT /api/orders/:id/pay` — mark paid
- `GET /api/orders` — all (admin)

## Notes

- **Pricing safety**: order totals are recalculated on the server from the DB to prevent client tampering.
- **Stock**: decremented on order placement; orders fail if any item is out of stock.
- **Currency** is Bangladeshi Taka (৳). Change in `frontend` files if needed.
- **Images** in seed are Unsplash URLs — replace with your own product photos.
- **Logo**: `frontend/public/logo.svg` — swap this file to change the brand mark app-wide (navbar, footer, favicon).

## Production Deployment (Frontend on Vercel, Backend on Render)

Vercel is built for static sites and serverless functions, so it's a great fit for the Vite frontend. The Express/MongoDB backend is a persistent server, so it's deployed separately to Render (Railway or Heroku work the same way).

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
```

Create a new GitHub repo and push this project to it — both Vercel and Render deploy directly from a Git repo.

### 2. Deploy the backend to Render

1. Go to [render.com](https://render.com) → **New** → **Web Service** → connect your GitHub repo.
2. Set **Root Directory** to `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables (same as `backend/.env.example`): `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`, and `CLIENT_URL` (you'll fill this in after step 3, once you have the Vercel URL).
5. Deploy. Note the resulting URL, e.g. `https://oneseven17-backend.onrender.com`.
6. In MongoDB Atlas, whitelist Render's outbound IPs (or `0.0.0.0/0` for simplicity) under **Network Access**.

### 3. Deploy the frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the same GitHub repo.
2. Set **Root Directory** to `frontend` (Vercel auto-detects the Vite framework).
3. Add environment variable `VITE_API_URL` = `https://oneseven17-backend.onrender.com/api` (your Render URL + `/api`).
4. Deploy. Vercel gives you a live URL, e.g. `https://oneseven17.vercel.app`.

### 4. Connect the two

Go back to Render → your backend service → environment variables → set `CLIENT_URL` to your Vercel URL (e.g. `https://oneseven17.vercel.app`) so CORS allows requests from the live frontend. Redeploy the backend for it to take effect.

### Notes

- `frontend/vercel.json` adds a SPA rewrite so client-side routes (e.g. `/products/123`) don't 404 on refresh.
- `frontend/src/api/axios.js` uses `VITE_API_URL` in production and falls back to the local dev proxy (`/api`) otherwise — no other code changes needed.
- Render's free tier spins down after inactivity, so the first request after idle time may take ~30s to wake up.

## License
MIT
