# Xitty Frontend

Frontend web de Xitty construido con Next.js. Incluye landing publica, flujo de autenticacion, dashboard, perfiles/micrositios, promociones, rankings, experiencias, audiotours y paneles admin.

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

La app queda en `http://localhost:3000`.

## Variables de entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_CITY=Barranquilla
```

| Variable | Para que |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL del backend NestJS. |
| `NEXT_PUBLIC_APP_URL` | URL publica/base del frontend para links y metadata. |
| `NEXT_PUBLIC_DEFAULT_CITY` | Ciudad operativa por defecto para home, ranking y listados. |
| `NEXT_PUBLIC_DISABLED_FEATURES` | Lista separada por comas de features apagadas. Vacio = todo encendido por defecto. |
| `NEXT_PUBLIC_DISABLED_LANDING_SECTIONS` | Lista separada por comas de secciones de landing apagadas. Vacio = todo encendido por defecto. |

## Feature flags

Por defecto, todas las funcionalidades y secciones estan encendidas. Para apagar algo puntual sin tocar codigo:

```env
NEXT_PUBLIC_DISABLED_FEATURES=aiChat,rewardsRally
NEXT_PUBLIC_DISABLED_LANDING_SECTIONS=landingFaq
```

Tambien se puede forzar una flag individual con valores `true/false`, `1/0`, `on/off`, `yes/no` o `enabled/disabled`:

```env
NEXT_PUBLIC_FEATURE_AI_CHAT=true
NEXT_PUBLIC_FEATURE_AUDIO_TOURS=true
NEXT_PUBLIC_LANDING_PLANNER=true
```

Las flags viven en `src/lib/feature-flags.ts`.

## Scripts utiles

```bash
npm run dev          # Desarrollo
npm run build        # Build de produccion
npm run typecheck    # TypeScript sin emitir
npm run test:run     # Suite Vitest
npm run lint         # ESLint
```

## QA rapido

- Landing en `/` con marca verde, secciones largas y assets visuales.
- Login en `/login`.
- Dashboard en `/dashboard`.
- Promociones en `/dashboard/promotions` y `/promotions`.
- Metricas en `/dashboard/metrics`.
- Admin scraping en `/admin/scraping`, incluyendo la pestaña "Calidad de datos".
- Admin destacados semanales en `/admin/featured`.
- Admin patrocinios en `/admin/sponsorships`.
