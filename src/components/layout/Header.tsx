import { Bell, LogOut, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/auth.hooks";
import { Button } from "../ui/Button";

export function Header() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-stone-50/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-rose-700">
            Dasiwa
          </p>
          <h1 className="truncate text-lg font-semibold text-stone-950">
            다시와, 단골을 기억하는 작은 노트
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="알림">
            <Bell className="size-5" />
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/app/customers/new">
              <Plus className="size-4" />
              고객 등록
            </Link>
          </Button>
          <Button
            aria-label="로그아웃"
            onClick={handleSignOut}
            size="icon"
            type="button"
            variant="ghost"
          >
            <LogOut className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
