USE RestaurantDB;
GO

-- pastrim i te dhenave ekzistuese
DELETE FROM payments;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM reservations;
DELETE FROM reviews;
DELETE FROM ingredients;
DELETE FROM menu_items;
DELETE FROM menu_categories;
DELETE FROM staff;
DELETE FROM restaurant_tables;
DELETE FROM refresh_tokens;
DELETE FROM user_roles;
DELETE FROM user_claims;
DELETE FROM user_tokens;
DELETE FROM users WHERE username NOT IN ('admin');
GO

-- resetimi i identiteteve
DBCC CHECKIDENT ('payments', RESEED, 0);
DBCC CHECKIDENT ('order_items', RESEED, 0);
DBCC CHECKIDENT ('orders', RESEED, 0);
DBCC CHECKIDENT ('reservations', RESEED, 0);
DBCC CHECKIDENT ('reviews', RESEED, 0);
DBCC CHECKIDENT ('menu_items', RESEED, 0);
DBCC CHECKIDENT ('menu_categories', RESEED, 0);
DBCC CHECKIDENT ('restaurant_tables', RESEED, 0);
GO

-- kategori
INSERT INTO menu_categories (name, description) VALUES
    ('Pjate kryesore', 'Pjatat kryesore te restorantit'),
    ('Antipasta', 'Pjate hapese'),
    ('Pije', 'Pije te ftohta dhe te ngrohta'),
    ('Embelsira', 'Desserts');

-- artikujt
INSERT INTO menu_items (name, description, price, available, category_id) VALUES
    ('Tave kosi', 'Specialitet shqiptar me mish dhe kos', 6.50, 1, 1),
    ('Pizza Margarita', 'Pizza klasike italiane', 5.00, 1, 1),
    ('Spageti Carbonara', 'Spageti me proshute dhe veze', 6.00, 1, 1),
    ('Sallate Greke', 'Sallate me djathe feta', 3.50, 1, 2),
    ('Bruschette', 'Buke me domate dhe rigon', 2.50, 1, 2),
    ('Coca-Cola 0.5L', 'Pije e gazuar', 1.50, 1, 3),
    ('Uje 0.5L', 'Uje natyral', 0.80, 1, 3),
    ('Espresso', 'Kafe italiane', 1.20, 1, 3),
    ('Tiramisu', 'Embelsira italiane', 3.00, 1, 4),
    ('Akullore', 'Akullore me 3 kupa', 2.50, 1, 4);

-- tavolina
INSERT INTO restaurant_tables (table_number, capacity, status) VALUES
    (1, 2, 'FREE'), (2, 2, 'FREE'), (3, 4, 'FREE'), (4, 4, 'FREE'),
    (5, 4, 'OCCUPIED'), (6, 6, 'FREE'), (7, 6, 'RESERVED'), (8, 8, 'FREE'),
    (9, 2, 'FREE'), (10, 2, 'FREE');

-- staffi
INSERT INTO staff (first_name, last_name, position, shift, salary) VALUES
    ('Yll', 'Nuradini', 'Manager', 'MORNING', 1200),
    ('Artor', 'Gegollaj', 'Waiter', 'EVENING', 800),
    ('Auron', 'Blakaj', 'Chef', 'EVENING', 1500),
    ('Drion', 'Gegollaj', 'Waiter', 'MORNING', 800);

-- shembull i porosise
INSERT INTO orders (table_id, order_date, status, total, order_type) VALUES
    (5, DATEADD(HOUR, -2, SYSUTCDATETIME()), 'PAID', 11.00, 'DINE_IN'),
    (3, DATEADD(MINUTE, -30, SYSUTCDATETIME()), 'IN_PROGRESS', 8.50, 'DINE_IN'),
    (NULL, DATEADD(MINUTE, -10, SYSUTCDATETIME()), 'PENDING', 6.50, 'TAKEAWAY');

INSERT INTO order_items (order_id, menu_item_id, quantity, price, notes) VALUES
    (1, 2, 2, 5.00, ''),
    (1, 7, 1, 1.00, 'Pa akull'),
    (2, 4, 1, 3.50, ''),
    (2, 9, 1, 5.00, ''),
    (3, 1, 1, 6.50, '');

INSERT INTO payments (order_id, amount, method) VALUES (1, 11.00, 'Card');

-- rezervime
INSERT INTO reservations (customer_name, phone, reservation_date, reservation_time, table_id, party_size, status) VALUES
    ('Familja Berisha', '+38344111222', DATEADD(DAY, 1, CAST(GETDATE() AS DATE)), '19:30', 7, 4, 'CONFIRMED'),
    ('Erion Sela', '+38344333444', DATEADD(DAY, 2, CAST(GETDATE() AS DATE)), '20:00', 8, 6, 'PENDING');

-- reviews
INSERT INTO reviews (customer_name, rating, comment) VALUES
    ('Klient Anonim', 5, 'Sherbim i shkelqyer dhe ushqim i shijshem!'),
    ('Visitor', 4, 'Atmosfere e bukur, çmime te arsyeshme'),
    ('Familja A.', 5, 'Do te kthehemi perseri me siguri');

PRINT 'Demo data u rivendos me sukses!';
PRINT 'Login: admin / Admin@12345';
GO