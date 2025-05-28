# ADR 001: Implementing CI/CD with GitHub Actions

## Context

Right now, the project needs manual testing and deployment. This slows down development, increases chances of human mistakes, and makes it harder to keep good product quality. To make the process more portable, reliable, and stable, we need automation.

It is especially important to:

- Run tests automatically after each code change;
- Automatically deploy a stable version after merging;
- Not depend on the developer's local setup.

## Decision

We will set up a CI/CD pipeline using GitHub Actions, which will:

- CI (Continuous Integration): run tests and linter on every pull request;
- CD (Continuous Deployment): automatically build and deploy after merging to the main branch.

The workflow will be split into two files:

- `ci.yml` — for code checks (linting, unit/integration tests);
- `deploy.yml` — for deploying to production after a merge.

## Rationale

GitHub Actions is a good choice because:

- It works well with GitHub;
- It has simple YAML syntax and is easy to start;
- No need for a separate CI/CD server;
- Large community and many ready-made templates (for Vercel, Firebase, Docker, etc.).

## Status

Proposed

## Consequences

**Positive:**

- Automated testing finds problems before merging;
- Automatic deployment updates production quickly without manual steps;
- Fewer mistakes caused by people;
- Portability: works the same in any environment;
- Easier for new team members to join.

**Negative:**

- Needs time to set up and test the pipelines;
- Depends on GitHub as a CI/CD platform. 
