# Q&A Prep — Restaurant Management System

## Sigurise & Auth

**Q: Pse JWT dhe jo session?**
A: REST eshte stateless; JWT mundeson scaling horizontal pa qenes te ndashme; mobil/web mund te perdorin te njejtin API.

**Q: Pse refresh token-et ne DB?**
A: Per t'i revoked menjehere ne logout. Nese ishin self-contained, do te qendronin valide deri ne expiration.

**Q: Cila eshte gjatesia e access dhe refresh token-it?**
A: Access = 15 minuta (900000ms). Refresh = 7 dite (604800000ms).

**Q: Ku ruhet token-i ne frontend?**
A: NUK ne localStorage/sessionStorage (XSS risk). E ruajme ne MobX store ne memorie. Refresh-i merr token te ri nga DB.

**Q: Si funksionon JwtAuthFilter?**
A: Para çdo request-i, lexon header `Authorization: Bearer ...`, valid-on signature dhe expiration, ben populate `SecurityContext` me UserDetails + roles.

**Q: BCrypt apo plaintext?**
A: BCrypt me strength 10 (default Spring). Nuk ruhet password ne plaintext kurre.

## Arkitektura

**Q: Pse Spring Boot 3?**
A: Suporti per Java 17 LTS, Jakarta EE 9+ namespace, performance i permiresuar, native image support.

**Q: Pse MSSQL dhe jo PostgreSQL/MySQL?**
A: Kerkesa e projektit. JPA bashke me Hibernate na lejon te ndryshojme dialect-in pa ndryshuar kodin.

**Q: Si menaxhohet relacioni Order ↔ OrderItem?**
A: ManyToOne ne te dyja drejtimet: OrderItem.order (FK order_id), pastaj order.items egzaminohet ndaras kur duhet (lazy loading per default).

**Q: Pse `@Entity(name = "OrderEntity")`?**
A: `Order` eshte fjale e rezervuar ne JPQL (ORDER BY). Duke e emertuar ndryshe ne entitet, JPQL queries funksionojne.

**Q: Pse @JsonIgnoreProperties?**
A: Per te shmangur infinite loops ne serializimin JSON kur User → Roles → Users → ...

## Performance

**Q: Si menaxhoni N+1 queries?**
A: Per relacionet kritike perdorim FetchType.EAGER. Per cases me kompleks, mund te shtojme @EntityGraph ose JOIN FETCH ne queries.

**Q: A keni indekse ne DB?**
A: Po — ne refresh_tokens(user_id), orders(order_date, status), reservations(date), menu_items(category_id).

**Q: Pse JPA `ddl-auto=update` jo `validate`?**
A: Per dev-in. Ne prod do te perdorim Flyway/Liquibase me migrime te versionuara.

## Frontend

**Q: Pse Vite jo CRA?**
A: 10x me i shpejte ne dev (Hot Module Replacement). CRA eshte deprecated.

**Q: Pse MobX jo Redux?**
A: API me i thjeshte per state vogel global (vetem auth). Redux do te ishte overkill.

**Q: Si funksionon refresh i automatik?**
A: Axios interceptor: kap 401, thirr /api/auth/refresh me refresh token, ruaj access te ri ne MobX, retry request-in origjinal.

**Q: Bootstrap apo Tailwind?**
A: Bootstrap 5 — komponente gati (modals, alerts, badges) qe perputhen me kerkesat e UI te thjeshte.

## Testing

**Q: Sa coverage keni?**
A: Auth + Orders kane integration tests. Coverage ~60% ne layer-in e controller-eve.

**Q: Pse H2 ne tests?**
A: In-memory, i shpejte, MSSQLServer mode emulon dialect-in.

## Probleme te njohura / TODO

**Q: Cili eshte limiti i njohur?**
A: Pa role-based row-level security (te gjithe me role MANAGER shohin te gjitha porosite, jo vetem ato te tyret).

**Q: Çfare do te shtonit nese kishit me shume kohe?**
A: WebSocket per status updates real-time, audit log (kush ndryshoi çfare), backup automatik i DB, tests me Cypress per E2E frontend.

## Pyetje teknike te perafera

**Q: Cila eshte ndryshimi mes @RequestBody dhe @RequestParam?**
A: `@RequestBody` deserializon JSON nga body. `@RequestParam` lexon query string ose form data.

**Q: Pse @Transactional?**
A: Per atomicity — nese OrderItem deshton te ruhet, gjithe transakcioni rollback-on, dhe Order nuk mbetet "orphan" pa items.

**Q: Si validoni input?**
A: Bean Validation (@NotBlank, @Min, @Email) ne DTOs, plus custom checks ne controller (statuset valide, transitions lejuara).
