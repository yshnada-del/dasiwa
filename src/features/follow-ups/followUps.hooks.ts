import { useCallback, useEffect, useMemo, useState } from "react";
import { getFollowUpCustomers, markFollowUpDone } from "./followUps.api";
import type { FollowUpCustomer } from "./followUps.types";
import { getFollowUpSummary } from "./followUps.utils";

export function useFollowUps(userId: string | undefined) {
  const [customers, setCustomers] = useState<FollowUpCustomer[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) {
      setCustomers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getFollowUpCustomers(userId);
      setCustomers(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "연락할 고객 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const summary = useMemo(() => getFollowUpSummary(customers), [customers]);

  return { customers, errorMessage, isLoading, refetch, summary };
}

export function useMarkFollowUpDone() {
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingCustomerId, setPendingCustomerId] = useState<string | null>(null);

  const markDone = useCallback(async (userId: string, customerId: string) => {
    setErrorMessage("");
    setPendingCustomerId(customerId);

    try {
      return await markFollowUpDone(userId, customerId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "연락 완료 처리 중 문제가 발생했습니다.";
      setErrorMessage(message);
      throw error;
    } finally {
      setPendingCustomerId(null);
    }
  }, []);

  return { errorMessage, markDone, pendingCustomerId };
}
