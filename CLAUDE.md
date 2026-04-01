# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm dev`: Start the development server.
- `pnpm build`: Build the project for production.
- `pnpm lint`: Run ESLint to check for code quality and style issues.
- `pnpm generate`: Use Plop to generate new components or features.

### Testing

- `pnpm test`: Run unit and integration tests with Vitest.
- `pnpm test:ui`: Run Vitest with the UI.
- `pnpm test:e2e`: Run end-to-end tests with Playwright.
- `pnpm vitest path/to/test.test.tsx`: Run a single test file.

## Architecture & Structure

The codebase follows a **Feature-First Architecture**, organizing code by domain (e.g., Auth, Users) rather than technical role.

### Key Directories

- `src/app/`: App entry point, global context providers (`provider.tsx`), and the main router.
- `src/app/routes/`: Route definitions, often importing components from features.
- `src/features/`: Domain-specific business logic. Each feature should follow this structure:
    - `api/`: React Query hooks and Fetch API calls.
    - `components/`: UI components specific to the feature.
    - `hooks/`: Feature-specific logic/hooks.
    - `types/`: Domain-specific TypeScript types and schemas (Zod).
    - `index.ts`: The public API for the feature (only exports what should be visible to other features).
- `src/components/`: Truly global, reusable UI components (built with Shadcn UI and Tailwind CSS).
- `src/lib/`: Core utilities and shared configuration (API client, React Query setup).
- `src/testing/`: Test setup, MSW handlers, and shared mocks.
- `src/config/`: Environment variables (validated with Zod) and global constants.

### Technology Stack

- **React 19 & TypeScript**: Uses the latest React features and React Compiler.
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest) for server state; [Zustand](https://github.com/pmndrs/zustand) for client state.
- **Routing**: [React Router 7](https://reactrouter.com/en/main).
- **Authentication**: Managed via `react-query-auth` with JWT handling in Fetch API interceptors (`src/lib/fetch-client.ts`).
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.
- **Mocking**: [MSW (Mock Service Worker)](https://mswjs.io/) for API mocking during development and testing.

## API Client

The app uses a custom fetch-based HTTP client instead of axios:

- `src/lib/fetch-client.ts`: Fetch API wrapper with:
    - Automatic JWT token handling
    - Token refresh on 401 responses
    - Request queue for concurrent 401 handling
    - ApiError class for error handling

### Usage

```typescript
import { api, ApiError } from '@/lib/fetch-client';

// GET
const user = await api.get<User>('/auth/me');

// POST
const response = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
});
```

## Testing

### MSW Mocks

MSW mocks are defined in `src/testing/mocks.ts` and include handlers for:

- Auth: login, signup, logout, refresh, verify email
- Password: forgot-password, reset-password
- Users: list, get by id
- Campaigns: list, get by id
- Activities: list, create
- Error simulation: 403, 500 responses

Enable mocking by setting `ENABLE_API_MOCKING=true` in environment.
