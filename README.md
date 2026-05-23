# 🧠 Salary-Sense

> **A Dynamic Model Pool Driven Developer Salary Prediction & Career Intelligence System**
>
> Research published at **IEEE I5CPS-2026** · Vidyalankar Institute of Technology, Mumbai

---

## ✨ What is Salary-Sense?

Salary-Sense is a **production-grade AI SaaS platform** that predicts developer salaries using a pool of 11 machine learning models. Rather than relying on a single model, the system dynamically selects the best-performing regressor for each developer profile at runtime.

Every prediction is backed by:
- **SHAP / LIME explainability** — why the salary is what it is
- **Skill-gap analytics** — what you're missing and what it's worth
- **Career intelligence** — trajectory forecasting and market opportunity mapping
- **Recruiter dashboards** — compensation benchmarking and demand analytics

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Nginx (port 80)                  │
│                    Reverse Proxy / Router               │
└───────────────────┬────────────────┬───────────────────-┘
                    │                │
        ┌───────────▼──────┐   ┌─────▼──────────────┐
        │  Next.js 15      │   │  Node.js / Express  │
        │  Frontend        │   │  Backend API        │
        │  (port 3000)     │   │  (port 5000)        │
        └──────────────────┘   └─────────┬───────────┘
                                         │
                            ┌────────────▼───────────┐
                            │  FastAPI ML Service    │
                            │  (port 8000)           │
                            │  11 ML models trained  │
                            │  on startup            │
                            └────────────┬───────────┘
                                         │
                            ┌────────────▼───────────┐
                            │  MongoDB (port 27017)  │
                            │  Users, Predictions,   │
                            │  Logs                  │
                            └────────────────────────┘
```

---

## 🚀 Quick Start — Docker (Recommended)

### Prerequisites
- Docker ≥ 24.0
- Docker Compose ≥ 2.20
- 4 GB free RAM (ML training needs ~2 GB)

### 1. Clone and configure

```bash
git clone https://github.com/your-repo/salary-sense.git
cd salary-sense

# Copy and edit environment variables (optional — defaults work for local dev)
cp .env.example .env
```

### 2. Start everything

```bash
docker compose up --build
```

This single command:
1. Starts MongoDB
2. Builds and starts the FastAPI ML service — **automatically trains all 11 models** on the 18k-row Stack Overflow dataset
3. Builds and starts the Node.js backend
4. Builds and starts the Next.js frontend
5. Starts Nginx as reverse proxy

### 3. Open the app

| URL | Service |
|-----|---------|
| http://localhost | Main App |
| http://localhost/api/health | Backend Health |
| http://localhost:8000/health | ML Service Health |
| http://localhost:8000/docs | FastAPI Swagger UI |

> ⏱️ **First startup takes 3–5 minutes** because the ML service trains 11 models on ~18,000 rows. Subsequent starts use cached models.

---

## 🧩 Services Breakdown

### ML Service (`/ml-service`) — Python / FastAPI

The heart of the platform. On startup:

1. Loads the Stack Overflow Developer Survey dataset
2. Runs the full feature engineering pipeline (log transform, scaling, encoding)
3. Trains 11 regression models: Linear, Ridge, Lasso, ElasticNet, Random Forest, Extra Trees, Gradient Boosting, XGBoost, LightGBM, KNN, and a Stacking Ensemble
4. Selects the best model by validation RMSE
5. Saves all models + metadata to `/app/models/`
6. Serves predictions, SHAP explanations, and trend analytics via REST API

**Key endpoints:**
```
POST /predict           — Single best-model prediction
POST /predict/all-models — Compare all 11 models
POST /explain/shap      — SHAP feature contributions
GET  /model-pool/metrics — Pool performance metadata
GET  /trends/*          — Salary trend analytics
GET  /skill-gap/market-skills — Market demand data
```

### Backend (`/backend`) — Node.js / Express

API gateway with:
- JWT authentication + RBAC (developer / recruiter / admin roles)
- Rate limiting (200 req/15min)
- Helmet security headers
- MongoDB persistence for users and prediction logs
- Proxies ML requests to the FastAPI service

### Frontend (`/frontend`) — Next.js 15 / React / TypeScript

13 pages with full Framer Motion animations, Recharts dashboards, and Tailwind CSS:

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero with neural network animation, KPI cards |
| Predictor | `/predict` | 3-panel form → model pool result |
| Dashboard | `/dashboard` | Model performance, convergence charts |
| Analytics | `/analytics` | 6 salary trend charts |
| Skill Gap | `/skill-gap` | Gap analysis, roadmaps, salary boost |
| Career AI | `/career` | Trajectory forecast, trending skills |
| Recruiter | `/recruiter` | Benchmarking, role comparison |
| Admin | `/admin` | System health, logs |
| Login | `/login` | Auth with demo login |
| Research | `/research` | Architecture, methodology, references |
| About | `/about` | Research team cards |

---

## 🔬 ML Model Pool

| Model | Type | Typical R² |
|-------|------|-----------|
| Linear Regression | Linear | ~0.72 |
| Ridge Regression | Regularized | ~0.74 |
| Lasso Regression | Regularized | ~0.73 |
| ElasticNet | Regularized | ~0.73 |
| Random Forest | Ensemble | ~0.95 |
| Extra Trees | Ensemble | ~0.92 |
| **Gradient Boosting** | **Boosting** | **~0.96** ✅ |
| XGBoost | Boosting | ~0.94 |
| LightGBM | Boosting | ~0.93 |
| KNN | Instance | ~0.78 |
| Stacking Ensemble | Meta | ~0.95 |

**Dynamic selection rule:**  `f* = argmin(RMSE_j)` over validation set — per the research paper.

---

## 📊 Dataset

Source: [Stack Overflow Developer Survey 2023](https://survey.stackoverflow.co/)

- **18,000 rows** after cleaning
- **37 features** including experience, education, skills, region, work mode, org size
- **Target variable**: Annual salary (USD), log-transformed during training
- 70% train / 15% validation / 15% test split

---

## 🛠️ Local Development (without Docker)

### ML Service
```bash
cd ml-service
pip install -r requirements.txt
python train.py          # Train all models (run once)
uvicorn main:app --reload --port 8000
```

### Backend
```bash
cd backend
npm install
# Set MONGO_URI in .env (need running MongoDB)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Set NEXT_PUBLIC_API_URL=http://localhost:5000/api in .env.local
npm run dev
```

---

## 🔐 Authentication

**Demo login** (no account needed):
- Developer Demo → full predictor + analytics access
- Recruiter Demo → recruiter dashboard + benchmarking

**Register** with email/password for persistent history.

**Roles:** `developer` | `recruiter` | `admin`

---

## 📁 Project Structure

```
salary-sense/
├── docker-compose.yml
├── .env.example
├── nginx/
│   └── nginx.conf
├── ml-service/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── train.py           ← Model pool training
│   ├── main.py            ← FastAPI application
│   └── data/
│       └── dataset.csv    ← Stack Overflow survey data
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── config/db.js
│       ├── models/
│       ├── routes/
│       ├── middleware/auth.js
│       └── utils/
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    └── src/
        ├── app/            ← Next.js App Router pages
        ├── components/     ← Reusable UI components
        ├── lib/api.ts      ← Axios client
        └── store/auth.ts   ← Zustand auth state
```

---

## 🌐 Production Deployment

### Vercel (Frontend) + Railway/Render (Backend + ML)

1. Push to GitHub
2. Connect frontend to Vercel — set `NEXT_PUBLIC_API_URL` to your backend URL
3. Deploy backend to Railway — set all env vars from `.env.example`
4. Deploy ML service to Railway/Render — needs at least 1 GB RAM

### Full Docker on VPS

```bash
# On your server (Ubuntu 22.04+)
git clone <your-repo> && cd salary-sense
cp .env.example .env
# Edit .env with your domain, JWT secret, MongoDB URI
docker compose up -d --build
```

---

## 📖 Research Citation

```
Piyush Nimbalkar, Prachi Patil, Atharva Jadhav, Sarthak Chaudhari, Divya Surve,
"Salary Sense: A Model Pool Driven Developer Salary Prediction and Career Intelligence System",
International Conference on Computing, Communication, Control and Cyber-Physical Systems (I5CPS-2026),
979-8-3315-6154-3/26/$31.00 ©2026 IEEE
```

---

## 🏆 Research Team

| Name | Role | Email |
|------|------|-------|
| Piyush Nimbalkar | Lead Researcher & Full Stack AI Engineer | piyush.nimbalkar@vit.edu.in |
| Prachi Patil | ML Engineer & Researcher | prachi.patil23@vit.edu.in |
| Atharva Jadhav | ML Engineer & Researcher | atharva.jadhav23@vit.edu.in |
| Sarthak Chaudhari | ML Researcher & Data Engineer | sarthak.chaudhari23@vit.edu.in |
| Divya Surve | Research Advisor | divya.nimbalkar@vit.edu.in |

**Institution:** Department of Computer Engineering, Vidyalankar Institute of Technology, Mumbai, India

---

## 📜 License

MIT License — see [LICENSE](LICENSE).

> This project is built for research, educational, and demonstration purposes.
> Salary predictions are statistical estimates based on historical survey data.
