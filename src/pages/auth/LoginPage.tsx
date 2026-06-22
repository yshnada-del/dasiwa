import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { EnvironmentNotice } from "../../components/ui/EnvironmentNotice";
import { Input } from "../../components/ui/Input";
import { signInWithEmail } from "../../features/auth/auth.api";
import { isSupabaseConfigured } from "../../lib/supabase";

const FIGMA_LOGO_URL = "/figma-assets/dasiwa-logo.png";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConfigured = isSupabaseConfigured();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured || isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await signInWithEmail({ email: email.trim(), password });
      navigate("/app/dashboard", { replace: true });
    } catch {
      setErrorMessage("로그인하지 못했어요. 이메일과 비밀번호를 확인해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f2f0] sm:p-6">
      <section className="h-[844px] w-full max-w-[390px] overflow-hidden rounded-[40px] bg-dasiwa-bg px-[28px] pt-[52px] pb-[40px] shadow-[0_24px_64px_rgba(42,26,31,0.12),0_4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col items-center text-center">
          <img alt="다시와" className="h-[52px] w-[69.328px] object-contain" src={FIGMA_LOGO_URL} />
          <p className="mt-0 h-[51px] pb-[32px] text-[12.5px] leading-[18.75px] tracking-[-0.1px] text-[#9b7478]">고객 기록과 재방문 타이밍을 가볍게 관리해요.</p>
        </div>

        <div className="mt-0 grid h-[41.5px] w-[334px] grid-cols-2 border-b-[1.5px] border-[#ead8d0]">
          <Link className="border-b-2 border-dasiwa-primary flex h-[40px] items-center justify-center pb-0 text-center text-[15px] leading-[22.5px] tracking-[-0.3px] font-bold text-dasiwa-primary" to="/login">로그인</Link>
          <Link className="flex h-[40px] items-center justify-center pb-0 text-center text-[15px] leading-[22.5px] tracking-[-0.3px] font-bold text-dasiwa-muted" to="/signup">회원가입</Link>
        </div>

        <div className="mt-7"><EnvironmentNotice /></div>
        <form className="mt-[28px] w-[334px] space-y-4" onSubmit={handleSubmit}>
          <Input autoComplete="email" label="이메일" onChange={(event) => setEmail(event.target.value)} placeholder="이메일을 입력하세요." required type="email" value={email} />
          <label className="block">
            <span className="mb-[6px] block text-[12.5px] font-medium leading-[18.75px] tracking-[-0.1px] text-[#9b7478]">비밀번호</span>
            <div className="flex h-[48px] items-center rounded-[10px] border border-[#ead8d0] bg-[#fffaf7] px-[15px] focus-within:border-dasiwa-primary focus-within:ring-2 focus-within:ring-dasiwa-primary/10">
              <input autoComplete="current-password" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-dasiwa-muted/65" onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호를 입력하세요." required type={showPassword ? "text" : "password"} value={password} />
              <button aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"} className="ml-2 text-dasiwa-muted" onClick={() => setShowPassword((current) => !current)} type="button">
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </label>
          {errorMessage ? <p className="rounded-[14px] bg-dasiwa-primary-soft px-4 py-3 text-[13px] font-medium text-dasiwa-primary">{errorMessage}</p> : null}
          <Button className="mt-2 min-h-[52px] w-full rounded-[12px] text-[15.5px] leading-[23.25px] tracking-[-0.3px]" disabled={!isConfigured || isSubmitting} type="submit">
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </section>
    </main>
  );
}


