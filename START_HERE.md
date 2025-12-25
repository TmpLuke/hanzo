# Hanzo Marketplace - Quick Start

## Running the Application

You need to run TWO servers:

### 1. Frontend (Vite Dev Server)
```bash
npm run dev
```
This runs on port 8080

### 2. Email API Server
```bash
npm run dev:api
```
This runs on port 3001

## For Local Payment Testing

Use ngrok to expose your local server:
```bash
ngrok http 8080
```

Then update `.env` with your ngrok URL:
```
VITE_SITE_URL="https://your-ngrok-url.ngrok-free.app"
```

And update `vite.config.ts` to allow the ngrok host.

## Environment Variables

All configured in `.env`:
- Supabase credentials
- MoneyMotion API key
- Discord webhook URL
- Gmail SMTP credentials
- Site URL for payments

## Features

✅ Products with variants (database-driven)
✅ MoneyMotion payment integration
✅ Discord notifications on purchase
✅ Gmail SMTP email confirmations with Hanzo branding
✅ Admin dashboard with real data
✅ Full CRUD on products from admin panel
