import { useCallback, useEffect, useState } from "react";
import {
  getTreatmentPhotosByCustomer,
  uploadTreatmentPhotos,
} from "./treatmentPhotos.api";
import type { TreatmentPhotoWithSignedUrl } from "./treatmentPhotos.types";

export function useTreatmentPhotos(
  userId: string | undefined,
  customerId: string | undefined,
) {
  const [photos, setPhotos] = useState<TreatmentPhotoWithSignedUrl[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId || !customerId) {
      setPhotos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getTreatmentPhotosByCustomer(userId, customerId);
      setPhotos(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "사진을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [customerId, userId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { errorMessage, isLoading, photos, refetch };
}

export function useUploadTreatmentPhotos() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(
    async ({
      customerId,
      files,
      treatmentId,
      userId,
    }: {
      userId: string;
      customerId: string;
      treatmentId: string;
      files: File[];
    }) => {
      setErrorMessage("");
      setIsUploading(true);

      try {
        return await uploadTreatmentPhotos({
          customerId,
          files,
          treatmentId,
          userId,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "사진 업로드 중 문제가 발생했습니다.";
        setErrorMessage(message);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return { errorMessage, isUploading, upload };
}
