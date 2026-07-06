"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useToggleFavorite, useFavoriteIds } from "@/features/favorites/hooks/use-favorites";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { cn } from "@/shared/utils/cn";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  placeId: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "solid";
  className?: string;
}

const sizes = {
  sm: { btn: "h-7 w-7", icon: "h-3.5 w-3.5" },
  md: { btn: "h-9 w-9", icon: "h-[18px] w-[18px]" },
  lg: { btn: "h-11 w-11", icon: "h-5 w-5" },
};

export function FavoriteButton({
  placeId,
  size = "md",
  variant = "solid",
  className,
}: FavoriteButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const ids = useFavoriteIds();
  const isFav = ids.has(placeId);
  const toggle = useToggleFavorite();
  const s = sizes[size];

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!accessToken) {
      toast.info("Inicia sesión para guardar lugares");
      router.push("/login");
      return;
    }
    try {
      await toggle.mutateAsync(placeId);
    } catch {
      toast.error("No se pudo guardar. Intenta de nuevo.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isFav}
      aria-label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full transition-all duration-150 active:scale-90 motion-reduce:transition-none motion-reduce:active:scale-100",
        // Invisible, centered hit area so the tappable target is >= 44px
        // even when the visible chrome (sm/md) is smaller. Keeps the icon
        // and absolute positioning of the visible circle unchanged.
        "before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:min-h-[44px] before:min-w-[44px] before:content-['']",
        s.btn,
        variant === "solid"
          ? "bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-2)]"
          : "bg-transparent hover:bg-[var(--surface-hover)]",
        className,
      )}
    >
      <Heart
        aria-hidden="true"
        className={cn(
          s.icon,
          "transition-colors",
          isFav
            ? "fill-[var(--accent)] text-[var(--accent)]"
            : "text-[var(--text-muted)]",
        )}
      />
    </button>
  );
}
