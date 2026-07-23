import {
  Compass,
  Search,
  Heart,
  CalendarCheck,
  User,
  Briefcase,
  BarChart3,
  Shield,
  Database,
  Sparkles,
  Star,
} from "lucide-react";
import type { Role } from "@/lib/api/types";
import { featureFlags } from "@/lib/feature-flags";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Navegación por rol — fuente de verdad compartida entre la Sidebar (desktop)
 * y la BottomNav (mobile). El orden importa: la BottomNav muestra los primeros
 * 5 ítems.
 */
export const navByRole: Record<Role, NavItem[]> = {
  user: [
    { href: "/home", label: "Descubrir", icon: Compass },
    { href: "/places", label: "Lugares", icon: Search },
    { href: "/favorites", label: "Favoritos", icon: Heart },
    { href: "/reservations", label: "Reservas", icon: CalendarCheck },
    { href: "/profile", label: "Mi cuenta", icon: User },
  ],
  // Promociones y Métricas viven como pestañas dentro del dashboard
  // (ver dashboard/layout.tsx); no se repiten aquí para evitar navegación
  // duplicada (auditoría #17). El sidebar te lleva AL dashboard; las
  // pestañas navegan DENTRO de él.
  business: [
    { href: "/dashboard", label: "Mi negocio", icon: Briefcase },
    { href: "/profile", label: "Mi cuenta", icon: User },
  ],
  // Solo rutas que existen hoy. `/admin/local-picks` y `/admin/users` se
  // agregarán al nav cuando sus páginas estén implementadas.
  admin: [
    { href: "/admin", label: "Panel admin", icon: Shield },
    { href: "/admin/scraping", label: "Scraping", icon: Database },
    { href: "/admin/ranking", label: "Ranking", icon: BarChart3 },
    { href: "/admin/featured", label: "Destacados", icon: Star },
    { href: "/admin/sponsorships", label: "Sponsorships", icon: Sparkles },
    { href: "/profile", label: "Mi cuenta", icon: User },
  ],
};

export function getNavItemsForRole(role: Role): NavItem[] {
  const items = navByRole[role] ?? navByRole.user;

  return items.filter((item) => {
    if (item.href === "/favorites") return featureFlags.favorites;
    if (item.href === "/reservations") return featureFlags.reservations;

    return true;
  });
}
