import { Calendar, ChevronRight, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { useAuth } from "../../features/auth/auth.hooks";
import { useCustomers } from "../../features/customers/customers.hooks";
import type { Customer } from "../../features/customers/customers.types";
import { formatDate, getEndOfCurrentWeekDateInputValue, getTodayDateInputValue } from "../../lib/dates";

const FIGMA_LOGO_URL = "/figma-assets/dasiwa-logo.png";

type CustomerFilter = "all" | "needs_contact" | "today" | "managed";

function status(customer: Customer) {
  if (!customer.next_visit_due_date) return { label: "기록 필요", tone: "stone" as const };
  const today = getTodayDateInputValue();
  const weekEnd = getEndOfCurrentWeekDateInputValue();
  if (customer.next_visit_due_date < today) return { label: "연락 필요", tone: "rose" as const };
  if (customer.next_visit_due_date === today) return { label: "오늘 추천", tone: "amber" as const };
  if (customer.next_visit_due_date <= weekEnd) return { label: "이번 주", tone: "amber" as const };
  return { label: "관리 중", tone: "green" as const };
}

function FilterTab({ active, children, onClick }: { active?: boolean; children: string; onClick: () => void }) {
  return (
    <button
      className={[
        "h-full shrink-0 rounded-[20px] border border-solid",
        active ? "border-[#d4144f] bg-[#fdf0f3]" : "border-[#ead8d0] bg-transparent",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      <span className="flex size-full flex-col items-center justify-center px-[14px] py-[6px]">
        <span
          className={[
            "font-['Noto_Sans_KR'] text-center text-[12px] leading-[18px] tracking-[-0.1px] whitespace-nowrap",
            active ? "font-bold text-[#d4144f]" : "font-normal text-[#9b7478]",
          ].join(" ")}
        >
          {children}
        </span>
      </span>
    </button>
  );
}

export function CustomerListPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<CustomerFilter>("all");
  const { customers, errorMessage, isLoading } = useCustomers(user?.id, searchTerm);
  const filteredCustomers = customers.filter((customer) => {
    if (activeFilter === "all") return true;
    const current = status(customer);
    if (activeFilter === "needs_contact") return current.label === "연락 필요";
    if (activeFilter === "today") return current.label === "오늘 추천";
    return current.label === "관리 중";
  });

  return (
    <div className="pt-12">
      <header className="h-28 px-[22px]">
        <div className="flex h-[46px] items-start justify-between">
          <div><h1 className="text-[20px] font-bold leading-[26px] tracking-[-0.5px] text-dasiwa-text">고객 노트</h1><p className="mt-0.5 text-[12px] font-normal leading-[18px] tracking-[-0.1px] text-[#c4a8ab]">총 {customers.length}명의 고객이 있어요</p></div>
          <div className="flex items-center gap-[10px] pt-[6.5px]"><img alt="다시와" className="h-[26px] w-[34.656px] object-contain opacity-85" src={FIGMA_LOGO_URL} /><Link className="flex h-[32.75px] items-center gap-1 rounded-[9px] bg-dasiwa-primary px-[12px] py-[7px] text-[12.5px] font-bold leading-[18.75px] tracking-[-0.1px] text-white shadow-[0_4px_7px_rgba(212,20,79,0.24)]" to="/app/customers/new"><Plus className="size-[13px]" />고객 등록</Link></div>
        </div>
        <div className="relative mt-[10px] h-[42px]"><Search className="absolute left-[13px] top-[13.5px] size-[15px] text-dasiwa-muted" /><input className="h-[42px] w-full rounded-[11px] border border-[#ead8d0] bg-white pl-[37px] pr-[15px] text-[13.5px] tracking-[-0.1px] outline-none placeholder:text-[#c4a8ab]" onChange={(event) => setSearchTerm(event.target.value)} placeholder="이름, 시술, 전화번호 검색" value={searchTerm} /></div>
      </header>

      <div className="flex h-[42px] gap-[7px] overflow-clip px-[22px] pb-[12px]"><FilterTab active={activeFilter === "all"} onClick={() => setActiveFilter("all")}>전체</FilterTab><FilterTab active={activeFilter === "needs_contact"} onClick={() => setActiveFilter("needs_contact")}>연락 필요</FilterTab><FilterTab active={activeFilter === "today"} onClick={() => setActiveFilter("today")}>오늘 추천</FilterTab><FilterTab active={activeFilter === "managed"} onClick={() => setActiveFilter("managed")}>관리 중</FilterTab></div>

      {errorMessage ? <p className="mx-[22px] rounded-[12px] bg-dasiwa-primary-soft px-3 py-2 text-[12px] text-dasiwa-primary">데이터를 불러오지 못했어요.</p> : null}
      {isLoading ? <p className="px-4 py-6 text-center text-[12px] text-dasiwa-muted">고객 목록을 불러오는 중이에요.</p> : null}
      {!isLoading && !errorMessage && filteredCustomers.length === 0 ? <p className="px-10 py-20 text-center text-[13px] leading-5 text-dasiwa-muted">{searchTerm ? "검색 결과가 없어요." : "아직 등록된 고객이 없어요."}</p> : null}

      <section className="bg-white">
        {filteredCustomers.map((customer) => {
          const current = status(customer);
          return (
            <Link className="block h-[136.75px] border-b border-[#f0e4dc]" key={customer.id} to={`/app/customers/${customer.id}`}>
              <div className="flex h-[135.75px] w-[375px] items-start px-5 py-[15px]">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[22px] bg-[#fff3ee] text-[16px] font-bold leading-[24px] text-dasiwa-accent">{customer.name.slice(0, 1)}</div>
                <div className="ml-[13px] min-w-0 flex-1">
                  <div className="flex h-[25.5px] items-start gap-[7px]"><h2 className="truncate text-[15px] font-bold leading-[22.5px] tracking-[-0.3px] text-dasiwa-text">{customer.name}</h2><span className="h-[19.75px] rounded-[5px] bg-[#fdf0f3] px-[7px] pt-px text-[10.5px] font-medium leading-[15.75px] tracking-[-0.1px] text-dasiwa-primary">{current.label}</span></div>
                  <p className="h-6 pt-0.5 text-[12.5px] leading-[18.75px] text-dasiwa-muted">{customer.preferred_service || "선호 시술 없음"}</p>
                  <div className="mt-2 flex h-[34px] items-center gap-[10px]"><span className="inline-flex h-[26px] items-center gap-1 rounded-[7px] bg-[#fdf0f3] px-[9px] py-[4px] text-[12px] font-bold leading-[18px] tracking-[-0.2px] text-dasiwa-primary"><Calendar className="size-[11px]" />{formatDate(customer.next_visit_due_date)}</span><span className="size-[3px] rounded-[1.5px] bg-[#ead8d0]" /><span className="text-[11.5px] font-normal leading-[17.25px] tracking-[-0.1px] text-[#c4a8ab]">최근 {formatDate(customer.last_visit_date)}</span></div>
                  <p className="mt-[5px] line-clamp-1 text-[11.5px] leading-[17.25px] text-dasiwa-muted">{customer.memo || "메모 없음"}</p>
                </div>
                <ChevronRight className="mt-1 size-[14px] text-[#c4a8ab]" />
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}


