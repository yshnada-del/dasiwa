import {
  buildTreatmentPhotoPath,
  createTreatmentPhotoSignedUrl,
  uploadTreatmentPhoto,
} from "../../lib/storage";
import { supabase } from "../../lib/supabase";
import type {
  CreateTreatmentPhotoMetadataInput,
  TreatmentPhoto,
  TreatmentPhotoWithSignedUrl,
} from "./treatmentPhotos.types";

export async function createTreatmentPhotoMetadata(
  input: CreateTreatmentPhotoMetadataInput,
) {
  const { data, error } = await supabase
    .from("treatment_photos")
    .insert({
      user_id: input.userId,
      customer_id: input.customerId,
      treatment_id: input.treatmentId,
      storage_path: input.storagePath,
    })
    .select()
    .single<TreatmentPhoto>();

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadTreatmentPhotos({
  customerId,
  files,
  treatmentId,
  userId,
}: {
  userId: string;
  customerId: string;
  treatmentId: string;
  files: File[];
}) {
  const savedPhotos: TreatmentPhoto[] = [];

  for (const file of files) {
    const storagePath = buildTreatmentPhotoPath({
      customerId,
      file,
      treatmentId,
      userId,
    });

    await uploadTreatmentPhoto(storagePath, file);

    const savedPhoto = await createTreatmentPhotoMetadata({
      userId,
      customerId,
      treatmentId,
      storagePath,
    });

    savedPhotos.push(savedPhoto);
  }

  return savedPhotos;
}

export async function getTreatmentPhotosByCustomer(
  userId: string,
  customerId: string,
) {
  const { data, error } = await supabase
    .from("treatment_photos")
    .select("*")
    .eq("user_id", userId)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .returns<TreatmentPhoto[]>();

  if (error) {
    throw error;
  }

  const photosWithSignedUrls = await Promise.all(
    data.map(async (photo): Promise<TreatmentPhotoWithSignedUrl> => {
      const signedUrl = await createTreatmentPhotoSignedUrl(photo.storage_path);
      return { ...photo, signedUrl };
    }),
  );

  return photosWithSignedUrls;
}
