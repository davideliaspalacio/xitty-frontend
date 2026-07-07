"use client";

import { CheckCircle2, Clock3, Languages, MapPin, Volume2 } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { featureFlags } from "@/lib/feature-flags";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useTts } from "@/features/onboarding/hooks/use-tts";
import {
  useAudioTourProgress,
  useAudioTours,
  useUpdateAudioTourProgress,
} from "@/features/audio-tours/hooks/use-audio-tours";
import type { AudioTourStop } from "@/lib/api/types";

interface AudioTourPanelProps {
  placeId: string;
  className?: string;
  compact?: boolean;
}

export function AudioTourPanel({
  placeId,
  className,
  compact = false,
}: AudioTourPanelProps) {
  if (!featureFlags.audioTours) return null;

  return (
    <AudioTourPanelContent
      placeId={placeId}
      className={className}
      compact={compact}
    />
  );
}

function AudioTourPanelContent({
  placeId,
  className,
  compact = false,
}: AudioTourPanelProps) {
  const token = useAuthStore((s) => s.accessToken);
  const { data, isLoading, isError } = useAudioTours(placeId);
  const tour = data?.data[0];
  const progress = useAudioTourProgress(tour?.id);
  const updateProgress = useUpdateAudioTourProgress(tour?.id ?? "");
  const tts = useTts();

  const completed = useMemo(
    () => new Set(progress.data?.completed_stop_ids ?? []),
    [progress.data?.completed_stop_ids],
  );

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-52" />
        </CardHeader>
      </Card>
    );
  }

  if (isError || !tour || tour.stops.length === 0) return null;

  const totalStops = tour.stops.length;
  const completedCount = completed.size;
  const currentStop =
    tour.stops.find((stop) => !completed.has(stop.id)) ?? tour.stops[0] ?? null;

  function markStopDone(stop: AudioTourStop) {
    if (!tour) return;

    const nextCompleted = Array.from(new Set([...completed, stop.id]));
    const nextStop =
      tour.stops.find((candidate) => !nextCompleted.includes(candidate.id)) ??
      stop;

    updateProgress.mutate({
      current_stop_id: nextStop.id,
      completed_stop_ids: nextCompleted,
      last_position_seconds: 0,
      completed: nextCompleted.length >= tour.stops.length,
    });
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-pill bg-[var(--accent-soft)] text-[var(--accent)]">
            <Volume2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="inline-flex items-center gap-1 rounded-pill border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]">
            <Languages className="h-3.5 w-3.5" aria-hidden="true" />
            {tour.language_code.toUpperCase()}
          </span>
        </div>
        <div>
          <CardTitle className={compact ? "text-lg" : undefined}>
            {tour.title}
          </CardTitle>
          {tour.description ? (
            <CardDescription>{tour.description}</CardDescription>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1 rounded-pill bg-[var(--bg-subtle)] px-2.5 py-1">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {tour.estimated_duration_min} min
          </span>
          <span className="inline-flex items-center gap-1 rounded-pill bg-[var(--bg-subtle)] px-2.5 py-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {totalStops} paradas
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {currentStop ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
            <p className="text-xs font-semibold text-[var(--text-soft)]">
              Parada actual
            </p>
            <h3 className="mt-1 text-base font-semibold text-[var(--text)]">
              {currentStop.title}
            </h3>
            {currentStop.description ? (
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                {currentStop.description}
              </p>
            ) : null}
            {currentStop.audio_url ? (
              <audio
                controls
                preload="none"
                src={currentStop.audio_url}
                className="mt-3 w-full"
              />
            ) : currentStop.transcript ? (
              <div className="mt-3 flex flex-col gap-3">
                <p className="line-clamp-3 text-sm text-[var(--text-muted)]">
                  {currentStop.transcript}
                </p>
                {tts.supported ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="self-start"
                    onClick={() =>
                      tts.speaking
                        ? tts.cancel()
                        : tts.speak(currentStop.transcript ?? "")
                    }
                  >
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                    {tts.speaking ? "Detener narración" : "Narrar parada"}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        <ol className="flex flex-col gap-2">
          {tour.stops.map((stop, index) => {
            const isDone = completed.has(stop.id);
            return (
              <li
                key={stop.id}
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5"
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-pill text-xs font-bold",
                    isDone
                      ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                      : "bg-[var(--accent-soft)] text-[var(--accent)]",
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">
                    {stop.title}
                  </p>
                  <p className="text-xs text-[var(--text-soft)]">
                    {Math.max(1, Math.round(stop.duration_seconds / 60))} min
                  </p>
                </div>
                {token ? (
                  <Button
                    type="button"
                    variant={isDone ? "secondary" : "soft"}
                    size="sm"
                    loading={updateProgress.isPending}
                    disabled={isDone}
                    onClick={() => markStopDone(stop)}
                  >
                    {isDone ? "Lista" : "Hecha"}
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ol>

        {token ? (
          <p className="text-xs text-[var(--text-soft)]">
            {completedCount}/{totalStops} paradas completadas.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
