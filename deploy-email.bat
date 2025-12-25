@echo off
echo ========================================
echo   Deploying Gmail Email Function
echo ========================================
echo.

echo Step 1: Logging into Supabase...
echo Please follow the browser prompt to login
npx supabase login

echo.
echo Step 2: Linking project...
npx supabase link --project-ref rucygmkwvmkzbxydoglm

echo.
echo Step 3: Setting Gmail secrets...
npx supabase secrets set GMAIL_USER="petyaiscute@gmail.com"
npx supabase secrets set GMAIL_APP_PASSWORD="bfmeghukdikgetkp"

echo.
echo Step 4: Deploying email function...
npx supabase functions deploy send-order-email --no-verify-jwt

echo.
echo Step 5: Deploying webhook function...
npx supabase functions deploy moneymotion-webhook --no-verify-jwt

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Test your emails by making a purchase!
echo.
pause
