"use client";

import type { ComponentType } from "react";
import { BriefcaseBusiness, Compass, Heart, Route, Users } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { TravelerType } from "@/lib/api/types";

interface TravelerTypeChipsProps {
  /** Currently selected traveler type, or null for none. If undefined, falls back to the value in the preferences store. */
  selected?: TravelerType | null;
  /** Called with the new traveler type, or `null` when the active chip is toggled off. */
  onChange: (next: TravelerType | null) => void;
  className?: string;
}

interface ChipOption {
  value: TravelerType;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const OPTIONS: ChipOption[] = [
  { value: "nomada", label: "Nómada", icon: Compass },
  { value: "pareja", label: "Pareja", icon: Heart },
  { value: "familia", label: "Familia", icon: Users },
  { value: "negocios", label: "Negocios", icon: BriefcaseBusiness },
  { value: "excursion", label: "Excursión", icon: Route },
];

export function TravelerTypeChips({
  selected,
  onChange,
  className,
}: TravelerTypeChipsProps) {
  // Default to the value stored in user preferences when the parent does not
  // explicitly control selection.
  const prefs = usePreferences();
  const fallback: TravelerType | null = prefs.data?.traveler_type ?? null;
  const active: TravelerType | null =
    selected === undefined ? fallback : selected;

  return (
    <div
      role="group"
      aria-label="Tipo de viajero"
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 -mx-1 px-1",
        "snap-x snap-mandatory",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {OPTIONS.map((opt) => {
        const isActive = active === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(isActive ? null : opt.value)}
            className={cn(
              "shrink-0 snap-start inline-flex items-center gap-1.5",
              "min-h-11 rounded-pill px-4 py-2 text-sm font-semibold",
              "transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30",
              isActive
                ? "bg-[var(--accent)] text-[var(--accent-fg)] border border-transparent shadow-[var(--shadow-1)]"
                : "bg-[var(--surface,white)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--border-strong)]",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
