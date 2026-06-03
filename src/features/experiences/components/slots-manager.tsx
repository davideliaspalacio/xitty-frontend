"use client";

import { useState } from "react";
import { CalendarPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useExperienceSlots } from "@/features/experiences/hooks/use-experiences";
import {
  useCreateSlot,
  useDeleteSlot,
} from "@/features/experiences/hooks/use-manage-experiences";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { Skeleton } from "@/shared/ui/skeleton";
import { ApiError } from "@/lib/api/types";

export function SlotsManager({ experienceId }: { experienceId: string }) {
  const slots = useExperienceSlots(experienceId);
  const createSlot = useCreateSlot(experienceId);
  const deleteSlot = useDeleteSlot(experienceId);
  const [startsAt, setStartsAt] = useState("");
  const [capacity, setCapacity] = useState("");

  async function handleAdd() {
    if (!startsAt) {
      toast.error("Elige fecha y hora");
      return;
    }
    const cap = Number(capacity);
    if (!Number.isFinite(cap) || cap < 1) {
      toast.error("Capacidad inválida");
      return;
    }
    const iso = new Date(startsAt).toISOString();
    if (new Date(iso).getTime() <= Date.now()) {
      toast.error("La fecha debe ser futura");
      return;
    }
    try {
      await createSlot.mutateAsync({ starts_at: iso, capacity: cap });
      setStartsAt("");
      setCapacity("");
      toast.success("Cupo agregado");
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "No se pudo agregar el cupo",
      );
    }
  }

  async function handleDelete(slotId: string) {
    if (!confirm("¿Eliminar este cupo?")) return;
    try {
      await deleteSlot.mutateAsync(slotId);
      toast.success("Cupo eliminado");
    } catch (e) {
      toast.error(
        e instanceof ApiError
          ? e.message
          : "No se pudo eliminar (¿tiene reservas?)",
      );
    }
  }

  const list = [...(slots.data ?? [])].sort(
    (a, b) =>
      new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-3 sm:items-end">
        <Field label="Fecha y hora" htmlFor="slot-date">
          <Input
            id="slot-date"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </Field>
        <Field label="Capacidad" htmlFor="slot-cap">
          <Input
            id="slot-cap"
            type="number"
            min={1}
            placeholder="8"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </Field>
        <Button
          type="button"
          variant="secondary"
          onClick={handleAdd}
          loading={createSlot.isPending}
        >
          <CalendarPlus className="h-4 w-4" /> Agregar
        </Button>
      </div>

      {slots.isLoading ? (
        <Skeleton className="h-16 rounded-lg" />
      ) : list.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          Aún no hay cupos. Agrega fechas para que los turistas reserven.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-[var(--border)]">
          {list.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {new Date(s.starts_at).toLocaleString("es-CO", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p className="text-xs text-[var(--text-soft)]">
                  {s.seats_taken}/{s.capacity} reservados · {s.seats_available}{" "}
                  disponibles
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Eliminar cupo"
                onClick={() => handleDelete(s.id)}
                disabled={deleteSlot.isPending}
              >
                <Trash2 className="h-4 w-4 text-[var(--danger)]" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
