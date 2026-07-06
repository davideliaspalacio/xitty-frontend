"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { useMyReservations } from "@/features/reservations";
import { ReservationCard } from "@/features/reservations/components/reservation-card";
import { Skeleton } from "@/shared/ui/skeleton";
import { buttonVariants } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { cn } from "@/shared/utils/cn";
import type { Reservation } from "@/lib/api/types";

type Tab = "upcoming" | "past" | "cancelled";

const tabs: { key: Tab; label: string }[] = [
  { key: "upcoming", label: "Próximas" },
  { key: "past", label: "Pasadas" },
  { key: "cancelled", label: "Canceladas" },
];

function bucketize(reservations: Reservation[]) {
  const now = Date.now();
  const upcoming: Reservation[] = [];
  const past: Reservation[] = [];
  const cancelled: Reservation[] = [];
  for (const r of reservations) {
    if (r.status === "cancelled") {
      cancelled.push(r);
      continue;
    }
    const ts = r.slot ? new Date(r.slot.starts_at).getTime() : 0;
    if (r.status === "completed" || ts <= now) past.push(r);
    else upcoming.push(r);
  }
  // sort upcoming asc, past desc, cancelled desc
  upcoming.sort((a, b) =>
    (a.slot?.starts_at ?? "").localeCompare(b.slot?.starts_at ?? ""),
  );
  past.sort((a, b) =>
    (b.slot?.starts_at ?? "").localeCompare(a.slot?.starts_at ?? ""),
  );
  cancelled.sort((a, b) =>
    (b.cancelled_at ?? "").localeCompare(a.cancelled_at ?? ""),
  );
  return { upcoming, past, cancelled };
}

export default function ReservationsPage() {
  const { data, isLoading } = useMyReservations(1, 100);
  const [tab, setTab] = useState<Tab>("upcoming");

  const buckets = useMemo(
    () => bucketize(data?.data ?? []),
    [data?.data],
  );
  const visible = buckets[tab];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="eyebrow">Mis reservas</p>
        <h1 className="text-[32px] font-semibold leading-[1.1] tracking-normal">
          Tu agenda en Xitty
        </h1>
        <p className="text-[var(--text-muted)] text-[15px]">
          Próximas experiencias, pasadas y canceladas — todo en un solo lugar.
        </p>
      </header>

      <nav
        className="flex gap-1 border-b border-[var(--border)] overflow-x-auto"
        role="group"
        aria-label="Filtrar reservas"
      >
        {tabs.map((t) => {
          const count = buckets[t.key].length;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              aria-pressed={active}
              onClick={() => setTab(t.key)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
                active
                  ? "border-[var(--accent)] text-[var(--text)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]",
              )}
            >
              {t.label}{" "}
              <span className="text-xs text-[var(--text-soft)]">{count}</span>
            </button>
          );
        })}
      </nav>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div>
          {tab === "upcoming" ? (
            <EmptyState
              icon={CalendarCheck}
              title="Aún no tienes reservas próximas"
              description="Reserva una experiencia para empezar a llenar tu agenda en Barranquilla."
              action={
                <Link href="/experiences" className={buttonVariants()}>
                  Ver experiencias
                </Link>
              }
            />
          ) : (
            <EmptyState
              icon={CalendarCheck}
              tone="neutral"
              title="Nada por aquí todavía"
              description="Cuando tengas reservas en esta categoría, las verás en esta lista."
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((r) => (
            <ReservationCard key={r.id} reservation={r} />
          ))}
        </div>
      )}
    </div>
  );
}
