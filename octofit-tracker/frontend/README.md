# Octofit Tracker Frontend

React 19 + Vite presentation tier for Octofit Tracker.

## Environment variable

Define `VITE_CODESPACE_NAME` for Codespaces API access. For example, create `.env.local` in this folder:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

With `VITE_CODESPACE_NAME` set, the app calls:

```text
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

If `VITE_CODESPACE_NAME` is not set, the app safely falls back to:

```text
http://localhost:8000/api/[component]/
```

This prevents invalid URLs such as `https://undefined-8000.app.github.dev/...`.

## Run

```bash
npm install --prefix /workspaces/skills-build-applications-w-copilot-agent-mode-42207/octofit-tracker/frontend
npm run dev --prefix /workspaces/skills-build-applications-w-copilot-agent-mode-42207/octofit-tracker/frontend
```
