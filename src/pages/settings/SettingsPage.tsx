import { ChevronRight, LogOut, RotateCcw, Save } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../features/auth/auth.hooks";
import { useProfile, useUpdateProfile } from "../../features/profiles/profiles.hooks";
import { ONBOARDING_COMPLETED_KEY } from "../../lib/onboarding";

const FIGMA_LOGO_URL = "http://localhost:3845/assets/5335b8b6d0e169e7cf8bdd06dbd8eda6f830d691.png";

export function SettingsPage() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile, errorMessage, isLoading, refetch } = useProfile(user?.id);
  const updateProfile = useUpdateProfile();
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [defaultRevisitIntervalDays, setDefaultRevisitIntervalDays] = useState("28");
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    if (!profile) return;
    setShopName(profile.shop_name);
    setOwnerName(profile.owner_name ?? "");
    setDefaultRevisitIntervalDays(String(profile.default_revisit_interval_days));
  }, [profile]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setInfoMessage("");
    await updateProfile.submit({ userId: user.id, shopName: shopName.trim(), ownerName: ownerName.trim(), defaultRevisitIntervalDays: Number(defaultRevisitIntervalDays || 28) });
    await refetch();
    setInfoMessage("저장했어요.");
  }

  function replayOnboarding() {
    localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
    navigate("/onboarding");
  }

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="pt-12">
      <header className="h-[61px] px-[22px] pb-[14px]"><h1 className="text-[20px] font-bold leading-[26px] tracking-[-0.5px] text-dasiwa-text">설정</h1><p className="mt-[3px] text-[12px] font-normal leading-[18px] tracking-[-0.1px] text-[#c4a8ab]">내 샵 정보와 앱 사용 설정을 관리해요.</p></header>

      <section className="h-[105px] pt-0"><div className="mx-[22px] flex h-[85px] w-[331px] items-center rounded-[16px] border border-[#ead8d0] bg-white p-[17px]"><div className="flex size-12 shrink-0 items-center justify-center rounded-[24px] border-2 border-dasiwa-accent bg-[#fff3ee] text-[18px] font-bold leading-[27px] text-dasiwa-accent">{(ownerName || shopName || "다").slice(0, 1)}</div><div className="ml-[13px] min-w-0 flex-1"><div className="flex items-center gap-[7px]"><h2 className="truncate text-[16px] font-bold leading-6 tracking-[-0.3px] text-dasiwa-text">{shopName || "샵 이름"}</h2><span className="rounded-[5px] bg-[#f5f0ee] px-[7px] py-0.5 text-[11px] font-medium leading-[16.5px] text-[#9b7478]">{ownerName || "원장님"}</span></div><p className="mt-[3px] truncate text-[12px] font-normal leading-[18px] text-[#c4a8ab]">{user?.email}</p></div><img alt="다시와" className="h-[22px] w-[29.328px] object-contain" src={FIGMA_LOGO_URL} /></div></section>
      <div className="h-2 bg-[#f2e6df]" />

      <form onSubmit={handleSubmit}>
        <section className="h-[44px] px-[22px] pt-[18px]"><h2 className="text-[11.5px] font-bold uppercase leading-[17.25px] tracking-[0.3px] text-[#c4a8ab]">내 샵 정보</h2></section>
        <section className="px-[22px]">
          <div className="space-y-[14px]">
            <Input disabled={isLoading} label="샵 이름" onChange={(event) => setShopName(event.target.value)} value={shopName} />
            <Input disabled={isLoading} label="원장님 이름" onChange={(event) => setOwnerName(event.target.value)} value={ownerName} />
            <label className="block"><span className="mb-[5px] block text-[11.5px] font-medium leading-[17.25px] tracking-[-0.1px] text-[#9b7478]">기본 재방문 주기</span><div className="relative w-[331px]"><input className="h-[44px] w-full rounded-[10px] border border-[#ead8d0] bg-white px-[14px] pr-[45px] text-[14px] leading-[21px] tracking-[-0.1px] outline-none" disabled={isLoading} inputMode="numeric" min={1} onChange={(event) => setDefaultRevisitIntervalDays(event.target.value)} type="number" value={defaultRevisitIntervalDays} /><span className="absolute right-[14px] top-[12.25px] text-[13px] font-normal leading-[19.5px] text-[#c4a8ab]">주</span></div></label>
            <p className="text-[12px] font-normal leading-[18px] text-[#c4a8ab]">새 고객이나 시술 기록을 추가할 때 기본값으로 사용돼요.</p>
            <Button className="min-h-[48px] w-[331px] rounded-[12px] text-[14.5px] leading-[21.75px] tracking-[-0.2px]" disabled={!user || updateProfile.isSubmitting} type="submit"><Save className="size-4" />{updateProfile.isSubmitting ? "저장 중..." : "저장하기"}</Button>
          </div>
          {errorMessage || updateProfile.errorMessage || infoMessage ? <p className="mt-3 rounded-[12px] bg-dasiwa-primary-soft px-3 py-2 text-[12px] text-dasiwa-primary">{errorMessage || updateProfile.errorMessage || infoMessage}</p> : null}
        </section>
      </form>

      <div className="mt-[17px] h-2 bg-[#f2e6df]" />
      <section><div className="h-[44px] px-[22px] pt-[18px]"><h2 className="text-[11.5px] font-bold uppercase leading-[17.25px] tracking-[0.3px] text-[#c4a8ab]">앱 설정</h2></div><div className="mx-[22px] overflow-hidden rounded-[14px] border border-[#ead8d0] bg-white"><button className="flex h-[71px] w-full items-center gap-[11px] px-4 text-left" onClick={replayOnboarding} type="button"><span className="flex size-8 items-center justify-center rounded-full bg-dasiwa-primary-soft text-dasiwa-primary"><RotateCcw className="size-[15px]" /></span><span className="min-w-0 flex-1"><span className="block text-[14px] font-medium leading-[21px] tracking-[-0.2px] text-dasiwa-text">온보딩 다시 보기</span><span className="mt-1 block text-[11.5px] font-medium leading-[17.25px] tracking-[-0.1px] text-[#c4a8ab]">앱 소개 화면을 처음부터 다시 확인해요</span></span><ChevronRight className="size-3.5 text-dasiwa-muted" /></button><div className="mx-4 h-px bg-dasiwa-border" /><button className="flex h-[58px] w-full items-center gap-[11px] px-4 text-left" onClick={handleSignOut} type="button"><span className="flex size-8 items-center justify-center rounded-full bg-dasiwa-primary-soft text-dasiwa-primary"><LogOut className="size-[15px]" /></span><span className="text-[14px] font-medium leading-[21px] tracking-[-0.2px] text-dasiwa-text">로그아웃</span></button></div></section>
      <section className="mx-[22px] mt-5 flex min-h-[60.78px] gap-2 rounded-[16px] bg-white/70 px-[15px] py-3 text-[12px] font-normal leading-[18px] text-[#c4a8ab]">다시와는 현재 베타 버전이에요. 알림, 결제, 카카오/네이버 연동은 추후 제공될 예정입니다.</section>
      <p className="h-[61px] px-[22px] pb-[24px] pt-[20px] text-center text-[11px] font-normal leading-[16.5px] tracking-[0.2px] text-[#c4a8ab]">다시와 v0.1.0 (Beta)</p>
    </div>
  );
}


