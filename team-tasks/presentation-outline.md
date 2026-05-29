# Slides Outline — Restaurant Management System

**Kohezgjatja:** 10-12 minuta + Q&A
**Mjet:** Google Slides ose PowerPoint
**Format:** 16:9, theme i pastert (te bardhe + blu primary)

---

## SLIDE 1 — Cover (15s)
**Title:** Restaurant Management System
**Subtitle:** Sistem i plote menaxhimi me Spring Boot + React + MSSQL
**Logo/Image:** Ikona e nje pjate ose furkete
**Authors:** Yll Nuradini, Artor Gegollaj, Yll Kadrijaj, Auron Blakaj, Drion Gegollaj
**Date:** Prill 2026 — UBT

---

## SLIDE 2 — Problemi & Qellimi (45s)
**Title:** Pse ky projekt?
- Restorantet ende perdorin letra dhe Excel per porosi/rezervime
- Mungese e statistikave real-time
- Konflikte mes turne-ve te kamarjereve
**Qellimi:** Sistem CRUD i unifikuar me role + raporte ditore

---

## SLIDE 3 — Tech Stack (60s)
**Title:** Stack-u i Perdorur
**Backend:**
- Spring Boot 3.2.5 / Java 17
- Spring Security + JWT (refresh token ne DB)
- Spring Data JPA + Hibernate
- MSSQL 2022

**Frontend:**
- React 18 + Vite
- Bootstrap 5 + Bootstrap Icons
- Axios (me refresh interceptor)
- MobX (token in-memory)
- Chart.js per dashboard

**Pse keto?** Industri-standard, Java skills ekzistuese, React popullor

---

## SLIDE 4 — Arkitektura (60s)
**Title:** Arkitektura
**Diagram:** [3-layer]
```
React (5173) ──HTTP+JWT──▶ Spring Boot (8080) ──JPA──▶ MSSQL
```
- 15 entitete, 14 controllers, 13 repositories
- 4 role: ADMIN, MANAGER, WAITER, USER
- Stateless API (JWT) → scalable

---

## SLIDE 5 — Database Schema (45s)
**Title:** Modeli i te Dhenave
**Diagram ER (i thjeshtuar):**
- Users ↔ Roles (M:N)
- MenuCategory → MenuItem → OrderItem ← Order → Table
- Order → Payment
- Reservation → Table
- Reviews (standalone)

**Konstrante:** CHECK ne enums (status, shift, method), FK me CASCADE/SET NULL

---

## SLIDE 6 — Auth & Security (60s)
**Title:** Autentikimi
1. **Register** → BCrypt password hash → users + user_roles
2. **Login** → JWT access (15 min) + Refresh (7 dite ne DB)
3. **Refresh** → revoke i vjetri + leshim token i ri (rotation)
4. **Logout** → revoke ne DB

**Frontend:**
- Token NUK ne localStorage (XSS) → MobX in-memory
- Axios interceptor: 401 → /refresh → retry

**Roles:** @PreAuthorize ne controllers

---

## SLIDE 7 — Live Demo (3 min) [SHKO TE BROWSER]
**Title:** Demo
**Skripti:**
1. Login admin
2. Krijo porosi me 2 artikuj → trego total auto
3. Ndrysho status PENDING → IN_PROGRESS → DELIVERED → PAID
4. Krijo pagese
5. Hap dashboard — chart me 7 dite
6. Logout — trego revoke ne DB

---

## SLIDE 8 — Veçori Kryesore (45s)
**Title:** Çfare e ben Special?
- ✓ JWT Refresh Token Rotation (industri-standard)
- ✓ Status state machine per porosi (validimi i tranzicioneve)
- ✓ Image upload me preview
- ✓ Dashboard me Chart.js (line + bar + doughnut)
- ✓ Bean Validation + Global Exception Handler
- ✓ Swagger UI (/swagger-ui.html)
- ✓ Postman collection per testim
- ✓ Role-based access ne 4 nivele

---

## SLIDE 9 — Sfidat & Mesimet (45s)
**Title:** Çfare Mesuam
- **Sfide:** `Order` eshte fjale e rezervuar JPQL → @Entity(name="OrderEntity")
- **Sfide:** Infinite loop ne JSON serialization → @JsonIgnoreProperties
- **Sfide:** MSSQL TCP/IP cfg + mixed-mode auth ne setup
- **Mesim:** State machine per status eshte me i miri se string i lire
- **Mesim:** MobX > localStorage per token (sigurise)

---

## SLIDE 10 — Tjeter Hap & Faleminderit (30s)
**Title:** Çfare Tjeter?
**Te ardhmen:**
- WebSockets per status real-time
- Audit log (kush beri çfare)
- Mobile app (React Native, ri-perdor JWT)
- Stripe per pagesa online
- Migrime me Flyway

**GitHub:** github.com/artorgegollaj/restaurant-management-system

**Faleminderit!**
**Q&A**

---

## Style Guide
- Font: Roboto / Open Sans
- Primary: #0d6efd (Bootstrap blu)
- Accent: #198754 (jeshile success)
- Background: e bardhe me header te bardhe blu
- Code blocks: ngjyre te ngrohte (#1e1e1e)
- Çdo slide max 5 bullets, font >=24pt

## Roli i secilit ne prezantim
| Slide | Folesi |
|-------|--------|
| 1 (cover) | Yll Nuradini |
| 2-3 (problem + stack) | Artor Gegollaj |
| 4-5 (architecture + DB) | Yll Kadrijaj |
| 6 (auth) | Drion Gegollaj |
| 7 (demo live) | Yll Nuradini |
| 8 (features) | Auron Blakaj |
| 9 (lessons) | Drion Gegollaj |
| 10 + Q&A | Te gjithe |