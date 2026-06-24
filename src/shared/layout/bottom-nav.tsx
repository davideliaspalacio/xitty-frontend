"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import type { Role } from "@/lib/api/types";
import { navByRole } from "./nav-config";

/**
 * Barra de navegación inferior, SOLO en mobile (`md:hidden`). Reemplaza a la
 * Sidebar (que está oculta < md) para que el usuario pueda moverse entre
 * secciones en celular. Muestra los primeros 5 ítems del rol y respeta el
 * safe-area de iOS.
 */
export function BottomNav({ role = "user" }: { role?: Role }) {
  const pathname = usePathname() ?? "";
  const items = (navByRole[role] ?? navByRole.user).slice(0, 5);

  return (
    <nav
      aria-label="Navegación"
      className={cn(
        "md:hidden fixed bottom-0 inset-x-0 z-40",
        "flex items-stretch",
        "border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur",
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 h-16 min-w-0",
              "text-[10px] font-medium transition-colors",
              active
                ? "text-[var(--accent)]"
                : "text-[var(--text-muted)] active:text-[var(--text)]",
            )}
          >
            <Icon className="h-[22px] w-[22px] shrink-0" />
            <span className="truncate max-w-full px-1">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
