# ADR 01: Add Unit Testing in Project

## Context

As the project grows, maintaining it without automated tests becomes increasingly difficult and time-consuming. Therefore, it's necessary to implement automated testing.

It is especially important to:

- Catch bugs early in the development process.
- Provide a safety net for code refactoring and future changes.
- Improve overall code quality and maintainability.

## Decision

We will implement unit testing in the Next.js project using Jest as the testing framework and React Testing Library for testing React components.

The setup will involve:

- Configuring Jest to work with Next.js
- Integrating React Testing Library for rendering components and simulating user interactions in a way that resembles how users interact with the application.

## Rationale

Jest and React Testing Library are good choices because:

- Jest is a widely adopted JavaScript testing framework, known for its simplicity, speed, and comprehensive feature set (mocking, code coverage, snapshot testing). It has strong community support and integrates well with Next.js.
- React Testing Library encourages writing tests that focus on user behavior rather than implementation details, leading to more resilient and maintainable tests. It aligns well with React best practices.
- Both tools are industry standards and have extensive documentation and community resources available.

## Status

Proposed

## Consequences

**Positive**

- Improved code quality and reliability by catching bugs at the unit level.
- Faster feedback loop for developers, as tests can be run locally before pushing code.
- Increased confidence when refactoring or adding new features.
- Better documentation of component behavior through tests.

**Negative**

- Requires initial time investment to set up the testing environment and write the first set of tests.
- Developers will need to spend time writing and maintaining tests for new and existing code.
- There might be a learning curve for team members not familiar with Jest or React Testing Library.
