# Code Generators

This project uses [Plop](https://plopjs.com/) to automate the creation of common code patterns. This ensures consistency and saves time.

## Available Generators

### Component

Generates a new UI component or feature-specific component.

- **Usage:** `pnpm run generate` and select `component`.
- **Outputs:**
    - `index.ts` (Entry point)
    - `[name].tsx` (React component)
    - `[name].stories.tsx` (Storybook story)

#### Options:

1. **Component Name:** The name of your component (e.g., `Button`). It will be converted to kebab-case for the folder and component name.
2. **Feature:**
    - Select `components` to place it in `src/components/[folder]`.
    - Select a specific feature (e.g., `auth`) to place it in `src/features/[feature]/components`.
3. **Folder:** (Only if `components` is selected) The subfolder within `src/components` (e.g., `ui`, `layouts`).

## Adding New Generators

To add a new generator:

1. Create a new folder in `generators/` (e.g., `generators/feature`).
2. Add an `index.cjs` file to that folder defining the generator logic.
3. Add `.hbs` templates in that folder.
4. Register the new generator in the root `plopfile.js`.
