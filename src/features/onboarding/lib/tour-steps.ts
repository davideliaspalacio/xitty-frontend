/**
 * Tour de bienvenida de Xitty.
 *
 * Define los 8 pasos del recorrido guiado sobre el home real. Cada paso apunta
 * a un `id` estable presente en la UI (ver `src/app/(app)/page.tsx`, la topbar,
 * la bottom-nav y el FAB de chat). La `description` es el guión que también se
 * narra por voz (Web Speech API) — escrito en un tono caribeño cálido.
 */

export const TOUR_STORAGE_KEY = "xitty_tour_completed";

export interface TourStep {
  /** Selector CSS del elemento a destacar (id estable, p. ej. "#tour-today"). */
  element: string;
  /** Título corto del popover. */
  title: string;
  /** Texto del popover y guión de la narración por voz. */
  description: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    element: "#tour-hero",
    title: "¡Bienvenido a Xitty! 🌴",
    description:
      "¡Qué nota tenerte por aquí! Soy tu guía en Barranquilla. En menos de un minuto te muestro cómo sacarle el jugo a la app. Dale, que esto está bueno.",
  },
  {
    element: "#tour-today",
    title: "Qué hacer hoy",
    description:
      "Aquí te dejo lo que vale la pena hacer hoy mismo, escogido según tu perfil y el momento. Si tienes un ratico libre, mira primero por acá.",
  },
  {
    element: "#tour-chips",
    title: "Tu tipo de viaje",
    description:
      "Cuéntame cómo andas: solo, en pareja, con la familia o de negocios. Toca el chip que va contigo y al toque te acomodo las recomendaciones.",
  },
  {
    element: "#tour-categories",
    title: "Explora por categoría",
    description:
      "¿Con hambre, con sed o con ganas de rumba? Entra por categoría y encuentra rapidito el tipo de lugar que estás buscando.",
  },
  {
    element: "#tour-experiences",
    title: "Vive experiencias únicas",
    description:
      "Tours, talleres, sabor caribeño y bienestar. Reserva experiencias que solo se viven aquí, en pleno Caribe colombiano.",
  },
  {
    element: "#tour-chat-fab",
    title: "Xi, tu asistente",
    description:
      "Este es Xi, tu pana digital. Pregúntale lo que sea: dónde comer, qué hacer o cómo llegar. Está pendiente de ti las 24 horas.",
  },
  {
    element: "#tour-sos",
    title: "Botón SOS",
    description:
      "Tranquilo, que tu seguridad es lo primero. Con este botón te conectas de una con la línea de emergencias 123. Ojalá nunca lo necesites.",
  },
  {
    element: "#tour-bottom-nav",
    title: "Muévete por la app",
    description:
      "Desde aquí abajo saltas entre Descubrir, Lugares, Favoritos, Reservas y tu cuenta. ¡Listo el pollo! Ya sabes lo esencial. Disfruta Barranquilla.",
  },
];
