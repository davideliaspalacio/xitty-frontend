import Link from "next/link";
import { Store } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { buttonVariants } from "@/shared/ui/button";
import { PlaceForm } from "@/features/places/components/place-form";

interface BusinessPlaceRequiredProps {
  showForm?: boolean;
}

export function BusinessPlaceRequired({
  showForm = false,
}: BusinessPlaceRequiredProps) {
  return (
    <div className="flex flex-col gap-4">
      <EmptyState
        icon={Store}
        title="Configura tu lugar para empezar"
        description="Tu negocio necesita un perfil base antes de publicar promociones, revisar métricas o vender experiencias."
        action={
          showForm ? null : (
            <Link
              href="/dashboard/place"
              className={buttonVariants({ variant: "primary" })}
            >
              Crear mi lugar
            </Link>
          )
        }
      />
      {showForm ? (
        <Card>
          <CardContent className="py-6">
            <PlaceForm />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
