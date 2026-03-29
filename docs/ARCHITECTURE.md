# System architecture (iOS + Django)

```
┌─────────────────┐         HTTPS/JSON          ┌──────────────────────┐
│  MyApp (iOS)    │ ──────────────────────────► │  Django REST + JWT   │
│  SwiftUI MVVM   │         Authorization:       │  myapp_backend       │
│  Keychain tokens│ ◄────────────────────────── │  PostgreSQL / Redis  │
└─────────────────┘         JWT access/refresh     └──────────────────────┘
```

## iOS (`MyApp/`)

- **Entry:** `MyAppApp.swift` → `RootView` → `LoginView` / `ContentView`
- **Auth:** `AuthService` + `APIClient` + `KeychainManager`
- **Environments:** Dev / Staging / Prod (xcconfig + compile flags)

## Backend (`myapp_backend/`)

- **Apps:** `users`, `api`, `core`, `notifications`
- **Auth:** `POST /api/auth/login/`, `register/`, `refresh/`, `profile/`, password reset
- **Health:** `GET /api/health/`

## Security notes

- TLS in production; local dev may use `http://127.0.0.1:8000` with ATS exceptions in Xcode.
- Secrets only in `.env` / CI secrets — never committed.
