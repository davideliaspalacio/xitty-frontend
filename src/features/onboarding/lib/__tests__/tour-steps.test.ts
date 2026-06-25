import { describe, it, expect } from "vitest";
import { TOUR_STEPS, TOUR_STORAGE_KEY } from "@/features/onboarding/lib/tour-steps";

describe("tour-steps", () => {
  it("defines exactly 8 steps", () => {
    expect(TOUR_STEPS).toHaveLength(8);
  });

  it("every step has a non-empty element selector, title and description", () => {
    for (const step of TOUR_STEPS) {
      expect(typeof step.element).toBe("string");
      expect(step.element.trim().length).toBeGreaterThan(0);
      // Selectors target ids on the home (e.g. "#tour-today").
      expect(step.element.startsWith("#")).toBe(true);

      expect(typeof step.title).toBe("string");
      expect(step.title.trim().length).toBeGreaterThan(0);

      expect(typeof step.description).toBe("string");
      expect(step.description.trim().length).toBeGreaterThan(0);
    }
  });

  it("uses unique element selectors", () => {
    const selectors = TOUR_STEPS.map((s) => s.element);
    expect(new Set(selectors).size).toBe(selectors.length);
  });

  it("exposes the localStorage flag key", () => {
    expect(TOUR_STORAGE_KEY).toBe("xitty_tour_completed");
  });
});
