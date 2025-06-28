@echo off
REM 프론트엔드 설치 스크립트 (Windows)

echo 🎨 프론트엔드 설치를 시작합니다...


echo 📦 프론트엔드 의존성 설치 중...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ 프론트엔드 의존성 설치 실패
    pause
    exit /b 1
)

echo ✅ 프론트엔드 설치 완료!
echo.
echo 🚀 실행 방법: start-frontend.bat
echo 🌐 웹앱: http://localhost:3000

pause
