import { Link, useLocation } from "react-router-dom";

const imgHome = "http://localhost:3845/assets/e22e318a901b0ef13f54be10da343e8324c76b76.svg";
const imgCustomers = "http://localhost:3845/assets/a57657a46e04b881d2999ba84d98f4cc93129fce.svg";
const imgPlus = "http://localhost:3845/assets/0ac6fa09c5e78ccdf854673c560bfe315ca0f559.svg";
const imgContact = "http://localhost:3845/assets/33bbc1c5749349ec2518f52f8483a203ed966d1a.svg";
const imgSettings = "http://localhost:3845/assets/f8d36dd1663cf61ae13c522b3319fad94251d14e.svg";

const navItems = [
  { to: "/app/dashboard", label: "홈", icon: imgHome, left: 20, active: (path: string) => path === "/app" || path === "/app/dashboard" },
  { to: "/app/customers", label: "고객", icon: imgCustomers, left: 96, active: (path: string) => path.startsWith("/app/customers") },
  { to: "/app/follow-ups", label: "연락", icon: imgContact, left: 242, active: (path: string) => path.startsWith("/app/follow-ups") },
  { to: "/app/settings", label: "설정", icon: imgSettings, left: 318, active: (path: string) => path.startsWith("/app/settings") },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 h-[82.75px] border-t border-[#f2e6df] bg-white">
      <div className="relative h-full">
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
        <Link aria-label="고객 등록" className="absolute left-[172px] top-[-6px] flex size-[46px] items-center justify-center rounded-[23px] bg-dasiwa-primary shadow-[0_6px_9px_rgba(212,20,79,0.32)]" to="/app/customers/new">
          <img alt="" className="size-[20px]" src={imgPlus} />
        </Link>
      </div>
    </nav>
  );
}