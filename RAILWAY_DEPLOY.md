# Deploy Railway

## Backend
1. New Project -> Deploy from GitHub
2. Root directory:
backend/FleetControlRH.Api

### Variables
ASPNETCORE_ENVIRONMENT=Production
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT__Key=CHANGE_THIS_SECRET_KEY
AllowedOrigins=https://your-frontend.up.railway.app

## Frontend
1. New Project -> Deploy from GitHub
2. Root directory:
frontend/fleet-control-rh

### Variables
VITE_API_URL=https://your-api.up.railway.app/api

## Build commands

Backend:
dotnet restore && dotnet publish -c Release

Frontend:
npm install && npm run build
