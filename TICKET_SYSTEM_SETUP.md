# 🎫 Ticket System Setup Guide

## Overview

Complete ticket system matching the Edner style with:
- ✅ Beautiful ticket panel with dropdown menu
- ✅ 4 ticket types: Purchase, Support, HWID Reset, Claim Role/Key
- ✅ Custom forms for each ticket type
- ✅ Automatic ticket channel creation
- ✅ HTML transcript generation
- ✅ Transcripts sent to user and logs channel
- ✅ Database tracking

## Setup Steps

### 1. Create Discord Categories

Create 4 categories in your Discord server for tickets:
1. **📦 Purchase Tickets**
2. **👤 Support Tickets**
3. **🔄 HWID Reset Tickets**
4. **⭐ Claim Role Tickets**

Right-click each category → Copy ID

### 2. Create Transcript Logs Channel

Create a channel called `#transcript-logs` (admin only)
Right-click → Copy ID

### 3. Update Environment Variables

Add these to your Railway bot service (Variables tab):

```env
TRANSCRIPT_LOGS_CHANNEL_ID=your_channel_id
PURCHASE_CATEGORY_ID=your_category_id
SUPPORT_CATEGORY_ID=your_category_id
HWID_CATEGORY_ID=your_category_id
CLAIM_CATEGORY_ID=your_category_id
```

### 4. Update Ticket Configuration

Edit `bot/utils/ticketHandler.js` and replace the category IDs:

```javascript
const TICKET_CONFIG = {
  purchase: {
    categoryId: 'YOUR_PURCHASE_CATEGORY_ID', // Replace this
    ...
  },
  // ... etc
};
```

### 5. Add Banner Image (Optional)

In `bot/commands/ticket.js`, replace:
```javascript
.setImage('PLACEHOLDER_BANNER_IMAGE_URL')
```

With your banner URL (like the "CONTACT US" image in Edner)

### 6. Apply Database Migration

Open `apply-redemption-codes.html` in browser (or manually run the SQL)
Run: `supabase/migrations/20251225000010_add_tickets.sql`

### 7. Deploy

```bash
git add -A
git commit -m "Add complete ticket system"
git push origin main
```

Railway will auto-deploy!

## Usage

### Send Ticket Panel

```
/ticket
```

This sends the beautiful panel with dropdown menu.

### Ticket Flow

1. User selects ticket type from dropdown
2. Modal appears with custom form
3. User fills out form and submits
4. Ticket channel created in appropriate category
5. Embed sent with user's responses
6. Staff helps user
7. Staff clicks "🔒 Close" button
8. Transcript generated and sent to:
   - User's DMs
   - Transcript logs channel
9. Ticket channel deleted after 5 seconds

## Ticket Types & Forms

### 1. Purchase
**Form Fields:**
- Which Product Do You Want To Purchase?
- Which Payment Method Would You Like To Use?
- Which Duration Are You Interested In?

### 2. Support
**Form Fields:**
- What Can We Help With? (paragraph)

### 3. License Key HWID Reset
**Form Fields:**
- Product To Be Reset?
- What Is Your License Key?

### 4. Claim Role / Key
**Form Fields:**
- Order Number?
- Product Ordered And Duration

## Transcript Features

The HTML transcripts include:
- ✅ Beautiful dark theme matching Discord
- ✅ All messages with avatars
- ✅ Timestamps
- ✅ Embeds preserved
- ✅ Bot badges
- ✅ Responsive design
- ✅ Hanzo branding

## Customization

### Change Colors

Edit `bot/utils/ticketHandler.js`:
```javascript
const TICKET_CONFIG = {
  purchase: {
    color: '#5865F2', // Change this
    ...
  }
};
```

### Change Emojis

Edit `bot/commands/ticket.js` in the dropdown options:
```javascript
{
  label: 'Purchase',
  emoji: '🛒' // Change this
}
```

### Add More Ticket Types

1. Add option to dropdown in `bot/commands/ticket.js`
2. Add category config in `bot/utils/ticketHandler.js`
3. Create modal function in `bot/utils/ticketHandler.js`
4. Add to `createTicketModal()` switch statement

## Database Schema

### `tickets` table:
- `id` - UUID primary key
- `channel_id` - Discord channel ID
- `user_id` - Discord user ID
- `ticket_type` - Type of ticket
- `status` - open/closed
- `created_at` - When ticket was created
- `closed_at` - When ticket was closed
- `transcript_url` - URL to transcript (optional)

## Troubleshooting

### Tickets not creating
- Check category IDs are correct
- Bot needs "Manage Channels" permission
- Bot needs "View Channel" permission in categories

### Transcripts not sending
- Check `TRANSCRIPT_LOGS_CHANNEL_ID` is set
- Bot needs "Send Messages" permission in logs channel
- User must have DMs enabled

### Forms not showing
- Commands must be registered: `node deploy-commands.js`
- Bot must be restarted after code changes

## Features

✅ Exact Edner style matching
✅ Dropdown menu with 4 options
✅ Custom forms for each type
✅ Beautiful ticket embeds
✅ Close button
✅ HTML transcripts
✅ Sent to user and logs
✅ Database tracking
✅ Category organization
✅ Permission management
✅ Hanzo branding

## Commands

- `/ticket` - Send ticket panel (Admin only)

## That's It!

Your ticket system is ready! Users can now create tickets, staff can help them, and everything is logged with beautiful HTML transcripts.
