import type { Customer } from "../customers/customers.types";
import type { Treatment } from "../treatments/treatments.types";

export type DashboardTreatment = Treatment & {
  customerName: string | null;
};

export type DashboardData = {
  customers: Customer[];
  recentTreatmentCountLast7Days: number;
  recentTreatments: DashboardTreatment[];
};
