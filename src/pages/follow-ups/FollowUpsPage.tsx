import { CalendarHeart, Copy } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAiMessage } from "../../features/ai-messages/aiMessages.hooks";
import { useAuth } from "../../features/auth/auth.hooks";
import { useFollowUps, useMarkFollowUpDone } from "../../features/follow-ups/followUps.hooks";
import type { FollowUpCustomer, FollowUpStatus } from "../../features/follow-ups/followUps.types";
import { formatDate } from "../../lib/dates";

const FIGMA_LOGO_URL = "http://localhost:3845/assets/5335b8b6d0e169e7cf8bdd06dbd8eda6f830d691.png";

const statusLabel: Record<FollowUpStatus, string> = { overdue: "예정일 지남", today: "오늘 추천", this_week: "이번 주", done: "완료" };
const statusTone: Record<FollowUpStatus, "amber" | "green" | "rose" | "stone"> = { overdue: "rose", today: "rose", this_week: "amber", done: "green" };

type FollowUpFilter = "all" | FollowUpStatus;

function FilterTab({ active, children, count, onClick }: { active?: boolean; children: string; count?: number; onClick: () => void }) {
  return (
    <button
      className={[
        "h-full shrink-0 rounded-[20px] border border-solid",
        active ? "border-[#d4144f] bg-[#fdf0f3]" : "border-[#ead8d0] bg-transparent",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      <span className="flex size-full items-center gap-[4px] px-[13px] py-[6px]">
        <span
          className={[
            "font-['Noto_Sans_KR'] text-center text-[12px] leading-[18px] tracking-[-0.1px] whitespace-nowrap",
            active ? "font-bold text-[#d4144f]" : "font-normal text-[#9b7478]",
          ].join(" ")}
        >
          {children}
        </span>
        {typeof count === "number" ? (
          <span className={["relative h-[16px] w-[15.703px] shrink-0 rounded-[10px]", active ? "bg-[#d4144f]" : "bg-[#ead8d0]"].join(" ")}>
            <span
              className={[
                "absolute left-[8px] top-[-1px] -translate-x-1/2 font-['Noto_Sans_KR'] text-center text-[10px] font-bold leading-[14px] tracking-[-0.1px] whitespace-nowrap",
                active ? "text-white" : "text-[#c4a8ab]",
              ].join(" ")}
            >
              {count}
            </span>
          </span>
        ) : null}
      </span>
    </button>
  );
}

function FollowUpCard({ customer, isPending, onMarkDone, userId }: { customer: FollowUpCustomer; isPending: boolean; onMarkDone: (customerId: string) => void; userId: string }) {
  const aiMessage = useAiMessage();
  async function handleGenerateMessage() {
    await aiMessage.generate({ userId, customerId: customer.id, treatmentId: null, messageType: "revisit_reminder", customerName: customer.name, serviceName: customer.preferred_service, lastVisitDate: customer.last_visit_date, nextVisitDueDate: customer.next_visit_due_date, tone: "friendly" });
  }

  return (
    <article className="border-b border-[#f0e4dc] bg-white">
      <div className="flex min-h-[113.5px] w-[375px] items-start px-5 py-3.5">
        <div className="flex size-[42px] shrink-0 items-center justify-center rounded-[21px] bg-[#fff3ee] text-[15px] font-bold text-dasiwa-primary">{customer.name.slice(0, 1)}</div>
        <div className="ml-3 min-w-0 flex-1">
          <div className="flex items-center gap-2"><h2 className="truncate text-[15px] font-bold leading-[22.5px] tracking-[-0.3px] text-dasiwa-text">{customer.name}</h2><span className="h-[19.75px] rounded-[5px] bg-[#fdf0f3] px-[7px] pt-px text-[10.5px] font-medium leading-[15.75px] tracking-[-0.1px] text-dasiwa-primary">{statusLabel[customer.followUpStatus]}</span></div>
          <p className="mt-0.5 truncate text-[12.5px] font-normal leading-[18.75px] tracking-[-0.1px] text-[#9b7478]">{customer.preferred_service || "선호 시술 없음"} · {customer.phone || "전화번호 없음"}</p>
          <p className="mt-1 text-[11.5px] font-normal leading-[17.25px] tracking-[-0.1px] text-[#c4a8ab]">최근 {formatDate(customer.last_visit_date)} · 다음 {formatDate(customer.next_visit_due_date)}</p>
          <div className="mt-2 flex gap-1.5"><button className="h-[28px] rounded-[7px] bg-dasiwa-bg px-2.5 text-[11px] font-bold text-dasiwa-primary" disabled={aiMessage.isGenerating} onClick={handleGenerateMessage} type="button">AI 문구</button><button className="h-[28px] rounded-[7px] bg-dasiwa-primary px-2.5 text-[11px] font-bold text-white" disabled={customer.isContactedToday || isPending} onClick={() => onMarkDone(customer.id)} type="button">{customer.isContactedToday ? "완료됨" : "완료"}</button><Link className="h-[28px] rounded-[7px] bg-dasiwa-bg px-2.5 pt-[6px] text-[11px] font-bold text-dasiwa-muted" to={`/app/customers/${customer.id}`}>상세</Link></div>
        </div>
      </div>
      {aiMessage.generated ? <div className="mx-5 mb-3 rounded-[12px] bg-dasiwa-bg p-3"><p className="whitespace-pre-wrap text-[12px] leading-5 text-dasiwa-text">{aiMessage.generated.message}</p><Button className="mt-2 min-h-8 px-3 text-[11px]" onClick={() => aiMessage.copy(userId)} type="button"><Copy className="size-3" />복사</Button></div> : null}
      {aiMessage.errorMessage ? <p className="mx-5 mb-3 rounded-[12px] bg-dasiwa-primary-soft px-3 py-2 text-[12px] text-dasiwa-primary">{aiMessage.errorMessage}</p> : null}
    </article>
  );
}

export function FollowUpsPage() {
  const { user } = useAuth();
  const { customers, errorMessage, isLoading, refetch, summary } = useFollowUps(user?.id);
  const { errorMessage: markDoneErrorMessage, markDone, pendingCustomerId } = useMarkFollowUpDone();
  const [activeFilter, setActiveFilter] = useState<FollowUpFilter>("all");
  const dragState = useRef({ dragging: false, moved: false, startX: 0, scrollLeft: 0 });
  const visibleCustomers = activeFilter === "all" ? customers : customers.filter((customer) => customer.followUpStatus === activeFilter);

  async function handleMarkDone(customerId: string) {
    if (!user) return;
    await markDone(user.id, customerId);
    await refetch();
  }

  return (
    <div className="pt-12">
      <header className="h-[108.5px] px-[22px]">
        <div className="flex h-[47px] justify-between"><div><h1 className="text-[20px] font-bold leading-[26px] tracking-[-0.5px] text-dasiwa-text">이번 주 연락</h1><p className="mt-[3px] text-[12px] font-normal leading-[18px] tracking-[-0.1px] text-[#c4a8ab]">재방문 타이밍이 온 고객을 확인하세요.</p></div><img alt="다시와" className="mt-0.5 h-[26px] w-[34.656px] object-contain" src={FIGMA_LOGO_URL} /></div>
        <div className="mt-[10px] flex h-[37.5px] items-center rounded-[10px] border border-[#ead8d0] bg-white px-[13px]"><span className="text-[12.5px] font-medium leading-[18.75px] tracking-[-0.1px] text-[#9b7478]">연락 대상</span><span className="ml-[6px] text-[13px] font-bold leading-[19.5px] tracking-[-0.1px] text-[#d4144f]">{summary.total}명</span><span className="mx-[15px] h-3 w-px bg-[#ead8d0]" /><span className="text-[12.5px] font-medium leading-[18.75px] tracking-[-0.1px] text-[#9b7478]">완료</span><span className="ml-[6px] text-[13px] font-bold leading-[19.5px] tracking-[-0.1px] text-[#2f9e73]">{summary.done}명</span></div>
      </header>
      <div
        className="flex h-[42px] cursor-grab gap-[6px] overflow-x-auto overflow-y-hidden px-[22px] pb-[12px] select-none active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={(event) => {
          dragState.current = { dragging: true, moved: false, startX: event.clientX, scrollLeft: event.currentTarget.scrollLeft };
        }}
        onPointerLeave={() => {
          dragState.current.dragging = false;
        }}
        onPointerMove={(event) => {
          if (!dragState.current.dragging) return;
          const deltaX = event.clientX - dragState.current.startX;
          if (Math.abs(deltaX) > 3) dragState.current.moved = true;
          event.currentTarget.scrollLeft = dragState.current.scrollLeft - deltaX;
        }}
        onPointerUp={() => {
          dragState.current.dragging = false;
        }}
      ><FilterTab active={activeFilter === "all"} count={summary.total} onClick={() => { if (!dragState.current.moved) setActiveFilter("all"); }}>전체</FilterTab><FilterTab active={activeFilter === "overdue"} count={summary.overdue} onClick={() => { if (!dragState.current.moved) setActiveFilter("overdue"); }}>예정일 지남</FilterTab><FilterTab active={activeFilter === "today"} count={summary.today} onClick={() => { if (!dragState.current.moved) setActiveFilter("today"); }}>오늘 추천</FilterTab><FilterTab active={activeFilter === "this_week"} count={summary.thisWeek} onClick={() => { if (!dragState.current.moved) setActiveFilter("this_week"); }}>이번 주</FilterTab><FilterTab active={activeFilter === "done"} count={summary.done} onClick={() => { if (!dragState.current.moved) setActiveFilter("done"); }}>완료</FilterTab></div>
      {isLoading ? <p className="px-4 py-6 text-center text-[12px] text-dasiwa-muted">연락할 고객을 불러오는 중이에요.</p> : null}
      {errorMessage || markDoneErrorMessage ? <p className="mx-[22px] rounded-[12px] bg-dasiwa-primary-soft px-3 py-2 text-[12px] text-dasiwa-primary">{errorMessage || markDoneErrorMessage}</p> : null}
      {!isLoading && !errorMessage && visibleCustomers.length === 0 ? <section className="relative h-[562.75px]"><div className="absolute left-[167px] top-[207px] flex size-14 items-center justify-center rounded-full bg-dasiwa-primary-soft text-dasiwa-primary"><CalendarHeart className="size-6" /></div><p className="absolute left-0 top-[279px] w-full text-center text-[15px] font-bold leading-[22.5px] tracking-[-0.3px] text-dasiwa-text">이번 주 연락할 고객이 없어요.</p><p className="absolute left-10 top-[313px] w-[310px] text-center text-[13px] font-normal leading-[21px] tracking-[-0.1px] text-[#9b7478]">고객의 다음 방문 예정일이 생기면 여기에서 확인할 수 있어요.</p></section> : null}
      <section>{user ? visibleCustomers.map((customer) => <FollowUpCard customer={customer} isPending={pendingCustomerId === customer.id} key={customer.id} onMarkDone={handleMarkDone} userId={user.id} />) : null}</section>
    </div>
  );
}


