import { Link, useLocation } from "react-router-dom";

const imgHome = "/figma-assets/nav-home.svg";
const imgCustomers = "/figma-assets/nav-customers.svg";
const imgPlus = "/figma-assets/nav-plus.svg";
const imgContact = "/figma-assets/nav-contact.svg";
const imgSettings = "/figma-assets/nav-settings.svg";

const navItems = [
  { to: "/app/dashboard", label: "홈", icon: imgHome, left: "5.13%", active: (path: string) => path === "/app" || path === "/app/dashboard" },
  { to: "/app/customers", label: "고객", icon: imgCustomers, left: "24.62%", active: (path: string) => path.startsWith("/app/customers") },
  { to: "/app/follow-ups", label: "연락", icon: imgContact, left: "62.05%", active: (path: string) => path.startsWith("/app/follow-ups") },
  { to: "/app/settings", label: "설정", icon: imgSettings, left: "81.54%", active: (path: string) => path.startsWith("/app/settings") },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 h-[calc(82.75px+env(safe-area-inset-bottom))] border-t border-[#f2e6df] bg-white md:absolute md:h-[82.75px]">
      <div className="relative mx-auto h-[82.75px] w-full max-w-[390px]">
        {navItems.map((item) => {
          const isActive = item.active(location.pathname);
          return (
            <Link className="absolute top-[10px] flex min-w-[52px] flex-col items-center gap-[4px] pt-[2px]" key={item.to} style={{ left: item.left }} to={item.to}>
              <span
                aria-hidden="true"
                className={isActive ? "size-[20px] bg-dasiwa-primary" : "size-[20px] bg-[#c4a8ab]"}
                style={{ WebkitMask: `url(${item.icon}) center / contain no-repeat`, mask: `url(${item.icon}) center / contain no-repeat` }}
              />
              <span className={(isActive ? "text-dasiwa-primary" : "text-[#c4a8ab]") + " text-[10.5px] font-normal leading-[15.75px] tracking-[-0.1px]"}>{item.label}</span>
            </Link>
          );
        })}
        <Link aria-label="고객 등록" className="absolute left-1/2 top-[-6px] flex size-[46px] -translate-x-1/2 items-center justify-center rounded-[23px] bg-dasiwa-primary shadow-[0_6px_9px_rgba(212,20,79,0.32)]" to="/app/customers/new">
          <img alt="" className="size-[20px]" src={imgPlus} />
        </Link>
      </div>
    </nav>
  );
}
