"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarDays, EyeOff, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useAdminFeatured,
  useCreateFeatured,
  useDeleteFeatured,
  useUpdateFeatured,
} from "@/features/admin";
import type { FeaturedEntry } from "@/features/admin/api";
import { RoleGate } from "@/features/auth/components/role-gate";
import { usePlaces } from "@/features/places";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { ApiError } from "@/lib/api/types";
import { env } from "@/lib/env";

const controlClass =
  "flex min-h-11 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-base text-[var(--text)] transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[var(--text-muted)] focus-visible:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/25 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm";

function toDatetimeLocal(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function defaultWeekWindow() {
  const now = new Date();
  const start = new Date(now);
  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 0, 0);

  return {
    weekStartsAt: toDatetimeLocal(start),
    weekEndsAt: toDatetimeLocal(end),
  };
}

function toIso(value: string) {
  return new Date(value).toISOString();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getStatus(entry: FeaturedEntry) {
  const now = Date.now();
  const starts = new Date(entry.week_starts_at).getTime();
  const ends = new Date(entry.week_ends_at).getTime();

  if (!entry.is_active)
    return { label: "Inactivo", variant: "default" as const };
  if (now < starts) return { label: "Programado", variant: "info" as const };
  if (now > ends) return { label: "Vencido", variant: "warning" as const };
  return { label: "Vigente", variant: "success" as const };
}

function FeaturedForm() {
  const defaults = useMemo(() => defaultWeekWindow(), []);
  const { data: places, isLoading: placesLoading } = usePlaces({
    limit: 100,
    city: env.NEXT_PUBLIC_DEFAULT_CITY,
  });
  const createFeatured = useCreateFeatured();
  const [placeId, setPlaceId] = useState("");
  const [curatorName, setCuratorName] = useState("Xitty");
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [weekStartsAt, setWeekStartsAt] = useState(defaults.weekStartsAt);
  const [weekEndsAt, setWeekEndsAt] = useState(defaults.weekEndsAt);
  // Posición 1-based de cara al curador (auditoría #28). Se guarda 0-based
  // en la BD (ver handleSubmit) para no romper el orden ni las filas viejas.
  const [position, setPosition] = useState(1);
  const [isActive, setIsActive] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!placeId) {
      toast.error("Selecciona un lugar");
      return;
    }

    if (new Date(weekEndsAt) <= new Date(weekStartsAt)) {
      toast.error("La fecha de fin debe ser posterior al inicio");
      return;
    }

    try {
      await createFeatured.mutateAsync({
        place_id: placeId,
        curator_name: curatorName.trim(),
        custom_title: customTitle.trim() || undefined,
        custom_description: customDescription.trim() || undefined,
        hero_image_url: heroImageUrl.trim() || undefined,
        week_starts_at: toIso(weekStartsAt),
        week_ends_at: toIso(weekEndsAt),
        // 1-based en el form → 0-based en la BD.
        position: position - 1,
        is_active: isActive,
      });
      toast.success("Destacado programado");
      setCustomTitle("");
      setCustomDescription("");
      setHeroImageUrl("");
      setPosition(1);
      setIsActive(true);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "No se pudo crear el destacado",
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo destacado</CardTitle>
        <CardDescription>
          Programa recomendaciones editoriales para la semana actual o futuras.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Field
            label="Lugar"
            htmlFor="featured-place"
            hint={`Mostrando lugares de ${env.NEXT_PUBLIC_DEFAULT_CITY}.`}
          >
            <select
              id="featured-place"
              className={controlClass}
              value={placeId}
              disabled={placesLoading}
              onChange={(event) => setPlaceId(event.target.value)}
            >
              <option value="">Selecciona un lugar</option>
              {places?.data.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Crédito" htmlFor="curator-name">
              <Input
                id="curator-name"
                value={curatorName}
                minLength={2}
                maxLength={100}
                onChange={(event) => setCuratorName(event.target.value)}
                required
              />
            </Field>
            <Field label="Posición" htmlFor="featured-position">
              <Input
                id="featured-position"
                type="number"
                min={1}
                max={100}
                value={position}
                onChange={(event) => setPosition(Number(event.target.value))}
              />
            </Field>
          </div>

          <Field label="Título editorial" htmlFor="custom-title">
            <Input
              id="custom-title"
              value={customTitle}
              maxLength={200}
              placeholder="Opcional: reemplaza el nombre del lugar"
              onChange={(event) => setCustomTitle(event.target.value)}
            />
          </Field>

          <Field label="Texto editorial" htmlFor="custom-description">
            <textarea
              id="custom-description"
              className={cn(controlClass, "min-h-28 resize-y")}
              value={customDescription}
              maxLength={2000}
              placeholder="Por qué vale la pena destacarlo esta semana"
              onChange={(event) => setCustomDescription(event.target.value)}
            />
          </Field>

          <Field label="Imagen destacada" htmlFor="hero-image-url">
            <Input
              id="hero-image-url"
              type="url"
              value={heroImageUrl}
              placeholder="https://..."
              onChange={(event) => setHeroImageUrl(event.target.value)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Inicio de semana" htmlFor="week-start">
              <Input
                id="week-start"
                type="datetime-local"
                value={weekStartsAt}
                onChange={(event) => setWeekStartsAt(event.target.value)}
                required
              />
            </Field>
            <Field label="Fin de semana" htmlFor="week-end">
              <Input
                id="week-end"
                type="datetime-local"
                value={weekEndsAt}
                onChange={(event) => setWeekEndsAt(event.target.value)}
                required
              />
            </Field>
          </div>

          <label className="flex min-h-11 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 text-sm font-medium text-[var(--text)]">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--accent)]"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
            />
            Publicar cuando entre en vigencia
          </label>

          <Button type="submit" loading={createFeatured.isPending}>
            <Star className="h-4 w-4" aria-hidden="true" />
            Programar destacado
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function FeaturedRow({ entry }: { entry: FeaturedEntry }) {
  const updateFeatured = useUpdateFeatured();
  const deleteFeatured = useDeleteFeatured();
  const status = getStatus(entry);
  const title = entry.custom_title || entry.place?.name || "Lugar sin nombre";

  async function handleToggle() {
    try {
      await updateFeatured.mutateAsync({
        id: entry.id,
        payload: { is_active: !entry.is_active },
      });
      toast.success(
        entry.is_active ? "Destacado pausado" : "Destacado activado",
      );
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "No se pudo actualizar el destacado",
      );
    }
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${title}" de destacados?`)) return;

    try {
      await deleteFeatured.mutateAsync(entry.id);
      toast.success("Destacado eliminado");
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "No se pudo eliminar",
      );
    }
  }

  return (
    <li className="grid gap-3 border-b border-[var(--border)] py-4 last:border-b-0 sm:grid-cols-[96px_1fr_auto] sm:items-center">
      <div className="h-24 overflow-hidden rounded-lg bg-[var(--bg-subtle)] sm:h-16">
        {entry.hero_image_url || entry.place?.cover_photo_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={entry.hero_image_url || entry.place?.cover_photo_url || ""}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--text-muted)]">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant={status.variant}>{status.label}</Badge>
          <Badge variant="secondary">{entry.curator_name}</Badge>
          <span className="text-xs text-[var(--text-muted)]">
            Posición {entry.position + 1}
          </span>
        </div>
        <h2 className="truncate text-sm font-semibold text-[var(--text)]">
          {title}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm text-[var(--text-muted)]">
          {entry.custom_description ||
            entry.place?.description ||
            "Sin texto editorial todavía."}
        </p>
        <p className="mt-2 text-xs text-[var(--text-soft)]">
          {formatDate(entry.week_starts_at)} - {formatDate(entry.week_ends_at)}
        </p>
      </div>

      <div className="flex gap-2 sm:justify-end">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          loading={updateFeatured.isPending}
          onClick={handleToggle}
        >
          {entry.is_active ? (
            <>
              <EyeOff className="h-4 w-4" aria-hidden="true" />
              Pausar
            </>
          ) : (
            <>
              <Star className="h-4 w-4" aria-hidden="true" />
              Activar
            </>
          )}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          aria-label={`Eliminar ${title}`}
          loading={deleteFeatured.isPending}
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}

function FeaturedList() {
  const { data, isLoading } = useAdminFeatured(1, 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Programación</CardTitle>
        <CardDescription>
          Revisa lo vigente, lo próximo y lo que debe pausarse antes de
          publicar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : data?.data.length ? (
          <ul className="divide-y-0">
            {data.data.map((entry) => (
              <FeaturedRow key={entry.id} entry={entry} />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={CalendarDays}
            tone="mint"
            title="Sin destacados programados"
            description="Crea el primer destacado para que el home tenga una recomendación curada esta semana."
          />
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminFeaturedPage() {
  return (
    <RoleGate allow={["admin"]}>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="eyebrow">Admin</p>
          <h1 className="text-[32px] font-semibold leading-[1.1] tracking-normal">
            Destacados semanales
          </h1>
          <p className="max-w-2xl text-[15px] text-[var(--text-muted)]">
            Programa lugares recomendados con texto editorial, crédito y ventana
            semanal para mantener vivo el home sin tocar la base de datos a
            mano.
          </p>
        </header>

        <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
          <FeaturedForm />
          <FeaturedList />
        </div>
      </div>
    </RoleGate>
  );
}
