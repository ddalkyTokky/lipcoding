#!/bin/bash

# 백엔드와 프론트엔드 동시 실행 스크립트

echo "🚀 멘토-멘티 매칭 웹앱을 시작합니다..."

# 현재 디렉토리 확인
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ 올바른 프로젝트 디렉토리에서 실행해주세요."
    exit 1
fi

# 백그라운드에서 백엔드 실행
echo "🔧 백엔드 서버 시작 중... (포트 8080)"
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# 잠시 대기 (백엔드 시작 시간)
sleep 3

# 백그라운드에서 프론트엔드 실행
echo "🎨 프론트엔드 서버 시작 중... (포트 3000)"
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ 서버들이 시작되었습니다!"
echo "🌐 웹앱: http://localhost:3000"
echo "📚 API 문서: http://localhost:8080/swagger-ui"
echo ""
echo "🧪 테스트 계정:"
echo "- mentor1@test.com / password123"
echo "- mentee1@test.com / password123"
echo ""
echo "⏹️  종료하려면 Ctrl+C를 누르세요"

# 사용자가 Ctrl+C를 누를 때까지 대기
trap "echo '🛑 서버를 종료합니다...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" INT

# 무한 대기
while true; do
    sleep 1
done
