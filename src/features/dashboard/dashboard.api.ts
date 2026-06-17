import { supabase } from "../../lib/supabase";
import type { Customer } from "../customers/customers.types";
import type { Treatment } from "../treatments/treatments.types";

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

  return {
    customers,
    recentTreatments,
    totalCustomerCount: allCustomers.length,
  };
}
