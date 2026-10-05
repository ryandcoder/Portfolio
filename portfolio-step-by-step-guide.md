# Portfolio + AI Assistant: Step-by-Step Guide

Follow the steps in order. Each step says what to do, how to check it worked, and roughly how long it takes. Total time: about 2 to 3 hours the first time.

**The big picture**

1. You set up accounts and install tools on your computer.
2. You get a Gemini API key.
3. You run everything on your own computer and test it.
4. You upload the code to GitHub.
5. You host the backend on Render, then the frontend on Vercel.
6. You connect the two and test the live site.

Do not skip ahead. Hosting comes last, after everything works locally.

---

## Part A: Prepare (30 to 45 minutes)

### Step 1. Create your free accounts
Sign up for these four, in this order. Use the same email for all of them.

- [ ] **GitHub**: github.com. Everything else connects to this, so make it first.
- [ ] **Google account** (for the Gemini key). Any Gmail works.
- [ ] **Render**: render.com. Click "Sign up with GitHub".
- [ ] **Vercel**: vercel.com. Click "Continue with GitHub".

*Check:* you can log in to all four.

### Step 2. Install the tools on your computer
You need three things. Download from the official sites.

- [ ] **Python 3.10 or newer**: python.org/downloads. On Windows, tick **"Add Python to PATH"** in the installer.
- [ ] **Git**: git-scm.com/downloads.
- [ ] **VS Code** (code editor): code.visualstudio.com.

*Check:* open a terminal (Windows: "Command Prompt" or PowerShell; Mac: "Terminal") and run:

```
python --version
git --version
```

Both should print a version number. On Mac, use `python3 --version` if `python` isn't found, and use `python3` everywhere this guide says `python`.

### Step 3. Get your Gemini API key
- [ ] Go to **aistudio.google.com/apikey** and sign in.
- [ ] Click **Create API key**.
- [ ] Copy the key and save it somewhere private for now (a password manager or a private note).

*Check:* you have a long string of letters and numbers. Never post it publicly or paste it into the HTML file.

---

## Part B: Set up the project on your computer (20 minutes)

### Step 4. Put the project in a folder
- [ ] Download the `portfolio-ai` folder I gave you and put it somewhere easy, such as `Documents/portfolio-ai`.
- [ ] Open VS Code, then **File > Open Folder** and choose `portfolio-ai`.

*Check:* in the left sidebar you see `backend`, `frontend`, `README.md`.

### Step 5. Install the backend's requirements
In VS Code, open a terminal (**Terminal > New Terminal**) and run these one at a time.

**Windows:**
```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

**Mac / Linux:**
```
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

*Check:* the install finishes without red errors, and your terminal line starts with `(.venv)`.

### Step 6. Add your key and your details
- [ ] In the `backend` folder, make a copy of `.env.example` and name the copy `.env`.
- [ ] Open `.env` and set:
  - `GEMINI_API_KEY=` your real key
  - `OWNER_NAME=` your name
  - leave `ALLOWED_ORIGINS` as it is for now
- [ ] Open `backend/profile.md` and replace every placeholder with your real background: skills, experience, projects, contact links. **This file is the only thing the AI knows about you**, so be specific.

*Check:* no "Your Name" or "[Company]" placeholders remain in `profile.md`.

---

## Part C: Test locally (20 minutes)

### Step 7. Start the backend
In the terminal (still inside `backend`, with `(.venv)` showing):

```
uvicorn main:app --reload --port 8000
```

- [ ] Open **http://localhost:8000** in your browser.

*Check:* you see `{"status":"ok"}`. If the terminal shows "GEMINI_API_KEY is not set", your `.env` file is in the wrong place or misnamed. Leave this terminal running.

### Step 8. Start the frontend
- [ ] Open a **second terminal** (click the `+` in the terminal panel) and run:

**Windows:**
```
cd frontend
python -m http.server 5500
```
**Mac / Linux:**
```
cd frontend
python3 -m http.server 5500
```

- [ ] Open **http://localhost:5500**.

*Check:* you see the portfolio. Click **Ask AI**, then click a suggestion chip. You should get an answer based on your `profile.md`.

If the chat says it can't reach the assistant, the backend terminal from Step 7 isn't running. If the browser console shows a CORS error, check that you opened the site at exactly `http://localhost:5500`.

### Step 9. Make the page yours
Edit `frontend/index.html` and refresh the browser after each change.

- [ ] Replace "Your Name", the hero sentence, the About text, and the email and social links.
- [ ] Edit the `PROJECTS` list near the bottom of the file.
- [ ] Optional: change the chat suggestion chips (`SUGGESTIONS`).

*Check:* the page looks right on your phone size too (in Chrome, press F12, then the phone icon).

---

## Part D: Upload to GitHub (15 minutes)

### Step 10. Push the code
- [ ] On github.com, click **New repository**, name it (e.g. `my-portfolio`), keep it empty (no README), click Create.
- [ ] In a terminal, from inside the `portfolio-ai` folder (not `backend`):

```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/my-portfolio.git
git push -u origin main
```

*Check:* refresh the GitHub page. You see `backend` and `frontend`. **Open the backend folder on GitHub and confirm there is NO `.env` file**, only `.env.example`. If `.env` is there, delete your key at Google AI Studio, make a new one, and ask me how to remove it from the repo.

---

## Part E: Go live (45 minutes)

Host the backend first, because the frontend needs its web address.

### Step 11. Deploy the backend on Render
- [ ] In Render: **New + > Web Service**, choose your GitHub repo.
- [ ] Fill in:
  - **Root Directory:** `backend`
  - **Runtime:** Python 3
  - **Build Command:** `pip install -r requirements.txt`
  - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
  - **Instance Type:** Free
- [ ] Under **Environment Variables**, add:
  - `GEMINI_API_KEY` = your key
  - `OWNER_NAME` = your name
  - `ALLOWED_ORIGINS` = `http://localhost:5500` (temporary; you will change it in Step 14)
- [ ] Click **Create Web Service** and wait for "Live" (3 to 5 minutes).
- [ ] Copy your Render address, which looks like `https://my-portfolio-xxxx.onrender.com`.

*Check:* opening that address shows `{"status":"ok"}`.

### Step 12. Point the frontend at your live backend
- [ ] In `frontend/index.html`, find this line near the bottom:
  ```js
  const API_URL = "http://localhost:8000";
  ```
  and change it to your Render address:
  ```js
  const API_URL = "https://my-portfolio-xxxx.onrender.com";
  ```
- [ ] Save, then in the terminal (inside `portfolio-ai`):
  ```
  git add .
  git commit -m "Set production API URL"
  git push
  ```

### Step 13. Deploy the frontend on Vercel
- [ ] In Vercel: **Add New > Project**, import your repo.
- [ ] Set **Root Directory** to `frontend`. Set **Framework Preset** to `Other`. Leave build settings empty.
- [ ] Click **Deploy**.
- [ ] Copy your Vercel address, e.g. `https://my-portfolio.vercel.app`.

*Check:* the site opens. The chat will not work yet. That is expected until the next step.

### Step 14. Connect them (the CORS step)
- [ ] Back in Render, open your service, then **Environment**.
- [ ] Change `ALLOWED_ORIGINS` to your exact Vercel address: `https://my-portfolio.vercel.app`
  - Use `https`, and **no slash at the end**.
  - If you will also use a custom domain, separate them with a comma, no spaces.
- [ ] Save. Render redeploys automatically.

### Step 15. Test the live site
- [ ] Open your Vercel address on your computer and on your phone.
- [ ] Open the chat and ask a question. The first answer may take up to a minute on the free plan because the server wakes up from sleep. After that it is fast.

---

## Final checklist

- [ ] Chat answers match what is in `profile.md`
- [ ] No placeholder text left on the site
- [ ] `.env` is not on GitHub
- [ ] Site works on mobile and in dark mode
- [ ] Links (email, LinkedIn, GitHub, projects) all go to the right place

**Optional next steps**
- Set a spending or quota limit for your key in Google AI Studio.
- Add a custom domain in Vercel (Settings > Domains), then add it to `ALLOWED_ORIGINS`.
- Keep the free Render server awake with a free uptime monitor that pings your backend address every 10 minutes.

## Quick fixes

| Problem | What to do |
|---|---|
| `python` not recognized | Reinstall Python and tick "Add to PATH", or use `python3` |
| Chat shows "can't reach the assistant" | Wrong `API_URL`, or the backend is asleep. Open the backend address and wait for `{"status":"ok"}` |
| CORS error in browser console | `ALLOWED_ORIGINS` doesn't exactly match your site address |
| Render build fails | Check Root Directory is `backend` and `requirements.txt` is in it |
| "Assistant is unavailable" (502) | Open Render **Logs**: usually a wrong key, wrong model name, or quota limit |
| Answers are vague or wrong | Add more detail to `profile.md`, push, and let Render redeploy |

**Updating later:** change a file, then run `git add .`, `git commit -m "update"`, `git push`. Both Render and Vercel redeploy automatically.
