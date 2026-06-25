"use client";

import { useCallback, useEffect } from "react";
import { create } from "zustand";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { TOUR_STORAGE_KEY } from "@/features/onboarding/lib/tour-steps";

/**
 * Estado compartido del tour. Vive en un store para que cualquier vista (p. ej.
 * el botón "Ver tour de bienvenida" en /profile) pueda lanzar el mismo tour
 * que monta `<OnboardingTour/>` en el layout.
 */
interface TourRunState {
  run: boolean;
  setRun: (run: boolean) => void;
}

export const useTourRunStore = create<TourRunState>((set) => ({
  run: false,
  setRun: (run) => set({ run }),
}));

/**
 * Lee el flag de tour completado de localStorage de forma segura (SSR + try/catch).
 */
function isTourCompleted(): boolean {
  if (typeof window === "undefined") return true; // En SSR nunca auto-arranca.
  try {
    return window.localStorage.getItem(TOUR_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export interface UseOnboardingResult {
  /**
   * Debe el tour arrancar solo: usuario autenticado + flag no marcado.
   * Útil para que el componente decida si auto-lanzar al montar.
   */
  shouldAutoStart: boolean;
  /** True mientras el tour debe estar corriendo. */
  run: boolean;
  /** Lanza el tour manualmente (p. ej. desde /profile), ignora el flag. */
  startTour: () => void;
  /** Marca el tour como completado, lo persiste y lo detiene. */
  markCompleted: () => void;
}

export function useOnboarding(): UseOnboardingResult {
  const user = useAuthStore((s) => s.user);
  const run = useTourRunStore((s) => s.run);
  const setRun = useTourRunStore((s) => s.setRun);

  const completed = isTourCompleted();
  const shouldAutoStart = Boolean(user) && !completed;

  // Auto-arranca una sola vez para usuarios nuevos autenticados.
  useEffect(() => {
    if (shouldAutoStart) {
      setRun(true);
    }
    // Solo reacciona al cambio de la condición de auto-arranque.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoStart]);

  const startTour = useCallback(() => {
    setRun(true);
  }, [setRun]);

  const markCompleted = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(TOUR_STORAGE_KEY, "1");
      } catch {
        // Ignorar (modo incógnito / storage deshabilitado).
      }
    }
    setRun(false);
  }, [setRun]);

  return { shouldAutoStart, run, startTour, markCompleted };
}
