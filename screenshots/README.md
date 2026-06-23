# Screenshots — curated + admin scraping

Capturas tomadas con `e2e/screenshots-curated.spec.ts` (Playwright, best-effort).

## Archivos

| Archivo | Descripcion | Estado |
|---|---|---|
| `curated-section.png` | Home publica, scrolled a la seccion "Descubre lo nuevo en Barranquilla" | Parcial — el heading no se renderizo en la corrida actual (ver Troubleshooting). |
| `admin-scraping-overview.png` | `/admin/scraping`, tab Sources (default) | OK |
| `admin-scraping-moderation.png` | `/admin/scraping`, tab Moderacion | OK (cola vacia en la corrida actual) |
| `admin-scraping-item-detail.png` | Modal `ItemEditor` abierto desde la cola | Parcial — sin items para clickear, la captura quedo identica a la de Moderacion. |

## Como re-correr

1. **Backend**

   ```bash
   cd /Users/1234/xitty/xitty-backend
   npm run start:dev > /tmp/be-curated.log 2>&1 &
   # esperar hasta que responda
   until curl -sf http://localhost:3001/api/docs >/dev/null; do sleep 2; done
   ```

2. **Frontend + Playwright**

   ```bash
   cd /Users/1234/xitty/xitty-frontend
   npx playwright test e2e/screenshots-curated.spec.ts --reporter=line
   ```

   `playwright.config.ts` ya arranca `npm run dev` automaticamente via `webServer` (default :3000).

3. **Matar backend**

   ```bash
   pkill -f 'nest start'
   ```

## Troubleshooting

### `curated-section.png` no muestra la seccion "Descubre lo nuevo"

El componente `CuratedCarousel` solo se renderiza si el endpoint
`GET /discover/curated` devuelve items. Si la base de datos no tiene
`scraped_items` con `status = 'published'`, la seccion no aparece y el spec cae
al fallback (captura del scroll-top de la home).

Para tener data:

- Asegurarse que las migraciones de `scraped_*` esten aplicadas en Supabase.
- Loggear como `seed_admin_001@xitty.local`, entrar a `/admin/scraping`, crear
  una source, correr el run, aprobar y publicar items desde la tab Moderacion.
- O insertar items publicados directamente con SQL si hay seed disponible.

### `admin-scraping-item-detail.png` no muestra el ItemEditor

El spec hace click en el primer boton "Editar" de la cola Moderacion. Si la
cola esta vacia, no hay boton y la captura cae al estado de la lista vacia.
Solucion: poblar la tabla `scraped_items` con al menos un item en `pending`
antes de correr el spec (ver pasos arriba).

### Endpoints retornan vacio

Verificar:

- `JWT_SECRET` y `SUPABASE_SERVICE_ROLE_KEY` en `xitty-backend/.env`.
- Que el usuario `seed_admin_001@xitty.local` tenga rol `admin` en
  `user_roles`.
- Logs en `/tmp/be-curated.log` para errores de RLS o policies.
