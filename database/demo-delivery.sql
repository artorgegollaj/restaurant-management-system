INSERT INTO orders (table_id, order_date, status, total, order_type)
VALUES
  (NULL, SYSDATETIME(), 'PENDING',    18.50, 'DELIVERY'),
  (NULL, SYSDATETIME(), 'PENDING',    24.00, 'DELIVERY'),
  (NULL, SYSDATETIME(), 'IN_PROGRESS', 9.90, 'DELIVERY');
GO

INSERT INTO deliveries (order_id, customer_name, customer_phone, address, status, delivery_fee, notes)
VALUES
  ((SELECT TOP 1 id FROM orders WHERE order_type='DELIVERY' ORDER BY id DESC OFFSET 2 ROWS FETCH NEXT 1 ROWS ONLY),
   'Arta Krasniqi', '+38344111222', 'Rr. Nene Tereza 5, Prishtine', 'PENDING', 2.50, 'Kati 2'),
  ((SELECT TOP 1 id FROM orders WHERE order_type='DELIVERY' ORDER BY id DESC OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY),
   'Besnik Hoxha',  '+38344333444', 'Rr. Bill Clinton 18, Prishtine', 'ASSIGNED', 2.50, NULL),
  ((SELECT TOP 1 id FROM orders WHERE order_type='DELIVERY' ORDER BY id DESC),
   'Drita Berisha', '+38344555666', 'Rr. Agim Ramadani 22, Prishtine', 'OUT_FOR_DELIVERY', 3.00, 'Telefono perpara');
GO

UPDATE deliveries SET courier_name='Drion G.', courier_phone='+38344999000'
WHERE status IN ('ASSIGNED','OUT_FOR_DELIVERY');
GO