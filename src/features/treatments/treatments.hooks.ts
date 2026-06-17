import { useCallback, useEffect, useState } from "react";
import {
  createTreatment,
  getTreatmentsByCustomer,
  updateCustomerVisitAfterTreatment,
} from "./treatments.api";
import type { CreateTreatmentInput, Treatment } from "./treatments.types";

export function useTreatments(
  userId: string | undefined,
  customerId: string | undefined,
) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId || !customerId) {
      setTreatments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getTreatmentsByCustomer(userId, customerId);
      setTreatments(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "시술 기록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [customerId, userId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { errorMessage, isLoading, refetch, treatments };
}

export function useCreateTreatment() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(async (input: CreateTreatmentInput) => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      return await createTreatment(input);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "시술 기록 저장 중 문제가 발생했습니다.";
      setErrorMessage(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { errorMessage, isSubmitting, submit };
}

export function useUpdateCustomerVisitAfterTreatment() {
  const [errorMessage, setErrorMessage] = useState("");

  const update = useCallback(
    async (input: {
      userId: string;
      customerId: string;
      treatmentDate: string;
      revisitIntervalDays: number;
    }) => {
      setErrorMessage("");

      try {
        await updateCustomerVisitAfterTreatment(input);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "고객 방문 정보를 업데이트하지 못했습니다.";
        setErrorMessage(message);
        throw error;
      }
    },
    [],
  );

  return { errorMessage, update };
}
