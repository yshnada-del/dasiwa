import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-[100dvh] bg-dasiwa-bg text-dasiwa-text md:flex md:items-center md:justify-center md:bg-[#f4f2f0] md:p-6">
      <div className="relative mx-auto min-h-[100dvh] w-full overflow-hidden bg-dasiwa-bg md:h-[844px] md:min-h-0 md:max-w-[390px] md:rounded-[40px] md:shadow-[0_24px_72px_rgba(42,26,31,0.13),0_2px_12px_rgba(0,0,0,0.05)]">
        <main className="h-[100dvh] overflow-y-auto pb-[calc(82.75px+env(safe-area-inset-bottom))] md:h-[844px] md:pb-[82.75px]">
          <Outlet />
        </main>
        <Sidebar />
      </div>
    </div>
  );
}
