# 🚀 Quick Start: Redemption System

## What You Get

✅ Customers receive unique codes in their order emails
✅ They redeem codes in Discord to get customer role
✅ Beautiful embed with button interface
✅ All redemptions logged automatically
✅ Staff can look up invoices with `/invoice`

## 3-Minute Setup

### Step 1: Apply Database Migration (30 seconds)

**Option A - Automatic:**
```bash
node apply-redemption-migration.js
```

**Option B - Manual:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20251225000009_add_redemption_codes.sql`
3. Paste and click "Run"

### Step 2: Discord Setup (1 minute)

**Create Customer Role:**
1. Discord Server Settings → Roles → Create Role
2. Name it "Customer" (or whatever you want)
3. Set color and permissions
4. Right-click role → Copy Role ID

**Create Logs Channel:**
1. Create channel `#redeem-logs`
2. Make it admin-only
3. Right-click channel → Copy Channel ID

### Step 3: Update Railway (1 minute)

1. Go to Railway dashboard
2. Click your bot service
3. Go to Variables tab
4. Add these two variables:
   ```
   CUSTOMER_ROLE_ID=paste_role_id_here
   REDEEM_LOGS_CHANNEL_ID=paste_channel_id_here
   ```
5. Click "Deploy" (bot will restart)

### Step 4: Test It! (30 seconds)

1. Make a test purchase on your site
2. Check email for redemption code
3. Go to Discord and run `/redeem`
4. Click button and enter code
5. You should get the customer role!
6. Check `#redeem-logs` for the log

## Commands

### `/redeem`
Shows embed with button → User clicks → Enters code → Gets role

### `/invoice <query>`
Look up orders by:
- Order number: `/invoice HNZ-12345`
- Email: `/invoice customer@email.com`
- Discord user: `/invoice @username`

## How It Works

```
Purchase → Email with Code → Discord /redeem → Enter Code → Get Role
                                                              ↓
                                                    Log to #redeem-logs
```

## Email Preview

Your customers will see this in their order confirmation:

```
┌─────────────────────────────────────┐
│  🎫 Redeem Your Customer Role       │
│                                     │
│  Join Discord and use /redeem       │
│  with your code below!              │
│                                     │
│  Your Redemption Code:              │
│  ┌─────────────────────────────┐   │
│  │     ABCD-EFGH-JKLM          │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Join Discord & Redeem Button]    │
└─────────────────────────────────────┘
```

## Security

✅ Each code can only be used once
✅ Codes are 12 characters (36^12 combinations)
✅ All redemptions tracked with user ID and timestamp
✅ Logs show who redeemed what and when

## Troubleshooting

**Bot doesn't respond to /redeem:**
- Check bot is online
- Run `node deploy-commands.js` in bot folder
- Check Railway logs

**Role not assigned:**
- Verify CUSTOMER_ROLE_ID is correct
- Bot needs "Manage Roles" permission
- Bot's role must be higher than customer role

**Code says invalid:**
- Check migration ran successfully
- Verify order status is "completed"
- Check Supabase credentials

## That's It!

Your redemption system is live! Customers can now redeem their codes and get their roles automatically.

**Need more details?** See `REDEMPTION_SYSTEM_SETUP.md`
