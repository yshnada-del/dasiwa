import { CalendarHeart, Home, UserPlus, UsersRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/app/dashboard", label: "홈", icon: Home },
  { to: "/app/customers", label: "고객", icon: UsersRound },
  { to: "/app/customers/new", label: "등록", icon: UserPlus },
  { to: "/app/follow-ups", label: "연락", icon: CalendarHeart },
];

export function Sidebar() {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-stone-200 bg-white px-4 py-5 lg:block">
        <div className="mb-8">
          <p className="text-xl font-bold text-stone-950">다시와</p>
          <p className="mt-1 text-sm text-stone-500">1인샵 단골 기억 앱</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-rose-50 text-rose-700"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
                ].join(" ")
              }
            >
              <item.icon className="size-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white px-2 py-2 lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex min-h-12 flex-col items-center justify-center rounded-lg text-xs font-medium transition",
                  isActive ? "bg-rose-50 text-rose-700" : "text-stone-500",
                ].join(" ")
              }
            >
              <item.icon className="mb-1 size-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
