# SkillBridge Frontend

A Next.js frontend for the SkillBridge learning platform. It includes public pages, authentication flows, role-aware dashboard navigation, and a reusable shared UI structure.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui + Radix UI
- React Hook Form
- Zod
- Sonner

## Features

- Login and registration forms
- Signup with role selection: `STUDENT` or `TUTOR`
- Email verification notice and resend flow
- Forgot password and reset password flow
- Update password form for authenticated users
- Cookie-based auth context on the frontend
- Role-aware dashboard navigation
- Shared navbar, footer, sidebar, and config structure

## Project Structure

```text
src/
├── app/
│   ├── (CommonLayout)/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── verify-email/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (DashboardLayout)/
│   │   ├── @admin/
│   │   ├── @student/
│   │   └── layout.tsx
│   └── layout.tsx
├── components/
│   ├── modules/
│   │   └── Auth/
│   ├── shared/
│   ├── dashboard/
│   └── ui/
├── config/
│   ├── apiConfig.ts
│   ├── navbar.tsx
│   └── sidebar-menus.ts
├── context/
│   ├── auth-context.tsx
│   └── theme-context.tsx
├── services/
│   └── auth/
└── types/
    ├── auth.ts
    ├── navbar.ts
    └── sidebar.ts
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

This frontend expects the backend auth API to be available at that base URL.

## Installation

```bash
pnpm install
```

## Run Locally

```bash
pnpm dev
```

Then open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Authentication Flow

### Register

1. User submits the registration form.
2. Frontend sends `name`, `email`, `password`, and `role`.
3. Backend creates the account and sends a verification email.
4. Frontend redirects to `/auth/verify-email?email=...`.
5. The verification email link points to the frontend verification page.

### Verify Email

1. User clicks the email link.
2. Frontend receives `token` in `/auth/verify-email`.
3. Frontend forwards the token to the backend verification endpoint.
4. Backend verifies the email and redirects back to the frontend login page.

### Login

1. User logs in with email and password.
2. Backend returns the logged-in user and sets the auth cookie.
3. Frontend stores user info in auth context.
4. User is redirected based on role:
   - `STUDENT` → student dashboard
   - `TUTOR` / `ADMIN` → admin-side dashboard flow

### Forgot / Reset Password

1. User requests a reset link from `/auth/forgot-password`.
2. Backend emails a reset link.
3. User opens `/auth/reset-password?token=...`.
4. Frontend submits the new password to the backend.

## Auth Service Endpoints

Defined in `src/config/apiConfig.ts`:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/verify-email`
- `GET /api/auth/verify-email`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/update-password`
- `POST /auth/logout`

## Notes

- The frontend uses `Link` for internal navigation.
- Auth state is handled through `auth-context.tsx`.
- Dashboard rendering is role-aware.
- Signup does not allow self-registration as `ADMIN`.

## Backend Requirement

This frontend depends on the SkillBridge backend auth system being configured and running, especially for:

- registration
- login
- email verification
- password reset
- session handling

Make sure the backend `FRONTEND_URL` matches the frontend app URL.
