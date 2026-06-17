import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { useAuth } from "../../features/auth/auth.hooks";
import { useDashboardData } from "../../features/dashboard/dashboard.hooks";
import { useFollowUps } from "../../features/follow-ups/followUps.hooks";
import { formatDate } from "../../lib/dates";

export function DashboardPage() {
  const { user } = useAuth();
  const {
    data,
    errorMessage: dashboardErrorMessage,
    isLoading: isDashboardLoading,
  } = useDashboardData(user?.id);
  const {
    customers: followUpCustomers,
    errorMessage: followUpErrorMessage,
    isLoading: areFollowUpsLoading,
  } = useFollowUps(user?.id);

  return (
    <div className="pb-20 lg:pb-0">
      <PageHeader
        eyebrow="다시와 홈"
        title="오늘 기억해야 할 고객을 먼저 확인하세요"
        description="고객 수, 연락할 고객, 최근 기록을 가볍게 모아 보여드려요."
        action={
          <Button asChild>
            <Link to="/app/customers/new">고객 등록</Link>
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="전체 고객"
          value={isDashboardLoading ? "-" : `${data.totalCustomerCount}명`}
          helper="삭제되지 않은 고객 기준"
        />
        <StatCard
          label="이번 주 연락"
          value={areFollowUpsLoading ? "-" : `${followUpCustomers.length}명`}
          helper="다음 방문 예정일 기준"
        />
        <StatCard
          label="최근 시술 기록"
          value={isDashboardLoading ? "-" : `${data.recentTreatments.length}건`}
          helper="최근 등록된 기록"
        />
      </section>

      {dashboardErrorMessage || followUpErrorMessage ? (
        <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
          {dashboardErrorMessage || followUpErrorMessage}
        </div>
      ) : null}

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-stone-950">
              이번 주 연락할 고객
            </h3>
            <Button asChild variant="secondary">
              <Link to="/app/follow-ups">전체 보기</Link>
            </Button>
          </div>

          {areFollowUpsLoading ? (
            <div className="rounded-lg bg-stone-50 p-5 text-center text-sm text-stone-500">
              연락할 고객을 확인하는 중입니다.
            </div>
          ) : null}

          {!areFollowUpsLoading && followUpCustomers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-stone-300 p-6 text-center">
              <p className="font-medium text-stone-800">
                이번 주 연락할 고객이 없어요.
              </p>
              <p className="mt-2 text-sm text-stone-500">
                시술 기록을 남기면 다음 방문 예정일 기준으로 자동 표시됩니다.
              </p>
            </div>
          ) : null}

          {!areFollowUpsLoading && followUpCustomers.length > 0 ? (
            <div className="space-y-3">
              {followUpCustomers.slice(0, 3).map((customer) => (
                <Link
                  className="block rounded-lg border border-stone-200 p-4 transition hover:bg-stone-50"
                  key={customer.id}
                  to={`/app/customers/${customer.id}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-stone-950">{customer.name}</p>
                    <Badge tone={customer.isContactedToday ? "green" : "rose"}>
                      {customer.isContactedToday ? "연락 완료" : "연락 필요"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-stone-500">
                    다음 방문 {formatDate(customer.next_visit_due_date)}
                  </p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-stone-950">최근 등록 고객</h3>
          {isDashboardLoading ? (
            <div className="mt-4 rounded-lg bg-stone-50 p-5 text-center text-sm text-stone-500">
              최근 고객을 불러오는 중입니다.
            </div>
          ) : null}

          {!isDashboardLoading && data.customers.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-stone-300 p-5 text-center">
              <p className="font-medium text-stone-800">아직 고객이 없습니다.</p>
              <p className="mt-2 text-sm text-stone-500">
                첫 고객을 등록하면 이곳에 표시됩니다.
              </p>
            </div>
          ) : null}

          {!isDashboardLoading && data.customers.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.customers.map((customer) => (
                <Link
                  className="block rounded-lg bg-stone-50 px-3 py-3 transition hover:bg-stone-100"
                  key={customer.id}
                  to={`/app/customers/${customer.id}`}
                >
                  <p className="font-medium text-stone-900">{customer.name}</p>
                  <p className="mt-1 text-sm text-stone-500">
                    {customer.preferred_service || "선호 시술 없음"}
                  </p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
