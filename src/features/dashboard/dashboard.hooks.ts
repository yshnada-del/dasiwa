import { useEffect, useState } from "react";
import { getDashboardData } from "./dashboard.api";
import type { DashboardData } from "./dashboard.types";

type DashboardState = DashboardData & {
  totalCustomerCount: number;
};

export function useDashboardData(userId: string | undefined) {
  const [data, setData] = useState<DashboardState>({
    customers: [],
    recentTreatmentCountLast7Days: 0,
    recentTreatments: [],
    totalCustomerCount: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!userId) {
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);
    setErrorMessage("");

    getDashboardData(userId)
      .then((dashboardData) => {
        if (isMounted) {
          setData(dashboardData);
        }
      })
      .catch(() => {
        if (isMounted) {
          setErrorMessage("대시보드 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
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
  }, [userId]);

  return { data, errorMessage, isLoading };
}
