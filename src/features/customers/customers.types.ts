export type Customer = {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  memo: string | null;
  preferred_service: string | null;
  default_revisit_interval_days: number | null;
  last_visit_date: string | null;
  next_visit_due_date: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateCustomerInput = {
  userId: string;
  name: string;
  phone?: string;
  memo?: string;
  preferredService?: string;
  defaultRevisitIntervalDays?: number;
};
