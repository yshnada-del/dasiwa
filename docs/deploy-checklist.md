# 다시와 배포 체크리스트

## 1. 로컬 최종 확인

- [ ] `npm install` 완료
- [ ] `.env`에 로컬 환경변수 설정 완료
- [ ] `npm run build` 성공
- [ ] 회원가입 / 로그인 / 로그아웃 확인
- [ ] 고객 등록 / 리스트 / 상세 확인
- [ ] 시술 기록 추가 / 조회 확인
- [ ] 사진 업로드 / signed URL 표시 확인
- [ ] 이번 주 연락할 고객 확인
- [ ] 연락 완료 처리 확인
- [ ] AI 메시지 생성은 OpenAI quota/결제 상태 확인 후 테스트

## 2. GitHub 업로드 전 확인

- [ ] `.env`가 Git에 포함되지 않는다.
- [ ] `.env.local`이 Git에 포함되지 않는다.
- [ ] `node_modules`가 Git에 포함되지 않는다.
- [ ] `dist`가 Git에 포함되지 않는다.
- [ ] `.vercel`이 Git에 포함되지 않는다.
- [ ] 실제 API Key가 README, 문서, 코드에 들어 있지 않다.

## 3. Vercel 환경변수

Vercel Project Settings > Environment Variables에 아래 값을 등록합니다.

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
OPENAI_API_KEY
```

주의:

- `OPENAI_API_KEY`는 서버 전용입니다.
- `VITE_OPENAI_API_KEY`는 만들지 않습니다.
- Preview / Production 환경에 모두 필요한 값이 들어갔는지 확인합니다.

## 4. Supabase 배포 전 확인

- [ ] `profiles` 테이블 존재
- [ ] `customers` 테이블 존재
- [ ] `treatments` 테이블 존재
- [ ] `treatment_photos` 테이블 존재
- [ ] `follow_up_logs` 테이블 존재
- [ ] `ai_message_logs` 테이블 존재
- [ ] 모든 사용자 데이터 테이블 RLS 활성화
- [ ] `auth.uid() = user_id` 또는 `auth.uid() = id` 정책 적용
- [ ] `treatment-photos` Storage bucket 생성
- [ ] `treatment-photos` bucket이 private
- [ ] `supabase/storage-policies.sql` 실행 완료
- [ ] 다른 계정 데이터 접근 차단 테스트 완료

## 5. Vercel 배포 후 확인

- [ ] 배포 URL 접속 가능
- [ ] 회원가입 가능
- [ ] 로그인 가능
- [ ] 고객 등록 가능
- [ ] 시술 기록 추가 가능
- [ ] 사진 업로드 가능
- [ ] 이번 주 연락할 고객 표시
- [ ] 연락 완료 처리 가능
- [ ] AI 메시지 생성 API가 `/api/generate-message`에서 응답
- [ ] OpenAI quota 부족 시 사용자에게 안전한 에러 메시지 표시

## 6. 알려진 리스크

- OpenAI API quota 또는 결제 설정이 없으면 AI 메시지 생성이 실패합니다.
- Vercel 로컬 개발에서 Node 24 + Windows 조합은 `vercel dev`가 불안정할 수 있습니다.
- 로컬 AI 테스트는 Node 20 또는 Node 22 LTS 환경을 권장합니다.
- Storage bucket 정책이 빠지면 사진 업로드 또는 signed URL 조회가 실패합니다.
