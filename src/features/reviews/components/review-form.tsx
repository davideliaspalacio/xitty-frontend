"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { RatingInput } from "./rating-input";
import { useCreateReview } from "@/features/reviews/hooks/use-reviews";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { ApiError } from "@/lib/api/types";

export function ReviewForm({ placeId }: { placeId: string }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const create = useCreateReview(placeId);

  if (!accessToken) {
    return (
      <p className="text-sm text-[var(--text-muted)] rounded-md border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3">
        Inicia sesión para dejar una reseña.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Selecciona una calificación de 1 a 5 estrellas");
      return;
    }
    try {
      await create.mutateAsync({
        rating,
        comment: comment.trim() ? comment.trim() : undefined,
      });
      setComment("");
      setRating(0);
      toast.success("Reseña publicada");
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        toast.info("Ya dejaste una reseña aquí. Edita la existente.");
      } else {
        toast.error(
          e instanceof ApiError ? e.message : "No se pudo publicar.",
        );
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium mb-2">¿Cómo fue tu experiencia?</p>
        <RatingInput value={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Cuéntale a otros viajeros qué tal estuvo (opcional)"
        rows={4}
        maxLength={1000}
        className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] resize-y"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-soft)]">{comment.length}/1000</p>
        <Button type="submit" loading={create.isPending} disabled={rating === 0}>
          Publicar reseña
        </Button>
      </div>
    </form>
  );
}
