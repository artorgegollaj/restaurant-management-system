-- ============================================================
-- Restaurant Management System — DDL i plote per MSSQL
-- ============================================================
USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'RestaurantDB')
    CREATE DATABASE RestaurantDB;
GO

USE RestaurantDB;
GO

-- ============== ROLES & USERS ==============
IF OBJECT_ID('user_roles', 'U') IS NOT NULL DROP TABLE user_roles;
IF OBJECT_ID('refresh_tokens', 'U') IS NOT NULL DROP TABLE refresh_tokens;
IF OBJECT_ID('user_tokens', 'U') IS NOT NULL DROP TABLE user_tokens;
IF OBJECT_ID('user_claims', 'U') IS NOT NULL DROP TABLE user_claims;
IF OBJECT_ID('payments', 'U') IS NOT NULL DROP TABLE payments;
IF OBJECT_ID('order_items', 'U') IS NOT NULL DROP TABLE order_items;
IF OBJECT_ID('orders', 'U') IS NOT NULL DROP TABLE orders;
IF OBJECT_ID('reservations', 'U') IS NOT NULL DROP TABLE reservations;
IF OBJECT_ID('reviews', 'U') IS NOT NULL DROP TABLE reviews;
IF OBJECT_ID('staff', 'U') IS NOT NULL DROP TABLE staff;
IF OBJECT_ID('ingredients', 'U') IS NOT NULL DROP TABLE ingredients;
IF OBJECT_ID('menu_items', 'U') IS NOT NULL DROP TABLE menu_items;
IF OBJECT_ID('menu_categories', 'U') IS NOT NULL DROP TABLE menu_categories;
IF OBJECT_ID('restaurant_tables', 'U') IS NOT NULL DROP TABLE restaurant_tables;
IF OBJECT_ID('users', 'U') IS NOT NULL DROP TABLE users;
IF OBJECT_ID('roles', 'U') IS NOT NULL DROP TABLE roles;
GO

CREATE TABLE roles (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    enabled BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
CREATE INDEX IX_users_email ON users(email);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE user_claims (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    claim_type NVARCHAR(100) NOT NULL,
    claim_value NVARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_tokens (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    login_provider NVARCHAR(50) NOT NULL,
    name NVARCHAR(100) NOT NULL,
    value NVARCHAR(500) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE refresh_tokens (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token NVARCHAR(500) NOT NULL UNIQUE,
    expiry_date DATETIME2 NOT NULL,
    revoked BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IX_refresh_tokens_user ON refresh_tokens(user_id);

-- ============== MENU ==============
CREATE TABLE menu_categories (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(500) NULL
);

CREATE TABLE menu_items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(1000) NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    image NVARCHAR(500) NULL,
    available BIT NOT NULL DEFAULT 1,
    category_id BIGINT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id)
);
CREATE INDEX IX_menu_items_category ON menu_items(category_id);

CREATE TABLE ingredients (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit NVARCHAR(20) NOT NULL,
    menu_item_id BIGINT NULL,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE SET NULL
);

-- ============== TABLES & RESERVATIONS ==============
CREATE TABLE restaurant_tables (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    table_number INT NOT NULL UNIQUE,
    capacity INT NOT NULL CHECK (capacity > 0),
    status NVARCHAR(20) NOT NULL DEFAULT 'FREE'
        CHECK (status IN ('FREE','OCCUPIED','RESERVED'))
);

CREATE TABLE reservations (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    customer_name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    table_id BIGINT NOT NULL,
    party_size INT NOT NULL CHECK (party_size > 0),
    status NVARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING','CONFIRMED','CANCELLED','COMPLETED')),
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id)
);
CREATE INDEX IX_reservations_date ON reservations(reservation_date);

-- ============== ORDERS ==============
CREATE TABLE orders (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    table_id BIGINT NULL,
    order_date DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    status NVARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING','IN_PROGRESS','DELIVERED','PAID','CANCELLED')),
    total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    order_type NVARCHAR(20) NOT NULL DEFAULT 'DINE_IN'
        CHECK (order_type IN ('DINE_IN','ONLINE','TAKEAWAY')),
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE SET NULL
);
CREATE INDEX IX_orders_date ON orders(order_date);
CREATE INDEX IX_orders_status ON orders(status);

CREATE TABLE order_items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    notes NVARCHAR(500) NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- ============== PAYMENTS ==============
CREATE TABLE payments (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    method NVARCHAR(20) NOT NULL
        CHECK (method IN ('Cash','Card','Bank Transfer','PayPal')),
    paid_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ============== STAFF ==============
CREATE TABLE staff (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NULL,
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    position NVARCHAR(50) NOT NULL,
    shift NVARCHAR(20) NOT NULL CHECK (shift IN ('MORNING','EVENING','NIGHT')),
    salary DECIMAL(10,2) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============== REVIEWS ==============
CREATE TABLE reviews (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    customer_name NVARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment NVARCHAR(1000) NULL,
    review_date DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- ============== SEED DATA INICIAL ==============
INSERT INTO roles (name) VALUES ('ADMIN'),('MANAGER'),('WAITER'),('USER');
GO

PRINT 'Schema krijuar me sukses!';
GO
