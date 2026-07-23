import Link from "next/link";
import { Compass } from "lucide-react";
import { EmptyState } from "@/shared/ui/empty-state";
import { buttonVariants } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/logo";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-8 px-4 py-16">
      <Link href="/" aria-label="Xitty — ir al inicio">
        <Logo size="md" />
      </Link>
      <EmptyState
        icon={Compass}
        title="Nos perdimos en el camino"
        description="Esta página no existe o se movió. Volvamos a explorar Barranquilla desde el inicio."
        action={
          <Link href="/home" className={buttonVariants()}>
            Volver al inicio
          </Link>
        }
      />
    </main>
  );
}
