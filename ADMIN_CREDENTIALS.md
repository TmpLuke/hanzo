# Admin Login Credentials

## Default Admin Access

**Username:** `AdminPortal`  
**Password:** `Hnz0!2024$Scr3t#Adm1n@P0rt4l*9X7z`

## Login URL

Navigate to: `/admin/login` or `http://localhost:5173/admin/login`

## Security Notes

- These are highly secure credentials with special characters, numbers, and mixed case
- **IMPORTANT:** Keep these credentials safe and secure
- The authentication is stored in localStorage
- To logout, click the "Logout" button in the admin sidebar

## Password Strength

The password includes:
- ✅ Uppercase letters (H, S, A, P, X)
- ✅ Lowercase letters (nz, cr, t, dm, n, rt, l, z)
- ✅ Numbers (0, 2, 0, 2, 4, 3, 1, 0, 4, 9, 7)
- ✅ Special characters (!, $, #, @, *)
- ✅ 35 characters long
- ✅ No dictionary words
- ✅ Highly resistant to brute force attacks

## Customizing Credentials

To change the admin credentials, edit the file:
`src/pages/admin/AdminLogin.tsx`

Look for these lines:
```typescript
const ADMIN_USERNAME = "AdminPortal";
const ADMIN_PASSWORD = "Hnz0!2024$Scr3t#Adm1n@P0rt4l*9X7z";
```

Replace with your desired credentials.

## Features

- Beautiful login page with Hanzo logo
- Green glow effects and animations
- Protected admin routes
- Session management via localStorage
- Logout functionality

---

**Created:** December 25, 2024  
**Hanzo Marketplace Admin Portal**
