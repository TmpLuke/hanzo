# 🎫 Redemption System Setup Guide

## Overview

Your bot now has a complete role redemption system! Customers receive a unique code in their email and can redeem it in Discord to get their customer role.

## ✨ Features

✅ **Beautiful Embed & Button** - Professional redemption interface
✅ **Unique Codes** - Auto-generated 12-character codes (e.g., `ABCD-EFGH-JKLM`)
✅ **One-Time Use** - Each code can only be redeemed once for security
✅ **Email Integration** - Codes sent automatically in order confirmation emails
✅ **Role Assignment** - Automatic customer role on redemption
✅ **Redeem Logs** - All redemptions logged to a dedicated channel
✅ **Invoice Lookup** - Staff can look up orders by number, email, or Discord user

## 🚀 Setup Steps

### 1. Run Database Migration

Apply the redemption codes migration to your Supabase database:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in Supabase Dashboard
# Go to SQL Editor and run: supabase/migrations/20251225000009_add_redemption_codes.sql
```

### 2. Create Customer Role in Discord

1. Go to your Discord server settings
2. Navigate to **Roles**
3. Click **Create Role**
4. Name it "Customer" (or whatever you prefer)
5. Set permissions and color
6. **Right-click the role** → **Copy Role ID**

### 3. Create Redeem Logs Channel

1. Create a new text channel called `#redeem-logs`
2. Make it private (only admins can see)
3. **Right-click the channel** → **Copy Channel ID**

### 4. Update Railway Environment Variables

Go to your Railway bot deployment and add these variables:

```env
CUSTOMER_ROLE_ID=your_role_id_here
REDEEM_LOGS_CHANNEL_ID=your_channel_id_here
```

Click **Deploy** to restart the bot with new variables.

### 5. Register New Commands

The bot will auto-register commands on restart, but you can manually trigger it:

```bash
cd bot
node deploy-commands.js
```

## 📝 New Commands

### `/redeem`
**Usage:** `/redeem`
**Description:** Shows a beautiful embed with a "Redeem Code" button
**Who can use:** Everyone

**Flow:**
1. User runs `/redeem`
2. Bot shows embed with button
3. User clicks "Redeem Code" button
4. Modal appears asking for code
5. User enters code from email
6. Bot verifies code and assigns role
7. Success message shown
8. Log sent to redeem logs channel

### `/invoice`
**Usage:** `/invoice <query>`
**Description:** Look up invoice information
**Who can use:** Staff with "Manage Messages" permission

**Query types:**
- Order number: `/invoice HNZ-12345`
- Email: `/invoice customer@email.com`
- Discord user: `/invoice @username`

**Shows:**
- Order details (number, date, amount)
- Product information
- Customer information
- Payment details
- Redemption status
- Who redeemed and when

## 🎨 Redemption Flow

### Customer Experience:

1. **Purchase Product** → Completes checkout
2. **Receive Email** → Gets order confirmation with redemption code
3. **Join Discord** → Joins your Discord server
4. **Run /redeem** → Sees beautiful embed with button
5. **Click Button** → Modal appears
6. **Enter Code** → Types code from email
7. **Get Role** → Automatically receives customer role
8. **Access Channels** → Can now see customer-only channels

### Admin Experience:

1. **Redemption Happens** → Notification in #redeem-logs
2. **View Details** → See who redeemed, what they bought
3. **Look Up Orders** → Use `/invoice` to find customer info
4. **Verify Purchases** → Check if someone is a real customer

## 🔒 Security Features

✅ **One-Time Use** - Codes can only be redeemed once
✅ **Unique Codes** - 12-character codes with 36^12 combinations
✅ **Database Verification** - All codes verified against Supabase
✅ **Redemption Tracking** - Who redeemed, when, and from where
✅ **Audit Logs** - Complete history in redeem logs channel

## 📧 Email Template

Customers receive this in their order confirmation:

```
🎫 Redeem Your Customer Role

Join our Discord server and use the /redeem command with your code below 
to get your customer role and access exclusive channels!

Your Redemption Code:
XXXX-XXXX-XXXX

[Join Discord & Redeem Button]
```

## 🎯 Testing

### Test the Redemption System:

1. **Make a test purchase** on your site
2. **Check your email** for the redemption code
3. **Go to Discord** and run `/redeem`
4. **Click the button** and enter your code
5. **Verify you got the role**
6. **Check #redeem-logs** for the log entry

### Test Invoice Lookup:

1. Run `/invoice HNZ-12345` (your order number)
2. Verify all details are correct
3. Check redemption status

## 🎨 Customization

### Change Embed Colors

Edit `bot/commands/redeem.js`:
```javascript
.setColor('#667eea') // Change to your brand color
```

### Change Role Name

The bot uses the role ID, so you can name it anything:
- "Customer"
- "Verified"
- "Premium"
- "Member"

### Change Code Format

Edit `supabase/migrations/20251225000009_add_redemption_codes.sql`:
```sql
-- Current: XXXX-XXXX-XXXX (12 chars)
-- Modify the generate_redemption_code() function
```

## 🐛 Troubleshooting

### Bot doesn't respond to /redeem
- Check bot is online in Discord
- Verify commands are registered: `node deploy-commands.js`
- Check Railway logs for errors

### Role not assigned
- Verify `CUSTOMER_ROLE_ID` is set correctly
- Check bot has permission to manage roles
- Ensure bot's role is higher than customer role

### Code says "Invalid"
- Check database migration ran successfully
- Verify Supabase credentials in Railway
- Check order was marked as "completed"

### Logs not appearing
- Verify `REDEEM_LOGS_CHANNEL_ID` is correct
- Check bot has permission to send messages in that channel
- Ensure channel exists

## 📊 Database Schema

### `redemption_codes` table:
- `id` - UUID primary key
- `code` - Unique redemption code
- `order_id` - Links to orders table
- `order_number` - For easy reference
- `customer_email` - Customer's email
- `product_name` - What they bought
- `variant_label` - Which variant
- `discord_user_id` - Who redeemed (null if not redeemed)
- `discord_username` - Their Discord tag
- `redeemed` - Boolean flag
- `redeemed_at` - Timestamp of redemption
- `created_at` - When code was generated

## 🎉 You're All Set!

Your redemption system is now fully functional! Customers can:
- ✅ Receive unique codes via email
- ✅ Redeem codes in Discord
- ✅ Get customer role automatically
- ✅ Access exclusive channels

And you can:
- ✅ Track all redemptions
- ✅ Look up customer invoices
- ✅ Verify purchases
- ✅ Manage customer roles

**Need help?** Check the Railway logs or test with a real purchase!
