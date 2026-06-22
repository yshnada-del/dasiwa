import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/auth.hooks";
import { useDashboardData } from "../../features/dashboard/dashboard.hooks";
import { useFollowUps } from "../../features/follow-ups/followUps.hooks";
import { formatDate } from "../../lib/dates";

const imgImage = "/figma-assets/dasiwa-logo.png";
const imgBell = "/figma-assets/dashboard-bell.svg";
const imgSettings = "/figma-assets/dashboard-settings.svg";
const imgChevronCustomer = "/figma-assets/chevron-customer.svg";
const imgChevronTreatment = "/figma-assets/chevron-treatment.svg";
const imgChevronHeader = "/figma-assets/chevron-header.svg";

function dday(date: string | null) {
  if (!date) return "D-";
  const today = new Date();
  const due = new Date(`${date}T00:00:00`);
  today.setHours(0, 0, 0, 0);
  return `D-${Math.max(0, Math.ceil((due.getTime() - today.getTime()) / 86400000))}`;
}

function FollowPreview({ customer }: { customer: { id: string; name: string; next_visit_due_date: string | null } }) {
  return (
    <Link className="bg-[rgba(255,255,255,0.14)] flex items-center gap-[8px] pl-[5px] pr-[10px] py-[5px] rounded-[20px]" to={`/app/customers/${customer.id}`}>
      <span className="bg-[rgba(255,255,255,0.3)] flex size-[22px] shrink-0 items-center justify-center rounded-[11px] text-[10px] font-bold leading-[15px] text-white">{customer.name.slice(0, 1)}</span>
      <span className="w-[32.828px] truncate text-[12px] font-normal leading-[18px] tracking-[-0.1px] text-[rgba(255,255,255,0.9)]">{customer.name}</span>
      <span className="text-[10.5px] font-medium leading-[15.75px] text-[rgba(255,255,255,0.65)]">{dday(customer.next_visit_due_date)}</span>
    </Link>
  );
}

function CustomerRow({ customer, index, total }: { customer: { id: string; name: string; preferred_service: string | null; next_visit_due_date: string | null }; index: number; total: number }) {
  const isSecond = index === 1;
  return (
    <>
      <Link className="flex w-full items-center gap-[12px] px-[16px] py-[14px]" to={`/app/customers/${customer.id}`}>
        <span className={["flex size-[36px] shrink-0 items-center justify-center rounded-[18px] text-[12.96px] font-bold leading-[19.44px]", isSecond ? "bg-[#fdf0f3] text-dasiwa-primary" : "bg-[#fff3ee] text-dasiwa-accent"].join(" ")}>{customer.name.slice(0, 1)}</span>
        <span className="min-w-0 flex-[218_0_0]">
          <span className="flex h-[24px] items-center gap-[6px] pb-[3px]">
            <span className="truncate text-[14px] font-bold leading-[21px] tracking-[-0.2px] text-dasiwa-text">{customer.name}</span>
            {customer.preferred_service ? <span className="h-[18.5px] rounded-[4px] bg-[#fff3ee] px-[6px] text-[11px] font-normal leading-[16.5px] text-[#c4a8ab]">{customer.preferred_service}</span> : null}
          </span>
          <span className="block h-[24px] text-[12px] font-normal leading-[24px] tracking-[-0.1px] text-[#9b7478]">다음 방문 {formatDate(customer.next_visit_due_date)}</span>
        </span>
        <img alt="" className="size-[15px] shrink-0" src={imgChevronCustomer} />
      </Link>
      {index < total - 1 ? <div className="mx-[16px] h-px bg-[#f0e4dc]" /> : null}
    </>
  );
}

function TreatmentRow({ treatment, index, total }: { treatment: { id: string; customer_id: string; customerName?: string | null; service_name?: string | null; treatment_date: string; next_visit_due_date: string | null }; index: number; total: number }) {
  return (
    <>
      <Link className="flex w-full items-center justify-between px-[16px] py-[13px]" to={`/app/customers/${treatment.customer_id}`}>
        <span className="min-w-0">
          <span className="flex items-center gap-[6px]">
            <span className="truncate text-[13.5px] font-bold leading-[20.25px] tracking-[-0.2px] text-dasiwa-text">{treatment.customerName || "고객"}</span>
            <span className="truncate text-[12.5px] font-normal leading-[18.75px] tracking-[-0.1px] text-[#9b7478]">{treatment.service_name || "시술 기록"}</span>
          </span>
          <span className="mt-[3px] flex items-center gap-[8px]">
            <span className="text-[11.5px] font-normal leading-[17.25px] text-[#c4a8ab]">시술 {formatDate(treatment.treatment_date)}</span>
            <span className="size-[3px] rounded-[1.5px] bg-[#ead8d0]" />
            <span className="text-[11.5px] font-medium leading-[17.25px] text-dasiwa-primary">재방문 {formatDate(treatment.next_visit_due_date)}</span>
          </span>
        </span>
        <img alt="" className="size-[14px] shrink-0" src={imgChevronTreatment} />
      </Link>
      {index < total - 1 ? <div className="mx-[16px] h-px bg-[#f0e4dc]" /> : null}
    </>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data, errorMessage: dashboardError, isLoading: dashboardLoading } = useDashboardData(user?.id);
  const { customers: followUps, errorMessage: followUpError, isLoading: followUpsLoading } = useFollowUps(user?.id);
  const errorMessage = dashboardError || followUpError;
  const previewFollowUps = followUps.slice(0, 3);
  const recentCustomers = data.customers.slice(0, 2);
  const recentTreatments = data.recentTreatments.slice(0, 3);

  return (
    <div className="flex min-h-[844px] flex-col items-start overflow-hidden bg-dasiwa-bg">
      <div className="h-[48px] w-full shrink-0" />
      <div className="min-h-0 w-full flex-[727_0_0] overflow-hidden">
        <header className="flex w-full items-start justify-between px-[24px] pb-[16px]">
          <div className="w-[149.594px] shrink-0">
            <img alt="다시와" className="h-[34px] w-[45.328px] object-contain" src={imgImage} />
            <div className="h-[23px] w-[149.594px] pt-[4px]">
              <p className="whitespace-nowrap text-[12.5px] font-normal leading-[18.75px] tracking-[-0.15px] text-[#9b7478]">오늘 연락할 고객을 확인해요.</p>
            </div>
          </div>
          <div className="flex h-[38px] w-[76px] shrink-0 items-center gap-[8px] pt-[4px]">
            <button className="relative flex size-[34px] items-center justify-center rounded-[17px] bg-[#fdf0f3]" type="button">
              <img alt="" className="size-[16px]" src={imgBell} />
              <span className="absolute left-[21px] top-[7px] size-[6px] rounded-[3px] border border-dasiwa-bg bg-dasiwa-primary" />
            </button>
            <Link className="flex size-[34px] items-center justify-center rounded-[17px]" to="/app/settings">
              <img alt="" className="size-[17px]" src={imgSettings} />
            </Link>
          </div>
        </header>

        {errorMessage ? <p className="mx-[24px] mb-[8px] rounded-[10px] bg-dasiwa-primary-soft px-3 py-2 text-[11px] text-dasiwa-primary">{errorMessage}</p> : null}

        <section className="w-full px-[24px] pb-[20px]">
          <div className="flex w-full items-center justify-between rounded-[18px] bg-dasiwa-primary px-[22px] py-[20px] text-white">
            <div className="w-[116.609px] shrink-0">
              <p className="whitespace-nowrap text-[12px] font-normal leading-[18px] tracking-[-0.1px] text-white/75">이번 주 연락할 고객</p>
              <div className="relative mt-[6px] h-[39.5px] w-full">
                <span className="absolute left-0 top-[-4px] text-[36px] font-bold leading-[36px] tracking-[-1px] text-white">{followUpsLoading ? "-" : followUps.length}</span>
                <span className="absolute left-[23.89px] top-[15px] text-[15px] font-medium leading-[22.5px] text-white/85">명</span>
              </div>
              <div className="relative h-[48.75px] w-full">
                <Link className="absolute left-0 top-[14px] flex h-[34.75px] w-[116.609px] items-center justify-center rounded-[8px] border border-white/30 bg-white/20 text-[12.5px] font-medium leading-[18.75px] tracking-[-0.1px] text-white" to="/app/follow-ups">연락할 고객 보기</Link>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-[7px]">
              {previewFollowUps.length === 0 ? <p className="py-[5px] text-[12px] font-normal leading-[18px] tracking-[-0.1px] text-white/90">대상 없음</p> : null}
              {previewFollowUps.map((customer) => <FollowPreview customer={customer} key={customer.id} />)}
            </div>
          </div>
        </section>

        <section className="w-full px-[24px] pb-[20px]">
          <div className="flex h-[76.5px] w-[327px] overflow-hidden rounded-[14px] border border-[#ead8d0] bg-white p-px">
            {[
              [`${dashboardLoading ? "-" : data.totalCustomerCount}명`, "전체 고객", false],
              [`${followUpsLoading ? "-" : followUps.length}명`, "이번 주 연락", true],
              [`${dashboardLoading ? "-" : data.recentTreatmentCountLast7Days}건`, "최근 7일 시술", false],
            ].map(([value, label, primary], index) => (
              <div className={["flex h-full min-w-0 flex-1 flex-col items-center gap-[3px] py-[14px]", index < 2 ? "border-r border-[#f0e4dc] pr-px" : ""].join(" ")} key={label.toString()}>
                <p className={(primary ? "text-dasiwa-primary" : "text-dasiwa-text") + " text-[18px] font-bold leading-[27px] tracking-[-0.5px]"}>{value}</p>
                <p className="text-[11px] font-normal leading-[16.5px] tracking-[-0.1px] text-[#c4a8ab]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full px-[24px] pb-[20px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[13.5px] font-bold leading-[20.25px] tracking-[-0.2px] text-dasiwa-text">최근 등록 고객</h2>
            <Link className="flex items-center gap-px text-[12px] font-medium leading-[18px] tracking-[-0.1px] text-[#c4a8ab]" to="/app/customers">전체 보기<img alt="" className="size-[12px]" src={imgChevronHeader} /></Link>
          </div>
          <div className="mt-[12px] flex h-[155px] w-full flex-col overflow-hidden rounded-[14px] border border-[#ead8d0] bg-white p-px">
            {dashboardLoading ? <p className="py-8 text-center text-[12px] text-dasiwa-muted">불러오는 중이에요.</p> : null}
            {!dashboardLoading && recentCustomers.length === 0 ? <p className="py-8 text-center text-[12px] text-dasiwa-muted">아직 등록된 고객이 없어요.</p> : null}
            {recentCustomers.map((customer, index) => <CustomerRow customer={customer} index={index} key={customer.id} total={recentCustomers.length} />)}
          </div>
        </section>

        <section className="w-full px-[24px] pb-[20px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[13.5px] font-bold leading-[20.25px] tracking-[-0.2px] text-dasiwa-text">최근 시술 기록</h2>
            <Link className="flex items-center gap-px text-[12px] font-medium leading-[18px] tracking-[-0.1px] text-[#c4a8ab]" to="/app/customers">전체 보기<img alt="" className="size-[12px]" src={imgChevronHeader} /></Link>
          </div>
          <div className="mt-[12px] flex h-[203.5px] w-full flex-col overflow-hidden rounded-[14px] border border-[#ead8d0] bg-white p-px">
            {dashboardLoading ? <p className="py-8 text-center text-[12px] text-dasiwa-muted">불러오는 중이에요.</p> : null}
            {!dashboardLoading && recentTreatments.length === 0 ? <p className="py-8 text-center text-[12px] text-dasiwa-muted">아직 시술 기록이 없어요.</p> : null}
            {recentTreatments.map((treatment, index) => <TreatmentRow index={index} key={treatment.id} total={recentTreatments.length} treatment={treatment} />)}
          </div>
        </section>
        <div className="h-[8px] w-full" />
      </div>
    </div>
  );
}
