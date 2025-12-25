# 🚂 Add These to Railway NOW

## Quick Steps:

1. Go to: https://railway.app
2. Click your **hanzo-order-bot** service
3. Click **Variables** tab
4. Click **+ New Variable** (or RAW Editor)
5. Add these TWO variables:

```
CUSTOMER_ROLE_ID=1453498268402192443
REDEEM_LOGS_CHANNEL_ID=1453498309929865279
```

6. Click **Deploy** (or it will auto-deploy)

## What This Does:

- `CUSTOMER_ROLE_ID` - The role users get when they redeem
- `REDEEM_LOGS_CHANNEL_ID` - Where redemption logs are sent

## After Adding:

Railway will automatically:
1. Restart your bot
2. Load the new environment variables
3. Register the `/redeem` and `/invoice` commands
4. Commands will appear in Discord within 1-2 minutes

## Test It:

Once Railway finishes deploying (check the logs):
1. Go to Discord
2. Type `/` and you should see:
   - `/redeem` - Redeem customer role
   - `/invoice` - Look up orders (staff only)
3. Try `/redeem` to see the beautiful embed!

---

**The bot will auto-register commands on startup now, so just add the variables and wait for deployment!**
