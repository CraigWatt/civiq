# civiq

Monorepo for the `civiq` iOS and Android app plus its backend.

## Structure

- `services/api` - Node.js + TypeScript backend
- `platform/contracts` - Shared types and utilities
- `infra` - AWS CDK infrastructure and deployment notes
- `tests/e2e` - cross-cutting end-to-end tests

## Goals

- Track official congressional and House trade disclosures
- Notify users when a matching trade appears
- Let users choose an amount of free cash to allocate
- Keep the user in control of execution
