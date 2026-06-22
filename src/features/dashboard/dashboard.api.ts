import { supabase } from "../../lib/supabase";
import type { Customer } from "../customers/customers.types";
import type { Treatment } from "../treatments/treatments.types";

function getSevenDaysAgoDateInputValue() {
  const date = new Date();
  date.setDate(date.getDate() - 6);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getDashboardData(userId: string) {
  const { data: customers, error: customersError } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<Customer[]>();

  if (customersError) {
    throw customersError;
  }

  const { data: allCustomers, error: allCustomersError } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .eq("is_deleted", false)
    .returns<Customer[]>();

  if (allCustomersError) {
    throw allCustomersError;
  }

  const { data: recentTreatments, error: treatmentsError } = await supabase
    .from("treatments")
    .select("*")
    .eq("user_id", userId)
    .order("treatment_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<Treatment[]>();

  if (treatmentsError) {
    throw treatmentsError;
  }

  const treatmentCustomerIds = Array.from(
    new Set(recentTreatments.map((treatment) => treatment.customer_id)),
  );
  const { data: treatmentCustomers, error: treatmentCustomersError } =
    treatmentCustomerIds.length > 0
      ? await supabase
          .from("customers")
          .select("*")
          .eq("user_id", userId)
          .in("id", treatmentCustomerIds)
          .returns<Customer[]>()
      : { data: [], error: null };

  if (treatmentCustomersError) {
    throw treatmentCustomersError;
  }

  const customerNameById = new Map(
    treatmentCustomers.map((customer) => [customer.id, customer.name]),
  );

  const { count: recentTreatmentCountLast7Days, error: recentCountError } =
    await supabase
      .from("treatments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("treatment_date", getSevenDaysAgoDateInputValue());

  if (recentCountError) {
    throw recentCountError;
  }

  return {
    customers,
    recentTreatmentCountLast7Days: recentTreatmentCountLast7Days ?? 0,
    recentTreatments: recentTreatments.map((treatment) => ({
      ...treatment,
      customerName: customerNameById.get(treatment.customer_id) ?? null,
    })),
    totalCustomerCount: allCustomers.length,
  };
}
