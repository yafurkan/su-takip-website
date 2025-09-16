#!/bin/bash

echo "Değişiklikleri GitHub'a gönderiyorum..."
git add .

echo "Commit mesajını girin:"
read commit_message

git commit -m "$commit_message"
git push origin main

echo ""
echo "✅ Değişiklikler başarıyla gönderildi!"
echo "🌐 Web siteniz birkaç dakika içinde güncellenecek: https://suuapp.com"