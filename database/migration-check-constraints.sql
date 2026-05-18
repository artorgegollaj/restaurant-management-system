-- ============================================================
-- Migration: CHECK constraints per kolonat enum + numerike
-- Idempotent — perdor IF NOT EXISTS, mund te ekzekutohet pa frike
-- Run: sqlcmd -S localhost -U sa -P Admin@12345 -d RestaurantDB -i database/migration-check-constraints.sql
-- ============================================================
USE RestaurantDB;
GO

-- ===== orders.status =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_orders_status')
    ALTER TABLE orders ADD CONSTRAINT CK_orders_status
        CHECK (status IN ('PENDING','IN_PROGRESS','DELIVERED','PAID','CANCELLED'));
GO

-- ===== orders.order_type =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_orders_type')
    ALTER TABLE orders ADD CONSTRAINT CK_orders_type
        CHECK (order_type IN ('DINE_IN','ONLINE','TAKEAWAY','DELIVERY'));
GO

-- ===== orders.total >= 0 =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_orders_total_positive')
    ALTER TABLE orders ADD CONSTRAINT CK_orders_total_positive
        CHECK (total >= 0);
GO

-- ===== order_items.quantity > 0 =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_order_items_qty')
    ALTER TABLE order_items ADD CONSTRAINT CK_order_items_qty
        CHECK (quantity > 0);
GO

-- ===== order_items.price >= 0 =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_order_items_price')
    ALTER TABLE order_items ADD CONSTRAINT CK_order_items_price
        CHECK (price >= 0);
GO

-- ===== tables.status =====   (tabela quhet [tables] sepse 'tables' eshte reserved)
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_tables_status')
    ALTER TABLE [tables] ADD CONSTRAINT CK_tables_status
        CHECK (status IN ('FREE','OCCUPIED','RESERVED'));
GO

-- ===== tables.capacity > 0 =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_tables_capacity')
    ALTER TABLE [tables] ADD CONSTRAINT CK_tables_capacity
        CHECK (capacity > 0);
GO

-- ===== reservations.status =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_reservations_status')
    ALTER TABLE reservations ADD CONSTRAINT CK_reservations_status
        CHECK (status IN ('PENDING','CONFIRMED','CANCELLED','COMPLETED'));
GO

-- ===== reservations.party_size > 0 =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_reservations_party')
    ALTER TABLE reservations ADD CONSTRAINT CK_reservations_party
        CHECK (party_size > 0);
GO

-- ===== staff.shift =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_staff_shift')
    ALTER TABLE staff ADD CONSTRAINT CK_staff_shift
        CHECK (shift IN ('MORNING','EVENING','NIGHT'));
GO

-- ===== payments.method =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_payments_method')
    ALTER TABLE payments ADD CONSTRAINT CK_payments_method
        CHECK (method IN ('Cash','Card','Bank Transfer','PayPal'));
GO

-- ===== payments.amount >= 0 =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_payments_amount')
    ALTER TABLE payments ADD CONSTRAINT CK_payments_amount
        CHECK (amount >= 0);
GO

-- ===== reviews.rating 1-5 =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_reviews_rating')
    ALTER TABLE reviews ADD CONSTRAINT CK_reviews_rating
        CHECK (rating BETWEEN 1 AND 5);
GO

-- ===== menu_items.price >= 0 =====
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_menu_items_price')
    ALTER TABLE menu_items ADD CONSTRAINT CK_menu_items_price
        CHECK (price >= 0);
GO

PRINT 'CHECK constraints u shtuan me sukses!';
GO
