"use client";

import { Sparkles } from "lucide-react";
import { useExperiences } from "@/features/experiences";
import { ExperienceCard } from "@/features/experiences/components/experience-card";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";

export default function ExperiencesPage() {
  const { data, isLoading } = useExperiences({ limit: 24, sort_by: "rating" });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 max-w-3xl">
        <p className="eyebrow">Catálogo</p>
        <h1 className="text-[32px] font-semibold leading-[1.1] tracking-normal">
          Experiencias en Barranquilla
        </h1>
        <p className="text-[var(--text-muted)] text-[15px]">
          Tours, talleres, gastronomía, bienestar y más. Reserva en segundos.
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
          ))}
        </div>
      ) : data?.data.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.data.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="Aún no hay experiencias publicadas"
          description="Estamos curando tours, talleres y planes especiales para la ciudad."
        />
      )}
    </div>
  );
}
