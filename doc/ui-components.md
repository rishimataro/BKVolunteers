# UI Components

This project uses a collection of reusable UI components located in `src/components/ui`. These components are designed to be accessible, customizable, and consistent across the application.

## Component Structure

When you use the [Code Generator](./generators.md) to create a new component, Plop will automatically create 3 files for you:

- **`index.ts`**: The entry point that exports the component for cleaner imports.
- **`[name].tsx`**: The actual React component implementation.
- **`[name].stories.tsx`**: A placeholder file for Storybook to document and test the component in isolation.

## Core Libraries

- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Variants:** [class-variance-authority (CVA)](https://cva.style/docs)
- **Primitives:** [@base-ui/react](https://base-ui.com/) and [Vaul](https://github.com/emilkowalski/vaul)
- **Icons:** [Lucide React](https://lucide.dev/)

## Available Components

### Button

A flexible button component with multiple variants (default, outline, secondary, ghost, destructive, link) and sizes (xs, sm, default, lg, icon).

- **File:** `src/components/ui/button.tsx`
- **Library:** `@base-ui/react/button`

### Drawer

A responsive drawer/modal component that can slide in from any direction.

- **File:** `src/components/ui/drawer.tsx`
- **Library:** `vaul`

### Dropdown Menu

A robust dropdown menu for actions and navigation.

- **File:** `src/components/ui/dropdown-menu.tsx`
- **Library:** `@base-ui/react/menu`

### Input

A standard text input component with built-in support for displaying error messages.

- **File:** `src/components/ui/input.tsx`

### Label

A simple, accessible label component for form fields.

- **File:** `src/components/ui/label.tsx`

### Link

A styled wrapper around `react-router`'s `Link` component.

- **File:** `src/components/ui/link/link.tsx`

### Notifications

A global notification system using a [Zustand](https://zustand-demo.pmnd.rs/) store. It supports info, success, warning, and error types.

- **Directory:** `src/components/ui/notifications/`
- **Usage:** Use `useNotifications.getState().addNotification(...)` to trigger a toast from anywhere.

### Spinner

A customizable loading spinner built with Lucide's `Loader2Icon`.

- **File:** `src/components/ui/spinner.tsx`

## Best Practices

1. **Use the Generator:** Always use `pnpm run generate` to maintain a consistent file structure.
2. **Prop Forwarding:** Ensure components use `React.forwardRef` when necessary to support third-party libraries (like `react-hook-form`).
3. **Accessibility:** Leverage the `data-slot` and ARIA attributes provided by the primitives to ensure high accessibility standards.
