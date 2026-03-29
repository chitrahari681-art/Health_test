# Google Cloud: Django backend (`myapp_backend`) deployment

This guide aligns with your repo’s **Django 4.2 + PostgreSQL + decouple env vars** setup.  
**Credits & billing:** Only you can activate trials/promo codes in [Google Cloud Console](https://console.cloud.google.com/); an AI agent cannot attach **$300** or billing to your account.

**Trial reality check:** Free trial / promotional credit is usually **time-limited (often ~90 days)**. A **$15/month budget alert** does not make $300 last “15–60 months”; it only notifies you when spend hits thresholds. Always read the **current** terms on Google’s site.

---

## Part 1 — Account, billing, project

1. Go to [cloud.google.com](https://cloud.google.com) → Console.
2. **Billing:** Create or link a billing account (card verification is normal; trials may still apply per current Google offers).
3. **Promo code (if you have one):** Billing → **Promotions** / **Promo codes** (wording varies by region). Apply the code; confirm balance under **Billing → Overview**.
4. **Project:** **IAM & Admin → Create project** (e.g. `myapp-production`). Select it in the top bar.

### Enable APIs (APIs & Services → Library)

| API | Why |
|-----|-----|
| **Cloud Run API** | Run the container |
| **Cloud SQL Admin API** | Managed PostgreSQL |
| **Artifact Registry API** | Store images (preferred over legacy Container Registry) |
| **Cloud Build API** | Build images in CI |
| **Secret Manager API** (recommended) | `SECRET_KEY`, DB password, etc. |
| **Cloud Storage API** | Media / backups (optional) |

Optional: **Cloud Monitoring**, **Cloud Logging**, **Firebase** (analytics) — as needed.

---

## Part 2 — Cloud SQL (PostgreSQL)

1. **SQL → Create instance → PostgreSQL**  
   - Instance ID: e.g. `myapp-db-prod`  
   - Version: **15** (matches local Docker)  
   - Region: closest to users / Cloud Run region  
   - Tier: `db-f1-micro` for experiments (pricing changes; check console)

2. **Databases → Create database** → e.g. `myapp_db` (UTF8).

3. **Users → Add user** → e.g. `myapp_user` + strong password (store in **Secret Manager**).

### Network (important)

- **Dev only:** Authorizing `0.0.0.0/0` on public IP is **high risk**. Prefer **not** exposing Postgres to the whole internet.
- **Production pattern:** **Cloud Run → Cloud SQL** via the **Cloud SQL connection** (Unix socket / connector), **not** a public IP + password from the open internet.

**Connection name:** `PROJECT_ID:REGION:INSTANCE_ID` (shown on the instance overview). You will attach this to Cloud Run (see Part 5).

### Env vars for *this* codebase

`myapp_backend` reads (see `settings/base.py`):

| Variable | Example (local IP — dev only) |
|----------|-------------------------------|
| `POSTGRES_DB` | `myapp_db` |
| `POSTGRES_USER` | `myapp_user` |
| `POSTGRES_PASSWORD` | *(secret)* |
| `POSTGRES_HOST` | Public IP **or** `/cloudsql/PROJECT:REGION:INSTANCE` on Cloud Run |
| `POSTGRES_PORT` | `5432` (empty or unused with Unix socket — see Google docs) |

For **Cloud Run + Unix socket**, Google documents using host `/cloudsql/CONNECTION_NAME` and attaching the instance to the service. Verify against [Connect Cloud Run to Cloud SQL](https://cloud.google.com/sql/docs/postgres/connect-run) for your region and driver.

---

## Part 3 — Cloud Storage (optional)

For `ImageField` / media:

1. **Cloud Storage → Buckets → Create** (globally unique name, same region as DB/Run if possible).
2. Grant the **Cloud Run service account** (or dedicated runtime SA) **Storage Object Admin** or narrower roles as needed.
3. For production, consider **django-storages** + GCS backend instead of local `MEDIA_ROOT` on the container filesystem.

---

## Part 4 — Service account for CI/CD

1. **IAM & Admin → Service accounts → Create** (e.g. `github-ci`).
2. Roles (tighten over time):
   - **Cloud Run Admin** (deploy)
   - **Service Account User** (act as runtime SA)
   - **Artifact Registry Writer** (push images)
   - **Cloud Build Editor** or **Cloud Build Service Account** usage (if using Cloud Build)
   - **Cloud SQL Client** (if migrations run from CI against Cloud SQL — prefer short-lived or job-based pattern)

3. **Keys → Add key → JSON** — store **only** in **GitHub Actions secrets** (e.g. `GCP_SA_KEY`). **Never** commit JSON to git.

**Better than long-lived JSON keys:** [Workload Identity Federation](https://github.com/google-github-actions/auth#workload-identity-federation) for GitHub → GCP (no downloadable key file).

---

## Part 5 — Cloud Run (backend)

1. **Cloud Run → Create service**  
   - Region: same as Cloud SQL (recommended)  
   - Authentication: **Allow unauthenticated** only if your API is public; otherwise use IAM.

2. **Container**
   - Image: from Artifact Registry (built in CI)
   - Port: **8000**
   - Memory/CPU: start small (e.g. 512Mi, 1 vCPU), load-test later

3. **Connect Cloud SQL**  
   - Add the **Cloud SQL connection** (`PROJECT:REGION:INSTANCE`) to the service.  
   - Set env vars (see table above). Use **Secret Manager** references for secrets.

4. **Django settings for production**
   - `DJANGO_SETTINGS_MODULE=myapp_backend.settings.production`
   - `SECRET_KEY` — strong, from Secret Manager  
   - `DEBUG=False`  
   - `ALLOWED_HOSTS` — **your Cloud Run URL and custom domain**, not `*`  
   - `CSRF_TRUSTED_ORIGINS` / CORS — your **HTTPS** app origins  
   - Run migrations: one-off **Cloud Run Job**, **Cloud Build** step, or manual `gcloud run jobs execute` — pick one process and document it.

5. **Static files**  
   - Current `Dockerfile` does not run `collectstatic` in the image. For Cloud Run, add **`collectstatic`** at build time and serve via **Whitenoise** and/or **GCS + CDN**. Do this before calling production “done”.

---

## Part 6 — CI/CD (GitHub Actions)

- Existing workflow: `myapp_backend/.github/workflows/backend-ci.yml` (pytest + SQLite test settings).
- **Deploy template (copy and fill):** `myapp_backend/.github/workflows/deploy-cloudrun.yml.example` → rename to `deploy-cloudrun.yml` when ready.

**GitHub secrets (typical)**

| Secret | Purpose |
|--------|---------|
| `GCP_SA_KEY` | Service account JSON *(or use WIF instead)* |
| `GCP_PROJECT_ID` | Project ID |
| `WIF_PROVIDER` / `WIF_SERVICE_ACCOUNT` | If using Workload Identity Federation |

Store **Django `SECRET_KEY`** and DB password in **GCP Secret Manager** and reference them from Cloud Run, or map from GitHub secrets only for non-prod if you accept the tradeoff.

---

## Part 7 — Cost controls

1. **Billing → Budgets & alerts** — e.g. monthly budget + 50% / 90% / 100% email alerts.  
2. **Billing → Reports** — see what drives cost (Cloud SQL vs Run vs egress).  
3. Turn off unused instances; use smallest viable Cloud SQL tier for dev.

---

## Part 8 — Monitoring

- **Cloud Logging / Error Reporting** for request logs.  
- **Sentry:** already optional in `settings/base.py` via `SENTRY_DSN`.

---

## Part 9 — Custom domain & TLS

1. **Cloud Run → your service → Manage custom domains**  
2. Add DNS records as instructed; Google provisions **managed TLS**.  
3. Set `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` to `https://api.yourdomain.com`.

---

## Part 10 — iOS app

Point **staging/production** API base URLs in `MyApp` (`AppEnvironment` / xcconfigs) to your **HTTPS** Cloud Run (or API Gateway) URL.  
Keep **localhost** / **ATS** rules for simulator dev (see `MyApp/README.md`).

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| Build fails | Cloud Build logs; Dockerfile path; `requirements.txt` |
| 502 / crash on start | Cloud Run logs; `ALLOWED_HOSTS`; missing env; migrations not applied |
| DB connection | Cloud SQL connection attached to service; correct user/db; socket vs IP |
| “Billing disabled” | Billing linked to project; account in good standing |

```bash
gcloud run services logs read SERVICE_NAME --region=REGION --limit=50
```

---

## Security checklist (owner)

- [ ] No `0.0.0.0/0` on production DB unless consciously accepted and time-boxed  
- [ ] `ALLOWED_HOSTS` / CORS explicit for prod  
- [ ] Secrets in **Secret Manager** or CI secrets — not in repo  
- [ ] Service account least privilege  
- [ ] Budget alerts configured  
- [ ] Migrations strategy documented  
- [ ] Static/media strategy documented (Whitenoise / GCS)  

**Status:** ☐ Ready for production / ☐ Issues: ___

---

## Related repo files

- Backend: `Health_test/myapp_backend/`  
- Dockerfile: `myapp_backend/Dockerfile`  
- Deploy workflow template: `myapp_backend/.github/workflows/deploy-cloudrun.yml.example`  
- Agent/owner process: `docs/AGENT_OWNER_QUICK_REFERENCE.md`
