"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Store,
  Ticket,
  Tag,
  BarChart3,
  Bell as BellIcon,
} from "lucide-react";
import { RoleGate } from "@/features/auth/components/role-gate";
import { cn } from "@/shared/utils/cn";

const tabs = [
  { href: "/dashboard", label: "Resumen", icon: Briefcase, exact: true },
  { href: "/dashboard/place", label: "Mi lugar", icon: Store, exact: false },
  { href: "/dashboard/experiences", label: "Mis experiencias", icon: Ticket, exact: false },
  { href: "/dashboard/promotions", label: "Promociones", icon: Tag, exact: false },
  { href: "/dashboard/metrics", label: "Métricas", icon: BarChart3, exact: false },
  { href: "/dashboard/settings", label: "Notificaciones", icon: BellIcon, exact: false },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <RoleGate allow={["business", "admin"]}>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-1">
          <p className="eyebrow">Mi negocio</p>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em]">
            Dashboard
          </h1>
        </header>

        {/* Wrapper relativo: el degradado lateral derecho insinúa que hay
            más pestañas hacia la que scrollear en pantallas angostas. */}
        <div className="relative border-b border-[var(--border)]">
          <nav
            className="flex gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
          >
            {tabs.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
                    active
                      ? "border-[var(--accent)] text-[var(--text)]"
                      : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          {/* Sombra/degradado derecho — solo visible cuando hay overflow. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--bg)] to-transparent"
          />
        </div>

        <div>{children}</div>
      </div>
    </RoleGate>
  );
}
