import { supabase } from "../../lib/supabase";
import type {
  AiMessageLog,
  GeneratedAiMessage,
  GenerateAiMessageInput,
} from "./aiMessages.types";

type Profile = {
  id: string;
  shop_name: string;
  owner_name: string | null;
};

async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, shop_name, owner_name")
    .eq("id", userId)
    .single<Profile>();

  if (error) {
    throw error;
  }

  return data;
}

async function requestGeneratedMessage(input: GenerateAiMessageInput, profile: Profile) {
  const response = await fetch("/api/generate-message", {
    body: JSON.stringify({
      messageType: input.messageType,
      customerName: input.customerName,
      shopName: profile.shop_name,
      ownerName: profile.owner_name ?? "원장님",
      serviceName: input.serviceName ?? undefined,
      lastVisitDate: input.lastVisitDate ?? undefined,
      nextVisitDueDate: input.nextVisitDueDate ?? undefined,
      tone: input.tone ?? "friendly",
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "메시지를 생성하지 못했어요. 잠시 후 다시 시도해주세요.",
    );
  }

  return data.message as string;
}

export async function generateAiMessage(
  input: GenerateAiMessageInput,
): Promise<GeneratedAiMessage> {
  const profile = await getProfile(input.userId);
  const generatedMessage = await requestGeneratedMessage(input, profile);
  const inputSnapshot = {
    customerName: input.customerName,
    lastVisitDate: input.lastVisitDate ?? null,
    messageType: input.messageType,
    nextVisitDueDate: input.nextVisitDueDate ?? null,
    ownerName: profile.owner_name ?? null,
    serviceName: input.serviceName ?? null,
    shopName: profile.shop_name,
    tone: input.tone ?? "friendly",
  };

  const { data, error } = await supabase
    .from("ai_message_logs")
    .insert({
      user_id: input.userId,
      customer_id: input.customerId,
      treatment_id: input.treatmentId ?? null,
      message_type: input.messageType,
      input_snapshot: inputSnapshot,
      generated_message: generatedMessage,
      copied_at: null,
    })
    .select()
    .single<AiMessageLog>();

  if (error) {
    throw error;
  }

  return {
    logId: data.id,
    message: data.generated_message,
  };
}

export async function markAiMessageCopied(userId: string, logId: string) {
  const { error } = await supabase
    .from("ai_message_logs")
    .update({ copied_at: new Date().toISOString() })
    .eq("id", logId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}
