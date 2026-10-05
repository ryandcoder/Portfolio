# My Portfolio Website with an AI Assistant

Hi, I'm **Kim Ryan Nabo**, a Computer Science graduate looking for entry-level roles in web development, data analytics, IT support, and network support. This is the story of how I built my portfolio website and the AI assistant that answers visitors' questions about me.

**Live site:** `https://ryandcoder.vercel.app` 

## What I wanted to build

I wanted a portfolio that was simple to read but did more than list my resume. My goals were:

- A clean, minimalist black-and-white design that works on phones and desktops
- Clear sections for my experience, projects, education, and certifications
- An AI assistant that lets recruiters ask quick questions, like "What projects has he built?", and get short, accurate answers

## Tech stack and why I chose it

| Part | What I used | Why |
|---|---|---|
| Frontend | HTML, Tailwind CSS, vanilla JavaScript | Fast to build, no build step, easy to host |
| Backend | Python and FastAPI | Simple to write, and I wanted to practice building a REST API |
| AI | Google Gemini (`google-genai`) | Free tier to start, and easy to connect from Python |
| Hosting | Vercel (frontend), Render (backend) | Both deploy straight from GitHub |

I split the project into a frontend and a backend on purpose. The API key must stay secret, so the browser never talks to Gemini directly. It talks to my backend, and my backend talks to Gemini.

```
Visitor's browser (Vercel)
        │  POST /api/chat  { message, history }
        ▼
FastAPI backend (Render)
        │  system prompt + my background + chat history
        ▼
Google Gemini API
```

## How I built it

### 1. The portfolio page
I started with the design before any code. I picked black and white only, one typeface, and lots of white space. I built the page in sections: hero, about, experience, projects, education, certifications, and contact. I added dark mode that follows the visitor's system setting and remembers their choice, and I made sure everything works on small screens.

### 2. The backend
I wrote a FastAPI app with one route, `POST /api/chat`. It receives the visitor's message and recent chat history, then sends them to Gemini with a system prompt. I enabled CORS so only my own website can call the API, and I added a rate limit and input length limits so nobody can abuse it.

### 3. Teaching the assistant about me
I put my resume details into `backend/profile.md`. The system prompt tells the assistant to answer only from that file, to say so when it doesn't know something, and to stay on topic. This keeps it from inventing projects or skills I don't have.

### 4. The chat widget
I built a floating chat button in the bottom-right corner that opens a panel with three quick-question chips. I made the replies easy to read by telling the assistant to write short paragraphs and small bullet lists, and by making the page show them that way instead of one big block of text.

### 5. Deploying
I pushed the code to GitHub, deployed the backend to Render, then deployed the frontend to Vercel. Last, I set the backend's `ALLOWED_ORIGINS` to my Vercel address so the two could talk.

## Problems I ran into and how I fixed them

Getting it working took more debugging than I expected. These are the main issues:

- **The chat box wouldn't close.** My panel's `hidden` setting was being overridden by a layout class. I fixed it with a rule that makes hidden elements truly hidden, and moved the panel's sizing into plain CSS so it fits small screens.
- **"Assistant is unavailable."** I added a `DEBUG` setting to show the real Gemini error in the chat. That showed me the cause.
- **Model not found (404).** The model I first chose was closed to new accounts. I updated to a current model, and I made the model name a setting so I can change it without editing code.
- **High demand (503).** The model was briefly overloaded. I added automatic retries and backup models.
- **Quota exceeded (429).** My testing used up the free daily limit. I added a cache so repeated questions, like the suggestion chips, cost no quota.
- **CORS errors on Vercel.** The allowed address on the backend has to match my site address exactly, including `https` and no trailing slash.

## What I learned

- How a frontend and a backend communicate, and why API keys must stay on the server
- How CORS works and why the exact address matters
- Environment variables and keeping secrets out of GitHub
- Deploying from GitHub to two different platforms
- Handling real-world API problems: retries, fallbacks, caching, and rate limits
- Writing instructions for an AI so its answers are short and accurate

## Project structure

```
portfolio-ai/
├── backend/
│   ├── main.py            FastAPI app and POST /api/chat
│   ├── profile.md         My background, the assistant's only source
│   ├── requirements.txt   Python dependencies
│   └── Procfile           Start command (Railway)
├── frontend/
│   └── index.html         Portfolio page and chat widget
├── .gitignore             Keeps .env out of Git
└── README.md
```

## Run it yourself

You need Python 3.10+, Git, and a Gemini API key from https://aistudio.google.com/apikey

**Backend**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # Windows: copy .env.example .env
```
Add your key to `.env`, then run:
```bash
uvicorn main:app --reload --port 8000
```

**Frontend** (in a second terminal)
```bash
cd frontend
python -m http.server 5500
```
Open http://localhost:5500. Make sure `API_URL` near the bottom of `index.html` is `http://localhost:8000`.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Your Gemini API key. Never commit it |
| `GEMINI_MODEL` | No | Main model. Default: `gemini-3.8-flash` |
| `GEMINI_FALLBACK_MODELS` | No | Backup models, comma-separated |
| `GEMINI_THINKING_LEVEL` | No | `low`, `medium`, or `high` |
| `OWNER_NAME` | No | Name used in the assistant's prompt |
| `ALLOWED_ORIGINS` | Yes (production) | Your frontend address, `https://` and no trailing slash |
| `RATE_LIMIT_PER_MIN` | No | Messages per visitor per minute. Default: `15` |
| `DEBUG` | No | `true` shows real errors in the chat. Keep `false` in production |

Model names change often. Check https://ai.google.dev/gemini-api/docs/models for current ones.

## Deploy

1. Push the project to GitHub and confirm `.env` is not in the repo.
2. **Render:** New Web Service, root directory `backend`, build command `pip install -r requirements.txt`, start command `uvicorn main:app --host 0.0.0.0 --port $PORT`, then add the environment variables.
3. In `frontend/index.html`, set `API_URL` to the Render address, then commit and push.
4. **Vercel:** import the repo, set the root directory to `frontend`, and deploy.
5. Set `ALLOWED_ORIGINS` on Render to the Vercel address and redeploy.

Both platforms redeploy automatically each time I push to GitHub.

## What I'd improve next

- Link each project card to a live demo or its GitHub repository
- Add a contact form
- Build Tailwind properly instead of loading it from the CDN
- Store the rate limit and cache in a database so they survive server restarts

## Contact

I'm open to entry-level roles in data analytics, IT support, technical support, and network support.

- Email: nabokimryan@gmail.com
- LinkedIn: https://www.linkedin.com/in/kim-ryan-nabo
