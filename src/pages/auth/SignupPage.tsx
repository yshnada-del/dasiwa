import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { EnvironmentNotice } from "../../components/ui/EnvironmentNotice";
import { Input } from "../../components/ui/Input";
import { signUpWithEmail } from "../../features/auth/auth.api";
import { isSupabaseConfigured } from "../../lib/supabase";

export function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConfigured = isSupabaseConfigured();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured || isSubmitting) {
      return;
    }

    setErrorMessage("");
    setInfoMessage("");
    setIsSubmitting(true);

    try {
      const result = await signUpWithEmail({
        email: email.trim(),
        ownerName: ownerName.trim(),
        password,
        shopName: shopName.trim(),
      });

      if (result.requiresEmailConfirmation) {
        setInfoMessage("가입 요청이 완료됐어요. 메일 인증 후 로그인해주세요.");
        return;
      }

      navigate("/app/dashboard", { replace: true });
    } catch {
      setErrorMessage("가입하지 못했어요. 입력값을 확인하고 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-rose-700">다시와 시작하기</p>
          <h1 className="mt-2 text-2xl font-bold text-stone-950">회원가입</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            1인샵 고객 기억 공간을 준비합니다.
          </p>
        </div>

        <EnvironmentNotice />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="샵 이름"
            onChange={(event) => setShopName(event.target.value)}
            placeholder="예: 모아네일"
            required
            value={shopName}
          />
          <Input
            label="원장님 이름"
            onChange={(event) => setOwnerName(event.target.value)}
            placeholder="예: 유나"
            required
            value={ownerName}
          />
          <Input
            autoComplete="email"
            label="이메일"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="owner@example.com"
            required
            type="email"
            value={email}
          />
          <Input
            autoComplete="new-password"
            label="비밀번호"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="6자 이상"
            required
            type="password"
            value={password}
          />

          {errorMessage ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          {infoMessage ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {infoMessage}
            </p>
          ) : null}

          <Button className="w-full" disabled={!isConfigured || isSubmitting} type="submit">
            {isSubmitting ? "가입 처리 중..." : "회원가입"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-stone-600">
          이미 계정이 있나요?{" "}
          <Link className="font-medium text-rose-700 hover:text-rose-800" to="/login">
            로그인
          </Link>
        </p>
      </section>
    </main>
  );
}
