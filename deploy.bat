@echo off
echo Değişiklikleri GitHub'a gönderiyorum...
git add .
set /p commit_message="Commit mesajını girin: "
git commit -m "%commit_message%"
git push origin main
echo.
echo ✅ Değişiklikler başarıyla gönderildi!
echo 🌐 Web siteniz birkaç dakika içinde güncellenecek: https://suuapp.com
pause
