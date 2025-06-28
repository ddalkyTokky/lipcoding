# 멘토-멘티 매칭 웹앱

## 🚀 빠른 시작

**완성된 앱을 실행하려면:**

### 자동 설치 및 실행
```bash
# 1. 저장소 클론
git clone https://github.com/ddalkyTokky/lipcoding.git
cd lipcoding

# 2-A. 전체 설치 (Windows)
.\install.bat

# 2-A. 전체 설치 (macOS/Linux)
chmod +x install.sh
./install.sh

# 2-B. 개별 설치 (Windows)
.\install-backend.bat     # 백엔드만 설치
.\install-frontend.bat    # 프론트엔드만 설치

# 2-B. 개별 설치 (macOS/Linux)
chmod +x install-backend.sh && ./install-backend.sh    # 백엔드만 설치
chmod +x install-frontend.sh && ./install-frontend.sh  # 프론트엔드만 설치

# 3. 서버 실행 (Windows)
# 터미널 1: 백엔드 실행
.\start-backend.bat

# 터미널 2: 프론트엔드 실행  
.\start-frontend.bat

# 3. 서버 실행 (macOS/Linux)
# 터미널 1: 백엔드 실행
chmod +x start-backend.sh && ./start-backend.sh

# 터미널 2: 프론트엔드 실행
chmod +x start-frontend.sh && ./start-frontend.sh
```

> **참고**: 
> - 전체 설치는 백엔드와 프론트엔드를 한 번에 설치합니다.
> - 개별 설치는 필요한 부분만 설치할 수 있습니다.
> - 각 터미널에서 로그를 직접 확인할 수 있습니다.
> - 이미 계정이 존재하는 경우 안전하게 건너뜁니다.

### 수동 설치
```bash
# 백엔드 설치 및 실행
cd backend
npm install
node create-test-accounts.js
node server.js

# 새 터미널에서 프론트엔드 실행
cd frontend
npm install
npm start
```

**접속 주소:**
- 웹앱: http://localhost:3000
- API 문서: http://localhost:8080/swagger-ui

**테스트 계정:**

| 역할 | 이메일 | 비밀번호 | 설명 |
|------|--------|----------|------|
| 멘토 | mentor1@test.com | password123 | React 전문가 (React, JavaScript, TypeScript, Next.js) |
| 멘토 | mentor2@test.com | password123 | 백엔드 전문가 (Node.js, Python, MongoDB, PostgreSQL) |
| 멘토 | mentor3@test.com | password123 | 풀스택 개발자 (React, Node.js, AWS, Docker) |
| 멘티 | mentee1@test.com | password123 | 프론트엔드 학습자 |
| 멘티 | mentee2@test.com | password123 | 백엔드 학습자 |

> **참고**: 테스트 계정은 설치 시 자동으로 생성되며, 이미 존재하는 계정은 건너뜁니다.

자세한 설치 및 실행 방법은 [SETUP.md](./SETUP.md)를 참고하세요.

## 🎯 주요 기능

- **사용자 인증**: JWT 기반 로그인/회원가입
- **역할별 접근**: 멘토/멘티 구분된 기능 제공
- **멘토 검색**: 기술 스택별 멘토 필터링 및 정렬
- **매칭 시스템**: 멘티가 멘토에게 매칭 요청
- **요청 관리**: 멘토가 요청 수락/거절 처리
- **프로필 관리**: 개인정보 및 기술 스택 관리
- **반응형 UI**: 모바일/데스크톱 호환 디자인

## 🛠️ 기술 스택

- **백엔드**: Node.js, Express, SQLite, JWT
- **프론트엔드**: React, React Router, Axios
- **문서화**: Swagger UI
- **개발도구**: VS Code Tasks, 자동화 스크립트

## 🚨 문제해결

### 포트 충돌 오류
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID번호> /F

# macOS/Linux  
lsof -ti:8080 | xargs kill -9
```

### 설치 오류
```bash
# 캐시 정리 후 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```
