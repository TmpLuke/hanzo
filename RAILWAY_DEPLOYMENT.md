# Deploy Discord Bot to Railway 🚂

Your bot will run 24/7 on Railway's free tier (500 hours/month = always on).

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (easiest)
3. Verify your email

## Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. If this is your first time:
   - Click "Configure GitHub App"
   - Give Railway access to your repository
4. Select your repository
5. Railway will detect it's a Node.js project

## Step 3: Configure Root Directory

Since your bot is in the `bot/` folder:

1. In Railway dashboard, click on your service
2. Go to **Settings** tab
3. Find "Root Directory"
4. Set it to: `bot`
5. Click "Update"

## Step 4: Set Environment Variables

1. Go to **Variables** tab
2. Click "Add Variable" and add these (get values from your bot/.env file):

```
DISCORD_BOT_TOKEN=<your_bot_token>
DISCORD_CLIENT_ID=<your_client_id>
VITE_SUPABASE_URL=https://rucygmkwvmkzbxydoglm.supabase.co
VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

**OR** use "Raw Editor" and paste your values from `bot/.env`

## Step 5: Deploy

1. Railway will automatically deploy
2. Watch the logs in the **Deployments** tab
3. You should see:
   ```
   ✅ Loaded command: help
   ✅ Loaded command: order
   ✅ Loaded command: orders
   ✅ Loaded command: ping
   ✅ Loaded command: product
   ✅ Loaded command: products
   ✅ Loaded command: stats
   ✅ Loaded command: updateorder
   ✅ Bot is online as Hanzo orders#8257
   📊 Serving 1 servers
   ```

## Step 6: Verify It's Working

1. Go to your Discord server
2. Type `/ping` - bot should respond
3. Type `/stats` - should show your store stats
4. Type `/products` - should list your products

## ✅ What You Get:

- 🟢 Bot runs 24/7 automatically
- 🔄 Auto-restarts if it crashes
- 📊 Connected to your Supabase database
- 💯 100% accurate data (same database as website)
- 🆓 Free (500 hours/month = always on)
- 📈 Auto-deploys when you push to GitHub

## Troubleshooting:

**Bot not starting?**
- Check logs in Railway dashboard
- Verify environment variables are set
- Make sure Root Directory is set to `bot`

**Commands not working?**
- Make sure you ran `npm run deploy` locally first to register commands
- Commands are registered globally, so they work from Railway too

**Need to update bot?**
- Just push to GitHub
- Railway auto-deploys
- Bot restarts with new code

## Stop Local Bot:

Once Railway is running, you can stop your local bot:
- The Railway bot will take over
- Same commands, same data
- Just hosted in the cloud instead of your PC

---

**Your bot will be 100% connected to your Supabase database and always accurate!**
