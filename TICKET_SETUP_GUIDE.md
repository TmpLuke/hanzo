# 🎫 Ticket System Setup Guide

## ✅ Current Status
Your ticket system code is **fully deployed** and working! The errors you're seeing are because Railway needs the category IDs configured.

---

## 🔧 Step 1: Set Environment Variables in Railway

Go to your Railway dashboard and add these environment variables:

1. **Go to**: Railway Dashboard → `peaceful-essence` → `hanzo-order-bot` → **Variables** tab

2. **Add these variables** (replace with your actual Discord category IDs):
   ```
   TRANSCRIPT_LOGS_CHANNEL_ID=your_transcript_channel_id
   PURCHASE_CATEGORY_ID=your_purchase_category_id
   SUPPORT_CATEGORY_ID=your_support_category_id
   HWID_CATEGORY_ID=your_hwid_category_id
   CLAIM_CATEGORY_ID=your_claim_category_id
   ```

3. **How to get category IDs**:
   - In Discord, enable Developer Mode (Settings → Advanced → Developer Mode)
   - Right-click on each category → Copy ID
   - Paste the IDs into Railway

4. **After adding variables**: Railway will automatically redeploy

---

## 🎨 Step 2: Edit Emojis (Optional)

### Ticket Panel Emojis
**File**: `bot/commands/ticket.js` (lines 24-51)

```javascript
.addOptions([
  {
    label: 'Purchase',
    emoji: '🛒'  // ← Change this emoji
  },
  {
    label: 'Support',
    emoji: '👤'  // ← Change this emoji
  },
  // ... etc
])
```

### Ticket Handler Emojis
**File**: `bot/utils/ticketHandler.js` (lines 9-32)

```javascript
const TICKET_CONFIG = {
  purchase: {
    emoji: '🛒',  // ← Change this emoji
  },
  support: {
    emoji: '👤',  // ← Change this emoji
  },
  // ... etc
}
```

After editing emojis:
1. Save the files
2. Run: `git add -A`
3. Run: `git commit -m "update emojis"`
4. Run: `git push`
5. Railway will auto-deploy

---

## 🚀 Step 3: Test the System

Once Railway redeploys with the category IDs:

1. Run `/ticket` in your Discord server
2. Click the dropdown and select a ticket type
3. Fill out the modal form
4. A ticket channel should be created in the correct category!

---

## 📋 All Available Commands

- `/ticket` - Send the ticket panel (Admin only)
- `/close` - Close the current ticket
- `/add @user` - Add a user to the ticket
- `/remove @user` - Remove a user from the ticket
- `/rename <new-name>` - Rename the ticket channel
- `/claim` - Claim a ticket (assigns you to it)

---

## ❓ Troubleshooting

**If tickets still don't work after setting variables:**
1. Go to Railway → Deployments tab
2. Click the three dots on the latest deployment
3. Click "Redeploy" to force a fresh deployment

**If you see "Invalid Form Body" errors:**
- Make sure all category IDs are valid Discord snowflake IDs (long numbers)
- Make sure the bot has permissions to create channels in those categories

---

## 🎉 You're All Set!

Your ticket system is ready to go once you add those category IDs in Railway!
