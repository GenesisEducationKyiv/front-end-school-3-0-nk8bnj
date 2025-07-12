# Track Manager

A modern web application for managing music tracks, built with Next.js 15 and React 19.

## Features

- Browse and search music tracks
- Filter tracks by genre and artist
- Create, edit and delete tracks
- Bulk selection and deletion
- Responsive design for desktop and mobile

## Tech Stack

- TypeScript
- React (Next.js)
- Zustand
- TailwindCSS
- Shadcn/ui
- Lucide
- Storybook

## Optimization & Build Features

### Bundle Analyzer
- Integrated with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) for visualizing bundle size and composition. Run with `ANALYZE=true npm run build` to generate a report.

### Code Splitting
- Uses Next.js automatic code splitting to load only the necessary JavaScript for each page, improving performance.

### Tree Shaking
- Leverages modern ES module tree shaking to remove unused code from production bundles. This is handled automatically under the hood by Next.js, requiring no manual configuration.

### Lazy Loading
- Components and pages are lazy-loaded using React's `lazy` and Next.js dynamic imports to reduce initial load time.
- React `Suspense` is used to handle loading states for lazy-loaded components.

### Source Maps
- Source maps are generated for easier debugging of production builds. Configure in `next.config.ts` as needed.

## Component Development & Documentation

### Storybook
- Integrated with Storybook for component development and documentation
- Features:
  - Component isolation and testing
  - Interactive documentation with auto-generated controls
  - Accessibility testing with `@storybook/addon-a11y`
  - Design integration with `@storybook/addon-designs`
  - Vitest integration for component testing
  - Chromatic integration for visual testing
- Stories are located in `/src/stories/` and follow the `*.stories.ts` pattern
- Run with `npm run storybook` to start the development server on port 6006
- Build static Storybook with `npm run build-storybook`

## Start project locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Storybook Development

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the component library and documentation.

## Project Structure

- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable React components
  - `/ui` - Shadcn/ui components
- `/src/hooks` - Custom React hooks
- `/src/store` - Zustand state management
- `/src/services` - API service functions
- `/src/types` - TypeScript type definitions
- `/src/lib` - Utility functions and configuration
- `/src/test` - Test setup and utilities
- `/src/stories` - Storybook component stories
- `/public` - Static assets
- `/.storybook` - Storybook configuration
- Configuration files:
  - `next.config.ts` - Next.js configuration
  - `vitest.config.ts` - Unit test configuration
  - `vitest.integration.config.ts` - Integration test configuration
  - `tailwind.config.ts` - TailwindCSS configuration