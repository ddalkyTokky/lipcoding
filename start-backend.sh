#!/bin/bash
# 백엔드 서버 실행 스크립트 (Linux/macOS)

echo "🔧 백엔드 서버를 시작합니다..."

# 현재 디렉토리 확인
if [ ! -d "backend" ]; then
    echo "❌ 올바른 프로젝트 디렉토리에서 실행해주세요."
    exit 1
fi

echo "📦 백엔드 디렉토리로 이동 중..."
cd backend

echo "🚀 백엔드 서버 시작 중... (포트 8080)"
echo "📚 API 문서: http://localhost:8080/swagger-ui"
echo "🛑 서버를 종료하려면 Ctrl+C를 누르세요."
echo ""

node server.js
