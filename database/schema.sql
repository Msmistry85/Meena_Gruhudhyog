-- Create database
CREATE DATABASE IF NOT EXISTS meena_gruhudyog;
USE meena_gruhudyog;

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  product VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'new',
  notes TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_category (category),
  INDEX idx_created_at (created_at)
);

-- Create products table for reference
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category ENUM('soap', 'shampoo') NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category)
);

-- Insert sample products
INSERT INTO products (name, category, price, description) VALUES
('Lavender Soap', 'soap', 149.00, 'Lavender soap with essential oils'),
('Neem Soap', 'soap', 159.00, 'Neem soap for skin health'),
('Honey Soap', 'soap', 169.00, 'Honey soap for moisturizing'),
('Rose Shampoo', 'shampoo', 179.00, 'Rose shampoo bar for hair care'),
('Aloe Shampoo', 'shampoo', 189.00, 'Aloe vera shampoo bar'),
('Coconut Shampoo', 'shampoo', 169.00, 'Coconut shampoo bar');
