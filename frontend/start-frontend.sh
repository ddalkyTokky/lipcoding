#!/bin/bash
# 프론트엔드 서버 실행 스크립트 (Linux/macOS)

echo "🎨 프론트엔드 서버를 시작합니다..."

echo "🚀 프론트엔드 서버를 백그라운드로 시작합니다... (포트 3000)"
echo "🌐 웹앱: http://localhost:3000"

# 백그라운드로 서버 실행
npm start &
SERVER_PID=$!

echo "✅ 프론트엔드 서버가 백그라운드에서 실행 중입니다 (PID: $SERVER_PID)"
echo "🛑 서버를 종료하려면: kill $SERVER_PID"
echo "📋 실행 중인 프로세스 확인: ps aux | grep 'npm start'"
echo ""
echo "🧪 테스트 계정:"
echo "- mentor1@test.com / password123"
echo "- mentee1@test.com / password123"
echo ""
echo "터미널을 계속 사용할 수 있습니다!"
