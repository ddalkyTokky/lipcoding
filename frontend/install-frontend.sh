#!/bin/bash
# 프론트엔드 설치 스크립트 (Linux/macOS)

echo "🎨 프론트엔드 설치를 시작합니다..."


echo "📦 프론트엔드 의존성 설치 중..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 프론트엔드 의존성 설치 실패"
    exit 1
fi

# 실행 스크립트에 권한 부여
echo "🔒 실행 스크립트 권한 설정 중..."
chmod +x start-frontend.sh
if [ -f "../backend/start-backend.sh" ]; then
    chmod +x ../backend/start-backend.sh
fi

echo "✅ 프론트엔드 설치 완료!"
echo ""
echo "🚀 실행 방법: ./start-frontend.sh"
echo "🌐 웹앱: http://localhost:3000"
