#!/bin/bash
# 백엔드 설치 스크립트 (Linux/macOS)

echo "🔧 백엔드 설치를 시작합니다..."

# 현재 디렉토리 확인
if [ ! -d "backend" ]; then
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

echo "✅ 백엔드 설치 완료!"
echo ""
echo "🚀 실행 방법: ./start-backend.sh"
echo "📚 API 문서: http://localhost:8080/swagger-ui"
echo ""
echo "🧪 테스트 계정:"
echo "- mentor1@test.com / password123 (React 전문가)"
echo "- mentor2@test.com / password123 (백엔드 전문가)"
echo "- mentor3@test.com / password123 (풀스택 개발자)"
echo "- mentee1@test.com / password123 (프론트엔드 학습자)"
echo "- mentee2@test.com / password123 (백엔드 학습자)"
