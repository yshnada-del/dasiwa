import { supabase } from "./supabase";

export const TREATMENT_PHOTOS_BUCKET = "treatment-photos";
export const MAX_TREATMENT_PHOTO_SIZE = 5 * 1024 * 1024;
export const MAX_TREATMENT_PHOTO_COUNT = 5;
export const TREATMENT_PHOTO_SIGNED_URL_EXPIRES_IN = 60 * 60;

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function validateTreatmentPhotos(files: File[]) {
  if (files.length > MAX_TREATMENT_PHOTO_COUNT) {
    return `사진은 한 시술 기록당 최대 ${MAX_TREATMENT_PHOTO_COUNT}장까지 첨부할 수 있습니다.`;
  }

  const invalidTypeFile = files.find((file) => !allowedImageTypes.includes(file.type));

  if (invalidTypeFile) {
    return "사진은 jpg, jpeg, png, webp 파일만 첨부할 수 있습니다.";
  }

  const oversizedFile = files.find((file) => file.size > MAX_TREATMENT_PHOTO_SIZE);

  if (oversizedFile) {
    return "사진은 파일 1개당 최대 5MB까지 첨부할 수 있습니다.";
  }

  return "";
}

export function buildTreatmentPhotoPath({
  customerId,
  file,
  treatmentId,
  userId,
}: {
  customerId: string;
  file: File;
  treatmentId: string;
  userId: string;
}) {
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${TREATMENT_PHOTOS_BUCKET}/${userId}/${customerId}/${treatmentId}/${Date.now()}-${safeFileName}`;
}

export async function uploadTreatmentPhoto(storagePath: string, file: File) {
  const { error } = await supabase.storage
    .from(TREATMENT_PHOTOS_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw error;
  }
}

export async function createTreatmentPhotoSignedUrl(storagePath: string) {
  const { data, error } = await supabase.storage
    .from(TREATMENT_PHOTOS_BUCKET)
    .createSignedUrl(storagePath, TREATMENT_PHOTO_SIGNED_URL_EXPIRES_IN);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}
