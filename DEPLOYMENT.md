# 🚀 Swerrv Deployment Guide

This guide covers deploying the Swerrv e-commerce app using **Docker locally** and to the cloud using **Railway** (backend + database) + **Vercel** (frontend).

---

## 📦 Option 1: Run Locally with Docker

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Steps

```bash
# 1. Navigate to the project root
cd c:\Users\User\Desktop\swervbackend

# 2. The .env file is already created with your credentials.
#    For a fresh setup, copy .env.example to .env and fill in your values:
#    copy .env.example .env

# 3. Build and start all containers
docker-compose up --build -d

# 4. Check that everything is running
docker-compose ps

# 5. View logs if needed
docker-compose logs -f backend
docker-compose logs -f frontend
```

Your app will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost/swagger-ui/

### Useful Docker Commands
```bash
# Stop all services
docker-compose down

# Stop and remove all data (including database)
docker-compose down -v

# Rebuild a single service
docker-compose up --build backend -d

# View real-time logs
docker-compose logs -f
```

---

## ☁️ Option 2: Deploy to Railway (Backend) + Vercel (Frontend)

### Part A: Deploy the Database + Backend on Railway

#### 1. Create a Railway Account
- Go to [railway.app](https://railway.app) and sign up (GitHub login recommended)

#### 2. Create a New Project
- Click **"New Project"** → **"Deploy from GitHub repo"**
- Connect your GitHub account and select the **swerrv backend repo**
- If your code is not on GitHub yet, push it first:
  ```bash
  cd c:\Users\User\Desktop\swervbackend\swerrv
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/<your-username>/swerrv-backend.git
  git branch -M main
  git push -u origin main
  ```

#### 3. Add a MySQL Database
- In your Railway project, click **"+ New"** → **"Database"** → **"MySQL"**
- Railway will provision a MySQL instance and give you connection details

#### 4. Configure Backend Environment Variables
- Click on your backend service → **"Variables"** tab
- Add all of these variables (get the DB values from the MySQL service's connection tab):

| Variable | Value |
|---|---|
| `DB_HOST` | *(from Railway MySQL → `MYSQLHOST`)* |
| `DB_PORT` | *(from Railway MySQL → `MYSQLPORT`)* |
| `DB_NAME` | *(from Railway MySQL → `MYSQLDATABASE`)* |
| `DB_USERNAME` | *(from Railway MySQL → `MYSQLUSER`)* |
| `DB_PASSWORD` | *(from Railway MySQL → `MYSQLPASSWORD`)* |
| `JWT_SECRET` | `5f7a2c1d8e3b9f4a6c2e1d0b7a5c3e9f8d2a4b6c8e1f3a5b7d9e2c4f6a8b0c2` |
| `STRIPE_API_KEY` | `sk_test_51RvGIW...` *(your full key)* |
| `STRIPE_WEBHOOK_SECRET` | `whsec_placeholder` |
| `GOOGLE_CLIENT_ID` | `623289467260-...` *(your full ID)* |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` *(your full secret)* |
| `APP_CORS_ORIGINS` | `https://your-vercel-domain.vercel.app` *(update after Vercel deploy)* |
| `SPRING_PROFILES_ACTIVE` | `docker` |

#### 5. Configure Build Settings
- In Railway, go to your backend service → **"Settings"**
- Set **Root Directory**: `/` (or the path to your `swerrv` folder if in a monorepo)
- Set **Build Command**: Railway will auto-detect the Dockerfile
- The backend will deploy automatically on each push

#### 6. Get Your Backend URL
- Railway gives you a public URL like `https://swerrv-backend-production-xxxx.up.railway.app`
- Note this URL — you'll need it for the frontend

---

### Part B: Deploy the Frontend on Vercel

#### 1. Create a Vercel Account
- Go to [vercel.com](https://vercel.com) and sign up (GitHub login recommended)

#### 2. Push the Frontend to GitHub
```bash
cd c:\Users\User\Desktop\swervbackend\swerrvfrontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/swerrv-frontend.git
git branch -M main
git push -u origin main
```

#### 3. Import to Vercel
- In Vercel dashboard, click **"Add New" → "Project"**
- Import from your GitHub repo
- Vercel auto-detects it as a Vite project

#### 4. Configure Environment Variables
- In Vercel → **Settings** → **Environment Variables**, add:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://swerrv-backend-production-xxxx.up.railway.app/api` |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_test_51RvGIW...` *(your full public key)* |

#### 5. Configure Rewrites (IMPORTANT)
Create a `vercel.json` file in the `swerrvfrontend` root:
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://YOUR-RAILWAY-BACKEND-URL.up.railway.app/api/:path*" }
  ]
}
```

#### 6. Deploy
- Click **"Deploy"** — Vercel will build and deploy your frontend
- Your site will be live at `https://your-project.vercel.app`

#### 7. Update Backend CORS
- Go back to Railway → backend service → **Variables**
- Update `APP_CORS_ORIGINS` to include your Vercel domain:
  ```
  https://your-project.vercel.app,https://swerrv.vercel.app
  ```
- Railway will auto-redeploy with the updated CORS

---

## 🔐 Security Checklist Before Going Live

- [ ] Change `JWT_SECRET` to a new, cryptographically random value
- [ ] Change `DB_PASSWORD` to a strong password
- [ ] Replace Stripe **test keys** with **live keys** when ready for real payments
- [ ] Update Google OAuth redirect URIs in the Google Cloud Console
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` (not `update`) in production
