# Project Setup & Configuration

## Environment Variables

The project uses Vite for environment variable management. All variables must be prefixed with `VITE_APP_`.

| Variable                      | Description                                                    | Default                 |
| :---------------------------- | :------------------------------------------------------------- | :---------------------- |
| `VITE_APP_API_URL`            | The URL of the API (Note: `/api/v1` is automatically appended) | -                       |
| `VITE_APP_ENABLE_API_MOCKING` | Enable/Disable API mocking (optional)                          | `false`                 |
| `VITE_APP_APP_URL`            | The URL of the application (optional)                          | `http://localhost:3000` |
| `VITE_APP_APP_MOCK_API_PORT`  | The port for the mock API (optional)                           | `8080`                  |

### Local Setup

1. Create a `.env` file in the root directory.
2. Add the required variables:
    ```env
    VITE_APP_API_URL=http://localhost:4000
    VITE_APP_ENABLE_API_MOCKING=true
    ```

## Authentication & Routing

### Protected Routes

Routes under `/app` are protected using the `ProtectedRoute` component. This component checks for a valid user session:

- **If authenticated:** Renders the requested route.
- **If not authenticated:** Redirects the user to `/auth/login` with a `redirectTo` parameter.

### Dashboard Structure

The dashboard is located at `/app` and uses the `DashboardLayout` for a consistent sidebar and header.

- **Main Dashboard:** `/app` (Renders `DashboardRoute`)
- **Users:** `/app/users` (Restricted to admins)
- **Profile:** `/app/profile`
