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

## Start project locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
- `/public` - Static assets
- Configuration files:
  - `next.config.ts` - Next.js configuration
  - `vitest.config.ts` - Unit test configuration
  - `vitest.integration.config.ts` - Integration test configuration
  - `tailwind.config.ts` - TailwindCSS configuration