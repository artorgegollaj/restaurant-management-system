-- ============================================================
-- Restaurant Management System — DDL i plote per MSSQL
-- Synchronized with Java entities (Hibernate ddl-auto=update)
-- ============================================================
USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'RestaurantDB')
    CREATE DATABASE RestaurantDB;
GO

USE RestaurantDB;
GO

-- ============== DROP (FK-first order) ==============
IF OBJECT_ID('user_roles',     'U') IS NOT NULL DROP TABLE user_roles;
IF OBJECT_ID('refresh_tokens', 'U') IS NOT NULL DROP TABLE refresh_tokens;
IF OBJECT_ID('user_tokens',    'U') IS NOT NULL DROP TABLE user_tokens;
IF OBJECT_ID('user_claims',    'U') IS NOT NULL DROP TABLE user_claims;
IF OBJECT_ID('payments',       'U') IS NOT NULL DROP TABLE payments;
IF OBJECT_ID('order_items',    'U') IS NOT NULL DROP TABLE order_items;
IF OBJECT_ID('orders',         'U') IS NOT NULL DROP TABLE orders;
IF OBJECT_ID('reservations',   'U') IS NOT NULL DROP TABLE reservations;
IF OBJECT_ID('reviews',        'U') IS NOT NULL DROP TABLE reviews;
IF OBJECT_ID('staff',          'U') IS NOT NULL DROP TABLE staff;
IF OBJECT_ID('ingredients',    'U') IS NOT NULL DROP TABLE ingredients;
IF OBJECT_ID('menu_items',     'U') IS NOT NULL DROP TABLE menu_items;
IF OBJECT_ID('menu_categories','U') IS NOT NULL DROP TABLE menu_categories;
IF OBJECT_ID('tables',         'U') IS NOT NULL DROP TABLE [tables];
IF OBJECT_ID('users',          'U') IS NOT NULL DROP TABLE users;
IF OBJECT_ID('roles',          'U') IS NOT NULL DROP TABLE roles;
GO

-- ============== ROLES & USERS ==============
-- Role.java: id, name (unique, not null)
CREATE TABLE roles (
    id   BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL UNIQUE
);

-- User.java: id, username (unique), email (unique), password
-- NOTE: no 'enabled' or 'created_at' — not mapped in entity
CREATE TABLE users (
    id       BIGINT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(255) NOT NULL UNIQUE,
    email    NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL
);
CREATE INDEX IX_users_email ON users(email);

-- User.java @ManyToMany @JoinTable(name="user_roles")
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- UserClaim.java: claimType (255), claimValue (@Column length=1000)
CREATE TABLE user_claims (
    id          BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id     BIGINT        NOT NULL,
    claim_type  NVARCHAR(255) NOT NULL,
    claim_value NVARCHAR(1000) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- UserToken.java: loginProvider, name, value (@Column length=1000), createdAt (Instant)
CREATE TABLE user_tokens (
    id             BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id        BIGINT         NOT NULL,
    login_provider NVARCHAR(255)  NOT NULL,
    name           NVARCHAR(255)  NOT NULL,
    value          NVARCHAR(1000) NOT NULL,
    created_at     DATETIME2      NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- RefreshToken.java: token (length=500 unique), expiryDate (Instant), revoked
CREATE TABLE refresh_tokens (
    id          BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id     BIGINT        NOT NULL,
    token       NVARCHAR(500) NOT NULL UNIQUE,
    expiry_date DATETIME2     NOT NULL,
    revoked     BIT           NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IX_refresh_tokens_user ON refresh_tokens(user_id);

-- ============== MENU ==============
-- MenuCategory.java: name (no unique annotation), description (@Column length=500)
CREATE TABLE menu_categories (
    id          BIGINT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(255) NOT NULL,
    description NVARCHAR(500) NULL
);

-- MenuItem.java: name, description (length=1000), price DECIMAL(10,2), image (length=500), available, category_id FK
CREATE TABLE menu_items (
    id          BIGINT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(255)  NOT NULL,
    description NVARCHAR(1000) NULL,
    price       DECIMAL(10,2)  NOT NULL CHECK (price >= 0),
    image       NVARCHAR(500)  NULL,
    available   BIT            NOT NULL DEFAULT 1,
    category_id BIGINT         NOT NULL,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id)
);
CREATE INDEX IX_menu_items_category ON menu_items(category_id);

-- Ingredient.java: name, unit, quantityAvailable, minimumQuantity
-- NOTE: no menu_item_id FK — not mapped in entity
CREATE TABLE ingredients (
    id                BIGINT IDENTITY(1,1) PRIMARY KEY,
    name              NVARCHAR(255) NOT NULL,
    unit              NVARCHAR(255) NOT NULL,
    quantity_available DECIMAL(10,2) NOT NULL,
    minimum_quantity   DECIMAL(10,2) NOT NULL
);

-- ============== TABLES & RESERVATIONS ==============
-- RestaurantTable.java: @Table(name="tables") — table name is 'tables' (reserved word → bracket)
CREATE TABLE [tables] (
    id           BIGINT IDENTITY(1,1) PRIMARY KEY,
    table_number INT           NOT NULL UNIQUE,
    capacity     INT           NOT NULL CHECK (capacity > 0),
    status       NVARCHAR(255) NOT NULL DEFAULT 'FREE'
);

-- Reservation.java: customerName, phone, reservationDate (LocalDate→DATE), reservationTime, table_id, partySize, status
CREATE TABLE reservations (
    id               BIGINT IDENTITY(1,1) PRIMARY KEY,
    customer_name    NVARCHAR(255) NOT NULL,
    phone            NVARCHAR(255) NULL,
    reservation_date DATE          NOT NULL,
    reservation_time TIME          NOT NULL,
    table_id         BIGINT        NOT NULL,
    party_size       INT           NOT NULL CHECK (party_size > 0),
    status           NVARCHAR(255) NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (table_id) REFERENCES [tables](id)
);
CREATE INDEX IX_reservations_date ON reservations(reservation_date);

-- ============== ORDERS ==============
-- OrderEntity.java: table_id (nullable FK), orderDate (LocalDateTime→DATETIME2), status, total, orderType
CREATE TABLE orders (
    id         BIGINT IDENTITY(1,1) PRIMARY KEY,
    table_id   BIGINT        NULL,
    order_date DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    status     NVARCHAR(255) NOT NULL DEFAULT 'PENDING',
    total      DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    order_type NVARCHAR(255) NOT NULL DEFAULT 'DINE_IN',
    FOREIGN KEY (table_id) REFERENCES [tables](id)
);
CREATE INDEX IX_orders_date   ON orders(order_date);
CREATE INDEX IX_orders_status ON orders(status);

-- OrderItem.java: order_id FK, menu_item_id FK, quantity, price, notes (no @Column → NVARCHAR(255))
CREATE TABLE order_items (
    id           BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_id     BIGINT        NOT NULL,
    menu_item_id BIGINT        NOT NULL,
    quantity     INT           NOT NULL CHECK (quantity > 0),
    price        DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    notes        NVARCHAR(255) NULL,
    FOREIGN KEY (order_id)     REFERENCES orders(id)     ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- ============== PAYMENTS ==============
-- Payment.java: @OneToOne(unique=true) order_id, amount, method, paymentDate (LocalDateTime→DATETIME2)
CREATE TABLE payments (
    id           BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_id     BIGINT        NOT NULL UNIQUE,
    amount       DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    method       NVARCHAR(255) NOT NULL,
    payment_date DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ============== STAFF ==============
-- Staff.java: firstName, lastName, position, phone, shift
-- NOTE: no user_id FK, no salary — not mapped in entity
CREATE TABLE staff (
    id         BIGINT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(255) NOT NULL,
    last_name  NVARCHAR(255) NOT NULL,
    position   NVARCHAR(255) NULL,
    phone      NVARCHAR(255) NULL,
    shift      NVARCHAR(255) NULL
);

-- ============== REVIEWS ==============
-- Review.java: customerName, rating (1-5), comment (length=1000), reviewDate (LocalDate→DATE)
CREATE TABLE reviews (
    id            BIGINT IDENTITY(1,1) PRIMARY KEY,
    customer_name NVARCHAR(255)  NOT NULL,
    rating        INT            NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment       NVARCHAR(1000) NULL,
    review_date   DATE           NOT NULL DEFAULT CAST(GETDATE() AS DATE)
);
GO

-- ============== SEED DATA ==============
INSERT INTO roles (name) VALUES ('ADMIN'), ('MANAGER'), ('WAITER'), ('USER');
GO

PRINT 'Schema krijuar me sukses!';
GO
