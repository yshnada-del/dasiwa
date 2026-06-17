import {
  getEndOfCurrentWeekDateInputValue,
  getTodayDateInputValue,
} from "../../lib/dates";
import type { Customer } from "../customers/customers.types";
import type {
  FollowUpCustomer,
  FollowUpStatus,
  FollowUpSummary,
} from "./followUps.types";

export function getFollowUpDateRange() {
  return {
    today: getTodayDateInputValue(),
    weekEnd: getEndOfCurrentWeekDateInputValue(),
  };
}

export function getFollowUpStatus(
  nextVisitDueDate: string,
  contactedToday: boolean,
): FollowUpStatus {
  if (contactedToday) {
    return "done";
  }

  const { today } = getFollowUpDateRange();

  if (nextVisitDueDate < today) {
    return "overdue";
  }

  if (nextVisitDueDate === today) {
    return "today";
  }

  return "this_week";
}

export function buildFollowUpCustomers(
  customers: Customer[],
  contactedCustomerIds: Set<string>,
) {
  return customers.map((customer): FollowUpCustomer => {
    const isContactedToday = contactedCustomerIds.has(customer.id);

    return {
      ...customer,
      followUpStatus: getFollowUpStatus(
        customer.next_visit_due_date ?? getFollowUpDateRange().today,
        isContactedToday,
      ),
      isContactedToday,
    };
  });
}

export function getFollowUpSummary(customers: FollowUpCustomer[]): FollowUpSummary {
  return customers.reduce(
    (summary, customer) => {
      summary.total += 1;

      if (customer.followUpStatus === "done") {
        summary.done += 1;
        return summary;
      }

      if (customer.followUpStatus === "overdue") {
        summary.overdue += 1;
      }

      if (customer.followUpStatus === "today") {
        summary.today += 1;
      }

      if (customer.followUpStatus === "this_week") {
        summary.thisWeek += 1;
      }

      return summary;
    },
    { done: 0, overdue: 0, thisWeek: 0, today: 0, total: 0 },
  );
}
