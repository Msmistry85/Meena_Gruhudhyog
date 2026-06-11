IF DB_ID('meena_gruhudyog') IS NULL
BEGIN
    CREATE DATABASE meena_gruhudyog;
END;
GO

USE meena_gruhudyog;
GO

IF OBJECT_ID('dbo.contacts', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.contacts (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) NOT NULL,
        category NVARCHAR(50) NOT NULL,
        product NVARCHAR(100) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        message NVARCHAR(MAX) NOT NULL,
        created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
        status NVARCHAR(20) DEFAULT 'new',
        notes NVARCHAR(MAX) NULL,
        updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
    );
    CREATE INDEX idx_email ON dbo.contacts(email);
    CREATE INDEX idx_category ON dbo.contacts(category);
    CREATE INDEX idx_created_at ON dbo.contacts(created_at);
END;
GO

IF OBJECT_ID('dbo.products', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.products (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        category NVARCHAR(20) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description NVARCHAR(MAX) NULL,
        image_url NVARCHAR(255) NULL,
        created_at DATETIME2 DEFAULT SYSUTCDATETIME()
    );
    CREATE INDEX idx_product_category ON dbo.products(category);
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.products WHERE name = 'Lavender Soap')
BEGIN
    INSERT INTO dbo.products (name, category, price, description) VALUES
    ('Lavender Soap', 'soap', 149.00, 'Lavender soap with essential oils'),
    ('Neem Soap', 'soap', 159.00, 'Neem soap for skin health'),
    ('Honey Soap', 'soap', 169.00, 'Honey soap for moisturizing'),
    ('Rose Shampoo', 'shampoo', 179.00, 'Rose shampoo bar for hair care'),
    ('Aloe Shampoo', 'shampoo', 189.00, 'Aloe vera shampoo bar'),
    ('Coconut Shampoo', 'shampoo', 169.00, 'Coconut shampoo bar');
END;
GO
