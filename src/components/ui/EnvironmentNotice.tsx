import { isSupabaseConfigured } from "../../lib/supabase";

export function EnvironmentNotice() {
  if (isSupabaseConfigured()) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="font-semibold">Supabase 환경변수가 필요합니다.</p>
      <p className="mt-1">
        프로젝트 루트의 .env 파일에 VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY를 입력한 뒤 개발 서버를 다시 실행해주세요.
      </p>
    </div>
  );
}
