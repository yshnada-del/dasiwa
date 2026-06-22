import { useCallback, useEffect, useState } from "react";
import { getProfile, updateProfile, type Profile } from "./profiles.api";

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      setProfile(await getProfile(userId));
    } catch {
      setErrorMessage("샵 정보를 불러오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { profile, errorMessage, isLoading, refetch };
}

export function useUpdateProfile() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(async (input: { userId: string; shopName: string; ownerName: string; defaultRevisitIntervalDays: number }) => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      return await updateProfile(input);
    } catch {
      setErrorMessage("샵 정보를 저장하지 못했어요.");
      throw new Error("Profile update failed");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { errorMessage, isSubmitting, submit };
}
