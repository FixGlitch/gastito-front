# Gastito Front - Web Architecture

## Overview
Gastito Front is a web application for personal financial management, specifically adapted for Argentina. It helps users track expenses, manage budgets, set savings goals, and visualize spending trends with Argentine-specific features like inflation adjustment and SUBE transport card tracking.

## Technology Stack
- **Next.js 15.1.6** (App Router) - React framework with SSR
- **React 19** - UI library
- **TypeScript 5.7.3** - Type-safe JavaScript
- **Tailwind CSS v3.4.17** - Utility-first CSS
- **Shadcn UI / Radix UI** - Accessible component primitives
- **Zustand 5.0.3** - Lightweight global state management
- **TanStack Query v5.66.0** - Server state management and caching
- **React Hook Form 7.54.2** - Performant form handling
- **Zod 3.24.1** - Schema validation
- **Recharts 2.15.1** - Charting library
- **TanStack Table v8.20.6** - Headless table library
- **date-fns 4.1.0** - Date manipulation
- **next-themes 0.4.4** - Dark/light/system theme support
- **lucide-react 0.474.0** - Icon library

## Project Structure
```
gastito-front/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes (unprotected)
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/              # Dashboard routes (protected)
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx          # Main dashboard
│   │   │   │   ├── expenses/page.tsx # Expense list
│   │   │   │   ├── savings/page.tsx  # Savings goals
│   │   │   │   └── settings/page.tsx # Budget configuration
│   │   │   └── layout.tsx            # Dashboard layout
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Root (redirects to /login)
│   ├── components/
│   │   ├── atoms/                    # Basic building blocks
│   │   ├── molecules/                # Composite components
│   │   ├── organisms/                # Complex components
│   │   ├── templates/                # Page structures
│   │   └── providers/                # Context providers
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts             # Fetch wrapper with auth
│   │   │   ├── query-keys.ts         # Query key factory
│   │   │   ├── query-provider.tsx    # React Query provider
│   │   │   └── hooks/                # API integration hooks
│   │   ├── store/                    # Zustand stores
│   │   ├── schemas.ts                # Zod validation schemas
│   │   ├── format.ts                 # ARS currency formatting
│   │   └── utils.ts                  # Utility functions
│   ├── types/                        # TypeScript definitions
│   └── middleware.ts                 # Auth protection middleware
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Architecture Patterns

### Routing (Next.js App Router)
- **(auth)** group: Unprotected authentication routes
- **(dashboard)** group: Protected dashboard routes with layout wrapper
- **Middleware**: Protects dashboard routes, redirects based on auth state
- **Root page**: Redirects to /login

### State Management Strategy
#### Zustand Stores (Client State)
- **Auth Store**: Persisted to localStorage (user, token, auth status)
- **UI Store**: Sidebar open/collapsed state (not persisted)

#### TanStack Query (Server State)
- Configured with 5-minute stale time
- 30-minute garbage collection
- Automatic retry (disabled for 401 errors)
- DevTools in development

### Component Architecture (Atomic Design)
- **Atoms**: Button, Card, Input, Select, CurrencyInput, etc.
- **Molecules**: AddExpenseModal, BudgetProgress, ExpenseRow, StatCard
- **Organisms**: AlertBanner, ExpenseTable, SidebarNav, SpendingTrendChart
- **Templates**: DashboardTemplate

### API Integration Layer
- **apiFetch**: Custom fetch wrapper with auth headers and error handling
- **Query Keys**: Factory pattern for consistent cache keys
- **Hooks**: Typed API hooks for each resource (auth, expenses, budget, savings, dashboard)

## Key Features

### 1. Authentication System
- Login and registration with form validation
- Token-based authentication with Bearer tokens
- Zustand persistence for auth state
- Middleware route protection
- Automatic redirect logic

### 2. Dashboard Overview
- Financial summary statistics (salary, savings, disposable income, spent)
- Spending trend chart (Recharts)
- Recent expenses list
- Budget alert banners
- Quick actions

### 3. Expense Management
- Full-featured expense table (TanStack Table)
- Filtering by month, category, search
- CRUD operations
- Argentine peso (ARS) formatting
- Category color coding

### 4. Savings Goals
- Create, track, and delete goals
- Progress visualization
- Savings projection (3, 6, 12 months)
- Integration with budget settings

### 5. Budget Settings
- Monthly salary and savings percentage
- Inflation adjustment rate (critical for Argentina)
- Quincena (bi-monthly payment) day selection
- Real-time calculation preview

## Argentine-Specific Features

### Currency Formatting (ARS)
- Thousands separator: period (`.`)
- Decimal separator: comma (`,`)
- Format: `$ 1.234.567,89`
- Implemented in `src/lib/format.ts`

### SUBE Card Highlighting
- Blue color scheme (`#2563EB`)
- Visually distinct in lists and charts
- Special budget alerts

### Inflation Adjustment
- Monthly inflation rate configuration
- Automatic budget expectation adjustment
- Critical for Argentine economic reality

### Quincena Support
- Payment day: 1st or 15th of month
- Accommodates bi-monthly salaries

## API Integration
Backend connection via `NEXT_PUBLIC_API_URL` (default: `http://localhost:3001/api`)

### Endpoints Used
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| GET | `/auth/me` | Get current user |
| GET | `/expenses` | List expenses |
| POST | `/expenses` | Create expense |
| PUT | `/expenses/:id` | Update expense |
| DELETE | `/expenses/:id` | Delete expense |
| GET | `/expenses/summary` | Summary by category |
| GET | `/budget/summary` | Budget summary |
| GET | `/budget/allocations` | Category allocations |
| GET/PUT | `/budget/settings` | Budget settings |

## Design System

### Color Palette
- **Primary**: Indigo 600 (`#4F46E5`)
- **SUBE**: Blue (`#2563EB`)
- **Success**: Green (`#16A34A`)
- **Warning**: Yellow (`#CA8A04`)
- **Sidebar**: Custom HSL CSS variables for theming

### Typography
- **Font**: Inter (with system fallback)
- CSS Variable: `--font-inter`

### Border Radius
- Standard: 12px (lg)
- Cards: 20px (xl)
- Small: 6px (sm)

## Form Validation (Zod Schemas)
- **loginSchema**: Email + password
- **registerSchema**: Name + email + password
- **expenseSchema**: Description + amount + category + date
- **budgetSettingsSchema**: Salary, savings %, inflation rate

## Environment Configuration
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Build & Development
```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint checking
```

## Path Aliases
- `@/*` maps to `./src/*`
