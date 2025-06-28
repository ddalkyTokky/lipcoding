@echo off
REM 백엔드 설치 스크립트 (Windows)

echo 🔧 백엔드 설치를 시작합니다...

REM 현재 디렉토리 확인
if not exist "backend\" (
    echo ❌ 올바른 프로젝트 디렉토리에서 실행해주세요.
    pause
    exit /b 1
)

echo 📦 백엔드 의존성 설치 중...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ 백엔드 의존성 설치 실패
    pause
    exit /b 1
)

echo 🗄️ 테스트 계정 생성 중...
node create-test-accounts.js
if errorlevel 1 (
    echo ⚠️ 테스트 계정 생성 중 일부 오류가 있었지만 계속 진행합니다.
)

echo ✅ 백엔드 설치 완료!
echo.
echo 🚀 실행 방법: start-backend.bat
echo 📚 API 문서: http://localhost:8080/swagger-ui
echo.
echo 🧪 테스트 계정:
echo - mentor1@test.com / password123 (React 전문가)
echo - mentor2@test.com / password123 (백엔드 전문가)
echo - mentor3@test.com / password123 (풀스택 개발자)
echo - mentee1@test.com / password123 (프론트엔드 학습자)
echo - mentee2@test.com / password123 (백엔드 학습자)

pause
