USE RestaurantDB;
GO

IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'restaurant_app')
BEGIN
    CREATE USER restaurant_app FOR LOGIN restaurant_app;
END
GO

ALTER ROLE db_owner ADD MEMBER restaurant_app;
GO