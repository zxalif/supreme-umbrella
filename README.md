# FreelanceHunt Frontend

**Next.js 15 Frontend for FreelanceHunt - Reddit-First Lead Generation Platform for Freelancers**

---

## 🚀 Quick Start

### With Docker (Recommended)
```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start services
docker-compose up --build

# 3. Access frontend
# - Frontend: http://localhost:9100
```

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 3. Start development server
npm run dev

# 4. Access frontend
# - Frontend: http://localhost:9100
```

---

## 📚 Documentation

- **[Landing Page Plan](docs/LANDING_PAGE_PLAN.md)** - Complete landing page & dashboard plan ⭐ NEW
- **[Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md)** - Step-by-step implementation guide ⭐ NEW
- **[Status Review](docs/STATUS_REVIEW.md)** - Current status and what's remaining
- **[Frontend Plan](docs/FRONTEND_PLAN.md)** - Complete frontend plan
- **[Implementation Plan](docs/IMPLEMENTATION_PLAN.md)** - Priority-based implementation guide
- **[Design System](docs/DESIGN_SYSTEM.md)** - Design system documentation
- **[Progress](docs/PROGRESS.md)** - Progress tracking

---

## 🎯 Current Status

**Overall Completion**: **~5%** ⏳

- ✅ **Infrastructure**: 100% (Project setup, config, Docker)
- ✅ **Design System**: 100% (CSS variables, Tailwind config)
- ✅ **Utilities**: 100% (Helper functions)
- ❌ **Core Foundation**: 0% (Types, API client, State management)
- ❌ **Landing Page**: 0% (Ready to build)
- ❌ **Dashboard**: 0% (Ready to build)
- ❌ **UI Components**: 0% (Pages, components)

**Next Focus**: Landing Page & Dashboard (Light Theme) 🎨

**See [Landing Page Plan](docs/LANDING_PAGE_PLAN.md) for detailed action plan.**

---

## 🏗️ Architecture

### Technology Stack
- **Framework**: Next.js 15+ (App Router)
- **React**: React 19+
- **UI**: Tailwind CSS 3.4+ with custom design system
- **State**: Zustand 4.5+
- **API Client**: Axios 1.7+
- **Forms**: React Hook Form 7.53+ + Zod 3.23+
- **Payments**: Paddle Checkout
- **Charts**: Recharts 2.12+
- **TypeScript**: 5.6+

### Project Structure
```
lead-frontend/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Landing page
│   │   └── (dashboard)/  # Dashboard routes
│   ├── components/       # React components
│   │   ├── landing/     # Landing page components
│   │   └── layout/      # Layout components
│   ├── store/           # Zustand stores
│   ├── lib/             # Utilities & API client
│   └── types/           # TypeScript types
├── docs/                # Documentation
└── public/              # Static assets
```

---

## 🎨 Design Theme

**Light Theme** - Clean, Modern, Professional

- **Primary Color**: Sky Blue (#0EA5E9)
- **Background**: White with light gray sections
- **Text**: Dark slate for readability
- **Style**: Minimalist with generous whitespace
- **Shadows**: Subtle for depth

See [Design System](docs/DESIGN_SYSTEM.md) for details.

---

## 📊 Features (Planned)

### Landing Page
- ✅ Hero section with value proposition
- ✅ Features showcase
- ✅ How it works (3-step process)
- ✅ Pricing section
- ✅ Testimonials
- ✅ FAQ section
- ✅ Final CTA

### Dashboard
- ✅ Clean, professional layout
- ✅ Sidebar navigation
- ✅ Stats cards
- ✅ Opportunities management
- ✅ Analytics charts
- ✅ Settings pages

---

## 🔧 Configuration

### Environment Variables
See `.env.example` for all available options.

**Required**:
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:7300`)

**Optional**:
- `NEXT_PUBLIC_PADDLE_VENDOR_ID` - Paddle vendor ID
- `NEXT_PUBLIC_PADDLE_ENVIRONMENT` - `sandbox` or `production`

---

## 🐳 Docker

### Services
- **lead-frontend** - Frontend application (port 9100)

### Commands
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f lead-frontend

# Stop services
docker-compose down

# Rebuild
docker-compose up --build
```

---

## 🔗 Integration

### Backend API
- Backend runs on port **7300**
- API base URL: `http://localhost:7300/api/v1`
- All API calls use JWT authentication

### Paddle Payments
- Payment processing via Paddle Checkout
- Hosted checkout (no SDK needed)
- Webhook handling on backend

---

## 📝 Development

### Scripts
```bash
npm run dev          # Start development server (port 9100)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Style
- TypeScript strict mode
- ESLint with Next.js config
- Tailwind CSS for styling
- Centralized design system (CSS variables)

---

## 📈 Next Steps

1. **Build Core Foundation** (Types, API client, State management)
2. **Build Landing Page** (Hero, Features, Pricing, etc.)
3. **Build Dashboard Layout** (Header, sidebar, navigation)
4. **Build Dashboard Pages** (Home, Opportunities, Analytics)
5. **Integration & Polish** (Connect to API, optimize, test)

**See [Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md) for detailed timeline.**

---

## 📝 License

See project root for license information.

---

## 🤝 Contributing

See project root for contributing guidelines.

---

**Status**: Foundation ready - Ready to build landing page & dashboard! 🚀
