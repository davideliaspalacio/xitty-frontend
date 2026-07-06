"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";
import { useI18nStore, type Lang } from "@/features/i18n/store";
import { cn } from "@/shared/utils/cn";

interface LangOption {
  value: Lang;
  label: string;
  code: string;
}

const OPTIONS: LangOption[] = [
  { value: "es", label: "Español", code: "ES" },
  { value: "en", label: "English", code: "EN" },
  { value: "fr", label: "Français", code: "FR" },
  { value: "pt", label: "Português", code: "PT" },
];

export function LanguageSelector({ className }: { className?: string }) {
  const lang = useI18nStore((s) => s.lang);
  const setLang = useI18nStore((s) => s.setLang);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const current = OPTIONS.find((o) => o.value === lang) ?? OPTIONS[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function handleSelect(value: Lang) {
    setLang(value);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Cambiar idioma"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 items-center gap-2 rounded-pill border border-[var(--border)] bg-[var(--bg-subtle)] px-3 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 sm:h-10"
      >
        <Globe className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide">{current.code}</span>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Cambiar idioma"
          className="absolute right-0 z-50 mt-2 min-w-[180px] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-2)]"
        >
          {OPTIONS.map((opt) => {
            const selected = opt.value === lang;
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(opt.value)}
                aria-current={selected ? "true" : undefined}
                className={cn(
                  "flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                  selected
                    ? "bg-[var(--surface-hover)] text-[var(--text)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]",
                )}
              >
                <span className="flex-1">{opt.label}</span>
                <span className="text-xs font-semibold text-[var(--text-muted)]">
                  {opt.code}
                </span>
                {selected ? (
                  <Check
                    className="h-3.5 w-3.5 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
