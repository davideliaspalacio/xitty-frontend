import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import { LocationBanner } from "@/features/geo/components/location-banner";
import { useGeoStore } from "@/features/geo/store/geo-store";

describe("LocationBanner", () => {
  beforeEach(() => {
    useGeoStore.setState({
      lastSnapshot: null,
      permission: "prompt",
      trackingEnabled: true,
      source: null,
    });
  });

  it("renders prompt message when permission is 'prompt'", () => {
    useGeoStore.setState({ permission: "prompt", trackingEnabled: true });
    render(<LocationBanner />);

    expect(
      screen.getByText(/activa tu ubicaci[oó]n/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /permitir/i })).toBeInTheDocument();
  });

  it("renders denied message when permission is 'denied'", () => {
    useGeoStore.setState({ permission: "denied", trackingEnabled: true });
    render(<LocationBanner />);

    expect(
      screen.getByText(/sin acceso a ubicaci[oó]n/i),
    ).toBeInTheDocument();
  });

  it("renders a small active badge when permission is 'granted'", () => {
    useGeoStore.setState({ permission: "granted", trackingEnabled: true });
    render(<LocationBanner />);

    expect(screen.getByText(/ubicaci[oó]n activa/i)).toBeInTheDocument();
  });

  it("renders nothing when trackingEnabled is false", () => {
    useGeoStore.setState({ permission: "granted", trackingEnabled: false });
    const { container } = render(<LocationBanner />);

    expect(container).toBeEmptyDOMElement();
  });
});
