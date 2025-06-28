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

# Node.js 버전 확인
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 16 ]; then
    echo "⚠️ Node.js v16+ 권장. 현재 버전: $(node -v)"
fi

# 기존 설치 정리 (문제 발생 시)
if [ -f ".install_failed" ]; then
    echo "🔄 이전 설치 실패 감지. 정리 중..."
    rm -rf node_modules package-lock.json .install_failed
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ 백엔드 의존성 설치 실패"
    touch .install_failed
    echo "💡 해결 방법:"
    echo "   sudo apt install build-essential python3-dev  # Ubuntu/Debian"
    echo "   sudo yum groupinstall 'Development Tools'     # CentOS/RHEL"
    echo "   그 후 npm rebuild sqlite3 실행"
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
