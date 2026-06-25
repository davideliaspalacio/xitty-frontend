import {
  Compass,
  Search,
  Heart,
  CalendarCheck,
  User,
  Briefcase,
  BarChart3,
  Tag,
  Shield,
  Database,
  Sparkles,
} from "lucide-react";
import type { Role } from "@/lib/api/types";

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
    { href: "/", label: "Descubrir", icon: Compass },
    { href: "/places", label: "Lugares", icon: Search },
    { href: "/favorites", label: "Favoritos", icon: Heart },
    { href: "/reservations", label: "Reservas", icon: CalendarCheck },
    { href: "/profile", label: "Mi cuenta", icon: User },
  ],
  business: [
    { href: "/dashboard", label: "Mi negocio", icon: Briefcase },
    { href: "/dashboard/promotions", label: "Promociones", icon: Tag },
    { href: "/dashboard/metrics", label: "Métricas", icon: BarChart3 },
    { href: "/profile", label: "Mi cuenta", icon: User },
  ],
  // Solo rutas que existen hoy. `/admin/featured`, `/admin/local-picks` y
  // `/admin/users` se agregarán al nav cuando sus páginas estén implementadas
  // (hoy darían 404).
  admin: [
    { href: "/admin", label: "Panel admin", icon: Shield },
    { href: "/admin/scraping", label: "Scraping", icon: Database },
    { href: "/admin/sponsorships", label: "Sponsorships", icon: Sparkles },
    { href: "/profile", label: "Mi cuenta", icon: User },
  ],
};
