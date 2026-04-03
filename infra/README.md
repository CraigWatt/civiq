# infra

Infrastructure and deployment assets for `civiq`.

This folder follows the same numbered layout style as `vfo` so environments and
their components stay predictable as the project grows.

## Proposed layout

- `infra/envs/dev/01-bootstrap` - account/bootstrap setup
- `infra/envs/dev/02-network` - VPC, subnets, security boundaries
- `infra/envs/dev/03-data` - database, queues, storage
- `infra/envs/dev/04-services` - app-facing services and APIs
- `infra/envs/dev/05-observability` - logs, alarms, dashboards
- `infra/modules` - reusable infrastructure modules
- `infra/docs` - architecture notes and deployment guidance

