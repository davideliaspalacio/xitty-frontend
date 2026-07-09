import { describe, expect, it } from "vitest";
import {
  isSponsorshipCurrent,
  isSponsorshipExpired,
} from "@/features/places/utils/sponsorship-status";

const NOW = new Date("2026-07-09T12:00:00.000Z").getTime();

describe("sponsorship-status", () => {
  it("marca vigente solo si el flag esta activo y la fecha no vencio", () => {
    expect(isSponsorshipCurrent(true, "2026-07-10T00:00:00.000Z", NOW)).toBe(
      true,
    );
    expect(isSponsorshipCurrent(true, "2026-07-08T00:00:00.000Z", NOW)).toBe(
      false,
    );
    expect(isSponsorshipCurrent(false, "2026-07-10T00:00:00.000Z", NOW)).toBe(
      false,
    );
  });

  it("marca vencido solo si el flag sigue activo y la fecha ya paso", () => {
    expect(isSponsorshipExpired(true, "2026-07-08T00:00:00.000Z", NOW)).toBe(
      true,
    );
    expect(isSponsorshipExpired(true, "2026-07-10T00:00:00.000Z", NOW)).toBe(
      false,
    );
    expect(isSponsorshipExpired(false, "2026-07-08T00:00:00.000Z", NOW)).toBe(
      false,
    );
  });
});
