import {
  getTodayStartDateTimeIsoString,
  getTomorrowDateTimeIsoString,
} from "../../lib/dates";
import { supabase } from "../../lib/supabase";
import type { Customer } from "../customers/customers.types";
import type { FollowUpLog } from "./followUps.types";
import { buildFollowUpCustomers, getFollowUpDateRange } from "./followUps.utils";

async function getDoneFollowUpLogsForToday(userId: string) {
  const { data, error } = await supabase
    .from("follow_up_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("follow_up_type", "revisit_reminder")
    .eq("status", "done")
    .gte("contacted_at", getTodayStartDateTimeIsoString())
    .lt("contacted_at", getTomorrowDateTimeIsoString())
    .returns<FollowUpLog[]>();

  if (error) {
    throw error;
  }

  return data;
}

export async function getFollowUpCustomers(userId: string) {
  const { weekEnd } = getFollowUpDateRange();

  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .eq("is_deleted", false)
    .not("next_visit_due_date", "is", null)
    .lte("next_visit_due_date", weekEnd)
    .order("next_visit_due_date", { ascending: true })
    .returns<Customer[]>();

  if (error) {
    throw error;
  }

  const doneLogs = await getDoneFollowUpLogsForToday(userId);
  const contactedCustomerIds = new Set(doneLogs.map((log) => log.customer_id));

  return buildFollowUpCustomers(customers, contactedCustomerIds);
}

export async function markFollowUpDone(userId: string, customerId: string) {
  const doneLogs = await getDoneFollowUpLogsForToday(userId);
  const alreadyDone = doneLogs.find((log) => log.customer_id === customerId);

  if (alreadyDone) {
    return alreadyDone;
  }

  const { data, error } = await supabase
    .from("follow_up_logs")
    .insert({
      user_id: userId,
      customer_id: customerId,
      follow_up_type: "revisit_reminder",
      status: "done",
      contacted_at: new Date().toISOString(),
      message: null,
    })
    .select()
    .single<FollowUpLog>();

  if (error) {
    throw error;
  }

  return data;
}
