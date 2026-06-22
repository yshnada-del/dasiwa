import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { completeOnboarding } from "../../lib/onboarding";

type Slide = {
  description: string;
  illustrationUrl: string;
  title: string;
};

const FIGMA_SYMBOL_URL = "/figma-assets/dasiwa-symbol.svg";

const slides: Slide[] = [
  {
    illustrationUrl: "/onboarding-card-figma.png",
    title: "고객 취향을 기억해요",
    description: "방문 기록과 메모를 한곳에 남겨두고, 다음 방문 때 바로 확인해요.",
  },
  {
    illustrationUrl: "/onboarding-photo-figma.png",
    title: "시술 사진을 모아봐요",
    description: "고객별 시술 히스토리를 사진으로 남기고, 이전 스타일을 쉽게 찾아봐요.",
  },
  {
    illustrationUrl: "/onboarding-connect-figma.png",
    title: "다시 연락할 타이밍을 알려줘요",
    description: "다음 방문 예정일에 맞춰 이번 주 연락할 고객을 확인해요.",
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  function finish() {
    completeOnboarding();
    navigate("/login", { replace: true });
  }

  function next() {
    if (isLast) {
      finish();
      return;
    }
    setIndex((current) => current + 1);
  }

  return (
    <main className="flex h-[100svh] min-h-[100svh] items-center justify-center overflow-hidden bg-[#fff8f1] supports-[height:100dvh]:h-[100dvh] supports-[height:100dvh]:min-h-[100dvh] md:bg-[#f4f2f0] md:p-6">
      <section className="relative flex h-full min-h-full w-screen flex-col overflow-hidden bg-[#fff8f1] px-7 text-center md:h-[844px] md:min-h-0 md:w-full md:max-w-[390px] md:rounded-[40px] md:shadow-[0_24px_72px_rgba(42,26,31,0.13),0_2px_12px_rgba(0,0,0,0.05)]">
        <header className="relative flex h-[calc(78px+env(safe-area-inset-top))] shrink-0 items-end justify-center pt-[calc(54px+env(safe-area-inset-top))] md:h-[78px] md:pt-14">
          <img alt="" className="h-[21.594px] w-9 object-contain" src={FIGMA_SYMBOL_URL} />
          <button className="absolute right-0 top-[calc(55.75px+env(safe-area-inset-top))] text-[13px] font-medium leading-[19.5px] tracking-[-0.2px] text-[#c4a8ab] md:top-[55.75px]" onClick={finish} type="button">
            건너뛰기
          </button>
        </header>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center pb-5 pt-2">
          <img alt="" className="h-[188px] w-[188px] object-contain min-[375px]:h-[200px] min-[375px]:w-[200px] min-[390px]:h-[210px] min-[390px]:w-[210px] md:h-[220px] md:w-[220px]" src={slide.illustrationUrl} />
          <div className="mt-[38px] w-full min-[390px]:mt-[48px] md:mt-[57px]">
            <h1 className="text-[22px] font-bold leading-[31.9px] tracking-[-0.5px] text-[#2a1a1f]">{slide.title}</h1>
            <p className="mx-auto mt-3 max-w-[318px] text-[14px] font-normal leading-[23.8px] tracking-[-0.2px] text-[#9b7478]">{slide.description}</p>
          </div>
        </div>
        <div className="w-full shrink-0 pb-[calc(52px+env(safe-area-inset-bottom))] md:pb-[52px]">
          <div className="mb-5 flex h-[7px] justify-center gap-2">
            {slides.map((item, slideIndex) => (
              <span className={slideIndex === index ? "h-[7px] w-[22px] rounded-[4px] bg-[#d4144f]" : "size-[7px] rounded-full bg-[#ffb6a3] opacity-35"} key={item.title} />
            ))}
          </div>
          <Button className="min-h-[54px] w-full rounded-[14px] text-[16px] font-bold leading-[24px] tracking-[-0.3px]" onClick={next} type="button">
            {isLast ? "시작하기" : "다음"}
          </Button>
        </div>
      </section>
    </main>
  );
}

