# Set default recipe to list all available recipes
default:
    @just --list

# Install project dependencies
install:
    pnpm install

# Start the development server
dev:
    pnpm dev

# Build the project for production
build:
    pnpm build

# Run linting
lint:
    pnpm lint

# Preview the production build
preview:
    pnpm preview

# Run unit tests
test:
    pnpm test

# Run unit tests with UI
test-ui:
    pnpm test:ui

# Run end-to-end tests
test-e2e:
    pnpm test:e2e

# Generate new components using Plop
generate:
    pnpm generate

# Clean build artifacts
clean:
    rm -rf dist
    rm -rf node_modules/.vite
