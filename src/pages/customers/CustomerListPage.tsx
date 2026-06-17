import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../features/auth/auth.hooks";
import { useCustomers } from "../../features/customers/customers.hooks";
import type { Customer } from "../../features/customers/customers.types";
import { formatDate, getTodayDateInputValue } from "../../lib/dates";

function getContactBadge(customer: Customer) {
  if (!customer.next_visit_due_date) {
    return <Badge>시술 기록 대기</Badge>;
  }

  if (customer.next_visit_due_date <= getTodayDateInputValue()) {
    return <Badge tone="rose">연락 필요</Badge>;
  }

  return <Badge tone="stone">예정 있음</Badge>;
}

export function CustomerListPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const { customers, errorMessage, isLoading } = useCustomers(user?.id, searchTerm);

  return (
    <div className="pb-20 lg:pb-0">
      <PageHeader
        eyebrow="고객"
        title="다시 연락하고 싶은 고객을 한곳에서 확인하세요"
        description="이름이나 전화번호로 빠르게 찾고, 다음 방문 예정일을 확인할 수 있어요."
        action={
          <Button asChild>
            <Link to="/app/customers/new">새 고객 등록</Link>
          </Button>
        }
      />

      <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <Input
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="고객명 또는 전화번호 검색"
          value={searchTerm}
        />

        {isLoading ? (
          <div className="mt-4 rounded-lg bg-stone-50 p-6 text-center text-sm text-stone-500">
            고객 목록을 불러오는 중입니다.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
            데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </div>
        ) : null}

        {!isLoading && !errorMessage && customers.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-stone-300 p-6 text-center">
            <p className="font-medium text-stone-800">
              {searchTerm ? "검색 결과가 없습니다." : "아직 등록된 고객이 없습니다."}
            </p>
            <p className="mt-2 text-sm text-stone-500">
              {searchTerm
                ? "고객 이름이나 전화번호를 다시 확인해주세요."
                : "첫 고객을 등록하면 시술 기록과 재방문 타이밍을 함께 관리할 수 있어요."}
            </p>
            {!searchTerm ? (
              <Button asChild className="mt-4">
                <Link to="/app/customers/new">고객 등록하기</Link>
              </Button>
            ) : null}
          </div>
        ) : null}

        {!isLoading && !errorMessage && customers.length > 0 ? (
          <div className="mt-4 divide-y divide-stone-100">
            {customers.map((customer) => (
              <Link
                className="grid gap-3 py-4 transition hover:bg-stone-50 sm:grid-cols-[1fr_auto] sm:items-center"
                key={customer.id}
                to={`/app/customers/${customer.id}`}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-stone-950">{customer.name}</p>
                  <p className="mt-1 text-sm text-stone-500">
                    {customer.phone || "전화번호 없음"} ·{" "}
                    {customer.preferred_service || "선호 시술 없음"}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    최근 방문 {formatDate(customer.last_visit_date)} · 다음 방문{" "}
                    {formatDate(customer.next_visit_due_date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getContactBadge(customer)}
                  <span className="text-sm text-stone-400">상세 보기</span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
