@echo off
echo ========================================
echo   Glass Invoice Genie - Git Deployment
echo ========================================
echo.

echo [1/4] Checking git status...
git status
echo.

echo [2/4] Adding all files...
git add .
echo.

echo [3/4] Committing changes...
set /p commit_msg="Enter commit message: "
git commit -m "%commit_msg%"
echo.

echo [4/4] Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Go to Railway dashboard
echo 2. Your app will auto-deploy
echo 3. Check deployment logs
echo.
pause
