"use client";

import { useEffect, useRef } from "react";
import { driver, type Driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { useTts } from "@/features/onboarding/hooks/use-tts";
import { TOUR_STEPS, type TourStep } from "@/features/onboarding/lib/tour-steps";

/**
 * Estilos del popover del tour, alineados con la identidad de Xitty
 * (acento coral, superficie y bordes desde las CSS vars del tema). Se inyectan
 * una sola vez; las reglas se deduplican por id del <style>.
 */
const TOUR_STYLES = `
.xitty-tour-popover.driver-popover {
  background: var(--surface);
  color: var(--text);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-3);
  max-width: 340px;
  padding: 20px;
}
.xitty-tour-popover .driver-popover-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--text);
}
.xitty-tour-popover .driver-popover-description {
  font-size: 14px;
  line-height: 1.55;
  color: var(--text-muted);
}
.xitty-tour-popover .driver-popover-progress-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
}
.xitty-tour-popover .driver-popover-footer button {
  text-shadow: none;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 13px;
  min-height: 44px;
}
.xitty-tour-popover .driver-popover-next-btn {
  background: var(--accent);
  color: var(--accent-fg);
  border: none;
}
.xitty-tour-popover .driver-popover-next-btn:hover {
  background: var(--accent-hover);
}
.xitty-tour-popover .driver-popover-prev-btn {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
}
.xitty-tour-popover .driver-popover-arrow {
  color: var(--surface);
}
.xitty-tour-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 14px;
}
.xitty-tour-voice-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 7px 12px;
  border-radius: 9999px;
  border: 1px solid var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.15s ease;
}
.xitty-tour-voice-btn:hover {
  filter: brightness(0.97);
}
.xitty-tour-skip-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  min-height: 44px;
  padding: 4px;
}
.xitty-tour-skip-btn:hover {
  color: var(--text);
}
@media (prefers-reduced-motion: reduce) {
  .xitty-tour-popover * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
`;

const PLAY_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const PAUSE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

/**
 * Tour de onboarding con voz.
 *
 * Corre un recorrido guiado (driver.js) sobre los `id` estables del home y la
 * navegación. Integra un botón de voz por paso (Web Speech API) que narra el
 * guión y permite pausar/reanudar, y un botón "Saltar" siempre visible. Al
 * finalizar o saltar, marca el flag `xitty_tour_completed` en localStorage.
 *
 * Auto-arranca para usuarios nuevos autenticados (ver `useOnboarding`).
 */
export function OnboardingTour() {
  const { run, markCompleted } = useOnboarding();
  const tts = useTts();

  const driverRef = useRef<Driver | null>(null);
  // Refs para que los callbacks imperativos de driver.js lean estado fresco
  // sin re-instanciar el tour.
  const voiceActiveRef = useRef(false);
  const isPausedRef = useRef(false);
  const ttsRef = useRef(tts);

  // Mantiene la referencia al TTS fresca para los callbacks imperativos de
  // driver.js sin re-instanciar el tour.
  useEffect(() => {
    ttsRef.current = tts;
  }, [tts]);

  useEffect(() => {
    if (!run) return;
    if (typeof window === "undefined") return;

    // Inyecta los estilos una sola vez.
    if (!document.getElementById("xitty-tour-styles")) {
      const styleEl = document.createElement("style");
      styleEl.id = "xitty-tour-styles";
      styleEl.textContent = TOUR_STYLES;
      document.head.appendChild(styleEl);
    }

    const supportsVoice = ttsRef.current.supported;

    const finish = () => {
      ttsRef.current.cancel();
      voiceActiveRef.current = false;
      isPausedRef.current = false;
      markCompleted();
    };

    const setVoiceLabel = (btn: HTMLButtonElement) => {
      const playing = voiceActiveRef.current && !isPausedRef.current;
      btn.innerHTML =
        (playing ? PAUSE_ICON : PLAY_ICON) +
        `<span>${playing ? "Pausar" : "Escuchar"}</span>`;
    };

    const narrateCurrent = () => {
      const d = driverRef.current;
      if (!d) return;
      const index = d.getActiveIndex() ?? 0;
      const step = TOUR_STEPS[index];
      if (!step) return;
      isPausedRef.current = false;
      ttsRef.current.speak(`${step.title}. ${step.description}`);
    };

    const steps: DriveStep[] = TOUR_STEPS.map((step: TourStep) => ({
      element: step.element,
      popover: {
        title: step.title,
        description: step.description,
        onPopoverRender: (popover) => {
          const controls = document.createElement("div");
          controls.className = "xitty-tour-controls";

          // Botón de voz (solo si el navegador lo soporta).
          if (supportsVoice) {
            const voiceBtn = document.createElement("button");
            voiceBtn.type = "button";
            voiceBtn.className = "xitty-tour-voice-btn";
            voiceBtn.setAttribute("aria-label", "Reproducir narración");
            setVoiceLabel(voiceBtn);
            voiceBtn.addEventListener("click", (e) => {
              e.preventDefault();
              const playing = voiceActiveRef.current && !isPausedRef.current;
              if (playing) {
                isPausedRef.current = true;
                ttsRef.current.pause();
              } else if (voiceActiveRef.current && isPausedRef.current) {
                isPausedRef.current = false;
                ttsRef.current.resume();
              } else {
                voiceActiveRef.current = true;
                narrateCurrent();
              }
              setVoiceLabel(voiceBtn);
            });
            controls.appendChild(voiceBtn);
          } else {
            // Mantiene la alineación del botón "Saltar" a la derecha.
            controls.appendChild(document.createElement("span"));
          }

          // Botón "Saltar" — siempre visible.
          const skipBtn = document.createElement("button");
          skipBtn.type = "button";
          skipBtn.className = "xitty-tour-skip-btn";
          skipBtn.textContent = "Saltar";
          skipBtn.addEventListener("click", (e) => {
            e.preventDefault();
            finish();
            driverRef.current?.destroy();
          });
          controls.appendChild(skipBtn);

          popover.footer.insertAdjacentElement("beforebegin", controls);
        },
      },
    }));

    const d = driver({
      steps,
      showProgress: true,
      progressText: "Paso {{current}} de {{total}}",
      nextBtnText: "Siguiente",
      prevBtnText: "Atrás",
      doneBtnText: "Finalizar",
      allowClose: true,
      // No cerrar al tocar fuera del spotlight (overlay): no-op.
      overlayClickBehavior: () => {},
      smoothScroll: true,
      stagePadding: 6,
      stageRadius: 12,
      popoverClass: "xitty-tour-popover",
      overlayColor: "var(--ink)",
      overlayOpacity: 0.6,
      onHighlighted: () => {
        // Auto-narra al avanzar de paso si la voz quedó activa.
        if (voiceActiveRef.current && supportsVoice) {
          narrateCurrent();
        }
      },
      // X (cerrar) marca el tour como completado.
      onCloseClick: () => {
        finish();
        driverRef.current?.destroy();
      },
      // "Finalizar" en el último paso (o cualquier destroy explícito).
      onDestroyStarted: () => {
        finish();
        driverRef.current?.destroy();
      },
      onDestroyed: () => {
        ttsRef.current.cancel();
      },
    });

    driverRef.current = d;

    // El ancla del primer paso solo existe en el home. Si el usuario relanza el
    // tour desde otra vista (p. ej. /profile navega a "/home"), esperamos a que el
    // home se monte antes de arrancar — con reintentos acotados.
    let attempts = 0;
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    const startWhenReady = () => {
      if (!driverRef.current) return;
      if (document.querySelector(TOUR_STEPS[0].element)) {
        d.drive();
        return;
      }
      attempts += 1;
      if (attempts <= 20) {
        startTimer = setTimeout(startWhenReady, 150);
      }
      // Si el ancla nunca aparece, abortamos en silencio (sin marcar el flag),
      // para que el usuario pueda reintentar más tarde.
    };
    startWhenReady();

    return () => {
      if (startTimer) clearTimeout(startTimer);
      ttsRef.current.cancel();
      if (driverRef.current?.isActive()) {
        driverRef.current.destroy();
      }
      driverRef.current = null;
    };
    // markCompleted es estable (useCallback). Solo re-corre cuando `run` cambia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return null;
}
