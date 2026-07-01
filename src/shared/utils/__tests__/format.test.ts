import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatRelativeDate } from "@/shared/utils/format";

describe("formatRelativeDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("devuelve '' para fecha ausente (nunca 'Hace NaN años')", () => {
    expect(formatRelativeDate(null)).toBe("");
    expect(formatRelativeDate(undefined)).toBe("");
    expect(formatRelativeDate("")).toBe("");
  });

  it("devuelve '' para fecha inválida (nunca 'Hace NaN')", () => {
    expect(formatRelativeDate("not-a-date")).toBe("");
    expect(formatRelativeDate("hace mucho")).toBe("");
  });

  it("formatea fechas válidas relativas a ahora", () => {
    expect(formatRelativeDate("2026-06-22T12:00:00Z")).toBe("Hoy");
    expect(formatRelativeDate("2026-06-21T12:00:00Z")).toBe("Ayer");
    expect(formatRelativeDate("2026-06-19T12:00:00Z")).toBe("Hace 3 días");
  });
});
