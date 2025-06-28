@echo off
REM 백엔드 서버 실행 스크립트 (Windows)

echo 🔧 백엔드 서버를 시작합니다...

echo 🚀 백엔드 서버 시작 중... (포트 8080)
echo 📚 API 문서: http://localhost:8080/swagger-ui
echo 🛑 서버를 종료하려면 Ctrl+C를 누르세요.
echo.

node server.js
