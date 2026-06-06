# NIE Danmark

En komplet platform der hjælper danskere med at ansøge om spansk NIE-nummer.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Sprog:** TypeScript
- **Styling:** TailwindCSS + Shadcn UI
- **Animationer:** Framer Motion
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth v5
- **Betaling:** Stripe
- **Forms:** React Hook Form + Zod
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## Kom i gang

### Forudsætninger

- Node.js 20+
- PostgreSQL database
- Stripe konto
- SMTP email konto (Gmail, Resend, etc.)

### Installation

```bash
# Klon repository
git clone https://github.com/yourusername/nie-danmark.git
cd nie-danmark

# Installer afhængigheder
npm install

# Kopiér og udfyld environment variables
cp .env.example .env.local

# Generer Prisma klient
npx prisma generate

# Kør database migrations
npx prisma migrate dev

# Start udviklingsserver
npm run dev
```

### Environment Variables

Kopiér `.env.example` til `.env.local` og udfyld alle værdier:

```bash
cp .env.example .env.local
```

Se `.env.example` for alle nødvendige variabler.

### Database Setup

```bash
# Opret migrations
npx prisma migrate dev --name init

# Se database i browser
npx prisma studio
```

### Stripe Setup

1. Opret konto på stripe.com
2. Hent test API nøgler
3. Opsæt webhook endpoint: `/api/payments/webhook`
4. Webhook events: `checkout.session.completed`

### Deployment til Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Vercel Environment Variables

Tilføj alle variabler fra `.env.example` i Vercel dashboard under Settings → Environment Variables.

#### Prisma på Vercel

Tilføj til `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

## Projektstruktur

```
nie-danmark/
├── app/
│   ├── (auth)/          # Login, register
│   ├── (marketing)/     # Forside, priser, blog, FAQ, kontakt
│   ├── admin/           # Admin panel
│   ├── dashboard/       # Kundeportal
│   └── api/             # API endpoints
├── components/
│   ├── layout/          # Navbar, footer
│   ├── forms/           # Ansøgningsformular
│   ├── sections/        # Landing page sections
│   ├── portal/          # Portal komponenter
│   └── admin/           # Admin komponenter
├── lib/
│   ├── auth.ts          # NextAuth konfiguration
│   ├── db.ts            # Prisma klient
│   ├── email.ts         # Email templates
│   ├── stripe.ts        # Stripe klient
│   └── utils.ts         # Hjælpefunktioner
├── prisma/
│   └── schema.prisma    # Database schema
└── .github/
    └── workflows/       # CI/CD pipeline
```

## API Endpoints

| Method | Endpoint | Beskrivelse |
|--------|----------|-------------|
| POST | /api/auth/register | Opret bruger |
| POST | /api/applications | Opret ansøgning |
| GET | /api/applications | Hent mine ansøgninger |
| GET | /api/applications/:id | Hent enkelt ansøgning |
| POST | /api/payments/create-checkout | Opret Stripe checkout |
| POST | /api/payments/webhook | Stripe webhook |
| POST | /api/documents/upload | Upload dokument |
| GET | /api/admin/applications | Admin: Alle ansøgninger |
| PATCH | /api/admin/applications/:id | Admin: Opdater ansøgning |

## Licens

Alle rettigheder forbeholdt © NIE Danmark
