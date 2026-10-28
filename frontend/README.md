# Solar panel inventory frontend

The React/Vite client is served by Nginx in Docker. Nginx forwards `/Add`,
`/DisplayAll`, `/Update`, and `/Delete` requests to the `backend` Compose
service, so the browser uses the same origin for the UI and API.

## Local development

1. Start the API from the repository root with `docker compose up --build db eureka backend`.
2. Run `npm ci` in `frontend`.
3. Run `npm run dev` in `frontend` and open the URL printed by Vite.

The Vite development proxy targets `http://localhost:8081` by default. Override
it with `VITE_DEV_API_TARGET` when the API is hosted elsewhere.

## Production container

The root `docker-compose.yml` builds this directory using its Dockerfile and
serves the static production build on port 5173. For API calls, Nginx proxies
to the backend service by its Compose DNS name.
