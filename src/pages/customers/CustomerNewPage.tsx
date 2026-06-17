import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || isSubmitting) {
      return;
    }

    const createdCustomer = await submit({
      userId: user.id,
      name: name.trim(),
      phone: phone.trim(),
      memo: memo.trim(),
      preferredService: preferredService.trim(),
      defaultRevisitIntervalDays: Number(defaultRevisitIntervalDays || 28),
    });

    navigate(`/app/customers/${createdCustomer.id}`, { replace: true });
  }

  return (
    <div className="pb-20 lg:pb-0">
      <PageHeader
        eyebrow="고객 등록"
        title="처음 기억할 정보를 가볍게 남기세요"
        description="고객 이름만 필수입니다. 나머지는 시술 후 천천히 채워도 괜찮아요."
      />

      <form
        className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="고객 이름"
            onChange={(event) => setName(event.target.value)}
            placeholder="예: 김지현"
            required
            value={name}
          />
          <Input
            label="전화번호"
            onChange={(event) => setPhone(event.target.value)}
            placeholder="예: 010-0000-0000"
            value={phone}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="선호 시술"
            onChange={(event) => setPreferredService(event.target.value)}
            placeholder="예: 젤네일, 속눈썹 펌"
            value={preferredService}
          />
          <Input
            label="기본 재방문 주기"
            min={1}
            onChange={(event) => setDefaultRevisitIntervalDays(event.target.value)}
            placeholder="예: 28"
            type="number"
            value={defaultRevisitIntervalDays}
          />
        </div>
        <Textarea
          label="고객 메모"
          onChange={(event) => setMemo(event.target.value)}
          placeholder="취향, 주의할 점, 자주 고르는 컬러 등을 간단히 남깁니다."
          value={memo}
        />

        {errorMessage ? (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            저장하지 못했어요. 입력값을 확인해주세요.
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            onClick={() => navigate("/app/customers")}
            type="button"
            variant="secondary"
          >
            취소
          </Button>
          <Button disabled={!user || isSubmitting} type="submit">
            {isSubmitting ? "저장 중..." : "고객 저장"}
          </Button>
        </div>
      </form>
    </div>
  );
}
