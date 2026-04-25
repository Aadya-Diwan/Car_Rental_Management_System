-- =====================================
-- CREATE DATABASE
-- =====================================
CREATE DATABASE IF NOT EXISTS Car_Rental_Management_System;
USE Car_Rental_Management_System;


-- =====================================
-- CUSTOMERS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    license_number VARCHAR(50) UNIQUE
);


-- =====================================
-- CARS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS Cars (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(100),
    brand VARCHAR(100),
    year INT,
    price_per_day DECIMAL(10,2),
    status ENUM('available','rented','maintenance') DEFAULT 'available'
);


-- =====================================
-- RENTALS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS Rentals (
    rental_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    car_id INT,
    start_date DATE,
    end_date DATE,
    total_amount DECIMAL(10,2),
    status ENUM('ongoing','completed','cancelled') DEFAULT 'ongoing',

    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES Cars(car_id) ON DELETE CASCADE,

    CHECK (end_date > start_date)
);


-- =====================================
-- PAYMENTS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT,
    amount DECIMAL(10,2),
    status ENUM('paid','pending') DEFAULT 'paid',

    FOREIGN KEY (rental_id) REFERENCES Rentals(rental_id) ON DELETE CASCADE
);


-- =====================================
-- SAMPLE DATA (CARS)
-- =====================================
INSERT INTO Cars (model, brand, year, price_per_day, status) VALUES
('Swift', 'Maruti', 2022, 1500, 'available'),
('Baleno', 'Maruti', 2021, 1400, 'available'),
('Creta', 'Hyundai', 2023, 2500, 'available'),
('Venue', 'Hyundai', 2022, 2200, 'available'),
('City', 'Honda', 2023, 2800, 'available'),
('Amaze', 'Honda', 2021, 1600, 'maintenance'),
('Fortuner', 'Toyota', 2023, 5000, 'available'),
('Innova', 'Toyota', 2022, 3500, 'available'),
('XUV700', 'Mahindra', 2023, 4000, 'available'),
('Thar', 'Mahindra', 2022, 4500, 'available'),
('i20', 'Hyundai', 2021, 1300, 'available'),
('Kia Seltos', 'Kia', 2023, 3000, 'available');


-- =====================================
-- VIEW (FOR PROJECT)
-- =====================================
CREATE VIEW rental_view AS
SELECT 
    cu.name,
    c.model,
    r.start_date,
    r.end_date
FROM Rentals r
JOIN Customers cu ON r.customer_id = cu.customer_id
JOIN Cars c ON r.car_id = c.car_id;


-- =====================================
-- USEFUL QUERIES (FOR REPORT)
-- =====================================

-- Available Cars
SELECT * FROM Cars WHERE status='available';

-- Rental Cost (example)
SELECT DATEDIFF(end_date, start_date) * price_per_day AS total_cost
FROM Rentals r
JOIN Cars c ON r.car_id = c.car_id;

-- Total Revenue
SELECT SUM(amount) AS total_revenue FROM Payments;

-- Top Customers
SELECT cu.name, SUM(r.total_amount) AS total_spent
FROM Rentals r
JOIN Customers cu ON r.customer_id = cu.customer_id
GROUP BY cu.customer_id
ORDER BY total_spent DESC;
