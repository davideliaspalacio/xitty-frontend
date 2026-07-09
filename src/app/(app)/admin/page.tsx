"use client";

import Link from "next/link";
import { ArrowRight, Radar, Sparkles, Star } from "lucide-react";
import { RoleGate } from "@/features/auth/components/role-gate";
import { Card } from "@/shared/ui/card";

type Section = {
  href: string;
  icon: typeof Radar;
  title: string;
  description: string;
};

const SECTIONS: Section[] = [
  {
    href: "/admin/scraping",
    icon: Radar,
    title: "Scraping & Moderación",
    description:
      "Configura las fuentes externas, dispara runs y modera los items entrantes antes de publicarlos como places o experiences.",
  },
  {
    href: "/admin/sponsorships",
    icon: Sparkles,
    title: "Sponsorships",
    description:
      "Activa o desactiva el patrocinio de places para destacarlos en el feed.",
  },
  {
    href: "/admin/featured",
    icon: Star,
    title: "Destacados semanales",
    description:
      "Programa recomendaciones editoriales con crédito, foto y semana de publicación.",
  },
];

export default function AdminHomePage() {
  return (
    <RoleGate allow={["admin"]}>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="eyebrow">Admin</p>
          <h1 className="text-[32px] font-semibold leading-[1.1] tracking-normal">
            Panel de administración
          </h1>
          <p className="text-[var(--text-muted)] text-[15px] max-w-2xl">
            Herramientas internas de Xitty. Elegí una sección para empezar.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href} className="group">
                <Card className="flex h-full flex-col gap-4 p-6 transition-colors hover:border-[var(--accent)]">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--bg-subtle)] text-[var(--accent)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowRight className="h-5 w-5 text-[var(--text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-lg font-semibold tracking-normal">
                      {section.title}
                    </h2>
                    <p className="text-sm text-[var(--text-muted)]">
                      {section.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </RoleGate>
  );
}
