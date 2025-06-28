#!/bin/bash
# 프론트엔드 서버 실행 스크립트 (Linux/macOS)

echo "🎨 프론트엔드 서버를 시작합니다..."

echo "📦 프론트엔드 디렉토리로 이동 중..."
cd frontend

echo "🚀 프론트엔드 서버 시작 중... (포트 3000)"
echo "🌐 웹앱: http://localhost:3000"
echo "🛑 서버를 종료하려면 Ctrl+C를 누르세요."
echo ""
echo "🧪 테스트 계정:"
echo "- mentor1@test.com / password123"
echo "- mentee1@test.com / password123"
echo ""

npm start
