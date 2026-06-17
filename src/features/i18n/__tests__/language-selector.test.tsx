import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageSelector } from "@/features/i18n/components/language-selector";
import { useI18nStore } from "@/features/i18n/store";

describe("LanguageSelector", () => {
  beforeEach(() => {
    useI18nStore.setState({ lang: "es" });
  });

  it("renders a trigger with aria-label 'Cambiar idioma'", () => {
    render(<LanguageSelector />);
    expect(
      screen.getByRole("button", { name: /cambiar idioma/i }),
    ).toBeInTheDocument();
  });

  it("opens a menu with the 4 language options when clicked", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    await user.click(screen.getByRole("button", { name: /cambiar idioma/i }));

    // ES, EN, FR, PT options (case-insensitive)
    expect(screen.getByRole("menuitem", { name: /español|es/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /english|en/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /français|francés|fr/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /portugu[eê]s|pt/i })).toBeInTheDocument();

    const items = screen.getAllByRole("menuitem");
    expect(items).toHaveLength(4);
  });

  it("clicking an option updates the store lang", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    await user.click(screen.getByRole("button", { name: /cambiar idioma/i }));
    await user.click(screen.getByRole("menuitem", { name: /english|en/i }));

    expect(useI18nStore.getState().lang).toBe("en");
  });

  it("clicking FR sets lang to 'fr'", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    await user.click(screen.getByRole("button", { name: /cambiar idioma/i }));
    await user.click(screen.getByRole("menuitem", { name: /français|francés|fr/i }));

    expect(useI18nStore.getState().lang).toBe("fr");
  });

  it("clicking PT sets lang to 'pt'", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    await user.click(screen.getByRole("button", { name: /cambiar idioma/i }));
    await user.click(screen.getByRole("menuitem", { name: /portugu[eê]s|pt/i }));

    expect(useI18nStore.getState().lang).toBe("pt");
  });
});
