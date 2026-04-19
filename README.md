# Restaurant Management System – Lab Course 1 (UBT 2025/2026)

Spring Boot 3 (Java 17) + React (Vite + MobX) + MSSQL + JWT/Refresh tokens.

## Stack

- **Backend**: Spring Boot 3.2, Spring Security, Spring Data JPA, JJWT 0.12, MSSQL JDBC
- **Frontend**: React 18 + Vite, MobX, React Router, Axios, Bootstrap 5
- **Database**: Microsoft SQL Server
- **Auth**: JWT access token (in memory only, sent via `Authorization: Bearer` header) + refresh token persisted in DB

## Project structure

```
updated/
  backend/     Spring Boot API
  frontend/    React + MobX SPA
```

## 1. Database setup (MSSQL)

Create a database named `RestaurantDB`:

```sql
CREATE DATABASE RestaurantDB;
```

Update `backend/src/main/resources/application.properties` with your MSSQL credentials
(defaults assume `sa` / `YourStrong@Passw0rd` on `localhost:1433`).

Tables are auto-created by Hibernate on first run (`spring.jpa.hibernate.ddl-auto=update`).

## 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts on http://localhost:8080.

On first boot a default admin user is seeded:

- **username**: `admin`
- **password**: `admin123`

## 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on http://localhost:5173.

## Auth flow

- `POST /api/auth/register` – create a new user
- `POST /api/auth/login` – returns `{ accessToken, refreshToken, username, roles }`
- `POST /api/auth/refresh` – exchange an existing refresh token for a new pair
- `POST /api/auth/logout` – revokes the refresh token

The React `AuthStore` (MobX) holds the access token **in memory only**. No
`localStorage` / `sessionStorage` is used. The axios interceptor attaches
`Authorization: Bearer <token>` to every request and, on a `401`, calls
`/api/auth/refresh` once and retries the original request.

Refresh tokens are stored in the `refresh_tokens` table with an expiry and a
`revoked` flag; rotation happens on every refresh call.

## Entities / CRUD endpoints

| Resource         | Endpoint                 |
|------------------|--------------------------|
| Menu Categories  | `/api/menu-categories`   |
| Menu Items       | `/api/menu-items`        |
| Tables           | `/api/tables`            |
| Reservations     | `/api/reservations`      |
| Orders           | `/api/orders`            |
| Order Items      | `/api/order-items`       |
| Staff            | `/api/staff`             |
| Payments         | `/api/payments`          |
| Reviews          | `/api/reviews`           |
| Ingredients      | `/api/ingredients`       |
| Dashboard        | `/api/dashboard/summary` |
| Sales Report     | `/api/dashboard/sales-report?from=YYYY-MM-DD&to=YYYY-MM-DD` |

Each resource exposes the standard `GET / GET/{id} / POST / PUT/{id} / DELETE/{id}`.
Orders also expose `PATCH /api/orders/{id}/status` for order status transitions
(`PENDING → PREPARING → DELIVERED → PAID`).

## Presentation checklist

- Git: every member commits individually with descriptive messages.
- Trello: tasks broken down per entity / feature.
- Live coding: be able to explain every file, add a new CRUD field on the fly.
- Dashboard: daily sales, monthly sales, top-selling items, date-filtered sales report.
