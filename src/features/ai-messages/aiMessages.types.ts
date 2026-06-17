export type AiMessageType = "review_request" | "revisit_reminder";

export type AiMessageTone = "friendly";

export type AiMessageLog = {
  id: string;
  user_id: string;
  customer_id: string | null;
  treatment_id: string | null;
  message_type: AiMessageType;
  input_snapshot: Record<string, unknown> | null;
  generated_message: string;
  copied_at: string | null;
  created_at: string;
};

export type GenerateAiMessageInput = {
  userId: string;
  customerId: string;
  treatmentId?: string | null;
  messageType: AiMessageType;
  customerName: string;
  serviceName?: string | null;
  lastVisitDate?: string | null;
  nextVisitDueDate?: string | null;
  tone?: AiMessageTone;
};

export type GeneratedAiMessage = {
  logId: string;
  message: string;
};
