"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Search,
  Heart,
  CalendarCheck,
  User,
  Briefcase,
  BarChart3,
  Tag,
  Shield,
} from "lucide-react";
import { Logo } from "@/shared/ui/logo";
import { cn } from "@/shared/utils/cn";
import type { Role } from "@/lib/api/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navByRole: Record<Role, NavItem[]> = {
  user: [
    { href: "/", label: "Descubrir", icon: Compass },
    { href: "/places", label: "Lugares", icon: Search },
    { href: "/favorites", label: "Favoritos", icon: Heart },
    { href: "/reservations", label: "Reservas", icon: CalendarCheck },
    { href: "/profile", label: "Mi cuenta", icon: User },
  ],
  business: [
    { href: "/dashboard", label: "Mi negocio", icon: Briefcase },
    { href: "/dashboard/promotions", label: "Promociones", icon: Tag },
    { href: "/dashboard/metrics", label: "Métricas", icon: BarChart3 },
    { href: "/profile", label: "Mi cuenta", icon: User },
  ],
  admin: [
    { href: "/admin", label: "Panel admin", icon: Shield },
    { href: "/admin/featured", label: "Destacados", icon: Compass },
    { href: "/admin/local-picks", label: "Local picks", icon: Heart },
    { href: "/admin/users", label: "Usuarios", icon: User },
    { href: "/profile", label: "Mi cuenta", icon: User },
  ],
};

export function Sidebar({ role = "user" }: { role?: Role }) {
  const pathname = usePathname();
  const items = navByRole[role] ?? navByRole.user;

  return (
    <aside
      style={{ width: "var(--sidebar-width)" }}
      className="hidden md:flex flex-col shrink-0 bg-[var(--bg-subtle)] border-r border-[var(--border)] sticky top-0 h-screen"
      aria-label="Navegación principal"
    >
      <div
        style={{ height: "var(--topbar-height)" }}
        className="flex items-center px-6 border-b border-[var(--border)]"
      >
        <Link href="/" aria-label="Ir al inicio">
          <Logo size="md" />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {items.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow-1)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-6 py-4 border-t border-[var(--border)] text-xs text-[var(--text-soft)]">
        Barranquilla · Atlántico
      </div>
    </aside>
  );
}
