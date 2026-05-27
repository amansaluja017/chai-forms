# 🍵 Chai Forms

Chai Forms is a modern, high-performance, full-stack form builder application designed to make creating, managing, and sharing forms effortless. Built with a robust monorepo architecture, it leverages cutting-edge web technologies to deliver a seamless user experience and powerful developer tools.

## ✨ Features

- **Drag-and-Drop Form Builder**: Intuitively build complex forms using a smooth drag-and-drop interface powered by `@dnd-kit`.
- **Public Form Sharing**: Easily share published forms with generated unique URLs and QR codes.
- **Robust Authentication**: Secure login flows utilizing `NextAuth` with support for Two-Factor Authentication (2FA) via OTP.
- **Device-Based Rate Limiting**: Intelligent sliding-window rate limiting in Redis using client-side fingerprinting (`@fingerprintjs`) to prevent abuse of endpoints.
- **Admin Analytics Dashboard**: Gain insights with a dedicated administrative dashboard and data visualization tools.
- **Modern UI/UX**: Designed with a responsive, glassmorphic aesthetic using Tailwind CSS, Radix UI primitives, and Framer Motion (tw-animate-css) micro-animations.
- **Type-Safe Full Stack**: End-to-end type safety from the database to the frontend using tRPC, Zod, and Drizzle ORM.

## 🏗️ Architecture

Chai Forms is structured as a monorepo using **Turborepo** and **pnpm** workspaces. This setup allows for efficient code sharing, incredibly fast builds, and organized project structure.

### 📦 Apps

- **`apps/web`**: The main frontend application built with Next.js (App Router), React, Tailwind CSS, Redux Toolkit, and tRPC React Query integration.
- **`apps/api`**: The backend API server built with Express, acting as the host for the tRPC server and handling secure form submission pipelines.

### 🧩 Packages

The shared packages within the `packages/` directory modularize the application logic:

- **`@repo/database`**: Database schemas and migrations powered by **Drizzle ORM** and PostgreSQL.
- **`@repo/trpc`**: Shared tRPC router definitions, procedures, and contexts ensuring API type-safety.
- **`@repo/redis`**: Redis client configurations for caching and rate-limiting.
- **`@repo/ai`**: AI integrations for form generation and analysis.
- **`@repo/email`**: Email templates and dispatchers (used for 2FA OTPs and notifications).
- **`@repo/services`**: Shared core business logic and utilities.
- **`@repo/logger`**: Custom logging configurations for consistency across apps.
- **`@repo/eslint-config` & `@repo/typescript-config`**: Shared linting and TypeScript configurations.

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v9.0.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) database
- [Redis](https://redis.io/) server

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amansaluja017/chai-forms.git
   cd chai-forms
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   Create `.env` files in the necessary directories (`apps/web`, `apps/api`, `packages/database`, etc.) based on the required `.env.example` configurations. You will need to supply credentials for Postgres, Redis, and your chosen Auth providers.

4. **Database Setup:**
   Run the database migrations and generate the Drizzle client:
   ```bash
   pnpm run db:generate
   pnpm run db:migrate
   ```

### Credentials
```
admin

email: admin@admin.com
password: admin@1234

```

### Development

To start the development servers for both the web app and the API concurrently, run:

```bash
pnpm run dev
```

This will leverage Turborepo to spin up:
- **API Server** at `http://localhost:8000` (along with Swagger Docs at `/docs`)
- **Web Client** at `http://localhost:3000`

### Building for Production

To build all apps and packages:

```bash
pnpm run build
```

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) & [Express](https://expressjs.com/)
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **API/Data Fetching**: [tRPC](https://trpc.io/) & [React Query](https://tanstack.com/query/latest)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Caching & Rate Limiting**: [Redis](https://redis.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Authentication**: [NextAuth](https://next-auth.js.org/)

## 📜 License

This project is licensed under the MIT License.
