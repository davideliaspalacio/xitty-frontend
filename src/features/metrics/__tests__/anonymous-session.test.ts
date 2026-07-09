import { describe, expect, it, beforeEach } from "vitest";
import { getAnonymousSessionId } from "@/features/metrics/anonymous-session";

describe("getAnonymousSessionId", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("creates and reuses a stable anonymous session id", () => {
    const first = getAnonymousSessionId();
    const second = getAnonymousSessionId();

    expect(first).toBeTruthy();
    expect(second).toBe(first);
    expect(window.localStorage.getItem("xitty-anonymous-session-id")).toBe(
      first,
    );
  });
});
