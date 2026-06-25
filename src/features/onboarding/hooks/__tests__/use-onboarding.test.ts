import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import {
  useOnboarding,
  useTourRunStore,
} from "@/features/onboarding/hooks/use-onboarding";
import { TOUR_STORAGE_KEY } from "@/features/onboarding/lib/tour-steps";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { User } from "@/lib/api/types";

const FAKE_USER = {
  id: "u1",
  email: "test@xitty.co",
  full_name: "Test User",
  role: "user",
} as unknown as User;

describe("useOnboarding", () => {
  beforeEach(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    useAuthStore.setState({ user: FAKE_USER });
    useTourRunStore.setState({ run: false });
  });

  afterEach(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    useAuthStore.setState({ user: null });
    vi.restoreAllMocks();
  });

  it("does NOT auto-show the tour when the flag is already set", () => {
    localStorage.setItem(TOUR_STORAGE_KEY, "1");

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.shouldAutoStart).toBe(false);
  });

  it("auto-shows the tour when not completed and user is authenticated", () => {
    const { result } = renderHook(() => useOnboarding());

    expect(result.current.shouldAutoStart).toBe(true);
  });

  it("does NOT auto-show the tour when there is no authenticated user", () => {
    useAuthStore.setState({ user: null });

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.shouldAutoStart).toBe(false);
  });

  it("startTour() forces the tour to run regardless of the flag", () => {
    localStorage.setItem(TOUR_STORAGE_KEY, "1");

    const { result } = renderHook(() => useOnboarding());
    expect(result.current.run).toBe(false);

    act(() => {
      result.current.startTour();
    });

    expect(result.current.run).toBe(true);
  });

  it("markCompleted() persists the flag and stops the tour", () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.startTour();
    });
    expect(result.current.run).toBe(true);

    act(() => {
      result.current.markCompleted();
    });

    expect(result.current.run).toBe(false);
    expect(localStorage.getItem(TOUR_STORAGE_KEY)).toBe("1");
  });
});
