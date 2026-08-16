# app-todo

Todo application with user authentication.

## Stack
- Backend: FastAPI + PostgreSQL
- Frontend: HTML/JS + Nginx

## Run locally
docker compose up --build

- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs

## CI/CD
- CI: GitHub Actions (tests, Trivy scan, Docker Hub push)
- CD: ArgoCD (GitOps via `infra-gitops`)

### Manual jobs (Actions UI)

| Workflow | Purpose |
|---|---|
| **Rollback** | Set backend/frontend image tags in `infra-gitops` to a previous CI git SHA; ArgoCD syncs |

**Rollback secrets** (on `app-todo`):
- `DOCKERHUB_USERNAME` — same as CI
- `GITOPS_TOKEN` — GitHub PAT with **contents: write** on `VictorB13/infra-gitops`

**How to roll back:** Actions → Rollback → Run workflow → paste the image tag (full `github.sha` from a previous green CI build).
