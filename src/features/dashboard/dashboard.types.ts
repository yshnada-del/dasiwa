import type { Customer } from "../customers/customers.types";
import type { Treatment } from "../treatments/treatments.types";

export type DashboardData = {
  customers: Customer[];
  recentTreatments: Treatment[];
};
