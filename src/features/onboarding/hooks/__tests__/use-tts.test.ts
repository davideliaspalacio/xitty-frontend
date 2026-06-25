import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useTts } from "@/features/onboarding/hooks/use-tts";

interface MockSpeechSynthesis {
  speak: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  resume: ReturnType<typeof vi.fn>;
  getVoices: ReturnType<typeof vi.fn>;
  onvoiceschanged: (() => void) | null;
  speaking: boolean;
  paused: boolean;
}

function installSpeechSynthesis(voices: Array<{ lang: string; name: string }>) {
  const mock: MockSpeechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => voices),
    onvoiceschanged: null,
    speaking: false,
    paused: false,
  };
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: mock,
  });
  // SpeechSynthesisUtterance stub — jsdom/happy-dom may not provide it.
  Object.defineProperty(window, "SpeechSynthesisUtterance", {
    configurable: true,
    value: class {
      text: string;
      lang = "";
      voice: unknown = null;
      rate = 1;
      pitch = 1;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    },
  });
  return mock;
}

describe("useTts", () => {
  let original: PropertyDescriptor | undefined;

  beforeEach(() => {
    original = Object.getOwnPropertyDescriptor(window, "speechSynthesis");
  });

  afterEach(() => {
    if (original) {
      Object.defineProperty(window, "speechSynthesis", original);
    } else {
      // @ts-expect-error cleanup
      delete window.speechSynthesis;
    }
    vi.restoreAllMocks();
  });

  it("reports supported=true and speak() calls speechSynthesis.speak", () => {
    const mock = installSpeechSynthesis([
      { lang: "es-ES", name: "Spanish" },
    ]);

    const { result } = renderHook(() => useTts());
    expect(result.current.supported).toBe(true);

    act(() => {
      result.current.speak("Hola, bienvenido a Xitty");
    });

    expect(mock.cancel).toHaveBeenCalled();
    expect(mock.speak).toHaveBeenCalledTimes(1);
  });

  it("reports supported=false and speak() is a no-op when speechSynthesis is unavailable", () => {
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useTts());
    expect(result.current.supported).toBe(false);

    // Must not throw when unsupported.
    expect(() => {
      act(() => {
        result.current.speak("Texto");
      });
    }).not.toThrow();
  });

  it("pause/resume/cancel proxy to speechSynthesis", () => {
    const mock = installSpeechSynthesis([{ lang: "es-CO", name: "Colombia" }]);

    const { result } = renderHook(() => useTts());

    act(() => result.current.pause());
    expect(mock.pause).toHaveBeenCalled();

    act(() => result.current.resume());
    expect(mock.resume).toHaveBeenCalled();

    act(() => result.current.cancel());
    expect(mock.cancel).toHaveBeenCalled();
  });
});
