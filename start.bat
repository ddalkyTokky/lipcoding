@echo off
REM 백엔드와 프론트엔드 동시 실행 스크립트 (Windows)

echo 🚀 멘토-멘티 매칭 웹앱을 시작합니다...

REM 현재 디렉토리 확인
if not exist "backend\" (
    echo ❌ 올바른 프로젝트 디렉토리에서 실행해주세요.
    pause
    exit /b 1
)

echo 🔧 백엔드 서버 시작 중... (포트 8080)
start "Backend Server" cmd /c "cd backend && node server.js"

REM 잠시 대기 (백엔드 시작 시간)
timeout /t 3 /nobreak >nul

echo 🎨 프론트엔드 서버 시작 중... (포트 3000)
start "Frontend Server" cmd /c "cd frontend && npm start"

echo.
echo ✅ 서버들이 시작되었습니다!
echo 🌐 웹앱: http://localhost:3000
echo 📚 API 문서: http://localhost:8080/swagger-ui
echo.
echo 🧪 테스트 계정:
echo - mentor1@test.com / password123
echo - mentee1@test.com / password123
echo.
echo 💡 서버들이 새 창에서 실행됩니다.
echo 🛑 종료하려면 각 창을 닫으세요.

pause
