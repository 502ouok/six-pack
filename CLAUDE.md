@AGENTS.md

# 식스팩(SIX PACK) 웹앱 프로젝트

## 프로젝트 기본 정보

- **경로**: `C:\Users\ohkmi\Desktop\my program\class\six-pack`
- **앱 이름**: SIX PACK (식스팩)
- **목적**: 초등학생(8~13세) 대상 WHO·OECD 기반 전인적 성장 플랫폼. 아동과 보호자(학부모·교사)가 함께 사용.
- **스택**: Next.js 16.3.5 + TypeScript + Tailwind CSS v4
- **백엔드**: Supabase (인증·프로필), localStorage (뱃지·게임 데이터)
- **UI 언어**: 한국어 전용
- **실행**: `cd "C:\Users\ohkmi\Desktop\my program\class\six-pack"` → `npm run dev` → `localhost:3000`
- **GitHub**: `https://github.com/502ouok/식스팩` (미확인, 확인 필요)

---

## 6가지 성장 영역 (팩)

| 팩 | 색상 | 설명 | 게임 |
|---|---|---|---|
| 신체 💪 | #FF6B6B | 체력·운동 | 오늘의 신체 도전 체크리스트 + 7일 연속 추적 |
| 정서 🌈 | #FF9F43 | 감정·마음 | 감정 맞히기 (5라운드, 상황 카드 → 감정 선택) |
| 사회 🤝 | #54A0FF | 친구·관계 | 우주 탐험 사회성 평가 게임 (3미션, SocialAssessmentGame) |
| 인지 🧠 | #A29BFE | 집중·사고 | 기억력 카드 짝 맞추기 (4×3 그리드) |
| 생활 🌙 | #FD79A8 | 수면·식습관 | 오늘의 습관 체크 + SVG 식물 성장 (5단계) |
| 진로 ⭐ | #F9CA24 | 꿈·강점 | A/B 강점 발견 (10라운드 → TOP 3 결과) |

---

## 페이지 구조

```
/                   홈페이지 (히어로 + 6팩 그리드 + CTA + 보호자 설명 섹션)
/auth/signup        역할 선택 가입 (아동/보호자)
/auth/login         로그인
/auth/callback      이메일 인증 콜백
/dashboard          아이·보호자 대시보드 (6팩 현황 + 뱃지 섹션)
/pack/physical      신체 팩 (📊측정하기 | 🎮놀이하기 탭)
/pack/emotional     정서 팩
/pack/social        사회 팩
/pack/cognitive     인지 팩
/pack/lifestyle     생활 팩
/pack/career        진로 팩
```

---

## 핵심 컴포넌트 구조

```
app/
├── page.tsx                        홈페이지 (보호자 섹션 4개 포함)
├── dashboard/page.tsx              대시보드 (서버 컴포넌트 + BadgesSection)
├── pack/[area]/page.tsx × 6        팩 페이지 → PackTabWrapper 사용
├── auth/signup/page.tsx            가입 (Suspense 래핑됨)
├── auth/login/page.tsx             로그인
└── components/
    ├── PackAssessmentClient.tsx    5점 척도 설문 (수정 없이 유지)
    ├── PackTabWrapper.tsx          📊/🎮 탭 전환 (useState 기반)
    ├── BadgesSection.tsx           뱃지 클라이언트 컴포넌트
    └── game/
        ├── EmotionalGame.tsx           감정 맞히기
        ├── CognitiveGame.tsx           기억력 카드
        ├── SocialGame.tsx              상황 선택지 (구버전, 보존)
        ├── SocialStoryGame.tsx         우주 어드벤처 스토리 게임 (구버전, 보존)
        ├── SocialAssessmentGame.tsx    우주 탐험 사회성 평가 게임 (현재 사용)
        ├── PhysicalGame.tsx            신체 도전 체크리스트
        ├── LifestyleGame.tsx           습관 체크 + 식물 성장
        └── CareerGame.tsx              A/B 강점 발견

lib/
├── badges.ts                       뱃지 저장·조회 (localStorage gf_badges)
├── supabase/client.ts              브라우저 Supabase 클라이언트
└── supabase/server.ts              서버 Supabase 클라이언트 (쿠키 기반)

app/lib/definitions.ts              Zod 스키마 (SignupSchema, LoginSchema)
app/actions/auth.ts                 Server Actions (signup, login, logout)
proxy.ts                            경로 보호 미들웨어
```

---

## 뱃지 시스템

| 뱃지 ID | 팩 | 이름 | 조건 |
|---|---|---|---|
| `emotional-detective` | 정서 | 감정 탐정 🔍 | 감정 맞히기 5라운드 완료 |
| `cognitive-focus` | 인지 | 집중왕 🧩 | 기억력 카드 모두 맞추기 |
| `social-master` | 사회 | 관계 고수 🤝 | 상황 카드 5장 완료 |
| `physical-king` | 신체 | 운동왕 🏆 | 오늘 도전 5개 모두 체크 |
| `lifestyle-planter` | 생활 | 생활 정원사 🌸 | 습관 5개 모두 체크 |
| `career-discovery` | 진로 | 강점 발견자 ⭐ | A/B 선택 10라운드 완료 |

---

## localStorage 키

| 키 | 내용 |
|---|---|
| `gf_badges` | Badge[] — 획득한 뱃지 배열 |
| `gf_physical_stamps` | Record<날짜, string[]> — 날짜별 완료 도전 목록 |
| `gf_lifestyle_habits` | Record<날짜, string[]> — 날짜별 완료 습관 목록 |
| `gf_social_responses` | ResponseRecord[] — 사회 팩 게임 응답 데이터 (lib/gameResults.ts) |

---

## Supabase 설정

- **URL**: `https://bfevswtqezdbasmoszds.supabase.co`
- **테이블**: `profiles` (id, nickname, role, created_at) — RLS 활성화
- **인증**: 이메일·비밀번호 + SSR 쿠키 방식

---

## 홈페이지 보호자 섹션 (4개)

1. **왜 식스팩인가요?** — WHO·OECD 근거, 연구 기반·전문가 설계·무료
2. **6가지 성장 영역 자세히** — 각 팩별 키울 수 있는 역량 카드
3. **보호자는 이렇게 함께해요** — 가입 → 게임 → 성장 추이 확인 3단계
4. **자주 묻는 질문** — 무료 여부, 개인정보, 치료 대체 여부, 적합 연령

---

## 사회 팩 게임 — SocialAssessmentGame (현재 버전)

**파일**: `app/components/game/SocialAssessmentGame.tsx` (~1,447줄)
**배포**: `https://six-pack-one.vercel.app/pack/social` → "🎮 놀이하기" 탭
**GitHub**: `https://github.com/502ouok/six-pack`

### 목적
"초사이언" 발표용 프로토타입 — 초등학생 사회성 평가 (감정 ToM·틀린믿음·사회정보처리)

### 게임 단계 (GameStage)
```
warp-start → warp-traveling → video-playing → landing → dialogue
→ m1-scene → m1-q1 → m1-q2 → m1-q3
→ m2-scene → m2-q1 → m2-q2 → m2-q3
→ m3-scene → m3-q1 → m3-q2 → m3-outcome
→ result-child → result-detail
```

### 3개 미션 측정 영역
| 미션 | 상황 | 측정 |
|---|---|---|
| M1 | 웃고 있지만 속상한 친구 (초록 쥐, 복권 낙첨) | 복합정서 이해, 비언어 단서, 공감 반응 |
| M2 | 사라진 우주 열쇠 (판다·뭉치 틀린믿음 과제) | 조망수용, 틀린믿음 이해 |
| M3 | 무너진 우주선 모형 (강아지가 블록 쓰러뜨림) | 귀인 유형, 사회정보처리 |

### 주요 SVG 캐릭터
- `GreenMouseSVG({ expression })` — `"default"` / `"excited"` / `"fake-happy"` (눈꺼풀 오버레이, 처진 눈동자, 긴장된 미소)
- `PuppySVG({ celebrating })` — 기뻐할 때 팔 추가
- `PandaSVG`, `SpaceshipSVG`

### 영상 경로
- `/public/videos/space-intro.mp4` (실제 src: `/videos/space-intro.mp4.mp4` — 이중 확장자 주의)
- 로딩 실패 시 자동으로 `landing` 단계로 건너뜀

### 발표자 결과 화면
`result-detail`: 각 문항별 ✅/△/⚠️ 해석 라벨 + 반응시간(ms) + 면책 조항
> "발표용 프로토타입으로, 실제 검사 활용을 위해 신뢰도 및 타당도 검증이 필요합니다."

### 관련 파일
- `lib/gameResults.ts` — `ResponseRecord` 타입, localStorage 저장
- `app/admin/social/page.tsx` — 응답 데이터 CSV 다운로드 관리자 페이지

---

## 다음 개발 예정

1. **보호자 대시보드** (`/guardian`) — 아이 계정 연결 및 진행 현황 조회
2. **게임 데이터 Supabase 연동** — localStorage → DB 영속화
3. **측정 결과 저장** — 팩별 점수 히스토리 및 성장 그래프
4. **알림 기능** — 오늘의 습관 체크 알림
