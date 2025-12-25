# Gmail Email Setup Complete ✅

I've updated your email function to use Gmail SMTP instead of Resend.

## What I Changed

✅ Replaced Resend API with Gmail SMTP (denomailer)
✅ Uses your existing Gmail credentials from `.env`
✅ Same beautiful HTML email template

## To Deploy (Manual Steps Required)

Since Supabase Edge Functions need to be deployed from their dashboard or CLI with proper authentication, here's what you need to do:

### Option 1: Deploy via Supabase Dashboard (Easiest)

1. Go to https://supabase.com/dashboard/project/rucygmkwvmkzbxydoglm/functions
2. Click on `send-order-email` function
3. Copy the code from `supabase/functions/send-order-email/index.ts`
4. Paste it in the editor and click "Deploy"
5. Go to **Settings** → **Edge Functions** → **Manage secrets**
6. Add these secrets:
   - `GMAIL_USER` = `petyaiscute@gmail.com`
   - `GMAIL_APP_PASSWORD` = `bfmeghukdikgetkp`

### Option 2: Deploy via CLI

```bash
# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref rucygmkwvmkzbxydoglm

# Set secrets
npx supabase secrets set GMAIL_USER="petyaiscute@gmail.com"
npx supabase secrets set GMAIL_APP_PASSWORD="bfmeghukdikgetkp"

# Deploy function
npx supabase functions deploy send-order-email
```

## Test After Deployment

Make a test purchase on your site and check:
1. Order appears in Discord (if webhook configured)
2. Email arrives in customer's inbox
3. Order shows in `/orders` bot command

## Current Status

- ✅ Code updated to use Gmail
- ⏳ Needs deployment to Supabase
- ⏳ Needs secrets configured in Supabase dashboard

Once deployed, emails will be sent automatically when orders are completed via the MoneyMotion webhook!
