"use client";

import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import type { SafetyTone } from "@/features/suggestions/types";

interface SafetyBadgeProps {
  score: number;
  neighborhood: string;
  tone: SafetyTone;
  className?: string;
}

const TONE_LABEL: Record<SafetyTone, string> = {
  good: "segura",
  ok: "tranquila",
  caution: "con cuidado",
};

const TONE_STYLES: Record<SafetyTone, string> = {
  good: "bg-teal-500/10 text-teal-700",
  ok: "bg-yellow-500/10 text-yellow-700",
  caution: "bg-red-500/10 text-red-700",
};

const TONE_ICON: Record<SafetyTone, typeof Shield> = {
  good: ShieldCheck,
  ok: Shield,
  caution: ShieldAlert,
};

export function SafetyBadge({
  score,
  neighborhood,
  tone,
  className,
}: SafetyBadgeProps) {
  const Icon = TONE_ICON[tone];
  const toneLabel = TONE_LABEL[tone];

  return (
    <span
      data-tone={tone}
      title={`Score ${score}/100`}
      className={cn(
        "inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full",
        "text-[11px] font-semibold leading-none",
        TONE_STYLES[tone],
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="truncate">
        Zona {toneLabel} · {neighborhood}
      </span>
    </span>
  );
}
