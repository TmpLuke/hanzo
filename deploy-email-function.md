# Deploy Email Function with Gmail

Your email function has been updated to use Gmail SMTP instead of Resend.

## Set Environment Variables in Supabase

You need to add your Gmail credentials to Supabase:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `rucygmkwvmkzbxydoglm`
3. Go to **Settings** → **Edge Functions** → **Secrets**
4. Add these secrets:

```
GMAIL_USER=petyaiscute@gmail.com
GMAIL_APP_PASSWORD=bfmeghukdikgetkp
```

## Deploy the Function

Run this command to deploy the updated email function:

```bash
npx supabase functions deploy send-order-email
```

Or if you have Supabase CLI installed:

```bash
supabase functions deploy send-order-email
```

## Test the Email

After deploying, test it with:

```bash
node test-gmail-smtp.mjs
```

## What Changed

- ❌ Removed Resend API dependency
- ✅ Added Gmail SMTP using denomailer
- ✅ Uses your existing Gmail credentials from .env
- ✅ Same beautiful HTML email template

The webhook will now send emails via Gmail when orders are completed!
