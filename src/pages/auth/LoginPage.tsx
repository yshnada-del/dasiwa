import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { EnvironmentNotice } from "../../components/ui/EnvironmentNotice";
import { Input } from "../../components/ui/Input";
import { signInWithEmail } from "../../features/auth/auth.api";
import { isSupabaseConfigured } from "../../lib/supabase";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConfigured = isSupabaseConfigured();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured || isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signInWithEmail({
        email: email.trim(),
        password,
      });
      navigate("/app/dashboard", { replace: true });
    } catch {
      setErrorMessage("로그인하지 못했어요. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-rose-700">다시와</p>
          <h1 className="mt-2 text-2xl font-bold text-stone-950">로그인</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            고객의 시술 기록과 재방문 타이밍을 이어서 확인하세요.
          </p>
        </div>

        <EnvironmentNotice />

        <form className="space-y-4" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            label="비밀번호"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호"
            required
            type="password"
            value={password}
          />

          {errorMessage ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <Button className="w-full" disabled={!isConfigured || isSubmitting} type="submit">
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-stone-600">
          처음이신가요?{" "}
          <Link className="font-medium text-rose-700 hover:text-rose-800" to="/signup">
            회원가입
          </Link>
        </p>
      </section>
    </main>
  );
}
