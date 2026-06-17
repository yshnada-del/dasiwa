import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Textarea } from "../../components/ui/Textarea";
import { useAiMessage } from "../../features/ai-messages/aiMessages.hooks";
import { useAuth } from "../../features/auth/auth.hooks";
import { useCustomer } from "../../features/customers/customers.hooks";
import {
  useTreatmentPhotos,
  useUploadTreatmentPhotos,
} from "../../features/treatment-photos/treatmentPhotos.hooks";
import type { TreatmentPhotoWithSignedUrl } from "../../features/treatment-photos/treatmentPhotos.types";
import {
  useCreateTreatment,
  useTreatments,
  useUpdateCustomerVisitAfterTreatment,
} from "../../features/treatments/treatments.hooks";
import type { Treatment } from "../../features/treatments/treatments.types";
import { formatDate, getTodayDateInputValue } from "../../lib/dates";
import { validateTreatmentPhotos } from "../../lib/storage";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-stone-100 py-3 last:border-b-0 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-stone-500">{label}</dt>
      <dd className="text-sm font-medium text-stone-900">{value || "없음"}</dd>
    </div>
  );
}

function formatPrice(price: number | null) {
  return price === null ? "없음" : `${new Intl.NumberFormat("ko-KR").format(price)}원`;
}

function TreatmentItem({ treatment }: { treatment: Treatment }) {
  return (
    <article className="rounded-lg border border-stone-200 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-stone-950">{treatment.service_name}</p>
          <p className="mt-1 text-sm text-stone-500">
            시술일 {formatDate(treatment.treatment_date)}
          </p>
        </div>
        <Badge tone="stone">다음 방문 {formatDate(treatment.next_visit_due_date)}</Badge>
      </div>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-stone-500">금액</dt>
          <dd className="font-medium text-stone-800">{formatPrice(treatment.price)}</dd>
        </div>
        <div>
          <dt className="text-stone-500">재방문 권장 주기</dt>
          <dd className="font-medium text-stone-800">
            {treatment.revisit_interval_days ?? 28}일
          </dd>
        </div>
      </dl>
      {treatment.memo ? (
        <p className="mt-3 whitespace-pre-wrap rounded-lg bg-stone-50 p-3 text-sm leading-6 text-stone-600">
          {treatment.memo}
        </p>
      ) : null}
    </article>
  );
}

function PhotoGrid({ photos }: { photos: TreatmentPhotoWithSignedUrl[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((photo) => (
        <div
          className="aspect-square overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
          key={photo.id}
        >
          <img
            alt="시술 사진"
            className="h-full w-full object-cover"
            loading="lazy"
            src={photo.signedUrl}
          />
        </div>
      ))}
    </div>
  );
}

export function CustomerDetailPage() {
  const { customerId } = useParams();
  const { user } = useAuth();
  const {
    customer,
    errorMessage: customerErrorMessage,
    isLoading: isCustomerLoading,
    refetch: refetchCustomer,
  } = useCustomer(user?.id, customerId);
  const {
    errorMessage: treatmentsErrorMessage,
    isLoading: areTreatmentsLoading,
    refetch: refetchTreatments,
    treatments,
  } = useTreatments(user?.id, customerId);
  const {
    errorMessage: photosErrorMessage,
    isLoading: arePhotosLoading,
    photos,
    refetch: refetchPhotos,
  } = useTreatmentPhotos(user?.id, customerId);
  const {
    errorMessage: createTreatmentErrorMessage,
    isSubmitting,
    submit,
  } = useCreateTreatment();
  const {
    errorMessage: uploadErrorMessage,
    isUploading,
    upload,
  } = useUploadTreatmentPhotos();
  const {
    errorMessage: updateCustomerVisitErrorMessage,
    update: updateCustomerVisit,
  } = useUpdateCustomerVisitAfterTreatment();
  const aiReviewMessage = useAiMessage();

  const [treatmentDate, setTreatmentDate] = useState(getTodayDateInputValue());
  const [serviceName, setServiceName] = useState("");
  const [memo, setMemo] = useState("");
  const [price, setPrice] = useState("");
  const [revisitIntervalDays, setRevisitIntervalDays] = useState("28");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [fileErrorMessage, setFileErrorMessage] = useState("");

  const latestTreatment = treatments[0] ?? null;

  useEffect(() => {
    if (customer?.default_revisit_interval_days) {
      setRevisitIntervalDays(String(customer.default_revisit_interval_days));
    }
  }, [customer?.default_revisit_interval_days]);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const validationMessage = validateTreatmentPhotos(files);

    if (validationMessage) {
      setSelectedFiles([]);
      setFileErrorMessage(validationMessage);
      return;
    }

    setSelectedFiles(files);
    setFileErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !customer || !customerId || isSubmitting || isUploading) {
      return;
    }

    const validationMessage = validateTreatmentPhotos(selectedFiles);

    if (validationMessage) {
      setFileErrorMessage(validationMessage);
      return;
    }

    const revisitDays = Number(revisitIntervalDays || 28);
    const createdTreatment = await submit({
      userId: user.id,
      customerId,
      treatmentDate,
      serviceName: serviceName.trim(),
      memo: memo.trim(),
      price: price ? Number(price) : null,
      revisitIntervalDays: revisitDays,
    });

    if (selectedFiles.length > 0) {
      await upload({
        userId: user.id,
        customerId,
        treatmentId: createdTreatment.id,
        files: selectedFiles,
      });
    }

    await updateCustomerVisit({
      userId: user.id,
      customerId,
      treatmentDate,
      revisitIntervalDays: revisitDays,
    });

    setTreatmentDate(getTodayDateInputValue());
    setServiceName("");
    setMemo("");
    setPrice("");
    setSelectedFiles([]);
    setFileErrorMessage("");
    setFileInputKey((currentKey) => currentKey + 1);
    setRevisitIntervalDays(String(customer.default_revisit_interval_days ?? 28));

    await Promise.all([refetchCustomer(), refetchTreatments(), refetchPhotos()]);
  }

  async function handleGenerateReviewMessage() {
    if (!user || !customer || !latestTreatment) {
      return;
    }

    await aiReviewMessage.generate({
      userId: user.id,
      customerId: customer.id,
      treatmentId: latestTreatment.id,
      messageType: "review_request",
      customerName: customer.name,
      serviceName: latestTreatment.service_name,
      lastVisitDate: latestTreatment.treatment_date,
      nextVisitDueDate: latestTreatment.next_visit_due_date,
      tone: "friendly",
    });
  }

  const submitErrorMessage =
    createTreatmentErrorMessage ||
    uploadErrorMessage ||
    updateCustomerVisitErrorMessage;

  return (
    <div className="pb-20 lg:pb-0">
      <PageHeader
        eyebrow="고객 상세"
        title={customer?.name ?? "고객 정보를 확인하세요"}
        description="고객 기본 정보와 시술 기록, 사진, 다음 방문 예정일을 함께 관리합니다."
        action={<Badge tone="stone">상세 조회</Badge>}
      />

      {isCustomerLoading ? (
        <div className="rounded-lg border border-stone-200 bg-white p-6 text-center text-sm text-stone-500 shadow-sm">
          고객 정보를 불러오는 중입니다.
        </div>
      ) : null}

      {customerErrorMessage ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
          {customerErrorMessage}
        </div>
      ) : null}

      {!isCustomerLoading && !customerErrorMessage && !customer ? (
        <div className="rounded-lg border border-stone-200 bg-white p-6 text-center shadow-sm">
          <p className="font-medium text-stone-800">고객을 찾을 수 없습니다.</p>
          <Button asChild className="mt-4" variant="secondary">
            <Link to="/app/customers">고객 리스트로 돌아가기</Link>
          </Button>
        </div>
      ) : null}

      {customer ? (
        <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-stone-950">{customer.name}</h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {customer.phone || "전화번호 없음"}
                  </p>
                </div>
                <Badge tone="stone">고객</Badge>
              </div>

              <dl className="mt-4">
                <DetailRow label="선호 시술" value={customer.preferred_service} />
                <DetailRow
                  label="기본 재방문 주기"
                  value={`${customer.default_revisit_interval_days ?? 28}일`}
                />
                <DetailRow label="최근 방문일" value={formatDate(customer.last_visit_date)} />
                <DetailRow
                  label="다음 방문 예정일"
                  value={formatDate(customer.next_visit_due_date)}
                />
              </dl>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-stone-950">고객 메모</h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-600">
                {customer.memo || "아직 남긴 메모가 없습니다."}
              </p>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-stone-950">시술 사진</h3>
              {arePhotosLoading ? (
                <div className="mt-4 rounded-lg bg-stone-50 p-5 text-center text-sm text-stone-500">
                  사진을 불러오는 중입니다.
                </div>
              ) : null}
              {photosErrorMessage ? (
                <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
                  {photosErrorMessage}
                </div>
              ) : null}
              {!arePhotosLoading && !photosErrorMessage && photos.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-stone-300 p-6 text-center">
                  <p className="font-medium text-stone-800">아직 등록된 사진이 없습니다.</p>
                  <p className="mt-2 text-sm text-stone-500">
                    시술 기록 저장 시 사진을 함께 첨부할 수 있습니다.
                  </p>
                </div>
              ) : null}
              {!arePhotosLoading && !photosErrorMessage && photos.length > 0 ? (
                <div className="mt-4">
                  <PhotoGrid photos={photos} />
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <form
              className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
              onSubmit={handleSubmit}
            >
              <h3 className="text-base font-semibold text-stone-950">시술 기록 추가</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  label="시술일"
                  onChange={(event) => setTreatmentDate(event.target.value)}
                  required
                  type="date"
                  value={treatmentDate}
                />
                <Input
                  label="시술명"
                  onChange={(event) => setServiceName(event.target.value)}
                  placeholder="예: 웨딩 네일"
                  required
                  value={serviceName}
                />
                <Input
                  label="금액"
                  min={0}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="예: 65000"
                  type="number"
                  value={price}
                />
                <Input
                  label="재방문 권장 주기"
                  min={1}
                  onChange={(event) => setRevisitIntervalDays(event.target.value)}
                  placeholder="예: 28"
                  type="number"
                  value={revisitIntervalDays}
                />
              </div>
              <Textarea
                className="mt-4"
                label="시술 메모"
                onChange={(event) => setMemo(event.target.value)}
                placeholder="컬러, 디자인, 고객 반응, 다음에 참고할 내용을 남깁니다."
                value={memo}
              />

              <label className="mt-4 block">
                <span className="mb-1.5 block text-sm font-medium text-stone-700">
                  시술 사진
                </span>
                <input
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-stone-700 hover:file:bg-stone-200"
                  key={fileInputKey}
                  multiple
                  onChange={handlePhotoChange}
                  type="file"
                />
                <span className="mt-1.5 block text-xs text-stone-500">
                  jpg, jpeg, png, webp만 가능하며 파일당 5MB, 최대 5장까지 첨부할 수 있습니다.
                </span>
              </label>

              {selectedFiles.length > 0 ? (
                <p className="mt-2 text-sm text-stone-600">
                  선택한 사진 {selectedFiles.length}장
                </p>
              ) : null}
              {fileErrorMessage ? (
                <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {fileErrorMessage}
                </p>
              ) : null}
              {submitErrorMessage ? (
                <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {submitErrorMessage}
                </p>
              ) : null}
              <div className="mt-4 flex justify-end">
                <Button disabled={isSubmitting || isUploading} type="submit">
                  {isSubmitting || isUploading ? "저장 중..." : "시술 기록 저장"}
                </Button>
              </div>
            </form>

            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-base font-semibold text-stone-950">시술 기록</h3>
                <Button
                  disabled={!latestTreatment || aiReviewMessage.isGenerating}
                  onClick={handleGenerateReviewMessage}
                  type="button"
                  variant="secondary"
                >
                  {aiReviewMessage.isGenerating ? "생성 중..." : "후기 요청 메시지 생성"}
                </Button>
              </div>

              {aiReviewMessage.errorMessage ? (
                <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {aiReviewMessage.errorMessage}
                </p>
              ) : null}
              {!aiReviewMessage.generated &&
              !aiReviewMessage.isGenerating &&
              latestTreatment ? (
                <div className="mt-4 rounded-lg border border-dashed border-stone-300 p-4 text-sm leading-6 text-stone-500">
                  최신 시술 기록을 기준으로 후기 요청 메시지를 만들 수 있어요.
                  생성된 문구는 복사해서 카카오톡이나 문자에 직접 붙여넣으면 됩니다.
                </div>
              ) : null}
              {aiReviewMessage.generated ? (
                <div className="mt-4 rounded-lg border border-rose-100 bg-rose-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-stone-800">
                    {aiReviewMessage.generated.message}
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button
                      onClick={() => user && aiReviewMessage.copy(user.id)}
                      type="button"
                    >
                      복사
                    </Button>
                    {aiReviewMessage.copiedMessage ? (
                      <span className="text-sm text-stone-600">
                        {aiReviewMessage.copiedMessage}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {areTreatmentsLoading ? (
                <div className="mt-4 rounded-lg bg-stone-50 p-5 text-center text-sm text-stone-500">
                  시술 기록을 불러오는 중입니다.
                </div>
              ) : null}
              {treatmentsErrorMessage ? (
                <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
                  {treatmentsErrorMessage}
                </div>
              ) : null}
              {!areTreatmentsLoading && !treatmentsErrorMessage && treatments.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-stone-300 p-6 text-center">
                  <p className="font-medium text-stone-800">아직 등록된 시술 기록이 없습니다.</p>
                  <p className="mt-2 text-sm text-stone-500">
                    시술 기록이 생기면 후기 요청 메시지를 만들 수 있습니다.
                  </p>
                </div>
              ) : null}
              {!areTreatmentsLoading && !treatmentsErrorMessage && treatments.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {treatments.map((treatment) => (
                    <TreatmentItem key={treatment.id} treatment={treatment} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
