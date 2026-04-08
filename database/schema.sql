CREATE DATABASE RestaurantManagementDB;
GO

USE RestaurantManagementDB;
GO


CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255) NULL
);
GO

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    PhoneNumber NVARCHAR(30) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE UserRoles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_UserRoles UNIQUE (UserId, RoleId)
);
GO

CREATE TABLE UserClaims (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ClaimType NVARCHAR(100) NOT NULL,
    ClaimValue NVARCHAR(255) NOT NULL,
    CONSTRAINT FK_UserClaims_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

CREATE TABLE UserTokens (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    TokenName NVARCHAR(100) NOT NULL,
    TokenValue NVARCHAR(MAX) NOT NULL,
    ExpirationDate DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_UserTokens_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

CREATE TABLE RefreshTokens (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Token NVARCHAR(500) NOT NULL UNIQUE,
    ExpiresAt DATETIME2 NOT NULL,
    IsRevoked BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    RevokedAt DATETIME2 NULL,
    ReplacedByToken NVARCHAR(500) NULL,
    CONSTRAINT FK_RefreshTokens_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

/* =========================
   MENU
========================= */

CREATE TABLE MenuCategories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Emertimi NVARCHAR(100) NOT NULL,
    Pershkrimi NVARCHAR(255) NULL
);
GO

CREATE TABLE MenuItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Emertimi NVARCHAR(150) NOT NULL,
    Pershkrimi NVARCHAR(500) NULL,
    Cmimi DECIMAL(10,2) NOT NULL CHECK (Cmimi >= 0),
    Imazhi NVARCHAR(500) NULL,
    CategoryId INT NOT NULL,
    Disponueshmeria BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_MenuItems_MenuCategories FOREIGN KEY (CategoryId) REFERENCES MenuCategories(Id)
);
GO

/* =========================
   TABLES & RESERVATIONS
========================= */

CREATE TABLE Tables (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    NumriTavolines INT NOT NULL UNIQUE,
    Kapaciteti INT NOT NULL CHECK (Kapaciteti > 0),
    Statusi NVARCHAR(50) NOT NULL
        CHECK (Statusi IN ('E lire', 'E zene', 'E rezervuar', 'Jashte funksionit'))
);
GO

CREATE TABLE Reservations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EmriKlientit NVARCHAR(150) NOT NULL,
    Telefoni NVARCHAR(30) NOT NULL,
    Data DATE NOT NULL,
    Ora TIME NOT NULL,
    TableId INT NOT NULL,
    NumriPersonave INT NOT NULL CHECK (NumriPersonave > 0),
    Statusi NVARCHAR(50) NOT NULL
        CHECK (Statusi IN ('Ne pritje', 'Konfirmuar', 'Anuluar', 'Perfuduar')),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Reservations_Tables FOREIGN KEY (TableId) REFERENCES Tables(Id)
);
GO

/* =========================
   ORDERS
========================= */

CREATE TABLE Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TableId INT NULL,
    DataOrar DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Statusi NVARCHAR(50) NOT NULL
        CHECK (Statusi IN ('Ne pritje', 'Ne pergatitje', 'E dorezuar', 'E paguar', 'Anuluar')),
    Totali DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (Totali >= 0),
    LlojiPorosise NVARCHAR(50) NOT NULL
        CHECK (LlojiPorosise IN ('Ne lokal', 'Online', 'Takeaway')),
    CreatedByUserId INT NULL,
    CustomerName NVARCHAR(150) NULL,
    CustomerPhone NVARCHAR(30) NULL,
    DeliveryAddress NVARCHAR(255) NULL,
    CONSTRAINT FK_Orders_Tables FOREIGN KEY (TableId) REFERENCES Tables(Id),
    CONSTRAINT FK_Orders_Users FOREIGN KEY (CreatedByUserId) REFERENCES Users(Id)
);
GO

CREATE TABLE OrderItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    MenuItemId INT NOT NULL,
    Sasia INT NOT NULL CHECK (Sasia > 0),
    Cmimi DECIMAL(10,2) NOT NULL CHECK (Cmimi >= 0),
    Shenime NVARCHAR(500) NULL,
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_MenuItems FOREIGN KEY (MenuItemId) REFERENCES MenuItems(Id)
);
GO

/* =========================
   STAFF
========================= */

CREATE TABLE Staff (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Emri NVARCHAR(100) NOT NULL,
    Mbiemri NVARCHAR(100) NOT NULL,
    Pozicioni NVARCHAR(100) NOT NULL,
    Telefoni NVARCHAR(30) NULL,
    Turni NVARCHAR(50) NOT NULL
        CHECK (Turni IN ('Paradite', 'Pasdite', 'Nate')),
    UserId INT NULL,
    CONSTRAINT FK_Staff_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);
GO

/* =========================
   PAYMENTS
========================= */

CREATE TABLE Payments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL UNIQUE,
    Shuma DECIMAL(12,2) NOT NULL CHECK (Shuma >= 0),
    MetodaPageses NVARCHAR(50) NOT NULL
        CHECK (MetodaPageses IN ('Cash', 'Card', 'Bank Transfer', 'PayPal')),
    Data DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Payments_Orders FOREIGN KEY (OrderId) REFERENCES Orders(Id)
);
GO

/* =========================
   REVIEWS
========================= */

CREATE TABLE Reviews (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EmriKlientit NVARCHAR(150) NOT NULL,
    Vleresimi INT NOT NULL CHECK (Vleresimi BETWEEN 1 AND 5),
    Komenti NVARCHAR(1000) NULL,
    Data DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

/* =========================
   INGREDIENTS
========================= */

CREATE TABLE Ingredients (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Emertimi NVARCHAR(150) NOT NULL,
    Njesia NVARCHAR(50) NOT NULL,
    SasiaDisponueshme DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (SasiaDisponueshme >= 0),
    SasiaMinimale DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (SasiaMinimale >= 0)
);
GO

/* =========================
   OPTIONAL: MENUITEM INGREDIENTS
   (e mire per projekt me te plote)
========================= */

CREATE TABLE MenuItemIngredients (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    MenuItemId INT NOT NULL,
    IngredientId INT NOT NULL,
    QuantityNeeded DECIMAL(10,2) NOT NULL CHECK (QuantityNeeded > 0),
    CONSTRAINT FK_MenuItemIngredients_MenuItems FOREIGN KEY (MenuItemId) REFERENCES MenuItems(Id) ON DELETE CASCADE,
    CONSTRAINT FK_MenuItemIngredients_Ingredients FOREIGN KEY (IngredientId) REFERENCES Ingredients(Id),
    CONSTRAINT UQ_MenuItemIngredients UNIQUE (MenuItemId, IngredientId)
);
GO

/* =========================
   INDEXES
========================= */

CREATE INDEX IX_MenuItems_CategoryId ON MenuItems(CategoryId);
CREATE INDEX IX_Reservations_TableId ON Reservations(TableId);
CREATE INDEX IX_Orders_TableId ON Orders(TableId);
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(OrderId);
CREATE INDEX IX_OrderItems_MenuItemId ON OrderItems(MenuItemId);
CREATE INDEX IX_RefreshTokens_UserId ON RefreshTokens(UserId);
CREATE INDEX IX_Staff_UserId ON Staff(UserId);
GO

/* =========================
   SEED DATA
========================= */

INSERT INTO Roles (Name, Description) VALUES
('Admin', 'Administratori i sistemit'),
('Manager', 'Menaxher restoranti'),
('Waiter', 'Kamarier'),
('Cashier', 'Arkatar');
GO

INSERT INTO MenuCategories (Emertimi, Pershkrimi) VALUES
('Pije', 'Pije te ftohta dhe te ngrohta'),
('Pizza', 'Lloje te ndryshme te pizzave'),
('Burger', 'Burger klasik dhe special'),
('Embelsira', 'Torta dhe embelsira');
GO

INSERT INTO Tables (NumriTavolines, Kapaciteti, Statusi) VALUES
(1, 4, 'E lire'),
(2, 2, 'E lire'),
(3, 6, 'E lire'),
(4, 8, 'E lire');
GO

INSERT INTO Ingredients (Emertimi, Njesia, SasiaDisponueshme, SasiaMinimale) VALUES
('Djath', 'kg', 10, 2),
('Mish', 'kg', 15, 3),
('Miell', 'kg', 20, 5),
('Domate', 'kg', 12, 3),
('Coca Cola', 'litra', 30, 5);
GO