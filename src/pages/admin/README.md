# Admin Panel

This directory contains all admin panel pages and components.

## Routes

- `/admin` - Dashboard (redirects to `/admin/dashboard`)
- `/admin/dashboard` - Main dashboard with key metrics
- `/admin/users` - Users list with search, filters, and pagination
- `/admin/users/:id` - User detail page with tabs
- `/admin/billing` - Plans & Billing management
- `/admin/collections` - Aggregate bookmark and tag statistics
- `/admin/analytics` - Growth charts and analytics
- `/admin/settings` - Admin preferences and feature flags
- `/admin/roles` - Roles & Permissions management
- `/admin/audit` - Audit logs with filtering

## Components

### Layout Components
- `AdminLayout` - Main layout wrapper with sidebar and header
- `AdminSidebar` - Navigation sidebar
- `AdminHeader` - Top header with search and date

### Data Components
- `UsersTable` - Data table for users with selection, sorting, and actions

## Data Layer

All data access functions are in `src/lib/data/admin/`:
- `types.ts` - TypeScript types
- `users.ts` - User-related queries
- `stats.ts` - Statistics and analytics
- `billing.ts` - Plan and billing data
- `roles.ts` - Role management
- `audit.ts` - Audit log queries

## Extending Columns

To add new columns to the Users table:

1. Update `AdminUser` type in `src/lib/data/admin/types.ts`
2. Update the database query in `src/lib/data/admin/users.ts`
3. Add the column header in `UsersTable.tsx`
4. Add the cell rendering in `UsersTable.tsx`

## Authentication

Admin routes are protected by `AdminProtectedRoute` which checks for admin authentication via `AdminAuthProvider`.

## Styling

All components use the same design system as the front app:
- Tailwind CSS with design tokens
- Radix UI primitives
- Consistent spacing, typography, and colors
- Dark/light mode support via theme provider
