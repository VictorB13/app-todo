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
- CD: ArgoCD (GitOps)