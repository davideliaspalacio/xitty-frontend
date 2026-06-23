import "@testing-library/jest-dom/vitest";

// Provide default env vars for any module that imports `@/lib/env`
// during tests (e.g. the HTTP client). Tests can still override these
// per-suite if they need to.
process.env.NEXT_PUBLIC_API_URL ??= "http://localhost:3001";
process.env.NEXT_PUBLIC_APP_URL ??= "http://localhost:3000";
