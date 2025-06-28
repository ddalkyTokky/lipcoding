# 멘토-멘티 매칭 웹앱 설치 및 실행 가이드

이 가이드는 다른 사용자가 이 프로젝트를 로컬 환경에서 실행할 수 있도록 도와드립니다.

## 📋 사전 요구사항

다음 프로그램들이 설치되어 있어야 합니다:

- **Node.js** (v14 이상) - [다운로드](https://nodejs.org/)
- **npm** (Node.js와 함께 설치됨)
- **Git** - [다운로드](https://git-scm.com/)

## 🚀 설치 및 실행 단계

### 1. 프로젝트 클론

```bash
git clone https://github.com/ddalkyTokky/lipcoding.git
cd lipcoding
```

### 2. 백엔드 설정 및 실행

```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 패키지 설치
npm install

# 테스트 계정 생성 (선택사항)
node create-test-accounts.js

# 백엔드 서버 실행
node server.js
```

백엔드 서버가 **포트 8080**에서 실행됩니다.
- API 서버: http://localhost:8080
- API 문서: http://localhost:8080/swagger-ui

### 3. 프론트엔드 설정 및 실행

**새 터미널을 열고** 다음 명령어를 실행하세요:

```bash
# 프로젝트 루트로 이동 (백엔드와 다른 터미널)
cd lipcoding

# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 패키지 설치
npm install

# 프론트엔드 서버 실행
npm start
```

프론트엔드 서버가 **포트 3000**에서 실행됩니다.
- 웹앱: http://localhost:3000

## 🔧 VS Code에서 실행 (권장)

VS Code를 사용하는 경우 더 쉽게 실행할 수 있습니다:

1. **VS Code에서 프로젝트 열기**
   ```bash
   code lipcoding
   ```

2. **터미널에서 작업 실행**
   - `Ctrl + Shift + P` → "Tasks: Run Task" 검색
   - "Start Backend Server" 선택 → 백엔드 실행
   - "Start Frontend Server" 선택 → 프론트엔드 실행

## 🧪 테스트 계정

다음 계정으로 로그인하여 기능을 테스트할 수 있습니다:

### 멘토 계정
- **mentor1@test.com** / password123 (React 전문가)
- **mentor2@test.com** / password123 (백엔드 전문가)  
- **mentor3@test.com** / password123 (풀스택 개발자)

### 멘티 계정
- **mentee1@test.com** / password123 (프론트엔드 학습자)
- **mentee2@test.com** / password123 (백엔드 학습자)

## 📱 주요 기능

1. **회원가입/로그인**
2. **멘토 목록 조회** (멘티만)
3. **매칭 요청 보내기** (멘티 → 멘토)
4. **매칭 요청 관리** (멘토가 수락/거절)
5. **프로필 관리**

## 🛠️ 문제 해결

### 포트 충돌 오류
만약 포트가 이미 사용 중이라는 오류가 발생하면:

**Windows (PowerShell):**
```powershell
# 포트 8080 사용 프로세스 확인 및 종료
netstat -ano | findstr :8080
taskkill /PID <PID번호> /F

# 포트 3000 사용 프로세스 확인 및 종료  
netstat -ano | findstr :3000
taskkill /PID <PID번호> /F
```

**macOS/Linux:**
```bash
# 포트 8080 사용 프로세스 확인 및 종료
lsof -ti:8080 | xargs kill -9

# 포트 3000 사용 프로세스 확인 및 종료
lsof -ti:3000 | xargs kill -9
```

### npm 설치 오류
```bash
# npm 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

## 📚 API 문서

백엔드가 실행된 후 http://localhost:8080/swagger-ui 에서 전체 API 문서를 확인할 수 있습니다.

## 🏗️ 프로젝트 구조

```
lipcoding/
├── backend/                 # 백엔드 서버 (Express/SQLite)
│   ├── routes/             # API 라우트
│   ├── middleware/         # 인증 미들웨어
│   ├── config/            # 데이터베이스 설정
│   └── database/          # SQLite 데이터베이스
├── frontend/               # 프론트엔드 (React)
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   └── App.js         # 메인 앱
│   └── public/            # 정적 파일
├── specifications/         # API 명세서 및 요구사항
└── extras/                # 정책 및 추가 문서
```

## 💡 추가 도움

문제가 발생하거나 추가 도움이 필요한 경우:
1. 이슈를 GitHub 저장소에 등록
2. 개발 팀에 문의
3. 로그 확인: 터미널에서 에러 메시지 확인

---

**Happy Coding! 🎉**
