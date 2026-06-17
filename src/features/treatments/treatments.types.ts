export type Treatment = {
  id: string;
  user_id: string;
  customer_id: string;
  treatment_date: string;
  service_name: string;
  memo: string | null;
  price: number | null;
  revisit_interval_days: number | null;
  next_visit_due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateTreatmentInput = {
  userId: string;
  customerId: string;
  treatmentDate: string;
  serviceName: string;
  memo?: string;
  price?: number | null;
  revisitIntervalDays: number;
};
