"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { RatingInput } from "@/features/reviews/components/rating-input";
import {
  useCreateExperienceReview,
  useDeleteExperienceReview,
  useUpdateExperienceReview,
} from "@/features/experiences/hooks/use-experience-reviews";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { ApiError } from "@/lib/api/types";
import type { ExperienceReview } from "@/lib/api/types";

export function ExperienceReviewForm({
  experienceId,
  myReview,
}: {
  experienceId: string;
  myReview: ExperienceReview | null;
}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isEdit = !!myReview;
  const reviewSource = [
    myReview?.id ?? "new",
    myReview?.rating ?? 0,
    myReview?.comment ?? "",
  ].join(":");

  const [reviewDraft, setReviewDraft] = useState(() => ({
    source: reviewSource,
    rating: myReview?.rating ?? 0,
    comment: myReview?.comment ?? "",
  }));
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [showPhotos, setShowPhotos] = useState(false);

  const create = useCreateExperienceReview(experienceId);
  const update = useUpdateExperienceReview(experienceId);
  const del = useDeleteExperienceReview(experienceId);

  const rating =
    reviewDraft.source === reviewSource
      ? reviewDraft.rating
      : myReview?.rating ?? 0;
  const comment =
    reviewDraft.source === reviewSource
      ? reviewDraft.comment
      : myReview?.comment ?? "";

  function setRating(next: number) {
    setReviewDraft({
      source: reviewSource,
      rating: next,
      comment,
    });
  }

  function setComment(next: string) {
    setReviewDraft({
      source: reviewSource,
      rating,
      comment: next,
    });
  }

  if (!accessToken) {
    return (
      <p className="text-sm text-[var(--text-muted)] rounded-md border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3">
        Inicia sesión para reseñar esta experiencia.
      </p>
    );
  }

  const busy = create.isPending || update.isPending || del.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Selecciona una calificación de 1 a 5 estrellas");
      return;
    }
    const trimmed = comment.trim();
    try {
      if (isEdit) {
        await update.mutateAsync({
          rating,
          comment: trimmed ? trimmed : undefined,
        });
        toast.success("Reseña actualizada");
      } else {
        const urls = photoUrls.map((u) => u.trim()).filter(Boolean);
        await create.mutateAsync({
          rating,
          comment: trimmed ? trimmed : undefined,
          photo_urls: urls.length ? urls : undefined,
        });
        setPhotoUrls([]);
        setShowPhotos(false);
        toast.success("Reseña publicada");
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toast.info("Ya reseñaste esta experiencia. Edita la existente.");
      } else {
        toast.error(
          err instanceof ApiError ? err.message : "No se pudo guardar.",
        );
      }
    }
  }

  async function handleDelete() {
    try {
      await del.mutateAsync();
      setReviewDraft({ source: reviewSource, rating: 0, comment: "" });
      toast.success("Reseña eliminada");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "No se pudo eliminar.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium mb-2">
          {isEdit ? "Tu reseña" : "¿Cómo estuvo la experiencia?"}
        </p>
        <RatingInput value={rating} onChange={setRating} disabled={busy} />
      </div>

      <label htmlFor={`experience-review-comment-${experienceId}`} className="sr-only">
        Comentario de la reseña
      </label>
      <textarea
        id={`experience-review-comment-${experienceId}`}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comparte los detalles: el guía, el recorrido, lo que más te gustó (opcional)"
        rows={4}
        maxLength={2000}
        disabled={busy}
        className="w-full resize-y rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-base text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25 disabled:opacity-60 sm:text-sm"
      />

      {!isEdit ? (
        <div className="flex flex-col gap-2">
          {!showPhotos ? (
            <button
              type="button"
              onClick={() => {
                setShowPhotos(true);
                setPhotoUrls([""]);
              }}
              className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-[var(--accent)] hover:underline underline-offset-4"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Agregar fotos (enlaces)
            </button>
          ) : (
            <div className="flex flex-col gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] p-3">
              <p className="text-xs text-[var(--text-muted)]">
                Pega hasta 5 enlaces de imágenes (https://…).
              </p>
              {photoUrls.map((url, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      const next = [...photoUrls];
                      next[i] = e.target.value;
                      setPhotoUrls(next);
                    }}
                    placeholder="https://…/foto.jpg"
                    className="flex-1 h-9 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoUrls(photoUrls.filter((_, j) => j !== i))
                    }
                    className="shrink-0 text-[var(--text-soft)] hover:text-[var(--danger)] p-1"
                    aria-label="Quitar enlace"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
              {photoUrls.length < 5 ? (
                <button
                  type="button"
                  onClick={() => setPhotoUrls([...photoUrls, ""])}
                  className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-[var(--accent)] hover:underline underline-offset-4"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Otro enlace
                </button>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--text-soft)]">{comment.length}/2000</p>
        <div className="flex items-center gap-2">
          {isEdit ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              loading={del.isPending}
              disabled={busy}
            >
              Eliminar
            </Button>
          ) : null}
          <Button
            type="submit"
            loading={create.isPending || update.isPending}
            disabled={rating === 0 || busy}
          >
            {isEdit ? "Actualizar" : "Publicar reseña"}
          </Button>
        </div>
      </div>
    </form>
  );
}
