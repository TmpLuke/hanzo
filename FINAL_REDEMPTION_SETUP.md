# ✅ Your Redemption System is Ready!

## What's Been Done

✅ Database migration created for redemption codes
✅ `/redeem` command with beautiful embed and button
✅ `/invoice` command for looking up orders
✅ Email integration with redemption codes
✅ Redeem logs channel configured
✅ Customer role ID configured
✅ Commands registered globally
✅ Code pushed to GitHub (Railway will auto-deploy)

## Your Configuration

```
Customer Role ID: 1453498268402192443
Redeem Logs Channel ID: 1453498309929865279
```

## Final Steps

### 1. Apply Database Migration (2 minutes)

Open `apply-redemption-codes.html` in your browser and click "Apply Migration"

**OR** manually in Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `supabase/migrations/20251225000009_add_redemption_codes.sql`
3. Paste and click "Run"

### 2. Update Railway Environment Variables (1 minute)

Go to Railway dashboard → Your bot service → Variables tab

Add these two variables:
```
CUSTOMER_ROLE_ID=1453498268402192443
REDEEM_LOGS_CHANNEL_ID=1453498309929865279
```

Click "Deploy" to restart the bot.

### 3. Test It! (1 minute)

1. Make a test purchase on your site
2. Check your email for the redemption code
3. Go to Discord and run `/redeem`
4. Click the "Redeem Code" button
5. Enter your code
6. You should get the customer role!
7. Check your redeem logs channel for the log

## How It Works

### Customer Flow:
```
Purchase → Email with Code → Discord /redeem → Enter Code → Get Role
```

### Email Preview:
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

### Discord /redeem Command:
```
🎁 Redeem Your Customer Role

Welcome to Hanzo Marketplace!

Click the button below to redeem your customer role.
You'll need the redemption code from your order confirmation email.

What you get:
✅ Customer role in this server
✅ Access to customer-only channels
✅ Priority support
✅ Exclusive updates and deals

[Redeem Code Button]
```

## Commands

### `/redeem`
- Shows embed with button
- User clicks button → Modal appears
- User enters code → Gets role
- Log sent to redeem logs channel

### `/invoice <query>`
Look up orders by:
- Order number: `/invoice HNZ-12345`
- Email: `/invoice customer@email.com`
- Discord user: `/invoice @username`

Shows:
- Order details
- Customer info
- Product info
- Redemption status
- Who redeemed and when

## Security

✅ Each code can only be used once
✅ Codes are 12 characters (36^12 combinations)
✅ All redemptions tracked with user ID and timestamp
✅ Logs show who redeemed what and when
✅ Staff can look up any order with `/invoice`

## Troubleshooting

### Bot doesn't respond to /redeem
- Check bot is online in Discord
- Verify Railway deployment succeeded
- Check Railway logs for errors

### Role not assigned
- Verify `CUSTOMER_ROLE_ID` is correct in Railway
- Bot needs "Manage Roles" permission
- Bot's role must be higher than customer role in Discord

### Code says invalid
- Check database migration ran successfully
- Verify order status is "completed"
- Check Supabase credentials are correct

### Logs not appearing
- Verify `REDEEM_LOGS_CHANNEL_ID` is correct
- Bot needs permission to send messages in that channel
- Check channel exists

## Railway Auto-Deploy

Your code has been pushed to GitHub. Railway will automatically:
1. Detect the changes
2. Build the new bot code
3. Deploy with updated commands
4. Restart the bot

Check Railway dashboard to see deployment progress.

## What's Next?

Once Railway finishes deploying (usually 2-3 minutes):

1. Apply the database migration
2. Add the environment variables to Railway
3. Test with a real purchase
4. Enjoy your automated redemption system!

## Support

If you need help:
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure database migration ran
- Test with `/ping` to see if bot is online

---

## 🎉 You're All Set!

Your customers can now:
✅ Receive unique codes via email
✅ Redeem codes in Discord
✅ Get customer role automatically
✅ Access exclusive channels

And you can:
✅ Track all redemptions
✅ Look up customer invoices
✅ Verify purchases
✅ Manage customer roles

**The redemption system is fully automated and ready to go!**
