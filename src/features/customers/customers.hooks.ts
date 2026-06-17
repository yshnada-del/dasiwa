import { useCallback, useEffect, useState } from "react";
import { createCustomer, getCustomerById, getCustomers } from "./customers.api";
import type { CreateCustomerInput, Customer } from "./customers.types";

export function useCustomers(userId: string | undefined, searchTerm: string) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!userId) {
      setCustomers([]);
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);
    setErrorMessage("");

    getCustomers(userId, searchTerm)
      .then((data) => {
        if (isMounted) {
          setCustomers(data);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "고객 목록을 불러오지 못했습니다.",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchTerm, userId]);

  return { customers, errorMessage, isLoading };
}

export function useCustomer(userId: string | undefined, customerId: string | undefined) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId || !customerId) {
      setCustomer(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getCustomerById(userId, customerId);
      setCustomer(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "고객 정보를 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [customerId, userId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { customer, errorMessage, isLoading, refetch };
}

export function useCreateCustomer() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(async (input: CreateCustomerInput) => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      return await createCustomer(input);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "고객 등록 중 문제가 발생했습니다.";
      setErrorMessage(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { errorMessage, isSubmitting, submit };
}
