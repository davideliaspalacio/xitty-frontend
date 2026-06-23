"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/auth-store";
import {
  useFeaturedCurrent,
  useLocalPicksCurrent,
  useRanking,
} from "@/features/discover";
import { useExperiences } from "@/features/experiences";
import { HorizontalCarousel } from "@/shared/layout/horizontal-carousel";
import { SectionHeader } from "@/shared/layout/section-header";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";
import { RankingCard } from "@/features/discover/components/ranking-card";
import { FeaturedCard } from "@/features/discover/components/featured-card";
import { LocalPickCard } from "@/features/discover/components/local-pick-card";
import { ExperienceCard as ExperienceCardComponent } from "@/features/experiences/components/experience-card";
import { TravelerTypeChips } from "@/features/preferences/components/traveler-type-chips";
import { useTravelerFilter } from "@/features/preferences/hooks/use-traveler-filter";
import { AdsHero } from "@/features/promotions";
import { TodaySection } from "@/features/recommendations";
import { CategoriesGrid } from "@/features/places/components/categories-grid";
import { CuratedCarousel, useCurated } from "@/features/curated";
import { useT } from "@/features/i18n";

function CarouselSkeletons() {
  return (
    <div className="flex gap-4 px-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="shrink-0 w-[320px]">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <div className="mt-3 flex flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyMini({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-10 text-center">
      <p className="text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const name = user?.full_name?.split(" ")[0] ?? "Hola";
  const t = useT();

  const { travelerType, setTravelerType } = useTravelerFilter();
  const ranking = useRanking(8, travelerType);
  const featured = useFeaturedCurrent(travelerType);
  const localPicks = useLocalPicksCurrent(travelerType);
  const experiences = useExperiences({ limit: 8, sort_by: "rating" });
  const curated = useCurated({ limit: 12 });

  return (
    <div className="flex flex-col space-y-12">
      {/* Greeting / hero */}
      <header className="flex flex-col gap-3 max-w-3xl">
        <p className="eyebrow">Hoy en Barranquilla</p>
        <h1 className="text-[36px] sm:text-[44px] font-semibold leading-[1.05] tracking-[-0.02em]">
          {t("home.greeting", { name })}
        </h1>
        <p className="text-[var(--text-muted)] text-[15px] leading-relaxed max-w-2xl">
          Selección curada de lugares, destacados de la semana y experiencias
          únicas en el Caribe colombiano.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/places">
            <Button variant="primary">Explorar lugares</Button>
          </Link>
          <Link href="/experiences">
            <Button variant="secondary">Ver experiencias</Button>
          </Link>
        </div>
      </header>

      {/* 1. Ads — promotional slot, no section header */}
      <AdsHero />

      {/* 2. Today — "Qué vale la pena hacer hoy" */}
      <TodaySection />

      {/* 3. Traveler-type filter */}
      <TravelerTypeChips
        selected={travelerType}
        onChange={setTravelerType}
      />

      {/* 4. Ranking */}
      <section>
        <SectionHeader
          eyebrow="Top de la ciudad"
          title="Ranking en Barranquilla"
          subtitle="Lo más visitado y mejor calificado esta semana."
          href="/places"
        />
        {ranking.isLoading ? (
          <CarouselSkeletons />
        ) : ranking.data?.data.length ? (
          <HorizontalCarousel>
            {ranking.data.data.map((item) => (
              <RankingCard key={item.place.id} item={item} />
            ))}
          </HorizontalCarousel>
        ) : (
          <EmptyMini message="El ranking se actualiza diariamente. Aún no hay datos." />
        )}
      </section>

      {/* 5. Featured — Recomendados */}
      <section>
        <SectionHeader
          eyebrow="Esta semana"
          title="Recomendados"
          subtitle="Curados por Xitty."
        />
        {featured.isLoading ? (
          <CarouselSkeletons />
        ) : featured.data?.length ? (
          <HorizontalCarousel>
            {featured.data.map((item) => (
              <FeaturedCard key={item.id} item={item} />
            ))}
          </HorizontalCarousel>
        ) : (
          <EmptyMini message="Pronto publicaremos los destacados de la semana." />
        )}
      </section>

      {/* 6. Curated — AI-curated weekly feed */}
      <section>
        <SectionHeader
          eyebrow="Curado con IA"
          title="Descubre lo nuevo en Barranquilla"
          subtitle="Curado con IA, actualizado cada semana."
        />
        {curated.isLoading ? (
          <CarouselSkeletons />
        ) : curated.data?.length ? (
          <CuratedCarousel items={curated.data} />
        ) : (
          <EmptyMini message="Pronto verás aquí lo nuevo de la semana, curado por nuestra IA." />
        )}
      </section>

      {/* 7. Categories grid */}
      <section>
        <SectionHeader
          title="Explora por categoría"
          subtitle="Encuentra lo que buscas, organizado por tipo de lugar."
        />
        <CategoriesGrid />
      </section>

      {/* 8. Experiences */}
      <section>
        <SectionHeader
          eyebrow="Experiencias"
          title="Vive algo único"
          subtitle="Tours, talleres, gastronomía y bienestar."
          href="/experiences"
        />
        {experiences.isLoading ? (
          <CarouselSkeletons />
        ) : experiences.data?.data.length ? (
          <HorizontalCarousel>
            {experiences.data.data.map((exp) => (
              <ExperienceCardComponent key={exp.id} experience={exp} />
            ))}
          </HorizontalCarousel>
        ) : (
          <EmptyMini message="Estamos curando las primeras experiencias para ti." />
        )}
      </section>

      {/* 9. Local picks — Disfruta como local */}
      <section>
        <SectionHeader
          eyebrow="Como local"
          title="Disfruta como un local"
          subtitle="Lugares secretos, auténticos y favoritos de la comunidad."
        />
        {localPicks.isLoading ? (
          <CarouselSkeletons />
        ) : localPicks.data?.length ? (
          <HorizontalCarousel>
            {localPicks.data.map((item) => (
              <LocalPickCard key={item.id} item={item} />
            ))}
          </HorizontalCarousel>
        ) : (
          <EmptyMini message="Los locales aún no han compartido sus secretos esta semana." />
        )}
      </section>
    </div>
  );
}
