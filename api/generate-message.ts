import OpenAI from "openai";

type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type MessageType = "review_request" | "revisit_reminder";

type GenerateMessageBody = {
  messageType?: MessageType;
  customerName?: string;
  shopName?: string;
  ownerName?: string;
  serviceName?: string;
  lastVisitDate?: string;
  nextVisitDueDate?: string;
  tone?: "friendly" | string;
};

const safeErrorMessage = "메시지를 생성하지 못했어요. 잠시 후 다시 시도해주세요.";

function parseBody(body: unknown): GenerateMessageBody {
  if (typeof body === "string") {
    return JSON.parse(body) as GenerateMessageBody;
  }

  if (body && typeof body === "object") {
    return body as GenerateMessageBody;
  }

  return {};
}

function buildPrompt(body: GenerateMessageBody & { messageType: MessageType }) {
  const toneGuide =
    body.tone === "friendly"
      ? "친근하지만 부담스럽지 않은 말투"
      : "정중하고 자연스러운 말투";

  const baseContext = [
    `고객 이름: ${body.customerName || "고객님"}`,
    `샵 이름: ${body.shopName || "샵"}`,
    `원장님 이름: ${body.ownerName || "원장님"}`,
    `시술명: ${body.serviceName || "시술"}`,
    `마지막 방문일: ${body.lastVisitDate || "알 수 없음"}`,
    `다음 방문 예정일: ${body.nextVisitDueDate || "알 수 없음"}`,
    `톤: ${toneGuide}`,
  ].join("\n");

  if (body.messageType === "review_request") {
    return `
아래 정보를 바탕으로 시술 후 후기 요청 메시지를 한국어로 작성해줘.

${baseContext}

조건:
- 카카오톡이나 문자에 바로 붙여넣을 수 있게 2~4문장으로 작성
- 너무 광고처럼 보이지 않게 작성
- 후기 작성을 강요하지 말 것
- 고객이 부담을 느끼지 않게 자연스럽게 부탁
- 전화번호, 민감정보, 사진 언급 금지
`;
  }

  return `
아래 정보를 바탕으로 재방문 유도 메시지를 한국어로 작성해줘.

${baseContext}

조건:
- 카카오톡이나 문자에 바로 붙여넣을 수 있게 2~4문장으로 작성
- "예약하세요"처럼 강요하지 말 것
- 고객 이름, 마지막 시술, 다음 방문 예정일을 자연스럽게 반영
- 다시 방문 타이밍을 부드럽게 떠올리게 할 것
- 전화번호, 민감정보, 사진 언급 금지
`;
}

function logServerError(error: unknown) {
  if (error instanceof OpenAI.APIError) {
    console.error("[generate-message] OpenAI API error", {
      code: error.code,
      message: error.message,
      requestID: error.requestID,
      status: error.status,
      type: error.type,
    });
    return;
  }

  if (error instanceof Error) {
    console.error("[generate-message] Server error", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    return;
  }

  console.error("[generate-message] Unknown server error", error);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 지원합니다." });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("[generate-message] Missing OPENAI_API_KEY");
    return res.status(500).json({ error: safeErrorMessage });
  }

  try {
    const body = parseBody(req.body);

    if (
      body.messageType !== "review_request" &&
      body.messageType !== "revisit_reminder"
    ) {
      console.error("[generate-message] Invalid messageType", {
        messageType: body.messageType,
      });
      return res.status(400).json({ error: "지원하지 않는 메시지 타입입니다." });
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "너는 1인샵 원장님을 돕는 CRM 메시지 작성 도우미다. 과장 없이 자연스럽고 짧은 한국어 메시지만 작성한다.",
        },
        {
          role: "user",
          content: buildPrompt({ ...body, messageType: body.messageType }),
        },
      ],
      model: "gpt-4o-mini",
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content?.trim();

    if (!message) {
      console.error("[generate-message] Empty OpenAI response", {
        id: completion.id,
        model: completion.model,
      });
      return res.status(500).json({ error: safeErrorMessage });
    }

    return res.status(200).json({ message });
  } catch (error) {
    logServerError(error);
    return res.status(500).json({ error: safeErrorMessage });
  }
}
