# JalSanchaeeNavachar

A React and Vite irrigation-planning application with a Node.js API, Firebase/Firestore integration, and Open-Meteo weather data.

## Prerequisites

- Node.js and npm
- Access to the Firebase project configured by the application

## Install dependencies

Run from the repository root:

```bash
npm install
```

## Run locally

Start the frontend in one terminal:

```bash
npm run dev
```

Start the API in a second terminal:

```bash
npm run server
```

The backend listens on port `5000` by default. The frontend irrigation service currently calls `http://localhost:5000/api`, so keep the default port unless the frontend API URL is updated as well.

Useful backend endpoints:

- `GET /api/health` — basic API health response
- `POST /api/generate-schedule` — generate and save an irrigation schedule

## Quality checks

```bash
npm test
npm run lint
npm run build
```

After a successful build, preview the production bundle with:

```bash
npm run preview
```

## Firebase and deployment notes

The current Firebase project configuration is defined in the frontend and backend source. Verify that it points to the intended Firebase project before running or deploying the application. Keep Firestore security rules restrictive and enforce user ownership on data operations; a Firebase web API key is project configuration, not an authorization mechanism.

Weather data is requested from Open-Meteo by the frontend weather service.
