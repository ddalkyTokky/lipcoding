#!/bin/bash
# 프론트엔드 설치 스크립트 (Linux/macOS)

echo "🎨 프론트엔드 설치를 시작합니다..."

# 현재 디렉토리 확인
if [ ! -d "frontend" ]; then
    echo "❌ 올바른 프로젝트 디렉토리에서 실행해주세요."
    exit 1
fi

echo "📦 프론트엔드 의존성 설치 중..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 프론트엔드 의존성 설치 실패"
    exit 1
fi

echo "✅ 프론트엔드 설치 완료!"
echo ""
echo "🚀 실행 방법: ./start-frontend.sh"
echo "🌐 웹앱: http://localhost:3000"
