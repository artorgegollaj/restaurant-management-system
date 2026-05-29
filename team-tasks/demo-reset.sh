#!/bin/bash
sqlcmd -S localhost -U sa -P Admin@12345 -i database/demo-reset.sql
echo "Demo data ready. Restart backend nese duhet: cd backend && mvn spring-boot:run"
