# SS Herbal Storefront

This workspace is split into separate `frontend` and `backend` apps so the UI and API can grow independently.

## Structure

```text
st-herbal/
|- backend/
|  |- package.json
|  `- server.js
|- frontend/
|  |- package.json
|  |- vite.config.js
|  `- src/
|- shared/
|  `- homepageData.js
|- package.json
`- README.md
```

## Run locally

1. Install workspace dependencies from the project root:

   ```bash
   npm install
   ```

2. Start the backend API:

   ```bash
   npm run dev:backend
   ```

3. In another terminal, start the frontend:

   ```bash
   npm run dev:frontend
   ```

The Vite app runs on `http://localhost:5173` and proxies `/api/*` requests to the backend on `http://localhost:4000`.
