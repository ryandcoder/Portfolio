# Portfolio + AI Assistant (FastAPI + Gemini + Vercel)

```
portfolio-ai/
├── backend/            -> deploy to Render or Railway
│   ├── main.py         FastAPI app, POST /api/chat
│   ├── profile.md      YOUR background (the only source the AI uses)
│   ├── requirements.txt
│   ├── .env.example    copy to .env locally
│   └── Procfile        start command for Railway
├── frontend/           -> deploy to Vercel
│   └── index.html      Tailwind UI + chat widget
└── .gitignore          keeps .env out of GitHub
```

## 1. Get a Gemini API key
1. Go to https://aistudio.google.com/apikey and sign in with a Google account.
2. Click **Create API key**, then copy it. Treat it like a password.
3. Check https://ai.google.dev/gemini-api/docs/models for the current model names. The default is `gemini-2.5-flash`; change `GEMINI_MODEL` if you want another.

## 2. Run it on your computer
Requires Python 3.10+.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # Windows: copy .env.example .env
```
Open `.env` and set `GEMINI_API_KEY` and `OWNER_NAME`. Then edit **`profile.md`** with your real details (skills, projects, contact). Start the API:

```bash
uvicorn main:app --reload --port 8000
```
Check http://localhost:8000 shows `{"status":"ok"}`.

Serve the frontend (new terminal):
```bash
cd frontend
python -m http.server 5500
```
Open http://localhost:5500. `API_URL` in `index.html` already points to `http://localhost:8000`, and `.env` already allows `http://localhost:5500`.

(In VS Code you can use the Live Server extension instead; it uses port 5500 too.)

## 3. Put the project on GitHub
```bash
cd portfolio-ai
git init && git add . && git commit -m "Initial commit"
```
Create an empty repo on github.com, then run the `git remote add origin ...` and `git push -u origin main` commands GitHub shows you. Confirm `.env` is NOT in the repo (only `.env.example`).

## 4. Deploy the backend to Render
1. https://render.com -> **New +** -> **Web Service** -> connect your GitHub repo.
2. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance type:** Free is fine for a portfolio (it sleeps after inactivity, so the first reply can take about a minute; the chat shows a "waking up" message).
3. Under **Environment**, add:
   - `GEMINI_API_KEY` = your key
   - `OWNER_NAME` = your name
   - `ALLOWED_ORIGINS` = `https://your-portfolio.vercel.app` (you can update this after step 5)
   - `PYTHON_VERSION` = `3.12.3` (optional, pins the Python version)
4. Deploy. Copy your URL, e.g. `https://portfolio-ai-xxxx.onrender.com`, and check it shows `{"status":"ok"}`.

**Railway alternative:** New Project -> Deploy from GitHub -> set **Root Directory** to `backend` -> add the same variables -> Settings -> Networking -> **Generate Domain**. The included `Procfile` supplies the start command.

## 5. Deploy the frontend to Vercel
1. In `frontend/index.html` change:
   ```js
   const API_URL = "https://portfolio-ai-xxxx.onrender.com";
   ```
   Commit and push.
2. https://vercel.com -> **Add New... -> Project** -> import the repo.
3. Set **Root Directory** to `frontend`, **Framework Preset** to `Other`, leave build settings empty. Deploy.
4. Copy your Vercel URL (e.g. `https://your-portfolio.vercel.app`).

## 6. Connect them (CORS)
Back on Render (or Railway) set `ALLOWED_ORIGINS` to your exact Vercel URL with no trailing slash. If you add a custom domain, list both separated by commas:
`https://your-portfolio.vercel.app,https://www.yourname.com`
Redeploy the backend, then test the chat on your live site.

## Customizing
- **Your info:** edit `backend/profile.md`, commit, push. Render redeploys automatically.
- **Personality:** edit `SYSTEM_PROMPT` in `main.py`.
- **Chat chips:** edit `SUGGESTIONS` in `index.html`.
- **Projects and text:** edit `PROJECTS` and the HTML sections in `index.html`.
- **Spam protection:** `RATE_LIMIT_PER_MIN` limits messages per visitor. Set a spending cap on your Google AI Studio project too.

## Troubleshooting
| Symptom | Fix |
|---|---|
| Browser console shows a CORS error | `ALLOWED_ORIGINS` must exactly match the site URL (https, no trailing slash). Redeploy after changing. |
| "I can't reach the assistant" | Wrong `API_URL`, or the backend is asleep or crashed. Open the backend URL directly and check Render logs. |
| Backend crashes at start with "GEMINI_API_KEY is not set" | Add the variable in the Render/Railway Environment tab. |
| 502 "assistant is unavailable" | Check backend logs: invalid key, wrong model name, or quota exceeded. |
| Answers are vague | Add more detail to `profile.md`. The AI only knows what is written there. |

## Production notes
- Tailwind is loaded from its CDN script for simplicity. For heavier traffic, switch to the Tailwind CLI build.
- The rate limiter is in memory (resets on restart and is per instance). Use Redis if you scale to multiple instances.
- Never put the Gemini key in `index.html`. It belongs only on the backend.
