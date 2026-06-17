export type TreatmentPhoto = {
  id: string;
  user_id: string;
  customer_id: string;
  treatment_id: string;
  storage_path: string;
  created_at: string;
};

export type TreatmentPhotoWithSignedUrl = TreatmentPhoto & {
  signedUrl: string;
};

export type CreateTreatmentPhotoMetadataInput = {
  userId: string;
  customerId: string;
  treatmentId: string;
  storagePath: string;
};
