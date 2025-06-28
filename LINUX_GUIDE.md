# 리눅스/macOS 실행 가이드

## 🐧 리눅스에서 실행하기

### 1. 스크립트 실행 권한 부여
```bash
# 모든 스크립트에 실행 권한 부여 (권장)
chmod +x backend/*.sh frontend/*.sh

# 또는 개별적으로
chmod +x backend/install-backend.sh
chmod +x backend/start-backend.sh
chmod +x frontend/install-frontend.sh
chmod +x frontend/start-frontend.sh
```

> **참고**: 설치 스크립트 실행 시 자동으로 실행 스크립트에 권한이 부여됩니다.

### 2. 의존성 확인
```bash
# Node.js 설치 확인
node --version
npm --version

# Node.js가 없다면 설치
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# CentOS/RHEL
sudo yum install nodejs npm

# macOS (Homebrew)
brew install node
```

### 3. 설치 및 실행
```bash
# 1. 저장소 클론
git clone https://github.com/ddalkyTokky/lipcoding.git
cd lipcoding

# 2. 실행 권한 부여
chmod +x backend/*.sh frontend/*.sh

# 3. 백엔드 설치
./backend/install-backend.sh

# 4. 프론트엔드 설치
./frontend/install-frontend.sh

# 5. 백엔드 실행 (터미널 1)
./backend/start-backend.sh

# 6. 프론트엔드 실행 (터미널 2)
./frontend/start-frontend.sh
./start-frontend.sh
```

### 4. 자주 발생하는 오류 및 해결책

#### sqlite3 컴파일 오류
```bash
# 빌드 도구 설치
# Ubuntu/Debian
sudo apt install build-essential python3-dev

# CentOS/RHEL
sudo yum groupinstall "Development Tools"
sudo yum install python3-devel

# 재설치
cd backend
rm -rf node_modules package-lock.json
npm install
```

#### 권한 오류
```bash
# npm 글로벌 디렉토리 권한 수정
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

#### 포트 사용 중 오류
```bash
# 포트 8080, 3000 사용 중인 프로세스 확인 및 종료
sudo lsof -ti:8080 | xargs kill -9
sudo lsof -ti:3000 | xargs kill -9
```

### 5. 환경별 차이점

| 항목 | Windows | Linux/macOS |
|------|---------|-------------|
| 스크립트 확장자 | .bat | .sh |
| 실행 권한 | 불필요 | chmod +x 필요 |
| 경로 구분자 | \ | / |
| 프로세스 종료 | taskkill | kill |
| 빌드 도구 | Visual Studio | build-essential |

### 6. 트러블슈팅

#### Node.js 버전 문제
```bash
# Node.js 버전 확인 (권장: v16+)
node --version

# nvm으로 버전 관리
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

#### SQLite3 네이티브 모듈 오류
```bash
# 네이티브 모듈 재빌드
cd backend
npm rebuild sqlite3

# 또는 전체 재설치
rm -rf node_modules package-lock.json
npm install
```
