"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Wrapper liviano sobre la Web Speech API (`window.speechSynthesis`) para
 * narrar el tour de bienvenida en español.
 *
 * - `supported`: false en SSR o navegadores sin `speechSynthesis`/voces.
 * - Carga las voces de forma asíncrona (algunos navegadores las exponen tarde)
 *   con reintentos, y elige una voz `es-*` cuando está disponible.
 * - `speak(text)` cancela cualquier narración previa antes de empezar.
 *
 * IMPORTANTE: la reproducción debe iniciarse tras un gesto del usuario
 * (un click en el botón de voz), por política de los navegadores.
 */
export interface UseTtsResult {
  /** El navegador soporta síntesis de voz Y hay voces disponibles. */
  supported: boolean;
  /** Narra el texto, cancelando lo que estuviera sonando. */
  speak: (text: string) => void;
  /** Pausa la narración actual. */
  pause: () => void;
  /** Reanuda una narración pausada. */
  resume: () => void;
  /** Detiene y vacía la cola de narración. */
  cancel: () => void;
  /** True mientras hay una narración activa (sonando o pausada). */
  speaking: boolean;
}

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  if (!("speechSynthesis" in window) || !window.speechSynthesis) return null;
  if (typeof window.SpeechSynthesisUtterance === "undefined") return null;
  return window.speechSynthesis;
}

function pickSpanishVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  // Preferimos español de Latinoamérica / Colombia y luego cualquier es-*.
  const byLang = (prefix: string) =>
    voices.find((v) => v.lang?.toLowerCase().startsWith(prefix));
  return (
    byLang("es-co") ??
    byLang("es-419") ??
    byLang("es-mx") ??
    byLang("es-us") ??
    byLang("es") ??
    null
  );
}

export function useTts(): UseTtsResult {
  // `supported` arranca en false para que SSR y la primera hidratación
  // coincidan (evita mismatch); se eleva en el efecto del cliente.
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const synth = getSynth();
    // `supported` ya arranca en false; si no hay síntesis, no hay nada que hacer.
    if (!synth) {
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const loadVoices = () => {
      if (cancelled) return;
      const voices = synth.getVoices();
      if (voices.length > 0) {
        voiceRef.current = pickSpanishVoice(voices);
        setSupported(true);
        return;
      }
      // Reintento: algunas plataformas exponen las voces de forma diferida.
      attempts += 1;
      if (attempts <= 10) {
        setTimeout(loadVoices, 150);
      }
    };

    // Carga inicial + escucha el evento `voiceschanged`.
    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      cancelled = true;
      // No anulamos onvoiceschanged si otra instancia lo necesita; pero como
      // este hook es de uso puntual, lo limpiamos.
      if (synth.onvoiceschanged === loadVoices) {
        synth.onvoiceschanged = null;
      }
      synth.cancel();
    };
  }, []);

  const cancel = useCallback(() => {
    const synth = getSynth();
    if (!synth) return;
    synth.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    const synth = getSynth();
    if (!synth || !text) return;
    // Reinicia cualquier narración previa.
    synth.cancel();

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = voiceRef.current?.lang ?? "es-ES";
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    synth.speak(utterance);
  }, []);

  const pause = useCallback(() => {
    const synth = getSynth();
    if (!synth) return;
    synth.pause();
  }, []);

  const resume = useCallback(() => {
    const synth = getSynth();
    if (!synth) return;
    synth.resume();
  }, []);

  return { supported, speak, pause, resume, cancel, speaking };
}
