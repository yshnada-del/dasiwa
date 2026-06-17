# 다시와

1인샵 원장님을 위한 고객 기억 CRM MVP입니다.

예약 관리 앱이 아니라, 고객별 시술 기록과 사진을 남기고 다음 방문 타이밍에 맞춰 연락할 고객을 놓치지 않도록 돕는 웹앱입니다.

## MVP 기능

- 회원가입 / 로그인 / 로그아웃
- 고객 등록 / 고객 리스트 / 고객 상세
- 고객별 시술 기록 추가 / 조회
- 시술 사진 업로드 / signed URL 조회
- 다음 방문 예정일 자동 계산
- 이번 주 연락할 고객 조회
- 연락 완료 처리
- AI 후기 요청 메시지 생성
- AI 재방문 유도 메시지 생성
- 생성 메시지 복사

## 기술 스택

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Vercel Serverless Functions
- OpenAI API

## 로컬 실행

```bash
npm install
npm.cmd run dev
```

일반 터미널에서는 아래 명령도 사용할 수 있습니다.

```bash
npm run dev
```

AI 서버 함수까지 로컬에서 확인하려면 Vercel dev를 사용합니다.

```bash
npx vercel dev
```

## 환경변수

루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

주의:

- `OPENAI_API_KEY`에는 절대 `VITE_` 접두사를 붙이지 않습니다.
- OpenAI API Key는 프론트엔드에 노출되면 안 됩니다.
- `.env` 파일은 GitHub에 올리지 않습니다.

## Supabase 설정

SQL Editor에서 아래 파일을 실행합니다.

- `supabase/schema.sql`
- `supabase/storage-policies.sql`

Storage에는 private bucket이 필요합니다.

```txt
treatment-photos
```

## 빌드

```bash
npm run build
```

## 현재 알려진 사항

AI 메시지 생성은 OpenAI API quota 또는 결제 상태에 따라 실패할 수 있습니다. 이 경우 코드 문제가 아니라 OpenAI 계정의 결제/사용량 설정을 확인해야 합니다.
