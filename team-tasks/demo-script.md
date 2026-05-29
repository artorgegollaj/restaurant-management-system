# Skripti i Demo-s — Restaurant Management System

**Kohezgjatja:** ~5 minuta
**Folesi:** Yll Nuradini

## 1. Hyrje (15s)
- "Po prezantojme nje sistem te plote menaxhimi restoranti me Spring Boot + React + MSSQL."

## 2. Login (30s)
- Hap http://localhost:5173
- Username: `admin`, Password: `Admin@12345`
- Trego: token NUK ruhet ne localStorage — eshte ne memorie (MobX)
- Hap DevTools → Network → trego header `Authorization: Bearer ...`

## 3. Menu Categories (45s)
- Klik "Kategoride"
- Shto kategori "Specialite"
- Edito → Fshi
- Trego validimin "Emertimi eshte i detyrueshem"

## 4. Menu Items (45s)
- Klik "Artikujt e Menyse"
- Shto "Pizza 4 djathra" — 7.50€ — kategoria Pje kryesore
- Trego dropdown-in dinamik te kategorive

## 5. Tavolinat (30s)
- Klik "Tavolinat" — trego 10 tavolina te seeded
- Ndrysho status nje tavoline ne RESERVED

## 6. Krijo Porosi e Plote (60s)
- Klik "Porosite" → "Porosi e Re"
- Lloji: "Ne lokal", Tavolina #3
- Shto 2 artikuj: Pizza Margarita x2 + Coca-Cola x1
- Klik "Ruaj" → trego total = (5.00 × 2) + 1.50 = 11.50€
- Trego ne DB: `SELECT * FROM order_items WHERE order_id = ?`

## 7. Ndrysho Status Porosie (20s)
- Dropdown ne tabele: Ne pritje → Ne pergatitje → E dorezuar → E paguar
- Trego endpoint PATCH ne Network tab

## 8. Pagesa (30s)
- Klik "Pagesat" → "Pagese e Re"
- Zgjidh porosine #1, shuma 11.50€, metoda Cash
- Ruaj

## 9. Dashboard (30s)
- Klik "Dashboard"
- Trego shitjet ditore + top produktet
- Filtro nga date X deri date Y

## 10. Refresh Token Flow (30s)
- Hap DevTools → Application → trego qe ska token ne localStorage
- Klik refresh ne nje pagine — request shkon me token-in nga memoria
- Pas 15 min (ose modifiko expiration ne dev), interceptor-i thrret /refresh automatikisht

## 11. Logout & Mbyllje (15s)
- Klik logout — trego revoke ne DB: `SELECT * FROM refresh_tokens WHERE revoked = 1`
- "Faleminderit!"

## Backup nese diçka deshton
- Screenshot folder: `team-tasks/demo-screenshots/`
- Video backup: `team-tasks/demo-backup.mp4`
- Postman collection: `team-tasks/restaurant-api.postman_collection.json`
