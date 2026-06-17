import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { useAiMessage } from "../../features/ai-messages/aiMessages.hooks";
import { useAuth } from "../../features/auth/auth.hooks";
import {
  useFollowUps,
  useMarkFollowUpDone,
} from "../../features/follow-ups/followUps.hooks";
import type {
  FollowUpCustomer,
  FollowUpStatus,
} from "../../features/follow-ups/followUps.types";
import { formatDate } from "../../lib/dates";

const statusLabel: Record<FollowUpStatus, string> = {
  done: "연락 완료",
  overdue: "예정일 지남",
  this_week: "이번 주 예정",
  today: "오늘 연락 추천",
};

const statusTone: Record<FollowUpStatus, "amber" | "green" | "rose" | "stone"> = {
  done: "green",
  overdue: "rose",
  this_week: "amber",
  today: "rose",
};

function FollowUpCard({
  customer,
  isPending,
  onMarkDone,
  userId,
}: {
  customer: FollowUpCustomer;
  isPending: boolean;
  onMarkDone: (customerId: string) => void;
  userId: string;
}) {
  const aiMessage = useAiMessage();

  async function handleGenerateMessage() {
    await aiMessage.generate({
      userId,
      customerId: customer.id,
      treatmentId: null,
      messageType: "revisit_reminder",
      customerName: customer.name,
      serviceName: customer.preferred_service,
      lastVisitDate: customer.last_visit_date,
      nextVisitDueDate: customer.next_visit_due_date,
      tone: "friendly",
    });
  }

  return (
    <article className="rounded-lg border border-stone-200 p-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-stone-950">{customer.name}</h3>
            <Badge tone={statusTone[customer.followUpStatus]}>
              {statusLabel[customer.followUpStatus]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-stone-500">
            {customer.phone || "전화번호 없음"} ·{" "}
            {customer.preferred_service || "선호 시술 없음"}
          </p>
          <p className="mt-1 text-xs text-stone-400">
            마지막 방문 {formatDate(customer.last_visit_date)} · 다음 방문{" "}
            {formatDate(customer.next_visit_due_date)}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="secondary">
            <Link to={`/app/customers/${customer.id}`}>상세 보기</Link>
          </Button>
          <Button
            disabled={aiMessage.isGenerating}
            onClick={handleGenerateMessage}
            type="button"
            variant="secondary"
          >
            {aiMessage.isGenerating ? "생성 중..." : "재방문 메시지"}
          </Button>
          <Button
            disabled={customer.isContactedToday || isPending}
            onClick={() => onMarkDone(customer.id)}
            type="button"
          >
            {customer.isContactedToday
              ? "연락 완료"
              : isPending
                ? "처리 중..."
                : "연락 완료"}
          </Button>
        </div>
      </div>

      {aiMessage.errorMessage ? (
        <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {aiMessage.errorMessage}
        </p>
      ) : null}

      {!aiMessage.generated && !aiMessage.isGenerating ? (
        <div className="mt-4 rounded-lg border border-dashed border-stone-300 p-4 text-sm leading-6 text-stone-500">
          재방문 메시지를 만들면 여기에서 문구를 확인하고 복사할 수 있어요.
          자동 발송은 하지 않으니, 복사 후 직접 보내면 됩니다.
        </div>
      ) : null}

      {aiMessage.generated ? (
        <div className="mt-4 rounded-lg border border-rose-100 bg-rose-50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-6 text-stone-800">
            {aiMessage.generated.message}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button onClick={() => aiMessage.copy(userId)} type="button">
              복사
            </Button>
            {aiMessage.copiedMessage ? (
              <span className="text-sm text-stone-600">
                {aiMessage.copiedMessage}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function FollowUpsPage() {
  const { user } = useAuth();
  const { customers, errorMessage, isLoading, refetch, summary } = useFollowUps(
    user?.id,
  );
  const {
    errorMessage: markDoneErrorMessage,
    markDone,
    pendingCustomerId,
  } = useMarkFollowUpDone();

  async function handleMarkDone(customerId: string) {
    if (!user) {
      return;
    }

    await markDone(user.id, customerId);
    await refetch();
  }

  return (
    <div className="pb-20 lg:pb-0">
      <PageHeader
        eyebrow="이번 주 연락"
        title="재방문 타이밍이 온 고객을 확인하세요"
        description="다음 방문 예정일이 지났거나 이번 주 안에 도래한 고객에게 보낼 메시지를 만들 수 있습니다."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard helper="이번 주 종료일까지" label="연락 대상" value={`${summary.total}명`} />
        <StatCard
          helper="예정일이 이미 지난 고객"
          label="예정일 지남"
          value={`${summary.overdue}명`}
        />
        <StatCard
          helper="오늘 연락하면 좋은 고객"
          label="오늘 추천"
          value={`${summary.today}명`}
        />
        <StatCard
          helper="오늘 이후 이번 주 예정"
          label="이번 주 예정"
          value={`${summary.thisWeek}명`}
        />
        <StatCard
          helper="오늘 처리한 고객"
          label="연락 완료"
          value={`${summary.done}명`}
        />
      </section>

      <section className="mt-5 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="rose">예정일 지남</Badge>
          <Badge tone="rose">오늘 연락 추천</Badge>
          <Badge tone="amber">이번 주 예정</Badge>
          <Badge tone="green">연락 완료</Badge>
        </div>

        {isLoading ? (
          <div className="rounded-lg bg-stone-50 p-6 text-center text-sm text-stone-500">
            연락할 고객을 불러오는 중입니다.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {markDoneErrorMessage ? (
          <div className="mb-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
            {markDoneErrorMessage}
          </div>
        ) : null}

        {!isLoading && !errorMessage && customers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 p-6 text-center">
            <p className="font-medium text-stone-800">
              이번 주 연락할 고객이 없어요.
            </p>
            <p className="mt-2 text-sm text-stone-500">
              고객의 다음 방문 예정일이 생기면 여기에서 확인할 수 있어요.
            </p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && customers.length > 0 && user ? (
          <div className="space-y-3">
            {customers.map((customer) => (
              <FollowUpCard
                customer={customer}
                isPending={pendingCustomerId === customer.id}
                key={customer.id}
                onMarkDone={handleMarkDone}
                userId={user.id}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
