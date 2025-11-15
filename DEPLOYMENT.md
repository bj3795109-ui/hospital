Deployment guide
================

This repository can be deployed automatically via GitHub Actions: the Next.js client to Vercel, and the Node server to Render.

Prerequisites
-------------
- Push this repository to GitHub.
- Create accounts on Vercel and Render and connect them to your GitHub repository (recommended).
- Generate VAPID keys (you already ran `npx web-push generate-vapid-keys`).

Environment variables / GitHub secrets
------------------------------------
You must add the following GitHub repository secrets (Settings → Secrets → Actions) before the workflows will succeed:

- For Vercel deployment (client):
  - `VERCEL_TOKEN` — your Vercel personal token
  - `VERCEL_ORG_ID` — your Vercel organization id
  - `VERCEL_PROJECT_ID` — your Vercel project id

- For Render deployment (server):
  - `RENDER_API_KEY` — your Render API key
  - `RENDER_SERVICE_ID` — the service id of the Render service (you create in Render)

Server environment
------------------
On Render, create a new Web Service and point it to this repository's `/server` folder (or use the Dockerfile). Configure the following environment variables on Render:

- `MONGO_URI` — your MongoDB connection string (recommend using a managed DB).
- `JWT_SECRET` — a secure secret for signing JWTs.
- `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` — generated earlier.
- `VAPID_EMAIL` — contact email for VAPID.

Client configuration
--------------------
On Vercel, create a new project from the `client` folder. Set the environment variable:

- `NEXT_PUBLIC_AGORA_TOKEN_ENDPOINT` — the public URL of your server (e.g., `https://your-server.onrender.com`).

Manual deploy (quick)
---------------------
If you just want to deploy immediately without CI:

1. Vercel (client):
   - Install Vercel CLI: `npm i -g vercel`
   - From the repo root: `cd client && vercel --prod --confirm` and follow prompts. Use the project settings to set environment variables.

2. Render (server):
   - In Render dashboard create a new Web Service, connect to GitHub repo and set the publish directory to `server` (or use the Dockerfile). Provide environment variables in the Render service settings.

How CI works
------------
- On push to `main`, the `deploy-client-vercel.yml` workflow builds the client and calls the Vercel action to deploy the `client` folder.
- On push to `main`, the `deploy-server-render.yml` workflow triggers the Render deploy action which tells Render to deploy the server. You must create the Render service in the Render dashboard and provide its `service_id` as a secret.

Questions?
---------
If you want, I can:

- Create Render service automatically via Render API (needs Render API key), or
- Create Vercel project via Vercel CLI and output required `VERCEL_PROJECT_ID`/org id, or
- Wire the server to use a managed database and update the `.env.example`.
