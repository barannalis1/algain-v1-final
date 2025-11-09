# DreamOracle Platform

DreamOracle is a Next.js 14 platform for AI-assisted dream interpretation, tarot and fortune readings, subscription video generation, and daily coaching.

## Stack
- **Web**: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Zustand, next-intl
- **API**: Next.js Route Handlers, OpenAPI docs at `/api/docs`
- **Database**: PostgreSQL + Prisma
- **Queue**: BullMQ + Redis
- **AI**: OpenAI (GPT, Whisper), Remotion + FFmpeg for video rendering
- **Auth**: NextAuth (Email, OAuth), JWT with RBAC tiers
- **Payments**: Stripe subscriptions (TRY)
- **Notifications**: Resend email, Web Push, optional Telegram
- **Observability**: pino logger + Sentry

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy environment template
   ```bash
   cp .env.example .env.local
   ```
   Update secrets: database, Stripe, OpenAI/Whisper, Supabase, Redis.
3. Apply database schema
   ```bash
   npx prisma migrate dev
   ```
4. Run the development server
   ```bash
   npm run dev
   ```
5. Visit [http://localhost:3000](http://localhost:3000)

### Background Workers
Render/queue jobs and daily notifications use BullMQ workers that can run via Docker/Render/Fly. Start locally with:
```bash
node -r dotenv/config ./src/workers/queue.ts
```

## Testing the FX Fallback
To ensure EUR approximations work without the external API:
```bash
FX_SOURCE_URL=https://invalid npm run dev
```
The pricing page will fall back to the `FX_TRY_EUR_FALLBACK` rate.

## Scripts
- `npm run lint` – ESLint
- `npm run prisma:generate` – generate Prisma client
- `npm run prisma:migrate` – run database migrations
- `npm run prisma:studio` – Prisma Studio

## Directory Overview
```
src/
  app/            # App Router routes and layouts
  components/     # UI and dashboard widgets
  lib/            # Server utilities (AI, FX, Prisma, logging)
  stores/         # Zustand stores
  workers/        # BullMQ processors
public/locales/   # i18n dictionaries (tr/en)
prisma/schema.prisma
```

## Deployment
- Web/API deploy to Vercel (Edge friendly handlers)
- Worker containers to Render/Fly.io with Dockerfile
- Configure Stripe webhook to `/api/stripe/webhook`
- Ensure Redis, PostgreSQL, Supabase storage buckets are provisioned.

## Compliance
DreamOracle surfaces ethical disclaimers (entertainment only), offers data export/deletion, and restricts usage to 18+ audiences to align with KVKK/GDPR.
