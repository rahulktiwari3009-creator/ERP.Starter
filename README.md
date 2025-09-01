ERP Starter (Frontend + Backend + Supabase Schema)
=================================================

What you get:
- apps/frontend  -> React + Vite minimal GRN UI
- apps/backend   -> Node.js + Express API with GRN endpoints
- schema/schema.sql -> Supabase/Postgres schema to run in Supabase SQL editor
- .env.example files for frontend/backend

Quick steps to run locally:
1. Create a Supabase project (free) and run `schema/schema.sql` in SQL editor.
2. Copy Supabase connection URL to `apps/backend/.env` as DATABASE_URL
3. Start backend:
   cd apps/backend
   npm install
   npm run dev
4. Start frontend:
   cd apps/frontend
   npm install
   npm run dev
   Open http://localhost:5173

Quick steps to deploy (free):
- Backend: Render.com (new web service) or Railway; set `DATABASE_URL` env var.
- Frontend: Vercel.com import the frontend folder; set `VITE_API_URL` env var to backend URL.
- Supabase: Create project and run `schema/schema.sql`.

If you want, I can now create a ZIP file and provide a download link so you can upload it to GitHub or extract and deploy directly.
