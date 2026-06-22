import { supabase } from "../../lib/supabase";

export type Profile = {
  id: string;
  shop_name: string;
  owner_name: string | null;
  default_revisit_interval_days: number;
};

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, shop_name, owner_name, default_revisit_interval_days")
    .eq("id", userId)
    .single<Profile>();

  if (error) throw error;
  return data;
}

export async function updateProfile(input: {
  userId: string;
  shopName: string;
  ownerName: string;
  defaultRevisitIntervalDays: number;
}) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      shop_name: input.shopName,
      owner_name: input.ownerName,
      default_revisit_interval_days: input.defaultRevisitIntervalDays,
    })
    .eq("id", input.userId)
    .select("id, shop_name, owner_name, default_revisit_interval_days")
    .single<Profile>();

  if (error) throw error;
  return data;
}
