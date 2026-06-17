import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useGeoHeartbeat } from "@/features/geo/hooks/use-geo-heartbeat";
import { useGeoStore } from "@/features/geo/store/geo-store";

// In-memory mock for navigator.geolocation
function createGeolocationMock() {
  let nextWatchId = 1;
  const watchers = new Map<
    number,
    {
      success: PositionCallback;
      error?: PositionErrorCallback;
      options?: PositionOptions;
    }
  >();

  return {
    watchers,
    api: {
      watchPosition: vi.fn(
        (
          success: PositionCallback,
          error?: PositionErrorCallback,
          options?: PositionOptions,
        ) => {
          const id = nextWatchId++;
          watchers.set(id, { success, error, options });
          return id;
        },
      ),
      clearWatch: vi.fn((id: number) => {
        watchers.delete(id);
      }),
      getCurrentPosition: vi.fn(),
    } as unknown as Geolocation,
  };
}

function setVisibility(value: DocumentVisibilityState) {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => value,
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

describe("useGeoHeartbeat", () => {
  let geoMock: ReturnType<typeof createGeolocationMock>;
  const originalGeolocation = Object.getOwnPropertyDescriptor(
    Navigator.prototype,
    "geolocation",
  );

  beforeEach(() => {
    // Reset store
    useGeoStore.setState({
      lastSnapshot: null,
      permission: "prompt",
      trackingEnabled: true,
      source: null,
    });

    geoMock = createGeolocationMock();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: geoMock.api,
    });

    setVisibility("visible");
  });

  afterEach(() => {
    if (originalGeolocation) {
      Object.defineProperty(
        Navigator.prototype,
        "geolocation",
        originalGeolocation,
      );
    }
    vi.restoreAllMocks();
  });

  it("initializes without errors and starts watching when tracking is enabled and tab is visible", () => {
    const { unmount } = renderHook(() => useGeoHeartbeat());

    expect(geoMock.api.watchPosition).toHaveBeenCalledTimes(1);
    expect(geoMock.watchers.size).toBe(1);

    unmount();
    expect(geoMock.api.clearWatch).toHaveBeenCalled();
    expect(geoMock.watchers.size).toBe(0);
  });

  it("pauses watching when the tab becomes hidden", () => {
    renderHook(() => useGeoHeartbeat());
    expect(geoMock.watchers.size).toBe(1);

    act(() => {
      setVisibility("hidden");
    });

    expect(geoMock.api.clearWatch).toHaveBeenCalled();
    expect(geoMock.watchers.size).toBe(0);
  });

  it("resumes watching when the tab becomes visible again", () => {
    renderHook(() => useGeoHeartbeat());

    act(() => {
      setVisibility("hidden");
    });
    expect(geoMock.watchers.size).toBe(0);

    act(() => {
      setVisibility("visible");
    });

    expect(geoMock.api.watchPosition).toHaveBeenCalledTimes(2);
    expect(geoMock.watchers.size).toBe(1);
  });

  it("degrades gracefully and marks source as unsupported when geolocation is not available", () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: undefined,
    });

    renderHook(() => useGeoHeartbeat());

    expect(useGeoStore.getState().source).toBe("unsupported");
  });

  it("does not start watching when trackingEnabled is false", () => {
    useGeoStore.setState({ trackingEnabled: false });

    renderHook(() => useGeoHeartbeat());

    expect(geoMock.api.watchPosition).not.toHaveBeenCalled();
  });
});
