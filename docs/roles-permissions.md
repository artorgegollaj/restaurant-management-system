# Tabela e Roleve dhe Lejeve

| Endpoint | ADMIN | MANAGER | WAITER | USER |
|----------|:-----:|:-------:|:------:|:----:|
| **AUTH** | | | | |
| POST /api/auth/register | ✓ (publik) | ✓ | ✓ | ✓ |
| POST /api/auth/login | ✓ | ✓ | ✓ | ✓ |
| POST /api/auth/refresh | ✓ | ✓ | ✓ | ✓ |
| POST /api/auth/logout | ✓ | ✓ | ✓ | ✓ |
| **USERS** | | | | |
| GET /api/users | ✓ | ✓ | ✗ | ✗ |
| POST /api/users | ✓ | ✗ | ✗ | ✗ |
| PUT /api/users/{id} | ✓ | ✗ | ✗ | ✗ |
| DELETE /api/users/{id} | ✓ | ✗ | ✗ | ✗ |
| **MENU CATEGORIES** | | | | |
| GET /api/menu-categories | ✓ | ✓ | ✓ | ✓ |
| POST/PUT/DELETE | ✓ | ✓ | ✗ | ✗ |
| **MENU ITEMS** | | | | |
| GET /api/menu-items | ✓ | ✓ | ✓ | ✓ |
| POST /api/menu-items | ✓ | ✓ | ✗ | ✗ |
| PUT /api/menu-items/{id} | ✓ | ✓ | ✗ | ✗ |
| DELETE /api/menu-items/{id} | ✓ | ✗ | ✗ | ✗ |
| **TABLES** | | | | |
| GET /api/tables | ✓ | ✓ | ✓ | ✗ |
| POST/PUT | ✓ | ✓ | ✗ | ✗ |
| DELETE /api/tables/{id} | ✓ | ✗ | ✗ | ✗ |
| **ORDERS** | | | | |
| GET /api/orders | ✓ | ✓ | ✓ | ✗ |
| POST /api/orders | ✓ | ✓ | ✓ | ✗ |
| PATCH /api/orders/{id}/status | ✓ | ✓ | ✓ | ✗ |
| DELETE /api/orders/{id} | ✓ | ✗ | ✗ | ✗ |
| **PAYMENTS** | | | | |
| GET /api/payments | ✓ | ✓ | ✓ | ✗ |
| POST /api/payments | ✓ | ✓ | ✓ | ✗ |
| DELETE /api/payments/{id} | ✓ | ✗ | ✗ | ✗ |
| **RESERVATIONS** | | | | |
| GET /api/reservations | ✓ | ✓ | ✓ | ✗ |
| POST /api/reservations | ✓ | ✓ | ✓ | ✓ |
| PUT /api/reservations/{id} | ✓ | ✓ | ✓ | ✗ |
| DELETE /api/reservations/{id} | ✓ | ✓ | ✗ | ✗ |
| **STAFF** | | | | |
| GET /api/staff | ✓ | ✓ | ✗ | ✗ |
| POST/PUT/DELETE | ✓ | ✗ | ✗ | ✗ |
| **REVIEWS** | | | | |
| GET /api/reviews | ✓ | ✓ | ✓ | ✓ |
| POST /api/reviews | ✓ | ✓ | ✓ | ✓ |
| DELETE /api/reviews/{id} | ✓ | ✓ | ✗ | ✗ |
| **DASHBOARD** | | | | |
| GET /api/dashboard/* | ✓ | ✓ | ✗ | ✗ |

## Permbledhje
- **ADMIN:** kontrolli total, e vetmja qe fshin perdorues / staff / kategori
- **MANAGER:** menaxhon menu, porosi, pagesa, raporte
- **WAITER:** krijon porosi, ndryshon status, pagesa
- **USER:** lexon meny + krijon rezervime/reviews
