import { ArrowLeft, Copy, ImagePlus, MoreHorizontal, Save, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { useAiMessage } from "../../features/ai-messages/aiMessages.hooks";
import { useAuth } from "../../features/auth/auth.hooks";
import { useCustomer } from "../../features/customers/customers.hooks";
import { useTreatmentPhotos, useUploadTreatmentPhotos } from "../../features/treatment-photos/treatmentPhotos.hooks";
import type { TreatmentPhotoWithSignedUrl } from "../../features/treatment-photos/treatmentPhotos.types";
import { useCreateTreatment, useTreatments, useUpdateCustomerVisitAfterTreatment } from "../../features/treatments/treatments.hooks";
import type { Treatment } from "../../features/treatments/treatments.types";
import { formatDate, getTodayDateInputValue } from "../../lib/dates";
import { validateTreatmentPhotos } from "../../lib/storage";

function dday(date: string | null) {
  if (!date) return "-";
  const today = new Date();
  const due = new Date(`${date}T00:00:00`);
  today.setHours(0, 0, 0, 0);
  return `D-${Math.max(0, Math.ceil((due.getTime() - today.getTime()) / 86400000))}`;
}

function formatPrice(price: number | null) {
  return price === null ? "금액 없음" : `${new Intl.NumberFormat("ko-KR").format(price)}원`;
}

function Photos({ photos }: { photos: TreatmentPhotoWithSignedUrl[] }) {
  if (photos.length === 0) return null;
  return <div className="mt-2 flex gap-2 overflow-x-auto">{photos.slice(0, 3).map((photo) => <img alt="시술 사진" className="size-[54px] rounded-[12px] object-cover" key={photo.id} loading="lazy" src={photo.signedUrl} />)}</div>;
}

function TreatmentItem({ photos, treatment }: { photos: TreatmentPhotoWithSignedUrl[]; treatment: Treatment }) {
  return (
    <article className="flex gap-3">
      <div className="flex w-7 flex-col items-center"><span className="mt-0 size-2.5 rounded-full bg-dasiwa-primary" /><span className="mt-1 w-px flex-1 bg-dasiwa-border" /></div>
      <div className="flex-1 rounded-[13px] border border-[#ead8d0] bg-white px-[15px] py-[14px]">
        <div className="flex items-start justify-between"><div><p className="text-[12px] font-bold leading-[18px] tracking-[-0.1px] text-[#9b7478]">{formatDate(treatment.treatment_date)}</p><h3 className="mt-1 text-[14px] font-bold leading-[21px] tracking-[-0.3px] text-dasiwa-text">{treatment.service_name}</h3></div><MoreHorizontal className="size-[13px] text-[#c4a8ab]" /></div>
        {treatment.memo ? <p className="mt-1 text-[12px] font-normal leading-[18px] tracking-[-0.1px] text-[#9b7478]">{treatment.memo}</p> : null}
        <Photos photos={photos} />
        <div className="mt-2 flex items-center gap-2 text-[11.5px]"><span className="text-dasiwa-muted">{formatPrice(treatment.price)}</span><span className="size-[3px] rounded-full bg-[#ead8d0]" /><span className="font-medium text-dasiwa-primary">다음 방문 {formatDate(treatment.next_visit_due_date)}</span></div>
      </div>
    </article>
  );
}

export function CustomerDetailPage() {
  const { customerId } = useParams();
  const { user } = useAuth();
  const { customer, errorMessage: customerErrorMessage, isLoading: isCustomerLoading, refetch: refetchCustomer } = useCustomer(user?.id, customerId);
  const { errorMessage: treatmentsErrorMessage, isLoading: areTreatmentsLoading, refetch: refetchTreatments, treatments } = useTreatments(user?.id, customerId);
  const { errorMessage: photosErrorMessage, isLoading: arePhotosLoading, photos, refetch: refetchPhotos } = useTreatmentPhotos(user?.id, customerId);
  const { errorMessage: createTreatmentErrorMessage, isSubmitting, submit } = useCreateTreatment();
  const { errorMessage: uploadErrorMessage, isUploading, upload } = useUploadTreatmentPhotos();
  const { errorMessage: updateCustomerVisitErrorMessage, update: updateCustomerVisit } = useUpdateCustomerVisitAfterTreatment();
  const aiReviewMessage = useAiMessage();

  const [treatmentDate, setTreatmentDate] = useState(getTodayDateInputValue());
  const [serviceName, setServiceName] = useState("");
  const [memo, setMemo] = useState("");
  const [price, setPrice] = useState("");
  const [revisitIntervalDays, setRevisitIntervalDays] = useState("28");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const [isTreatmentFormOpen, setIsTreatmentFormOpen] = useState(false);

  const latestTreatment = treatments[0] ?? null;
  const photosByTreatmentId = useMemo(() => photos.reduce<Record<string, TreatmentPhotoWithSignedUrl[]>>((acc, photo) => { acc[photo.treatment_id] = [...(acc[photo.treatment_id] ?? []), photo]; return acc; }, {}), [photos]);

  useEffect(() => { if (customer?.default_revisit_interval_days) setRevisitIntervalDays(String(customer.default_revisit_interval_days)); }, [customer?.default_revisit_interval_days]);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const validationMessage = validateTreatmentPhotos(files);
    if (validationMessage) { setSelectedFiles([]); setFileErrorMessage(validationMessage); return; }
    setSelectedFiles(files); setFileErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !customer || !customerId || isSubmitting || isUploading) return;
    const validationMessage = validateTreatmentPhotos(selectedFiles);
    if (validationMessage) { setFileErrorMessage(validationMessage); return; }
    const revisitDays = Number(revisitIntervalDays || 28);
    const createdTreatment = await submit({ userId: user.id, customerId, treatmentDate, serviceName: serviceName.trim(), memo: memo.trim(), price: price ? Number(price) : null, revisitIntervalDays: revisitDays });
    if (selectedFiles.length > 0) await upload({ userId: user.id, customerId, treatmentId: createdTreatment.id, files: selectedFiles });
    await updateCustomerVisit({ userId: user.id, customerId, treatmentDate, revisitIntervalDays: revisitDays });
    setTreatmentDate(getTodayDateInputValue()); setServiceName(""); setMemo(""); setPrice(""); setSelectedFiles([]); setFileErrorMessage(""); setFileInputKey((key) => key + 1); setRevisitIntervalDays(String(customer.default_revisit_interval_days ?? 28)); setIsTreatmentFormOpen(false);
    await Promise.all([refetchCustomer(), refetchTreatments(), refetchPhotos()]);
  }

  async function handleGenerateReviewMessage() {
    if (!user || !customer || !latestTreatment) return;
    try { await aiReviewMessage.generate({ userId: user.id, customerId: customer.id, treatmentId: latestTreatment.id, messageType: "review_request", customerName: customer.name, serviceName: latestTreatment.service_name, lastVisitDate: latestTreatment.treatment_date, nextVisitDueDate: latestTreatment.next_visit_due_date, tone: "friendly" }); } catch { }
  }

  const submitErrorMessage = createTreatmentErrorMessage || uploadErrorMessage || updateCustomerVisitErrorMessage;

  return (
    <div className="pt-12">
      <header className="relative h-12"><Link className="absolute left-5 top-0 flex size-9 items-center justify-center rounded-[18px] border border-[#ead8d0] bg-white text-dasiwa-text" to="/app/customers"><ArrowLeft className="size-[18px]" /></Link><h1 className="pt-1.5 text-center text-[16px] font-bold leading-6 tracking-[-0.3px] text-dasiwa-text">고객 상세</h1><button className="absolute right-5 top-0 flex size-9 items-center justify-center rounded-[18px] border border-[#ead8d0] bg-white text-dasiwa-text" type="button"><MoreHorizontal className="size-[18px]" /></button></header>
      {isCustomerLoading ? <p className="px-4 py-6 text-center text-[12px] text-dasiwa-muted">고객 정보를 불러오는 중이에요.</p> : null}
      {customerErrorMessage ? <p className="mx-[22px] rounded-[12px] bg-dasiwa-primary-soft px-3 py-2 text-[12px] text-dasiwa-primary">{customerErrorMessage}</p> : null}
      {customer ? <>
        <section className="h-[82px] px-[22px] pt-1.5"><div className="flex items-center"><div className="flex size-14 items-center justify-center rounded-[28px] border-2 border-dasiwa-accent bg-[#fff3ee] text-[22px] font-bold leading-[33px] text-dasiwa-accent">{customer.name.slice(0, 1)}</div><div className="ml-[14px] min-w-0"><div className="flex items-center gap-2"><h2 className="text-[20px] font-bold leading-[30px] tracking-[-0.5px] text-dasiwa-text">{customer.name}</h2><span className="rounded-[5px] bg-[#f5f0ee] px-[8px] py-0.5 text-[11px] font-medium leading-[16.5px] text-[#9b7478]">{customer.preferred_service || "선호 시술"}</span></div><p className="mt-0.5 text-[13px] font-normal leading-[19.5px] tracking-[0.1px] text-[#9b7478]">{customer.phone || "전화번호 없음"}</p></div></div></section>
        <div className="mx-[22px] h-px bg-dasiwa-border" />
        <section className="flex h-[73.5px] px-[22px] py-4"><div className="w-[154.5px]"><p className="text-[11px] font-normal leading-[16.5px] tracking-[-0.1px] text-[#c4a8ab]">최근 방문일</p><p className="mt-1 text-[14px] font-bold leading-[21px] tracking-[-0.2px] text-[#9b7478]">{formatDate(customer.last_visit_date)}</p></div><div className="flex w-[37px] justify-center"><span className="h-[37.5px] w-px bg-dasiwa-border" /></div><div className="w-[154.5px]"><p className="text-[11px] font-normal leading-[16.5px] tracking-[-0.1px] text-[#c4a8ab]">다음 방문 예정일</p><div className="mt-1 flex items-center gap-2"><p className="text-[14px] font-bold leading-[21px] tracking-[-0.2px] text-[#9b7478]">{formatDate(customer.next_visit_due_date)}</p><span className="rounded-[5px] bg-[#f5f0ee] px-[8px] py-0.5 text-[11px] font-medium leading-[16.5px] text-[#9b7478]">{dday(customer.next_visit_due_date)}</span></div></div></section>
        <div className="h-2 bg-[#f2e6df]" />
        <section className="px-[22px] py-[18px]"><div className="flex h-[21px] items-center justify-between"><h2 className="text-[14px] font-bold leading-[21px] tracking-[-0.3px] text-dasiwa-text">시술 기록</h2><span className="text-[12px] text-dasiwa-muted">총 {treatments.length}회</span></div><div className="mt-[18px] space-y-3">{areTreatmentsLoading ? <p className="text-center text-[12px] text-dasiwa-muted">불러오는 중이에요.</p> : null}{treatmentsErrorMessage ? <p className="text-[12px] text-dasiwa-primary">{treatmentsErrorMessage}</p> : null}{!areTreatmentsLoading && treatments.length === 0 ? <p className="py-8 text-center text-[12px] text-dasiwa-muted">아직 시술 기록이 없어요.</p> : null}{treatments.map((treatment) => <TreatmentItem key={treatment.id} photos={photosByTreatmentId[treatment.id] ?? []} treatment={treatment} />)}</div></section>
        <div className="h-2 bg-[#f2e6df]" />
        <section className="px-[22px] py-[18px]"><div className="flex h-[21px] items-center justify-between"><h2 className="text-[14px] font-bold leading-[21px] tracking-[-0.3px] text-dasiwa-text">후기 요청 문구</h2><button className="text-[12px] font-bold text-dasiwa-primary" disabled={!latestTreatment || aiReviewMessage.isGenerating} onClick={handleGenerateReviewMessage} type="button">다시 생성</button></div><div className="mt-3 rounded-[13px] border border-[#ead8d0] bg-[#fffcf9] px-[17px] py-[15px]"><p className="min-h-[72px] whitespace-pre-wrap text-[13px] font-normal leading-[22.1px] tracking-[-0.1px] text-[#9b7478]">{aiReviewMessage.generated?.message || "시술 기록을 바탕으로 고객에게 보낼 후기 요청 문구를 만들 수 있어요."}</p><Button className="mt-3 min-h-[44px] w-full rounded-[11px] border border-dasiwa-primary bg-[#fdf0f3] text-[13.5px] leading-[20.25px] tracking-[-0.2px] text-dasiwa-primary shadow-none" disabled={!latestTreatment || aiReviewMessage.isGenerating} onClick={aiReviewMessage.generated ? () => user && aiReviewMessage.copy(user.id) : handleGenerateReviewMessage} type="button" variant={aiReviewMessage.generated ? "primary" : "secondary"}>{aiReviewMessage.generated ? <Copy className="size-4" /> : <Sparkles className="size-4" />}{aiReviewMessage.generated ? "문구 복사하기" : "AI 문구 만들기"}</Button></div></section>
        {isTreatmentFormOpen ? <form className="mx-[22px] mb-4 space-y-3 rounded-[16px] bg-white p-4" onSubmit={handleSubmit}><Input label="시술일" onChange={(event) => setTreatmentDate(event.target.value)} required type="date" value={treatmentDate} /><Input label="시술명" onChange={(event) => setServiceName(event.target.value)} required value={serviceName} /><div className="grid grid-cols-2 gap-2"><Input label="금액" onChange={(event) => setPrice(event.target.value)} type="number" value={price} /><Input label="재방문 주기" onChange={(event) => setRevisitIntervalDays(event.target.value)} type="number" value={revisitIntervalDays} /></div><Textarea label="메모" onChange={(event) => setMemo(event.target.value)} value={memo} /><label className="block rounded-[12px] border border-dashed border-dasiwa-border bg-dasiwa-bg p-3 text-[12px] text-dasiwa-muted"><span className="flex items-center gap-2 font-bold text-dasiwa-text"><ImagePlus className="size-4 text-dasiwa-primary" />사진 첨부</span><input accept="image/jpeg,image/jpg,image/png,image/webp" className="mt-2 block w-full" key={fileInputKey} multiple onChange={handlePhotoChange} type="file" /></label>{fileErrorMessage || submitErrorMessage ? <p className="text-[12px] text-dasiwa-primary">{fileErrorMessage || submitErrorMessage}</p> : null}<Button className="w-full" disabled={isSubmitting || isUploading} type="submit"><Save className="size-4" />{isSubmitting || isUploading ? "저장 중..." : "저장하기"}</Button></form> : null}
        <div className="px-[22px] pb-4"><Button className="min-h-[54px] w-full rounded-[15px] text-[15px] leading-[22.5px] tracking-[-0.3px]" onClick={() => setIsTreatmentFormOpen((open) => !open)} type="button">{isTreatmentFormOpen ? "시술 기록 입력 닫기" : "시술 기록 추가"}</Button></div>
        {arePhotosLoading || photosErrorMessage ? <p className="px-[22px] text-[12px] text-dasiwa-muted">{arePhotosLoading ? "사진을 불러오는 중이에요." : photosErrorMessage}</p> : null}
      </> : null}
    </div>
  );
}
