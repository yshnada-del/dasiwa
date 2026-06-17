import { supabase } from "../../lib/supabase";
import type { CreateCustomerInput, Customer } from "./customers.types";

export async function createCustomer(input: CreateCustomerInput) {
  const { data, error } = await supabase
    .from("customers")
    .insert({
      user_id: input.userId,
      name: input.name,
      phone: input.phone || null,
      memo: input.memo || null,
      preferred_service: input.preferredService || null,
      default_revisit_interval_days: input.defaultRevisitIntervalDays ?? 28,
      is_deleted: false,
    })
    .select()
    .single<Customer>();

  if (error) {
    throw error;
  }

  return data;
}

export async function getCustomers(userId: string, searchTerm = "") {
  let query = supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  const trimmedSearchTerm = searchTerm.trim();

  if (trimmedSearchTerm) {
    query = query.or(
      `name.ilike.%${trimmedSearchTerm}%,phone.ilike.%${trimmedSearchTerm}%`,
    );
  }

  const { data, error } = await query.returns<Customer[]>();

  if (error) {
    throw error;
  }

  return data;
}

export async function getCustomerById(userId: string, customerId: string) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .eq("id", customerId)
    .eq("is_deleted", false)
    .single<Customer>();

  if (error) {
    throw error;
  }

  return data;
}
