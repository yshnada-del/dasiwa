import { addDaysToDate } from "../../lib/dates";
import { supabase } from "../../lib/supabase";
import type { CreateTreatmentInput, Treatment } from "./treatments.types";

export async function createTreatment(input: CreateTreatmentInput) {
  const nextVisitDueDate = addDaysToDate(
    input.treatmentDate,
    input.revisitIntervalDays,
  );

  const { data, error } = await supabase
    .from("treatments")
    .insert({
      user_id: input.userId,
      customer_id: input.customerId,
      treatment_date: input.treatmentDate,
      service_name: input.serviceName,
      memo: input.memo || null,
      price: input.price ?? null,
      revisit_interval_days: input.revisitIntervalDays,
      next_visit_due_date: nextVisitDueDate,
    })
    .select()
    .single<Treatment>();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCustomerVisitAfterTreatment(input: {
  userId: string;
  customerId: string;
  treatmentDate: string;
  revisitIntervalDays: number;
}) {
  const nextVisitDueDate = addDaysToDate(
    input.treatmentDate,
    input.revisitIntervalDays,
  );

  const { error: customerError } = await supabase
    .from("customers")
    .update({
      last_visit_date: input.treatmentDate,
      next_visit_due_date: nextVisitDueDate,
    })
    .eq("id", input.customerId)
    .eq("user_id", input.userId);

  if (customerError) {
    throw customerError;
  }
}

export async function getTreatmentsByCustomer(userId: string, customerId: string) {
  const { data, error } = await supabase
    .from("treatments")
    .select("*")
    .eq("user_id", userId)
    .eq("customer_id", customerId)
    .order("treatment_date", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<Treatment[]>();

  if (error) {
    throw error;
  }

  return data;
}
