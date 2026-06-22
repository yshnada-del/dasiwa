import { ArrowLeft, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { useAuth } from "../../features/auth/auth.hooks";
import { useCreateCustomer } from "../../features/customers/customers.hooks";

export function CustomerNewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { errorMessage, isSubmitting, submit } = useCreateCustomer();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [preferredService, setPreferredService] = useState("");
  const [defaultRevisitIntervalDays, setDefaultRevisitIntervalDays] = useState("28");
  const [formErrorMessage, setFormErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || isSubmitting) return;
    if (!name.trim()) {
      setFormErrorMessage("고객 이름을 입력해 주세요.");
      return;
    }
    setFormErrorMessage("");
    try {
      const createdCustomer = await submit({
        userId: user.id,
        name: name.trim(),
        phone: phone.trim(),
        memo: memo.trim(),
        preferredService: preferredService.trim(),
        defaultRevisitIntervalDays: Number(defaultRevisitIntervalDays || 28),
      });
      navigate(`/app/customers/${createdCustomer.id}`, { replace: true });
    } catch {
      setFormErrorMessage("고객을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <div className="px-[22px] pt-12">
      <button className="mb-5 inline-flex items-center gap-2 text-[13px] font-bold text-dasiwa-muted" onClick={() => navigate("/app/customers")} type="button"><ArrowLeft className="size-4" />고객 목록</button>
      <h1 className="text-[26px] font-black leading-[34px] text-dasiwa-text">고객 등록</h1>
      <p className="mt-1 text-[13px] leading-5 text-dasiwa-muted">기본 정보와 선호 시술을 가볍게 남겨요.</p>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <section className="space-y-3.5 rounded-[18px] bg-white px-4 py-4">
          <Input label="고객 이름" onChange={(event) => setName(event.target.value)} placeholder="예: 김지현" required value={name} />
          <Input inputMode="tel" label="전화번호" onChange={(event) => setPhone(event.target.value)} placeholder="예: 010-1234-5678" value={phone} />
        </section>
        <section className="space-y-3.5 rounded-[18px] bg-white px-4 py-4">
          <Input label="선호 시술" onChange={(event) => setPreferredService(event.target.value)} placeholder="예: 젤 네일" value={preferredService} />
          <Textarea className="min-h-28" label="메모" onChange={(event) => setMemo(event.target.value)} placeholder="취향, 주의할 점, 다음에 챙길 내용을 남겨요." value={memo} />
        </section>
        <section className="space-y-3.5 rounded-[18px] bg-white px-4 py-4">
          <Input inputMode="numeric" label="기본 재방문 주기" min={1} onChange={(event) => setDefaultRevisitIntervalDays(event.target.value)} type="number" value={defaultRevisitIntervalDays} />
          <p className="text-[12px] leading-5 text-dasiwa-muted">시술 기록을 추가할 때 이 주기를 기준으로 다음 방문일을 계산해요.</p>
        </section>
        {formErrorMessage || errorMessage ? <p className="rounded-[14px] bg-dasiwa-primary-soft px-4 py-3 text-[13px] text-dasiwa-primary">{formErrorMessage || errorMessage}</p> : null}
        <Button className="w-full" disabled={!user || isSubmitting} type="submit"><Save className="size-4" />{isSubmitting ? "저장 중..." : "고객 저장하기"}</Button>
      </form>
    </div>
  );
}
