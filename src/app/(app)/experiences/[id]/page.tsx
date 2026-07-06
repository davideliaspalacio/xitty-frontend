"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";
import {
  useExperienceById,
  useExperienceSlots,
} from "@/features/experiences";
import { SlotPicker } from "@/features/experiences/components/slot-picker";
import { BookingDialog } from "@/features/experiences/components/booking-dialog";
import { ExperienceReviewsSection } from "@/features/experiences/components/experience-reviews-section";
import { RatingStars } from "@/features/places/components/rating-stars";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent } from "@/shared/ui/card";
import { fmtCop } from "@/shared/utils/format";

export default function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: exp, isLoading, error } = useExperienceById(id);
  const slots = useExperienceSlots(id);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl">
        <Skeleton className="aspect-[16/9] rounded-lg" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (error || !exp) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-16 text-center max-w-3xl">
        <p className="text-sm text-[var(--text-muted)]">
          No encontramos esta experiencia.{" "}
          <Link
            href="/experiences"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Ver catálogo
          </Link>
        </p>
      </div>
    );
  }

  const selectedSlot = slots.data?.find((s) => s.id === selectedSlotId) ?? null;

  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      <nav className="text-sm text-[var(--text-muted)]">
        <Link
          href="/experiences"
          className="hover:text-[var(--text)] underline-offset-4 hover:underline"
        >
          Experiencias
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--text)]">{exp.title}</span>
      </nav>

      <header className="flex flex-col gap-4">
        <p className="eyebrow">{exp.experience_type}</p>
        <h1 className="text-[36px] sm:text-[44px] font-semibold leading-[1.05] tracking-normal">
          {exp.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
          <RatingStars value={exp.average_rating} count={exp.total_reviews} />
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" />{" "}
            {Math.round((exp.duration_minutes / 60) * 10) / 10}h
          </span>
        </div>
      </header>

      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[var(--bg-subtle)]">
        {exp.cover_photo_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={exp.cover_photo_url}
            alt={exp.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="flex flex-col gap-8 min-w-0">
          {exp.description ? (
            <section>
              <h2 className="text-xl font-semibold tracking-normal mb-3">
                Sobre la experiencia
              </h2>
              <p className="text-[15px] leading-relaxed">{exp.description}</p>
            </section>
          ) : null}

          {exp.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {exp.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center h-7 px-3 rounded-pill text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]"
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}

          <section>
            <h2 className="text-xl font-semibold tracking-normal mb-4">
              Elige fecha y hora
            </h2>
            {slots.isLoading ? (
              <Skeleton className="h-20 w-full rounded-lg" />
            ) : (
              <SlotPicker
                slots={slots.data ?? []}
                selectedId={selectedSlotId}
                onSelect={setSelectedSlotId}
              />
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <Card>
            <CardContent className="py-5 flex flex-col gap-2">
              <p className="text-xs text-[var(--text-muted)]">Precio por persona</p>
              <p className="text-3xl font-semibold">
                {fmtCop.format(exp.price_cop)}
              </p>
              <Button
                size="lg"
                className="mt-3"
                disabled={!selectedSlot}
                onClick={() => setBookingOpen(true)}
              >
                {selectedSlot ? "Reservar" : "Elige una fecha"}
              </Button>
              <p className="text-xs text-[var(--text-soft)] mt-1">
                Cancelación gratuita hasta {exp.cancellation_hours}h antes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5 flex flex-col gap-3 text-sm">
              <Row icon={<Clock className="h-4 w-4" />} label="Duración">
                {Math.floor(exp.duration_minutes / 60)}h{" "}
                {exp.duration_minutes % 60}m
              </Row>
              <Row icon={<Users className="h-4 w-4" />} label="Participantes">
                {exp.min_participants} – {exp.max_participants}
              </Row>
              {exp.meeting_point_address ? (
                <Row
                  icon={<MapPin className="h-4 w-4" />}
                  label="Punto de encuentro"
                >
                  {exp.meeting_point_address}
                </Row>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>

      <ExperienceReviewsSection experienceId={exp.id} />

      {selectedSlot ? (
        <BookingDialog
          experience={exp}
          slot={selectedSlot}
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
        />
      ) : null}
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 mt-0.5 text-[var(--text-muted)]">{icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs text-[var(--text-soft)]">{label}</span>
        <span className="text-[var(--text)]">{children}</span>
      </div>
    </div>
  );
}
