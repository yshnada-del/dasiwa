import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isOnboardingCompleted } from "../../lib/onboarding";

const FIGMA_LOGO_URL = "/figma-assets/dasiwa-logo.png";

export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate(isOnboardingCompleted() ? "/login" : "/onboarding", { replace: true });
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <main className="flex h-[100svh] min-h-[100svh] items-center justify-center overflow-hidden bg-[#fff8f1] supports-[height:100dvh]:h-[100dvh] supports-[height:100dvh]:min-h-[100dvh] md:bg-[#f4f2f0] md:p-6">
      <section className="relative h-full min-h-full w-screen overflow-hidden bg-[#fff8f1] text-center md:h-[844px] md:min-h-0 md:w-full md:max-w-[390px] md:rounded-[40px] md:shadow-[0_24px_72px_rgba(42,26,31,0.13),0_2px_12px_rgba(0,0,0,0.05)]">
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-[58%] flex-col items-center px-6 md:-translate-y-1/2">
          <img alt="다시와" className="h-[123px] w-[164px] object-contain" src={FIGMA_LOGO_URL} />
          <p className="mt-[39px] w-[190px] text-center text-[15px] font-bold leading-[25.5px] tracking-[-0.2px] text-[#2a1a1f]">
            단골이 다시 오는 순간을<br />놓치지 않게
          </p>
          <p className="mt-[31px] w-[260px] text-center text-[11.5px] font-normal leading-[17.25px] tracking-[-0.1px] text-[#c4a8ab]">
            고객 기록과 재방문 타이밍을 가볍게 관리해요.
          </p>
        </div>
        <div className="absolute bottom-[calc(36px+env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 items-center gap-[6px] md:bottom-[36px]">
          <span className="h-px w-[22px] bg-[#ffb6a3]" />
          <span className="text-[10px] font-medium leading-[15px] tracking-[0.2px] text-[#c4a8ab]">dasiwa</span>
          <span className="h-px w-[22px] bg-[#ffb6a3]" />
        </div>
      </section>
    </main>
  );
}
