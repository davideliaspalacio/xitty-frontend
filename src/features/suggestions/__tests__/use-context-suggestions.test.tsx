import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

import { useGeoStore } from "@/features/geo/store/geo-store";
import type { SuggestionContextResponse } from "@/features/suggestions/types";

// Mock the API module
vi.mock("@/features/suggestions/api", () => ({
  suggestionsApi: {
    getContext: vi.fn(),
  },
}));

import { suggestionsApi } from "@/features/suggestions/api";
import { useContextSuggestions } from "@/features/suggestions/hooks/use-context-suggestions";

const mockedGetContext = vi.mocked(suggestionsApi.getContext);

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
    },
  });
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
}

function resetGeo() {
  useGeoStore.setState({
    lastSnapshot: null,
    permission: "prompt",
    trackingEnabled: true,
    source: null,
  });
}

const sampleResponse: SuggestionContextResponse = {
  safety_zone: {
    neighborhood: "El Prado",
    score: 82,
    tags: ["turistica"],
    tone: "good",
  },
  nearby_beach_m: 850,
  price_band: "medio",
};

describe("useContextSuggestions", () => {
  beforeEach(() => {
    mockedGetContext.mockReset();
    resetGeo();
  });

  afterEach(() => {
    resetGeo();
  });

  it("does not fetch when there is no lat/lng in the geo-store", () => {
    // No snapshot, permission != granted
    const { result } = renderHook(() => useContextSuggestions(), {
      wrapper: makeWrapper(),
    });

    expect(mockedGetContext).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.safetyZone).toBeNull();
    expect(result.current.nearbyBeachM).toBeNull();
    expect(result.current.priceBand).toBeNull();
  });

  it("does not fetch when tracking is disabled even with a snapshot", () => {
    useGeoStore.setState({
      lastSnapshot: {
        lat: 10.99,
        lng: -74.81,
        accuracy: 10,
        timestamp: Date.now(),
      },
      permission: "granted",
      trackingEnabled: false,
      source: "gps",
    });

    renderHook(() => useContextSuggestions(), { wrapper: makeWrapper() });

    expect(mockedGetContext).not.toHaveBeenCalled();
  });

  it("fetches when lat/lng + granted + enabled and returns parsed values", async () => {
    mockedGetContext.mockResolvedValueOnce(sampleResponse);
    useGeoStore.setState({
      lastSnapshot: {
        lat: 10.99,
        lng: -74.81,
        accuracy: 10,
        timestamp: Date.now(),
      },
      permission: "granted",
      trackingEnabled: true,
      source: "gps",
    });

    const { result } = renderHook(() => useContextSuggestions(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockedGetContext).toHaveBeenCalledWith({ lat: 10.99, lng: -74.81 });
    expect(result.current.safetyZone?.neighborhood).toBe("El Prado");
    expect(result.current.safetyZone?.tone).toBe("good");
    expect(result.current.nearbyBeachM).toBe(850);
    expect(result.current.priceBand).toBe("medio");
  });
});
