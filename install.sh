#!/bin/bash

# 멘토-멘티 매칭 웹앱 자동 설치 및 실행 스크립트

echo "🚀 멘토-멘티 매칭 웹앱 설치를 시작합니다..."

# 현재 디렉토리 확인
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    echo "❌ 올바른 프로젝트 디렉토리에서 실행해주세요."
    exit 1
fi

echo "📦 백엔드 의존성 설치 중..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 백엔드 의존성 설치 실패"
    exit 1
fi

echo "🗄️ 테스트 계정 생성 중..."
node create-test-accounts.js
if [ $? -ne 0 ]; then
    echo "⚠️ 테스트 계정 생성 중 일부 오류가 있었지만 계속 진행합니다."
fi

echo "📦 프론트엔드 의존성 설치 중..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 프론트엔드 의존성 설치 실패"
    exit 1
fi

echo "✅ 설치 완료!"
echo ""
echo "🎯 실행 방법:"
echo "1. 백엔드 실행: cd backend && node server.js"
echo "2. 프론트엔드 실행: cd frontend && npm start"
echo ""
echo "🌐 접속 주소:"
echo "- 웹앱: http://localhost:3000"
echo "- API 문서: http://localhost:8080/swagger-ui"
echo ""
echo "🧪 테스트 계정:"
echo "- mentor1@test.com / password123"
echo "- mentee1@test.com / password123"
