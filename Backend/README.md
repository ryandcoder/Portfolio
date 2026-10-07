# SupportIQ — IT Support Analytics Dashboard

A full-stack analytics dashboard that turns raw IT support ticket data into clear, defensible business insights.

SupportIQ is a **portfolio project built to demonstrate Data Analyst skills**: data cleaning, SQL, Python/Pandas, data visualization, and turning numbers into recommendations. The web application exists to present the analysis, not to be an enterprise product.

> **Data → Analysis → Visualization → Business Insights**

---

## Project Overview

SupportIQ loads a realistic synthetic dataset of ~5,000 IT support tickets into PostgreSQL, cleans and documents data-quality issues with Pandas, calculates support KPIs, and displays everything in a single filterable dashboard. The "Key Insights" and "Recommendations" sections are **generated from the data at runtime**. Nothing analytical is hardcoded.

The UI follows an **Editorial Analytics** theme: warm paper background, serif headlines, a deep teal accent, and an insight sentence above each chart. Light and dark modes are both supported.

## Objectives

The dashboard answers these questions:

- [ ] How many tickets were created?
- [ ] How many tickets were resolved?
- [ ] How many tickets are still open?
- [ ] What are the most common IT problems?
- [ ] Which categories take the longest to resolve?
- [ ] Which priority levels generate the most tickets?
- [ ] How long does it take to resolve tickets?
- [ ] How many tickets meet the SLA?
- [ ] Which technicians handle the most tickets?
- [ ] Are ticket volumes increasing or decreasing?
- [ ] Which departments generate the most tickets?
- [ ] What are the most important findings in the data?

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Recharts, React Router, Axios |
| Backend | Python, FastAPI, Pydantic, Pandas, NumPy, SQLAlchemy |
| Database | PostgreSQL |
| Environment | Docker, Docker Compose |
| Tooling | Git, GitHub |

```text
React Frontend  →  FastAPI  →  PostgreSQL
```

## Features

- [ ] Synthetic dataset generator with realistic relationships between fields
- [ ] Data-cleaning pipeline that documents every change it makes
- [ ] Data-quality report (total records, missing values, duplicates, invalid records)
- [ ] KPI cards: total, open, resolved, resolution rate, SLA compliance, average resolution time, average CSAT
- [ ] Charts: monthly volume, category, priority, status, resolution time by category, SLA compliance, department
- [ ] Technician performance table
- [ ] Filters: date range, category, priority, status, department, technician (with reset)
- [ ] Ticket table with search, sorting and server-side pagination
- [ ] Dynamically generated Key Insights
- [ ] Dynamically generated Recommendations
- [ ] CSV upload
- [ ] Export / reports
- [ ] Light and dark mode
- [ ] Automated tests
- [ ] One-command local setup with Docker Compose

## Project Structure

Tick a box when the file exists and works. `[x]` means done.

- [ ] `supportiq/`
  - [x] `README.md`
  - [x] `.gitignore`
  - [x] `.env.example`
  - [ ] `docker-compose.yml` (database service only for now; backend and frontend are added later)
  - [ ] `data/`
    - [x] `tickets.csv`
  - [ ] `scripts/`
    - [x] `generate_data.py`
  - [ ] `backend/`
    - [ ] `Dockerfile`
    - [x] `requirements.txt`
    - [ ] `app/`
      - [x] `__init__.py`
      - [ ] `main.py`
      - [x] `config.py`
      - [ ] `schemas.py`
      - [ ] `api/`
        - [x] `__init__.py`
        - [ ] `dashboard.py`
        - [ ] `tickets.py`
        - [ ] `insights.py`
        - [ ] `technicians.py`
        - [ ] `upload.py`
        - [ ] `reports.py`
      - [ ] `analytics/`
        - [x] `__init__.py`
        - [ ] `cleaning.py`
        - [ ] `kpis.py`
        - [ ] `insights.py`
        - [ ] `recommendations.py`
      - [x] `database/`
        - [x] `__init__.py`
        - [x] `connection.py`
        - [x] `models.py`
        - [x] `schema.sql`
        - [ ] `load_data.py`
        - [ ] `queries.py`
    - [ ] `tests/`
      - [ ] `test_cleaning.py`
      - [ ] `test_kpis.py`
      - [ ] `test_api.py`
  - [ ] `frontend/`
    - [ ] `Dockerfile`
    - [ ] `package.json`
    - [ ] `vite.config.ts`
    - [ ] `tailwind.config.js`
    - [ ] `index.html`
    - [ ] `src/`
      - [ ] `main.tsx`
      - [ ] `App.tsx`
      - [ ] `index.css` (theme colors, fonts)
      - [ ] `components/`
        - [ ] `Layout.tsx`
        - [ ] `ThemeToggle.tsx`
        - [ ] `KpiCard.tsx`
        - [ ] `FilterBar.tsx`
        - [ ] `InsightCard.tsx`
        - [ ] `RecommendationList.tsx`
        - [ ] `TechnicianTable.tsx`
        - [ ] `TicketTable.tsx`
        - [ ] `DataQualityPanel.tsx`
      - [ ] `charts/`
        - [ ] `VolumeLineChart.tsx`
        - [ ] `CategoryBarChart.tsx`
        - [ ] `PriorityChart.tsx`
        - [ ] `StatusDonut.tsx`
        - [ ] `ResolutionTimeChart.tsx`
        - [ ] `SlaChart.tsx`
        - [ ] `DepartmentChart.tsx`
      - [ ] `pages/`
        - [ ] `Dashboard.tsx`
        - [ ] `Upload.tsx`
      - [ ] `services/`
        - [ ] `api.ts`
      - [ ] `types/`
        - [ ] `index.ts`
  - [ ] `docs/`
    - [ ] `screenshots/`

## Data

The dataset is **synthetic**. It contains no real people or companies. It is created by `scripts/generate_data.py` (seeded, so the output is reproducible) and saved to `data/tickets.csv`.

**Fields:** `ticket_id`, `created_at`, `resolved_at`, `category`, `priority`, `status`, `department`, `technician`, `location`, `device_type`, `operating_system`, `resolution_type`, `customer_satisfaction`, `reopened`

**Realistic patterns built in (but never perfectly predictable):**

- Network, VPN and Cloud tickets take longer to resolve. Account Access, Email and Printer tickets are faster.
- Critical tickets are resolved fastest but have the tightest SLA.
- Older devices produce more Hardware tickets. Remote staff produce more VPN tickets.
- Volume grows slowly over time, with seasonality and weekday/business-hour peaks.
- One short VPN/Network outage creates a visible spike in March 2026.
- Some tickets are escalated to a vendor and take far longer. Some breach SLA. Some are reopened.
- Customer satisfaction falls as resolution time exceeds the SLA target, and falls further when a ticket is reopened.
- Recent tickets are more likely to still be open.

**Deliberate data-quality problems:** by default the generator injects a small number of errors (duplicates, missing values, impossible dates, invalid categories, priorities and satisfaction scores) so the cleaning pipeline has real work to do. The generator prints exactly how many it injected, so the cleaning report can be checked against it. Use `--clean` for an error-free file.

```bash
python scripts/generate_data.py                  # 5,000 rows with injected errors
python scripts/generate_data.py --clean          # no injected errors
python scripts/generate_data.py --rows 5000 --seed 42
```

## Database

PostgreSQL holds two tables and one view. `backend/app/database/schema.sql` is the source of truth.

| Object | Purpose |
|---|---|
| `tickets` | The cleaned ticket data. Constraints reject invalid priorities, statuses, satisfaction scores outside 1–5, and `resolved_at` earlier than `created_at`. |
| `ticket_metrics` (view) | Adds `resolution_time_hours`, `sla_target_hours` and `sla_status`, calculated from the base table and never stored. |
| `data_quality_reports` | One JSON cleaning report per data load, so the dashboard can show what was changed. |

Indexes exist on `created_at`, `category`, `priority`, `status`, `department` and `technician`, the columns used by the dashboard filters.

## Analytics

Derived values are **calculated, not stored**.

| Metric | Definition |
|---|---|
| Resolution time (hours) | `resolved_at − created_at` |
| SLA target (hours) | Critical = 2, High = 4, Medium = 8, Low = 24 |
| SLA status | **Within SLA** if resolution time ≤ target, otherwise **Breached** |
| Total tickets | Count of tickets after cleaning and filtering |
| Open tickets | Status is `Open` or `In Progress` |
| Resolved tickets | Status is `Resolved` or `Closed` |
| Resolution rate | Resolved tickets ÷ total tickets |
| SLA compliance | Resolved tickets within SLA ÷ resolved tickets |
| Average / median resolution time | Mean / median of resolution time for resolved tickets |
| Average CSAT | Mean of valid scores (1–5); tickets without a response are excluded |
| Reopen rate | Reopened tickets ÷ resolved tickets |

**Data cleaning** handles missing values, duplicate tickets, invalid dates, invalid categories, invalid priorities and invalid satisfaction scores. Every change is counted and reported. Nothing is modified silently.

**SQL and Pandas:** SQL handles database-level filtering and aggregation. Pandas handles cleaning, derived metrics, distributions, technician performance, and insight generation.

## Installation

**Requirements:** Docker and Docker Compose.

```bash
git clone <your-repo-url>
cd supportiq
cp .env.example .env     # then edit the password
docker compose up --build
```

Then open:

- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs

> Docker Compose is added in the final setup phase. Until then, only the dataset generator can be run (see below).

### Start only the database (Step 2)

```bash
cp .env.example .env            # then set POSTGRES_PASSWORD
docker compose up -d db
docker compose exec db psql -U supportiq -d supportiq -c "\dt"
```

The schema is applied automatically the first time the volume is created. To reset the database completely, run `docker compose down -v`.

### Run the dataset generator now (no Docker)

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install pandas numpy
python scripts/generate_data.py
```

## Build Progress

Built in this order. Each phase must work before the next one starts.

- [x] **Step 1:** Synthetic dataset (`scripts/generate_data.py`, `data/tickets.csv`)
- [x] **Step 2:** PostgreSQL schema and database setup
- [ ] **Step 3:** Load the dataset into PostgreSQL
- [ ] **Step 4:** Pandas cleaning and analytics engine
- [ ] **Step 5:** FastAPI endpoints (`/api/dashboard`, `/api/tickets`, `/api/insights`, `/api/technicians`)
- [ ] **Step 6:** React dashboard with the Editorial Analytics theme
- [ ] **Step 7:** Connect React to FastAPI
- [ ] **Step 8:** Filters
- [ ] **Step 9:** Dynamic insights and recommendations
- [ ] **Step 10:** CSV upload, export and reports
- [ ] **Step 11:** Tests
- [ ] **Step 12:** Docker Compose, final README and screenshots

## Screenshots

| Light mode | Dark mode |
|---|---|
| _Screenshot placeholder_ | _Screenshot placeholder_ |

_Add images to `docs/screenshots/` and link them here._

## Deployment Plan

- [ ] Frontend on Vercel
- [ ] Backend on Render, Railway or similar
- [ ] Database on Supabase, Neon or similar
- [ ] Code on GitHub

## Future Improvements

Not part of the first version:

- Ticket volume forecasting
- Machine learning (for example, resolution-time prediction)
- More advanced anomaly detection (for example, automatic outage detection)
- Authentication and role-based access

## Notes

This project intentionally avoids authentication, microservices, Kubernetes, Redis, message queues, chatbots, and other enterprise features. The goal is clear, correct, explainable analysis.
