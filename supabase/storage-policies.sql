-- Storage policies for the private treatment-photos bucket.
--
-- Run this after creating a private bucket named treatment-photos.
-- The app stores object names as:
-- treatment-photos/{user_id}/{customer_id}/{treatment_id}/{timestamp-fileName}

insert into storage.buckets (id, name, public)
values ('treatment-photos', 'treatment-photos', false)
on conflict (id) do update set public = false;

drop policy if exists "treatment_photos_select_own" on storage.objects;
create policy "treatment_photos_select_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'treatment-photos'
  and (storage.foldername(name))[1] = 'treatment-photos'
  and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "treatment_photos_insert_own" on storage.objects;
create policy "treatment_photos_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'treatment-photos'
  and (storage.foldername(name))[1] = 'treatment-photos'
  and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "treatment_photos_update_own" on storage.objects;
create policy "treatment_photos_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'treatment-photos'
  and (storage.foldername(name))[1] = 'treatment-photos'
  and (storage.foldername(name))[2] = auth.uid()::text
)
with check (
  bucket_id = 'treatment-photos'
  and (storage.foldername(name))[1] = 'treatment-photos'
  and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "treatment_photos_delete_own" on storage.objects;
create policy "treatment_photos_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'treatment-photos'
  and (storage.foldername(name))[1] = 'treatment-photos'
  and (storage.foldername(name))[2] = auth.uid()::text
);
