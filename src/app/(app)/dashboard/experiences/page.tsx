"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Settings2, Star } from "lucide-react";
import { useOwnedPlace } from "@/features/places/hooks/use-owned-place";
import { useOwnedExperiences } from "@/features/experiences/hooks/use-manage-experiences";
import {
  ExperienceForm,
  experienceTypeLabel,
} from "@/features/experiences/components/experience-form";
import { ExperienceEditor } from "@/features/experiences/components/experience-editor";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { fmtCop } from "@/shared/utils/format";

export default function DashboardExperiencesPage() {
  const { data: place, isLoading: placeLoading } = useOwnedPlace();
  const experiences = useOwnedExperiences(place?.id);
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (placeLoading) return <Skeleton className="h-64 rounded-lg" />;

  if (!place) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-12 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          Primero necesitas un lugar.{" "}
          <Link
            href="/dashboard/place"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Crea tu lugar
          </Link>{" "}
          para poder publicar experiencias.
        </p>
      </div>
    );
  }

  const list = experiences.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--text-muted)]">
          {list.length} experiencia{list.length === 1 ? "" : "s"} publicada
          {list.length === 1 ? "" : "s"}
        </p>
        {!creating ? (
          <Button
            onClick={() => {
              setCreating(true);
              setSelectedId(null);
            }}
          >
            <Plus className="h-4 w-4" /> Nueva experiencia
          </Button>
        ) : null}
      </div>

      {creating ? (
        <Card>
          <CardContent className="py-6">
            <ExperienceForm
              operatorPlaceId={place.id}
              onSuccess={() => setCreating(false)}
              onCancel={() => setCreating(false)}
            />
          </CardContent>
        </Card>
      ) : null}

      {experiences.isLoading ? (
        <Skeleton className="h-40 rounded-lg" />
      ) : list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-12 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Aún no has publicado experiencias. Crea la primera para que los
            turistas la reserven.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((exp) => (
            <div key={exp.id} className="flex flex-col gap-3">
              <Card className="flex items-start justify-between gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold tracking-normal truncate">
                      {exp.title}
                    </h3>
                    <span className="inline-flex items-center h-5 px-2 rounded-pill text-[10px] font-semibold uppercase bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                      {experienceTypeLabel(exp.experience_type)}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] flex items-center gap-2 flex-wrap">
                    <span>{fmtCop.format(exp.price_cop)}</span>
                    <span>·</span>
                    <span>
                      {Math.round((exp.duration_minutes / 60) * 10) / 10}h
                    </span>
                    {exp.total_reviews > 0 ? (
                      <span className="inline-flex items-center gap-0.5">
                        · <Star className="h-3 w-3 fill-current" />{" "}
                        {exp.average_rating.toFixed(1)} ({exp.total_reviews})
                      </span>
                    ) : null}
                  </p>
                </div>
                <Button
                  variant={selectedId === exp.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() =>
                    setSelectedId(selectedId === exp.id ? null : exp.id)
                  }
                >
                  <Settings2 className="h-4 w-4" />{" "}
                  {selectedId === exp.id ? "Cerrar" : "Gestionar"}
                </Button>
              </Card>

              {selectedId === exp.id ? (
                <Card>
                  <CardContent className="py-6">
                    <ExperienceEditor
                      experience={exp}
                      onClose={() => setSelectedId(null)}
                    />
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[var(--text-soft)]">
        Para dar de baja una experiencia, contacta al administrador (la
        eliminación definitiva es solo de admin).
      </p>
    </div>
  );
}
