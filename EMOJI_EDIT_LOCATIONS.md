# 🎨 Where to Edit Emojis - Quick Reference

## File 1: `bot/commands/ticket.js`

**Lines 24-51** - Dropdown menu options:

```javascript
.addOptions([
  {
    label: 'Purchase',
    description: 'Click on this option to purchase a product!',
    value: 'purchase',
    emoji: '🛒'  // ← EDIT THIS
  },
  {
    label: 'Support',
    description: 'Click on this option if you require support!',
    value: 'support',
    emoji: '👤'  // ← EDIT THIS
  },
  {
    label: 'License Key HWID Reset',
    description: 'Click on this option if you need a Key Reset!',
    value: 'hwid_reset',
    emoji: '🛒'  // ← EDIT THIS
  },
  {
    label: 'Claim Role / Key',
    description: 'Click here to claim your customer role!',
    value: 'claim_role',
    emoji: '⭐'  // ← EDIT THIS
  }
])
```

---

## File 2: `bot/utils/ticketHandler.js`

**Lines 9-32** - Ticket configuration:

```javascript
const TICKET_CONFIG = {
  purchase: {
    categoryId: process.env.PURCHASE_CATEGORY_ID || null,
    emoji: '🛒',  // ← EDIT THIS
    title: 'Purchase Information',
    color: '#1db954'
  },
  support: {
    categoryId: process.env.SUPPORT_CATEGORY_ID || null,
    emoji: '👤',  // ← EDIT THIS
    title: 'Support Request',
    color: '#1db954'
  },
  hwid_reset: {
    categoryId: process.env.HWID_CATEGORY_ID || null,
    emoji: '🔄',  // ← EDIT THIS
    title: 'License Key Reset',
    color: '#1db954'
  },
  claim_role: {
    categoryId: process.env.CLAIM_CATEGORY_ID || null,
    emoji: '⭐',  // ← EDIT THIS
    title: 'Claim Role/Key',
    color: '#1db954'
  }
};
```

---

## 🔄 After Editing

1. Save both files
2. Run these commands:
   ```bash
   git add -A
   git commit -m "update ticket emojis"
   git push
   ```
3. Railway will automatically deploy your changes!

---

## 💡 Tips

- Use Discord emoji format: `<:emoji_name:emoji_id>` for custom emojis
- Use Unicode emojis: `🎮`, `💰`, `🔑`, etc. for standard emojis
- Make sure emojis match in both files for consistency!
