# CheckInOut-bot (CIO)

슬랙 Daily check in-out을 위한 자동화 봇

## 📋 개요

매일 평일 오전 5시(KST)에 슬랙 채널에 체크인/아웃 메시지를 자동으로 전송하는 GitHub Actions 기반 봇입니다.
한국 공휴일을 자동으로 확인하여 평일에만 메시지를 전송합니다.

## ✨ 주요 기능

- **자동 스케줄링**: 평일 오전 5시 KST 자동 실행
- **공휴일 제외**: 한국 공휴일 API 연동으로 공휴일 자동 제외
- **실시간 날씨**: Open-Meteo API로 현재 날씨 이모지 표시
- **한국어 지원**: 한국어 날짜/요일 표시
- **수동 실행**: 필요시 GitHub Actions에서 수동 실행 가능

## 🚀 설치 및 설정

### 1. Repository 설정

```bash
git clone https://github.com/your-username/CheckInOut-bot.git
cd CheckInOut-bot
npm install
```

### 2. GitHub Secrets 설정

Repository Settings > Secrets and variables > Actions에서 다음 설정:

| Secret Name | 설명 | 예시 |
|-------------|------|------|
| `SLACK_BOT_TOKEN` | Slack 봇 토큰 | `xoxb-...` |
| `SLACK_CHANNEL_ID` | 메시지를 보낼 채널 ID | `C087WJ9UKV5` |
| `KOREAN_HOLIDAY_API_KEY` | 공공데이터포털 API 키 | `n026MeHJSm4C99Q5N%2B9cGW%2FJThP8z1XnCm4RLL%2BI9uQqdwSTaBQOcGNP5SPVP0veNwmaIWY0ZtF55E2LZxiu5A%3D%3D` |

### 3. Slack 앱 설정

1. [Slack API](https://api.slack.com/apps)에서 새 앱 생성
2. **OAuth & Permissions**에서 다음 스코프 추가:
   - `chat:write`
   - `channels:read`
3. 워크스페이스에 앱 설치
4. Bot User OAuth Token 복사

### 4. 공공데이터포털 API 키 발급

1. [공공데이터포털](https://www.data.go.kr/) 회원가입
2. "한국천문연구원_특일 정보" 검색 후 활용신청
3. 일반인증키(Encoding) 발급

## 📅 실행 스케줄

- **실행 시간**: 평일 오전 5:00 KST
- **실행 요일**: 월요일 ~ 금요일
- **제외 조건**: 한국 공휴일, 주말

## 📝 메시지 형식

```
데일리 체크인&아웃 | 2025/09/22 | 월 | 🌤️
이 스레드에 오늘의 체크인/아웃을 댓글로 남겨주세요!

[템플릿]
🌟 체크인
- 업무 (Todo + 예상 시간 or 🍅)
- 몸/마음 (각각 숫자 + 한줄 코멘트)
- 오늘 집중 포인트

✅ 체크 아웃
- 완료 vs 계획
- 성과/배움
- 개선/내일 인계
```

## 🛠️ 로컬 테스트

```bash
# 환경변수 설정
export SLACK_BOT_TOKEN="your-bot-token"
export SLACK_CHANNEL_ID="your-channel-id"
export KOREAN_HOLIDAY_API_KEY="your-api-key"

# 실행
node index.js
```

## 🔧 수동 실행

GitHub Repository > Actions > "Post Slack Daily Check-in" > "Run workflow"

## 📊 사용된 기술

- **Node.js**: 메인 런타임
- **@slack/web-api**: Slack API 클라이언트
- **dayjs**: 날짜/시간 처리
- **GitHub Actions**: 자동화 스케줄링
- **공공데이터포털 API**: 한국 공휴일 정보
- **Open-Meteo API**: 날씨 정보

## 📁 프로젝트 구조

```
CheckInOut-bot/
├── .github/workflows/
│   └── daily-cio.yml          # GitHub Actions 워크플로우
├── index.js                   # 메인 봇 로직
├── package.json               # 의존성 관리
├── .gitignore                 # Git 제외 파일
└── README.md                  # 프로젝트 문서
```

## 🐛 트러블슈팅

### 메시지가 전송되지 않는 경우

1. **GitHub Secrets 확인**: 모든 필수 secrets가 설정되었는지 확인
2. **Slack 권한 확인**: 봇이 해당 채널에 메시지를 보낼 권한이 있는지 확인
3. **API 키 확인**: 공휴일 API 키가 유효한지 확인
4. **Actions 로그 확인**: GitHub Actions 실행 로그에서 오류 메시지 확인

### 스케줄이 작동하지 않는 경우

1. **Repository 활성화**: 60일 이상 비활성 상태면 scheduled workflows 비활성화
2. **Default Branch**: workflow가 default branch에 있는지 확인
3. **Actions 할당량**: GitHub Actions 사용량 확인

## 📈 커밋 히스토리

- `CIO-001`: 메시지 & 워크플로 초기 설정
- `CIO-002`: 실시간 날씨 정보 및 한국 시간대 적용
- `CIO-003`: Workflow 설정
- `CIO-004`: 환경변수 설정 수정
- `CIO-005`: 환경변수 참조 오류 수정
- `CIO-006`: 한국 공휴일 API 연동
- `CIO-007`: .gitignore 추가 및 불필요한 파일 제거

## 📄 라이선스

MIT License

## 🤝 기여

이슈나 개선사항이 있으시면 언제든지 Issue나 Pull Request를 생성해주세요!