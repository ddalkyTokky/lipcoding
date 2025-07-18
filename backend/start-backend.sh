#!/bin/bash
# 백엔드 서버 실행 스크립트 (Linux/macOS)

echo "🔧 백엔드 서버를 시작합니다..."

echo "🚀 백엔드 서버를 백그라운드로 시작합니다... (포트 8080)"
echo "📚 API 문서: http://localhost:8080/swagger-ui"

# 백그라운드로 서버 실행
node server.js &
SERVER_PID=$!

echo "✅ 백엔드 서버가 백그라운드에서 실행 중입니다 (PID: $SERVER_PID)"
echo "🛑 서버를 종료하려면: kill $SERVER_PID"
echo "📋 실행 중인 프로세스 확인: ps aux | grep 'node server.js'"
echo ""
echo "터미널을 계속 사용할 수 있습니다!"
