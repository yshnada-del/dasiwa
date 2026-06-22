import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f4f2f0] text-dasiwa-text sm:flex sm:items-center sm:justify-center sm:p-6">
      <div className="relative mx-auto min-h-[844px] w-full max-w-[390px] overflow-hidden rounded-[40px] bg-dasiwa-bg shadow-[0_24px_72px_rgba(42,26,31,0.13),0_2px_12px_rgba(0,0,0,0.05)]">
        <main className="h-[844px] overflow-y-auto pb-[82.75px]">
          <Outlet />
        </main>
        <Sidebar />
      </div>
    </div>
  );
}