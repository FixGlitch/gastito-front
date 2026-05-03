# Gastito 🇦🇷

Dashboard de gestión financiera personal adaptado a Argentina.

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Estilos**: Tailwind CSS v3 + Shadcn (headless)
- **Íconos**: Lucide React
- **Server State**: TanStack Query v5
- **Estado global**: Zustand
- **Formularios**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Tablas**: TanStack Table v8

## Estructura del proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Grupo de autenticación
│   │   └── login/page.tsx
│   ├── (dashboard)/              # Grupo del dashboard (protegido)
│   │   ├── layout.tsx            # Layout con sidebar + topbar
│   │   ├── dashboard/page.tsx    # Resumen principal
│   │   ├── expenses/page.tsx     # Listado de gastos
│   │   ├── savings/page.tsx      # Seguimiento de ahorro
│   │   └── settings/page.tsx     # Configuración
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Redirect inicial
│   └── globals.css               # Estilos globales + variables CSS
├── components/
│   ├── atoms/                    # Componentes base
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── currency-input.tsx    # Input con formato ARS
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── select-field.tsx
│   │   ├── status-badge.tsx
│   │   └── trend-icon.tsx
│   ├── molecules/                # Combinaciones de átomos
│   │   ├── add-expense-modal.tsx
│   │   ├── budget-progress.tsx
│   │   ├── expense-row.tsx
│   │   ├── stat-card.tsx
│   │   └── theme-toggle.tsx
│   ├── organisms/                # Componentes complejos
│   │   ├── alert-banner.tsx
│   │   ├── allocation-chart.tsx  # Gráfico de distribución
│   │   ├── expense-table.tsx     # TanStack Table
│   │   ├── sidebar-nav.tsx       # Navegación lateral
│   │   ├── spending-trend-chart.tsx
│   │   └── top-bar.tsx
│   ├── templates/                # Estructuras de página
│   │   └── dashboard-template.tsx
│   └── providers/
│       └── theme-provider.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts             # Fetch wrapper con auth
│   │   ├── query-keys.ts         # Claves para TanStack Query
│   │   ├── query-provider.tsx    # Provider de React Query
│   │   └── hooks/
│   │       ├── auth.ts           # useLogin, useLogout, useMe
│   │       ├── budget.ts         # useBudgetSummary, useBudgetSettings
│   │       └── expenses.ts       # useExpenses, useCreateExpense, etc.
│   ├── store/
│   │   ├── auth.ts               # Zustand auth store
│   │   └── ui.ts                 # Zustand UI store (sidebar)
│   ├── utils/
│   │   ├── toast.ts              # Sistema de notificaciones
│   │   └── format.ts             # Formato ARS, fechas
│   ├── schemas.ts                # Zod schemas
│   └── utils.ts                  # cn() utility
├── types/
│   ├── auth.ts
│   ├── budget.ts
│   ├── dashboard.ts
│   └── expense.ts
└── middleware.ts                 # Auth middleware
```

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Editá `.env.local` con la URL de tu API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Iniciar el backend

En la carpeta `gastito-back`:

```bash
cd gastito-back
cp .env.example .env
# Editá .env con tus credenciales de PostgreSQL
npm install
npm run seed       # Datos de prueba
npm run dev        # Backend en puerto 3001
```

### 4. Ejecutar el frontend

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4. Build de producción

```bash
npm run build
npm start
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión |
| `/register` | Crear cuenta nueva |
| `/dashboard` | Resumen financiero |
| `/dashboard/expenses` | Listado de gastos con filtros |
| `/dashboard/savings` | Metas de ahorro |
| `/dashboard/settings` | Configuración de presupuesto |

## Integración con el backend

### Endpoints esperados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Login con email + password |
| GET | `/auth/me` | Obtener usuario autenticado |
| GET | `/expenses` | Listar gastos (con filtros) |
| POST | `/expenses` | Crear gasto |
| PUT | `/expenses/:id` | Actualizar gasto |
| DELETE | `/expenses/:id` | Eliminar gasto |
| GET | `/expenses/summary` | Resumen de gastos por categoría |
| GET | `/budget/summary` | Resumen del presupuesto |
| GET | `/budget/allocations` | Distribución por categoría |
| GET | `/budget/settings` | Configuración actual |
| PUT | `/budget/settings` | Actualizar configuración |

### Formato de respuesta esperado

```json
{
  "user": { "id": "1", "name": "Juan", "email": "juan@mail.com" },
  "tokens": { "accessToken": "...", "refreshToken": "..." }
}
```

### Autenticación

- El token se almacena en una cookie `auth_token` httpOnly (recomendado)
- El middleware protege las rutas `/dashboard/*`
- Las peticiones API envían `Authorization: Bearer <token>`

## Formato ARS

Todos los montos se muestran en formato argentino:

- Separador de miles: punto (`.`)
- Separador decimal: coma (`,`)
- Ejemplo: `$ 1.234.567,89`

## Categorías

La categoría **SUBE** está destacada visualmente en todos los listados y formularios con color azul (`#2563EB`).

## Design System

- **Color primario**: `#4F46E5` (Indigo 600)
- **Border radius**: 12px (standard), 20px (cards)
- **Tipografía**: Inter (system font fallback)
- **Responsive**: mobile-first con breakpoints de Tailwind
