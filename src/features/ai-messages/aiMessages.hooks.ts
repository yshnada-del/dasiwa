import { useCallback, useState } from "react";
import { generateAiMessage, markAiMessageCopied } from "./aiMessages.api";
import type { GeneratedAiMessage, GenerateAiMessageInput } from "./aiMessages.types";

export function useAiMessage() {
  const [copiedMessage, setCopiedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [generated, setGenerated] = useState<GeneratedAiMessage | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(async (input: GenerateAiMessageInput) => {
    setCopiedMessage("");
    setErrorMessage("");
    setIsCopied(false);
    setIsGenerating(true);

    try {
      const nextGenerated = await generateAiMessage(input);
      setGenerated(nextGenerated);
      return nextGenerated;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "메시지를 생성하지 못했어요. 잠시 후 다시 시도해주세요.";
      setErrorMessage(message);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const copy = useCallback(
    async (userId: string) => {
      if (!generated) {
        return;
      }

      try {
        await navigator.clipboard.writeText(generated.message);
        await markAiMessageCopied(userId, generated.logId);
        setIsCopied(true);
        setCopiedMessage("복사했어요. 카카오톡이나 문자에 붙여넣어 보내세요.");
      } catch {
        setIsCopied(false);
        setCopiedMessage("복사하지 못했어요. 메시지를 직접 선택해 복사해주세요.");
      }
    },
    [generated],
  );

  return {
    copiedMessage,
    copy,
    errorMessage,
    generate,
    generated,
    isCopied,
    isGenerating,
  };
}
