# 🚀 AI-Powered Startup MVP Builder

A full-stack web application that transforms startup business ideas into structured MVP plans using **Google Gemini AI**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| AI | Google Gemini 1.5 Flash |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

## 📁 Project Structure

```
AI-Startup-MVP-Builder/
├── frontend/           # React + Vite app (port 5173)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route-level page components
│   │   ├── layouts/    # Layout shells (sidebar + header)
│   │   ├── services/   # API client (Axios)
│   │   ├── hooks/      # Custom React hooks
│   │   └── styles/     # Global CSS
│   └── package.json
│
├── backend/            # Express API server (port 5000)
│   ├── src/
│   │   ├── config/     # DB connection
│   │   ├── controllers/# Route handlers
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # Express routers
│   │   ├── middleware/ # Error handling, validation
│   │   ├── services/   # Gemini AI service
│   │   └── utils/      # Response helpers
│   ├── server.js       # Entry point
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## ⚡ Prerequisites

- **Node.js** v18 or higher: https://nodejs.org
- **MongoDB Atlas** account (free tier): https://cloud.mongodb.com
- **Google Gemini API Key**: https://aistudio.google.com/app/apikey
- **Git**: https://git-scm.com

---

## 🚀 Installation & Setup

### Step 1 — Clone or download the project

```bash
git clone <your-repo-url> AI-Startup-MVP-Builder
cd AI-Startup-MVP-Builder
```

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Create your environment file:
```bash
copy .env.example .env
```

Edit `backend/.env` with your actual values:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ai-startup-mvp?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3 — Frontend Setup

```bash
cd ../frontend
npm install
```

### Step 4 — Get a Gemini API Key

1. Visit https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and paste it into `backend/.env` as `GEMINI_API_KEY`

### Step 5 — Set up MongoDB Atlas

1. Create a free account at https://cloud.mongodb.com
2. Create a new cluster (free tier M0 is sufficient)
3. Click "Connect" → "Connect your application"
4. Copy the connection string and paste into `backend/.env` as `MONGO_URI`
5. Replace `<password>` with your database user password
6. In "Network Access", add IP `0.0.0.0/0` (allow all, for development)

---

## ▶️ Running the Application

### Terminal 1 — Start the Backend

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### Terminal 2 — Start the Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

Open your browser to: **http://localhost:5173**

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Dashboard statistics |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get project by ID |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/generate-plan` | Generate MVP plan via AI |
| GET | `/api/projects/:id/plan` | Get saved MVP plan |
| POST | `/api/ai/analyze` | Quick AI analysis (no save) |

---

## 🧪 Testing

### Backend health check
```bash
curl http://localhost:5000/
```

### Create a test project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Test App\",\"businessIdea\":\"A food delivery app for college campuses\",\"problem\":\"Students struggle to find quick meal options\",\"targetAudience\":\"College students\",\"industry\":\"Food & Beverage\",\"timeline\":\"3-6 months\"}"
```

### Generate MVP plan
```bash
curl -X POST http://localhost:5000/api/projects/<project_id>/generate-plan
```

---

## 📸 Pages

- **Dashboard** — Live stats, recent projects, quick actions
- **Projects** — Browse, search, and filter all projects  
- **Create Project** — Multi-field form with validation
- **Project Details** — Full project view with plan CTA
- **MVP Plan** — AI-generated plan with tabs (Features, Roadmap, Tech Stack, Risks, Metrics)
- **Edit Project** — Update project details

---

## 🔒 Security Notes

- Gemini API key is **never exposed to the frontend** — all AI calls go through the backend
- `.env` file is git-ignored
- CORS is configured to allow only the frontend URL
- Rate limiting applied to AI endpoints (10 requests per 15 minutes)
- Helmet.js adds security headers
- Input validation on all endpoints

---

## 🚢 Deployment

### Backend (Railway / Render / Heroku)
1. Set environment variables in the platform dashboard
2. Deploy the `backend/` folder
3. Update `FRONTEND_URL` to your deployed frontend URL

### Frontend (Vercel / Netlify)
1. Set the backend URL in `vite.config.js` or via `VITE_API_URL` env var
2. Deploy the `frontend/` folder

---

## 📋 License

MIT License — Free to use for academic and personal projects.
