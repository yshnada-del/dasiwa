import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isOnboardingCompleted } from "../../lib/onboarding";

const FIGMA_LOGO_URL = "http://localhost:3845/assets/5335b8b6d0e169e7cf8bdd06dbd8eda6f830d691.png";

export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate(isOnboardingCompleted() ? "/login" : "/onboarding", { replace: true });
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f2f0] sm:p-6">
      <section className="relative h-[844px] w-full max-w-[390px] overflow-hidden rounded-[40px] bg-[#fff8f1] text-center shadow-[0_24px_72px_rgba(42,26,31,0.13),0_2px_12px_rgba(0,0,0,0.05)]">
        <div className="absolute left-1/2 top-[300px] h-[123px] w-[237px] -translate-x-1/2">
          <img alt="다시와" className="mx-auto h-[123px] w-[164px] object-contain" src={FIGMA_LOGO_URL} />
        </div>
        <p className="absolute left-1/2 top-[462px] w-[190px] -translate-x-1/2 text-center text-[15px] font-bold leading-[25.5px] tracking-[-0.2px] text-[#2a1a1f]">
          단골이 다시 오는 순간을<br />놓치지 않게
        </p>
        <p className="absolute left-1/2 top-[535px] w-[260px] -translate-x-1/2 text-center text-[11.5px] font-normal leading-[17.25px] tracking-[-0.1px] text-[#c4a8ab]">
          고객 기록과 재방문 타이밍을 가볍게 관리해요.
        </p>
        <div className="absolute bottom-[36px] left-1/2 flex -translate-x-1/2 items-center gap-[6px]">
          <span className="h-px w-[22px] bg-[#ffb6a3]" />
          <span className="text-[10px] font-medium leading-[15px] tracking-[0.2px] text-[#c4a8ab]">dasiwa</span>
          <span className="h-px w-[22px] bg-[#ffb6a3]" />
        </div>
      </section>
    </main>
  );
}
