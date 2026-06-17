import type { Customer } from "../customers/customers.types";

export type FollowUpStatus = "overdue" | "today" | "this_week" | "done";

export type FollowUpLog = {
  id: string;
  user_id: string;
  customer_id: string;
  follow_up_type: "review_request" | "revisit_reminder" | "manual";
  status: "pending" | "done" | "skipped";
  message: string | null;
  contacted_at: string | null;
  created_at: string;
};

export type FollowUpCustomer = Customer & {
  followUpStatus: FollowUpStatus;
  isContactedToday: boolean;
};

export type FollowUpSummary = {
  total: number;
  overdue: number;
  today: number;
  thisWeek: number;
  done: number;
};
