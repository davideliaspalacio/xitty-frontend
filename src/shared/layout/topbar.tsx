"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/ui/button";
import { EmergencyButton } from "@/shared/ui/emergency-button";
import { LanguageSelector } from "@/features/i18n/components/language-selector";
import { Logo } from "@/shared/ui/logo";
import { useRouter } from "next/navigation";

export function Topbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    router.push(trimmed ? `/places?q=${encodeURIComponent(trimmed)}` : "/places");
    setQ("");
  }

  const initials = (user?.full_name || user?.email || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header
      style={{ height: "var(--topbar-height)" }}
      className="sticky top-0 z-40 flex items-center gap-4 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur px-6"
    >
      {/* Logo — solo en mobile (en desktop vive en la Sidebar) */}
      <Link href="/home" aria-label="Ir al inicio" className="md:hidden shrink-0">
        <Logo size="sm" />
      </Link>

      {/* Buscador full — solo desktop. En mobile colapsa a un botón-lupa
          (abajo) para no ahogar la barra en 390px. */}
      <form onSubmit={handleSearchSubmit} className="hidden md:block flex-1 max-w-xl">
        <div className="relative">
          <label htmlFor="topbar-search" className="sr-only">
            Buscar lugares y experiencias
          </label>
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
            aria-hidden="true"
          />
          <input
            id="topbar-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar lugares, experiencias…"
            className="h-11 w-full rounded-pill border border-[var(--border)] bg-[var(--bg-subtle)] pl-10 pr-4 text-base text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25 md:text-sm"
          />
        </div>
      </form>

      {/* Empuja las acciones a la derecha en mobile (no hay buscador inline) */}
      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Lupa → /places, solo mobile */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Buscar"
          className="md:hidden"
          onClick={() => router.push("/places")}
        >
          <Search className="h-[18px] w-[18px]" aria-hidden="true" />
        </Button>

        {/* Campana: solo desde sm para no saturar mobile */}
        <Button variant="ghost" size="icon" aria-label="Notificaciones" className="hidden sm:inline-flex">
          <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        </Button>

        <span id="tour-sos" className="inline-flex">
          <EmergencyButton />
        </span>

        <LanguageSelector className="hidden sm:flex" />

        <div className="flex items-center gap-3 pl-2">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]"
            aria-hidden
          >
            {initials}
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-medium text-[var(--text)]">
              {user?.full_name ?? user?.email ?? "Invitado"}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] text-left"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
