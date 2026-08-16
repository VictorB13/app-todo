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
- **CI:** tests → Trivy (code) → build/push images → Trivy (images)
- **CD:** on push to `main`, update image tags in `infra-gitops` (`values-prod.yaml`) → ArgoCD syncs the cluster
- **Rollback:** manual workflow to set tags back to a previous git SHA

### Secrets (app-todo)

| Secret | Used by |
|---|---|
| `DOCKERHUB_USERNAME` / `DOCKERHUB_PASSWORD` | CI image push |
| `GITOPS_TOKEN` | CD + Rollback (write to `infra-gitops`) |

### Manual jobs (Actions UI)

| Workflow | Purpose |
|---|---|
| **Rollback** | Set backend/frontend tags in `infra-gitops` to a previous CI git SHA |
