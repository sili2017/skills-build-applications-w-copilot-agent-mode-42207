# OctoFit Backend API

This backend runs on port 8000.

## API Base URL

The API base URL is environment-aware:

- When `CODESPACE_NAME` is set:
  - `https://$CODESPACE_NAME-8000.app.github.dev`
- When `CODESPACE_NAME` is not set:
  - `http://localhost:8000`

The API exposes these routes:

- `/api/users/`
- `/api/teams/`
- `/api/activities/`
- `/api/leaderboard/`
- `/api/workouts/`

## Quick Verify

```bash
curl -s http://localhost:8000/api/users/
curl -s http://localhost:8000/api/activities/
```
