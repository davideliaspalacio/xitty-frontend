import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { Sidebar } from "@/shared/layout/sidebar";

describe("Sidebar", () => {
  it("does not show the Scraping entry for the user role", () => {
    render(<Sidebar role="user" />);
    expect(screen.queryByRole("link", { name: /scraping/i })).toBeNull();
  });

  it("does not show the Scraping entry for the business role", () => {
    render(<Sidebar role="business" />);
    expect(screen.queryByRole("link", { name: /scraping/i })).toBeNull();
  });

  it("shows the Scraping entry pointing to /admin/scraping for admins", () => {
    render(<Sidebar role="admin" />);
    const link = screen.getByRole("link", { name: /scraping/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/admin/scraping");
  });
});
