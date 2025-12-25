# 🚀 Complete Deployment Guide for hanzocheats.com

## ✅ What's Been Configured

Your Hanzo Marketplace is now fully configured for **hanzocheats.com** with:

- ✅ Domain set to `https://hanzocheats.com`
- ✅ MoneyMotion payment integration
- ✅ Webhook handling with session verification
- ✅ Email notifications via Gmail SMTP
- ✅ Discord webhook notifications
- ✅ Admin login portal with secure credentials
- ✅ Complete order flow (checkout → payment → success → email → Discord)

---

## 📋 Pre-Deployment Checklist

### 1. Domain Setup
- [ ] Point `hanzocheats.com` to your hosting provider
- [ ] Ensure SSL certificate is installed (HTTPS required for MoneyMotion)
- [ ] Configure DNS A/CNAME records
- [ ] Test domain accessibility

### 2. Environment Variables (.env)
Your `.env` file is configured with:

```env
# Supabase
VITE_SUPABASE_PROJECT_ID="rucygmkwvmkzbxydoglm"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://rucygmkwvmkzbxydoglm.supabase.co"

# Discord
VITE_DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."

# MoneyMotion
VITE_MONEYMOTION_API_KEY="mk_live_A5CFqwvkmkX5GKPO2tE5ibjLCfjUGLnz"
MONEYMOTION_WEBHOOK_SECRET="b536135dfcb113f13cc34618003d20116f35fb8f7b5f1a6681dc77b281f27482"
VITE_SITE_URL="https://hanzocheats.com"

# Gmail SMTP
GMAIL_USER="petyaiscute@gmail.com"
GMAIL_APP_PASSWORD="bfmeghukdikgetkp"

# API
VITE_API_URL="https://hanzocheats.com"
```

**⚠️ IMPORTANT:** Never commit `.env` to public repositories!

### 3. MoneyMotion Configuration

#### A. Webhook URL Setup
1. Log into your MoneyMotion dashboard
2. Navigate to **Settings → Webhooks**
3. Add webhook URL: `https://hanzocheats.com/functions/v1/moneymotion-webhook`
4. Select event: `checkout_session:complete`
5. Copy your webhook secret (already in .env)

#### B. API Key
- Your live API key is already configured: `mk_live_A5CFqwvkmkX5GKPO2tE5ibjLCfjUGLnz`
- Keep this secure and never expose it client-side

#### C. Redirect URLs
MoneyMotion will redirect to:
- **Success:** `https://hanzocheats.com/checkout/success?order_id={ORDER_ID}`
- **Cancel:** `https://hanzocheats.com/checkout/cancel?order_id={ORDER_ID}`
- **Failure:** `https://hanzocheats.com/checkout/failure?order_id={ORDER_ID}`

---

## 🔄 Complete Payment Flow

### Step-by-Step Process

1. **Customer Selects Product**
   - Browses products on hanzocheats.com
   - Selects variant and clicks "Buy Now"

2. **Checkout Initiated**
   - Customer enters email and name
   - Order created in database with status: `pending`
   - MoneyMotion checkout session created
   - Customer redirected to MoneyMotion payment page

3. **Payment Processing**
   - Customer completes payment on MoneyMotion
   - MoneyMotion processes the transaction

4. **Webhook Received** ✨
   - MoneyMotion sends webhook to your server
   - Webhook verifies signature (HMAC SHA-512)
   - Webhook verifies session status via API
   - Order status updated to `completed`

5. **Notifications Sent** 📧
   - **Discord:** Notification sent to your Discord channel
   - **Email:** Confirmation email sent to customer
   - **Success Page:** Customer redirected to success page

6. **Customer Receives**
   - Email with order details
   - Instructions to claim product via Discord ticket
   - Order number for reference

---

## 🛠️ Deployment Steps

### Option 1: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# Go to: Project Settings → Environment Variables
# Add all variables from .env file
```

### Option 2: Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
```

### Option 3: Deploy to Your Own Server

```bash
# Build the project
npm run build

# Upload dist/ folder to your server
# Configure nginx/apache to serve the files
# Set up SSL certificate (Let's Encrypt)
# Configure environment variables on server
```

---

## 🔧 Server Configuration

### Nginx Configuration Example

```nginx
server {
    listen 443 ssl http2;
    server_name hanzocheats.com www.hanzocheats.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    root /var/www/hanzocheats/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy for email server
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📧 Email Server Setup

Your email server needs to run alongside your main app:

```bash
# Start email server
node server.js

# Or use PM2 for production
pm2 start server.js --name "hanzo-email-server"
pm2 save
pm2 startup
```

---

## 🧪 Testing the Complete Flow

### 1. Test MoneyMotion Integration

```bash
# Run the test script
node test-moneymotion.js
```

### 2. Test Email Sending

```bash
# Test Gmail SMTP
node test-gmail-smtp.mjs
```

### 3. Test Webhook

```bash
# Use ngrok for local testing
ngrok http 8080

# Update VITE_SITE_URL in .env to ngrok URL
# Make a test purchase
# Check webhook logs in Supabase
```

### 4. End-to-End Test

1. Go to `https://hanzocheats.com/products`
2. Select a product
3. Click "Buy Now"
4. Enter test email
5. Complete payment on MoneyMotion
6. Verify:
   - [ ] Redirected to success page
   - [ ] Email received
   - [ ] Discord notification sent
   - [ ] Order marked as completed in database

---

## 🔐 Admin Portal

### Access Admin Dashboard

1. Navigate to: `https://hanzocheats.com/admin/login`
2. Login with credentials:
   - **Username:** `AdminPortal`
   - **Password:** `Hnz0!2024$Scr3t#Adm1n@P0rt4l*9X7z`

### Admin Features

- View all orders
- Manage products
- Create/edit coupons
- Manage licenses
- Configure settings
- View analytics

---

## 🚨 Troubleshooting

### Payment Not Completing

1. Check MoneyMotion webhook logs
2. Verify webhook URL is correct
3. Check webhook secret matches
4. Ensure HTTPS is enabled
5. Check Supabase function logs

### Email Not Sending

1. Verify Gmail credentials
2. Check app password is correct
3. Ensure email server is running
4. Check server logs: `pm2 logs hanzo-email-server`

### Discord Notification Not Sending

1. Verify webhook URL in .env
2. Test webhook URL manually
3. Check Discord server permissions

### Orders Stuck in Pending

1. Check webhook is receiving events
2. Verify signature validation
3. Check database permissions
4. Review Supabase logs

---

## 📊 Monitoring

### Check Logs

```bash
# Supabase function logs
# Go to: Supabase Dashboard → Edge Functions → moneymotion-webhook → Logs

# Email server logs
pm2 logs hanzo-email-server

# Application logs
pm2 logs hanzo-app
```

### Monitor Orders

- Admin dashboard: `https://hanzocheats.com/admin/orders`
- Supabase dashboard: Orders table
- Discord channel: Real-time notifications

---

## 🔒 Security Checklist

- [ ] SSL certificate installed and valid
- [ ] Environment variables secured
- [ ] Webhook signature verification enabled
- [ ] Admin portal password is strong
- [ ] Database RLS policies configured
- [ ] API keys not exposed in client code
- [ ] CORS properly configured
- [ ] Rate limiting enabled

---

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review error logs
3. Test individual components
4. Contact MoneyMotion support for payment issues
5. Check Supabase documentation for database issues

---

## ✅ Final Checklist

Before going live:

- [ ] Domain pointing to correct server
- [ ] SSL certificate active
- [ ] All environment variables set
- [ ] MoneyMotion webhook configured
- [ ] Email server running
- [ ] Discord webhook tested
- [ ] Test purchase completed successfully
- [ ] Admin portal accessible
- [ ] All notifications working
- [ ] Database backups configured

---

**🎉 Your hanzocheats.com marketplace is ready to go live!**

**Domain:** https://hanzocheats.com  
**Admin:** https://hanzocheats.com/admin/login  
**Support:** petyaiscute@gmail.com
