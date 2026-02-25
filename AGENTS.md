# AGENTS.md

## Cursor Cloud specific instructions

This is an Angular 17 To-Do List SPA located in `client/`. No backend, database, or external services are needed — all data persists in browser `localStorage`.

### Running the app

```
cd client && npx ng serve
```

Dev server runs on port 4200. See `README.md` for all available commands.

### Known issues

- `npx ng test --no-watch --browsers=ChromeHeadless` fails with pre-existing TypeScript errors in `src/app/service/list-data.service.spec.ts` (Jasmine type-narrowing issue with `DataOrder` enum). The build itself (`npx ng build`) compiles cleanly.

### Notes

- No linter is configured (no ESLint in devDependencies). Only `ng build` serves as a static analysis check.
- The lockfile is `package-lock.json` — use `npm install` (not yarn/pnpm) for dependency management.
