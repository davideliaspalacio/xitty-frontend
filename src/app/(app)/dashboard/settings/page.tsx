"use client";

import { toast } from "sonner";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/features/notification-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { ApiError } from "@/lib/api/types";

const TOGGLES: { key: "notify_call_click" | "notify_whatsapp_click" | "notify_reservation_click" | "daily_summary"; label: string; hint: string }[] = [
  {
    key: "notify_call_click",
    label: "Cuando alguien llama",
    hint: "Aviso interno cuando alguien toca 'Llamar' desde tu micrositio.",
  },
  {
    key: "notify_whatsapp_click",
    label: "Cuando abren WhatsApp",
    hint: "Aviso interno cuando alguien toca 'WhatsApp'.",
  },
  {
    key: "notify_reservation_click",
    label: "Cuando intentan reservar",
    hint: "Aviso interno cuando alguien toca 'Reservar' (no garantiza reserva confirmada).",
  },
  {
    key: "daily_summary",
    label: "Resumen diario",
    hint: "Resumen listo con las interacciones del día anterior cuando el canal esté configurado.",
  },
];

export default function NotificationsSettingsPage() {
  const { data, isLoading } = useNotificationSettings();
  const update = useUpdateNotificationSettings();

  if (isLoading || !data) {
    return <Skeleton className="h-64 rounded-lg" />;
  }

  async function toggle(key: typeof TOGGLES[number]["key"], value: boolean) {
    try {
      await update.mutateAsync({ [key]: value });
      toast.success("Preferencia actualizada");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo guardar");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notificaciones</CardTitle>
        <CardDescription>
          Elige cuándo te avisamos sobre interacciones con tu negocio. Puedes
          cambiar esto en cualquier momento.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        {TOGGLES.map((t, i) => (
          <div
            key={t.key}
            className={
              "flex items-start justify-between gap-4 py-4 " +
              (i < TOGGLES.length - 1 ? "border-b border-[var(--border)]" : "")
            }
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{t.label}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{t.hint}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={data[t.key]}
                onChange={(e) => toggle(t.key, e.target.checked)}
                disabled={update.isPending}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[var(--border)] peer-focus:ring-2 peer-focus:ring-[var(--accent)]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-[var(--border)] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]" />
            </label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
