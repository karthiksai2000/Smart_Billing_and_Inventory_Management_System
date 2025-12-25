-- ============================================
-- ASHA HARDWARE BILLING SYSTEM - TEST DATA
-- ============================================
-- This script inserts 50+ rows into each table
-- for comprehensive testing purposes
-- ============================================

-- ============================================
-- 0. CLEAR EXISTING DATA (Handle Foreign Keys)
-- ============================================
-- Disable foreign key checks to avoid constraint violations
SET FOREIGN_KEY_CHECKS=0;

DELETE FROM bill_items;
DELETE FROM bills;
DELETE FROM items;
DELETE FROM categories;
DELETE FROM users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;

-- Reset AUTO_INCREMENT counters for clean IDs
ALTER TABLE categories AUTO_INCREMENT = 1;
ALTER TABLE items AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE bills AUTO_INCREMENT = 1;
ALTER TABLE bill_items AUTO_INCREMENT = 1;

-- ============================================
-- 1. CATEGORIES TABLE (3 rows)
-- ============================================
INSERT INTO categories (name) VALUES
('Hardware'),
('Electrical'),
('Plumbing');

-- ============================================
-- 2. ITEMS TABLE (60 rows)
-- ============================================
-- Hardware Category Items (20)
INSERT INTO items (custom_id, name, category_id, stock_quantity, price) VALUES
('HW001', 'Hammer - 1kg', 1, 150, 250.00),
('HW002', 'Hammer - 500g', 1, 200, 180.00),
('HW003', 'Screwdriver Set (10pcs)', 1, 80, 320.00),
('HW004', 'Wrench Set (15pcs)', 1, 60, 450.00),
('HW005', 'Drill Machine 13mm', 1, 40, 1800.00),
('HW006', 'Drill Bits Set', 1, 100, 280.00),
('HW007', 'Saw Blade 10"', 1, 120, 220.00),
('HW008', 'Measuring Tape 25m', 1, 200, 150.00),
('HW009', 'Spirit Level 2ft', 1, 90, 280.00),
('HW010', 'Plier Set (8pcs)', 1, 110, 380.00),
('HW011', 'Clamps C-Clamp 4"', 1, 150, 120.00),
('HW012', 'Clamps C-Clamp 6"', 1, 120, 180.00),
('HW013', 'Clamps F-Clamp 12"', 1, 85, 250.00),
('HW014', 'Vice Clamp 4"', 1, 45, 650.00),
('HW015', 'Nail Assorted Box 1kg', 1, 300, 180.00),
('HW016', 'Wood Screws Box 500g', 1, 250, 140.00),
('HW017', 'Machine Bolts M8 1kg', 1, 200, 220.00),
('HW018', 'Anchor Bolts Mixed 1kg', 1, 180, 190.00),
('HW019', 'Grease Gun', 1, 50, 420.00),
('HW020', 'Tool Belt Heavy Duty', 1, 30, 580.00),

-- Electrical Category Items (20)
('EL001', 'LED Bulb 5W', 2, 500, 80.00),
('EL002', 'LED Bulb 7W', 2, 480, 120.00),
('EL003', 'LED Bulb 9W', 2, 450, 140.00),
('EL004', 'LED Tube 2ft', 2, 400, 250.00),
('EL005', 'LED Tube 4ft', 2, 350, 420.00),
('EL006', 'CFL Bulb 12W', 2, 350, 95.00),
('EL007', 'Incandescent Bulb 60W', 2, 600, 25.00),
('EL008', 'Incandescent Bulb 100W', 2, 500, 35.00),
('EL009', 'Switch 1 Gang 6A', 2, 300, 60.00),
('EL010', 'Switch 2 Gang 6A', 2, 250, 90.00),
('EL011', 'Socket 3 Pin 15A', 2, 280, 85.00),
('EL012', 'Socket 5 Pin 15A', 2, 200, 140.00),
('EL013', 'Junction Box 100x100', 2, 400, 45.00),
('EL014', 'Cable 1.5sqmm Per Meter', 2, 2000, 12.00),
('EL015', 'Cable 2.5sqmm Per Meter', 2, 1800, 18.00),
('EL016', 'Cable 4sqmm Per Meter', 2, 1500, 28.00),
('EL017', 'MCB 6A Single Pole', 2, 350, 45.00),
('EL018', 'MCB 16A Single Pole', 2, 300, 65.00),
('EL019', 'Conduit Pipe 20mm Per Meter', 2, 2500, 8.00),
('EL020', 'Electrical Tape Roll', 2, 400, 35.00),

-- Plumbing Category Items (20)
('PL001', 'PVC Pipe 1/2" Per Meter', 3, 3000, 15.00),
('PL002', 'PVC Pipe 3/4" Per Meter', 3, 2500, 22.00),
('PL003', 'PVC Pipe 1" Per Meter', 3, 2000, 30.00),
('PL004', 'PVC Elbow 1/2"', 3, 600, 8.00),
('PL005', 'PVC Elbow 3/4"', 3, 500, 12.00),
('PL006', 'PVC Elbow 1"', 3, 400, 18.00),
('PL007', 'PVC Tee 1/2"', 3, 550, 10.00),
('PL008', 'PVC Tee 3/4"', 3, 450, 15.00),
('PL009', 'PVC Tee 1"', 3, 350, 22.00),
('PL010', 'PVC End Cap 1/2"', 3, 800, 5.00),
('PL011', 'PVC End Cap 3/4"', 3, 700, 7.00),
('PL012', 'PVC End Cap 1"', 3, 600, 10.00),
('PL013', 'PVC Union 1/2"', 3, 400, 20.00),
('PL014', 'PVC Union 3/4"', 3, 350, 28.00),
('PL015', 'PVC Union 1"', 3, 300, 35.00),
('PL016', 'PVC Ball Valve 1/2"', 3, 300, 45.00),
('PL017', 'PVC Ball Valve 3/4"', 3, 250, 65.00),
('PL018', 'PVC Ball Valve 1"', 3, 200, 85.00),
('PL019', 'Plumbing Cement 250ml', 3, 500, 55.00),
('PL020', 'PTFE Tape Roll 20m', 3, 400, 25.00);

-- ============================================
-- 3. USERS TABLE (5 rows - Cashiers & Admin)
-- ============================================
-- Note: These passwords are hashed (spring security encoding)
-- Default password: test123 (hashed with bcrypt)
INSERT INTO users (username, password, role) VALUES
('admin1', '$2a$10$slYQmyNdGzin7olVN3p5Be4DlH.PKZbv5H8KnzzVgXXbVxzy72uDm', 'ADMIN'),
('cashier1', '$2a$10$slYQmyNdGzin7olVN3p5Be4DlH.PKZbv5H8KnzzVgXXbVxzy72uDm', 'CASHIER'),
('cashier2', '$2a$10$slYQmyNdGzin7olVN3p5Be4DlH.PKZbv5H8KnzzVgXXbVxzy72uDm', 'CASHIER'),
('cashier3', '$2a$10$slYQmyNdGzin7olVN3p5Be4DlH.PKZbv5H8KnzzVgXXbVxzy72uDm', 'CASHIER'),
('cashier4', '$2a$10$slYQmyNdGzin7olVN3p5Be4DlH.PKZbv5H8KnzzVgXXbVxzy72uDm', 'CASHIER');

-- ============================================
-- 4. BILLS TABLE (60 rows)
-- ============================================
-- Distributed across cashiers, various dates in last 90 days
INSERT INTO bills (date, cashier_id, refunded, refunded_date) VALUES
-- December 2024 Bills (Cashier 1)
('2024-12-23 09:15:00', 2, false, NULL),
('2024-12-23 10:45:00', 2, false, NULL),
('2024-12-23 14:20:00', 2, false, NULL),
('2024-12-22 09:30:00', 2, true, '2024-12-22 15:00:00'),
('2024-12-22 11:00:00', 2, false, NULL),
('2024-12-21 10:15:00', 3, false, NULL),
('2024-12-21 13:45:00', 3, false, NULL),
('2024-12-20 09:00:00', 3, false, NULL),
('2024-12-20 14:30:00', 4, false, NULL),
('2024-12-19 10:20:00', 4, false, NULL),
('2024-12-19 15:45:00', 5, false, NULL),
('2024-12-18 09:30:00', 2, false, NULL),
('2024-12-18 12:00:00', 2, false, NULL),
('2024-12-17 10:45:00', 3, true, '2024-12-18 09:00:00'),
('2024-12-17 14:15:00', 3, false, NULL),
('2024-12-16 09:15:00', 4, false, NULL),
('2024-12-16 13:30:00', 4, false, NULL),
('2024-12-15 10:00:00', 5, false, NULL),
('2024-12-15 14:45:00', 5, false, NULL),
('2024-12-14 09:45:00', 2, false, NULL),

-- December Early Bills
('2024-12-13 10:30:00', 2, false, NULL),
('2024-12-12 11:15:00', 3, false, NULL),
('2024-12-11 09:00:00', 3, false, NULL),
('2024-12-10 14:00:00', 4, false, NULL),
('2024-12-09 10:30:00', 4, true, '2024-12-10 10:00:00'),
('2024-12-08 13:45:00', 5, false, NULL),
('2024-12-07 09:15:00', 5, false, NULL),
('2024-12-06 11:00:00', 2, false, NULL),
('2024-12-05 14:30:00', 2, false, NULL),
('2024-12-04 10:15:00', 3, false, NULL),

-- November 2024 Bills (Late)
('2024-11-30 09:30:00', 3, false, NULL),
('2024-11-29 13:00:00', 4, false, NULL),
('2024-11-28 10:45:00', 4, false, NULL),
('2024-11-27 14:20:00', 5, false, NULL),
('2024-11-26 09:15:00', 5, false, NULL),
('2024-11-25 11:30:00', 2, true, '2024-11-26 10:00:00'),
('2024-11-24 10:00:00', 2, false, NULL),
('2024-11-23 14:45:00', 3, false, NULL),
('2024-11-22 09:30:00', 3, false, NULL),
('2024-11-21 13:15:00', 4, false, NULL),

-- November Mid
('2024-11-20 10:30:00', 4, false, NULL),
('2024-11-19 14:00:00', 5, false, NULL),
('2024-11-18 09:45:00', 5, false, NULL),
('2024-11-17 11:20:00', 2, false, NULL),
('2024-11-16 10:15:00', 2, false, NULL),
('2024-11-15 13:45:00', 3, false, NULL),
('2024-11-14 09:00:00', 3, false, NULL),
('2024-11-13 14:30:00', 4, true, '2024-11-14 09:30:00'),
('2024-11-12 10:45:00', 4, false, NULL),
('2024-11-11 12:00:00', 5, false, NULL),

-- November Early & October
('2024-11-10 09:30:00', 5, false, NULL),
('2024-11-09 13:15:00', 2, false, NULL),
('2024-11-08 10:00:00', 2, false, NULL),
('2024-11-07 14:45:00', 3, false, NULL),
('2024-11-06 09:15:00', 3, false, NULL),
('2024-10-30 11:00:00', 4, false, NULL),
('2024-10-29 10:30:00', 4, false, NULL),
('2024-10-28 13:45:00', 5, false, NULL),
('2024-10-27 09:00:00', 5, false, NULL),
('2024-10-26 14:20:00', 2, false, NULL);

-- ============================================
-- 5. BILL_ITEMS TABLE (200+ rows)
-- ============================================
-- For 60 bills, we'll create 3-4 items per bill
-- Bill 1 - Cashier 1 - 4 items
INSERT INTO bill_items (bill_id, item_id, quantity, price, refunded) VALUES
(1, 1, 2, 250.00, false),
(1, 3, 1, 320.00, false),
(1, 21, 5, 80.00, false),
(1, 41, 10, 15.00, false),

-- Bill 2 - Cashier 1 - 3 items
(2, 2, 3, 180.00, false),
(2, 22, 2, 120.00, false),
(2, 42, 20, 22.00, false),

-- Bill 3 - Cashier 1 - 4 items
(3, 4, 1, 450.00, false),
(3, 5, 1, 1800.00, false),
(3, 23, 8, 140.00, false),
(3, 43, 15, 30.00, false),

-- Bill 4 - Refunded - 3 items
(4, 6, 2, 280.00, true),
(4, 24, 3, 250.00, true),
(4, 44, 5, 45.00, true),

-- Bill 5 - Cashier 1 - 4 items
(5, 7, 1, 220.00, false),
(5, 25, 4, 60.00, false),
(5, 45, 10, 8.00, false),
(5, 1, 1, 250.00, false),

-- Bill 6 - Cashier 2 - 3 items
(6, 8, 2, 150.00, false),
(6, 26, 6, 90.00, false),
(6, 46, 30, 12.00, false),

-- Bill 7 - Cashier 2 - 4 items
(7, 9, 1, 280.00, false),
(7, 27, 2, 85.00, false),
(7, 47, 25, 18.00, false),
(7, 21, 4, 80.00, false),

-- Bill 8 - Cashier 2 - 3 items
(8, 10, 1, 380.00, false),
(8, 28, 1, 140.00, false),
(8, 48, 50, 28.00, false),

-- Bill 9 - Cashier 3 - 4 items
(9, 11, 3, 120.00, false),
(9, 29, 2, 220.00, false),
(9, 49, 35, 8.00, false),
(9, 2, 2, 180.00, false),

-- Bill 10 - Cashier 3 - 3 items
(10, 12, 2, 180.00, false),
(10, 30, 1, 190.00, false),
(10, 50, 20, 10.00, false),

-- Bill 11 - Cashier 4 - 4 items
(11, 13, 1, 250.00, false),
(11, 31, 3, 420.00, false),
(11, 51, 40, 5.00, false),
(11, 22, 3, 120.00, false),

-- Bill 12 - Cashier 1 - 3 items
(12, 14, 1, 650.00, false),
(12, 32, 1, 580.00, false),
(12, 52, 15, 20.00, false),

-- Bill 13 - Cashier 1 - 4 items
(13, 15, 2, 180.00, false),
(13, 33, 5, 45.00, false),
(13, 53, 100, 0.08, false),
(13, 3, 1, 320.00, false),

-- Bill 14 - Refunded - 3 items
(14, 16, 1, 140.00, true),
(14, 34, 2, 65.00, true),
(14, 54, 50, 0.12, true),

-- Bill 15 - Cashier 2 - 4 items
(15, 17, 3, 220.00, false),
(15, 35, 1, 45.00, false),
(15, 55, 200, 0.18, false),
(15, 24, 3, 250.00, false),

-- Bill 16 - Cashier 3 - 3 items
(16, 18, 2, 190.00, false),
(16, 36, 2, 85.00, false),
(16, 56, 25, 0.28, false),

-- Bill 17 - Cashier 3 - 4 items
(17, 19, 1, 420.00, false),
(17, 37, 3, 35.00, false),
(17, 57, 150, 0.15, false),
(17, 4, 1, 450.00, false),

-- Bill 18 - Cashier 4 - 3 items
(18, 20, 1, 580.00, false),
(18, 38, 4, 250.00, false),
(18, 58, 75, 0.30, false),

-- Bill 19 - Cashier 4 - 4 items
(19, 1, 1, 250.00, false),
(19, 39, 2, 95.00, false),
(19, 59, 100, 0.22, false),
(19, 27, 2, 85.00, false),

-- Bill 20 - Cashier 1 - 3 items
(20, 2, 2, 180.00, false),
(20, 40, 1, 140.00, false),
(20, 60, 80, 0.35, false),

-- Bill 21 - Cashier 1 - 4 items
(21, 3, 1, 320.00, false),
(21, 21, 6, 80.00, false),
(21, 41, 12, 15.00, false),
(21, 5, 1, 1800.00, false),

-- Bill 22 - Cashier 2 - 3 items
(22, 4, 1, 450.00, false),
(22, 22, 4, 120.00, false),
(22, 42, 25, 22.00, false),

-- Bill 23 - Cashier 2 - 4 items
(23, 6, 1, 280.00, false),
(23, 23, 5, 140.00, false),
(23, 43, 20, 30.00, false),
(23, 8, 2, 150.00, false),

-- Bill 24 - Cashier 3 - 3 items
(24, 7, 1, 220.00, false),
(24, 24, 2, 250.00, false),
(24, 44, 8, 45.00, false),

-- Bill 25 - Refunded - 4 items
(25, 9, 1, 280.00, true),
(25, 25, 3, 60.00, true),
(25, 45, 12, 8.00, true),
(25, 10, 1, 380.00, true),

-- Bill 26 - Cashier 4 - 3 items
(26, 11, 2, 120.00, false),
(26, 26, 4, 90.00, false),
(26, 46, 35, 12.00, false),

-- Bill 27 - Cashier 4 - 4 items
(27, 12, 1, 180.00, false),
(27, 27, 1, 85.00, false),
(27, 47, 30, 18.00, false),
(27, 13, 1, 250.00, false),

-- Bill 28 - Cashier 1 - 3 items
(28, 14, 1, 650.00, false),
(28, 28, 2, 140.00, false),
(28, 48, 60, 28.00, false),

-- Bill 29 - Cashier 1 - 4 items
(29, 15, 3, 180.00, false),
(29, 29, 1, 220.00, false),
(29, 49, 40, 8.00, false),
(29, 16, 1, 140.00, false),

-- Bill 30 - Cashier 2 - 3 items
(30, 17, 2, 220.00, false),
(30, 30, 2, 190.00, false),
(30, 50, 25, 10.00, false),

-- Bill 31 - Cashier 2 - 4 items
(31, 18, 1, 190.00, false),
(31, 31, 2, 420.00, false),
(31, 51, 50, 5.00, false),
(31, 19, 1, 420.00, false),

-- Bill 32 - Cashier 3 - 3 items
(32, 20, 1, 580.00, false),
(32, 32, 1, 580.00, false),
(32, 52, 20, 20.00, false),

-- Bill 33 - Cashier 3 - 4 items
(33, 1, 1, 250.00, false),
(33, 33, 4, 45.00, false),
(33, 53, 120, 0.08, false),
(33, 21, 5, 80.00, false),

-- Bill 34 - Refunded - 3 items
(34, 2, 2, 180.00, true),
(34, 34, 1, 65.00, true),
(34, 54, 60, 0.12, true),

-- Bill 35 - Cashier 4 - 4 items
(35, 3, 1, 320.00, false),
(35, 35, 2, 45.00, false),
(35, 55, 250, 0.18, false),
(35, 22, 3, 120.00, false),

-- Bill 36 - Cashier 4 - 3 items
(36, 4, 1, 450.00, false),
(36, 36, 3, 85.00, false),
(36, 56, 30, 0.28, false),

-- Bill 37 - Cashier 1 - 4 items
(37, 6, 2, 280.00, false),
(37, 37, 2, 35.00, false),
(37, 57, 180, 0.15, false),
(37, 23, 4, 140.00, false),

-- Bill 38 - Cashier 1 - 3 items
(38, 7, 1, 220.00, false),
(38, 38, 3, 250.00, false),
(38, 58, 90, 0.30, false),

-- Bill 39 - Cashier 2 - 4 items
(39, 8, 2, 150.00, false),
(39, 39, 1, 95.00, false),
(39, 59, 120, 0.22, false),
(39, 24, 2, 250.00, false),

-- Bill 40 - Cashier 2 - 3 items
(40, 9, 1, 280.00, false),
(40, 40, 2, 140.00, false),
(40, 60, 100, 0.35, false),

-- Bill 41 - Cashier 3 - 4 items
(41, 10, 1, 380.00, false),
(41, 25, 5, 60.00, false),
(41, 45, 15, 8.00, false),
(41, 25, 4, 60.00, false),

-- Bill 42 - Cashier 3 - 3 items
(42, 11, 3, 120.00, false),
(42, 26, 2, 90.00, false),
(42, 46, 40, 12.00, false),

-- Bill 43 - Cashier 4 - 4 items
(43, 12, 2, 180.00, false),
(43, 27, 3, 85.00, false),
(43, 47, 35, 18.00, false),
(43, 1, 1, 250.00, false),

-- Bill 44 - Refunded - 3 items
(44, 13, 1, 250.00, true),
(44, 28, 1, 140.00, true),
(44, 48, 70, 0.28, true),

-- Bill 45 - Cashier 4 - 4 items
(45, 14, 1, 650.00, false),
(45, 29, 2, 220.00, false),
(45, 49, 50, 0.08, false),
(45, 2, 2, 180.00, false),

-- Bill 46 - Cashier 1 - 3 items
(46, 15, 2, 180.00, false),
(46, 30, 1, 190.00, false),
(46, 50, 30, 0.10, false),

-- Bill 47 - Cashier 1 - 4 items
(47, 16, 1, 140.00, false),
(47, 31, 1, 420.00, false),
(47, 51, 60, 0.05, false),
(47, 3, 1, 320.00, false),

-- Bill 48 - Cashier 2 - 3 items
(48, 17, 3, 220.00, false),
(48, 32, 1, 580.00, false),
(48, 52, 25, 0.20, false),

-- Bill 49 - Cashier 2 - 4 items
(49, 18, 2, 190.00, false),
(49, 33, 3, 45.00, false),
(49, 53, 150, 0.08, false),
(49, 21, 6, 80.00, false),

-- Bill 50 - Cashier 3 - 3 items
(50, 19, 1, 420.00, false),
(50, 34, 2, 65.00, false),
(50, 54, 80, 0.12, false),

-- Bill 51 - Cashier 3 - 4 items
(51, 20, 1, 580.00, false),
(51, 35, 1, 45.00, false),
(51, 55, 300, 0.18, false),
(51, 22, 5, 120.00, false),

-- Bill 52 - Cashier 4 - 3 items
(52, 1, 2, 250.00, false),
(52, 36, 2, 85.00, false),
(52, 56, 35, 0.28, false),

-- Bill 53 - Cashier 4 - 4 items
(53, 2, 1, 180.00, false),
(53, 37, 4, 35.00, false),
(53, 57, 200, 0.15, false),
(53, 23, 3, 140.00, false),

-- Bill 54 - Refunded - 3 items
(54, 3, 1, 320.00, true),
(54, 38, 2, 250.00, true),
(54, 58, 100, 0.30, true),

-- Bill 55 - Cashier 1 - 4 items
(55, 4, 1, 450.00, false),
(55, 39, 3, 95.00, false),
(55, 59, 140, 0.22, false),
(55, 24, 1, 250.00, false),

-- Bill 56 - Cashier 1 - 3 items
(56, 6, 1, 280.00, false),
(56, 40, 1, 140.00, false),
(56, 60, 110, 0.35, false),

-- Bill 57 - Cashier 2 - 4 items
(57, 7, 2, 220.00, false),
(57, 21, 4, 80.00, false),
(57, 41, 18, 0.15, false),
(57, 5, 1, 1800.00, false),

-- Bill 58 - Cashier 2 - 3 items
(58, 8, 1, 150.00, false),
(58, 22, 2, 120.00, false),
(58, 42, 28, 0.22, false),

-- Bill 59 - Cashier 3 - 4 items
(59, 9, 1, 280.00, false),
(59, 23, 3, 140.00, false),
(59, 43, 22, 0.30, false),
(59, 1, 1, 250.00, false),

-- Bill 60 - Cashier 3 - 3 items
(60, 10, 2, 380.00, false),
(60, 24, 2, 250.00, false),
(60, 44, 12, 0.45, false);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count total records
SELECT 'CATEGORIES' as table_name, COUNT(*) as record_count FROM categories
UNION ALL
SELECT 'ITEMS' as table_name, COUNT(*) as record_count FROM items
UNION ALL
SELECT 'USERS' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'BILLS' as table_name, COUNT(*) as record_count FROM bills
UNION ALL
SELECT 'BILL_ITEMS' as table_name, COUNT(*) as record_count FROM bill_items;

-- Sample data check
SELECT c.name as category, COUNT(i.id) as item_count
FROM categories c
LEFT JOIN items i ON c.id = i.category_id
GROUP BY c.id, c.name;

-- Bill statistics
SELECT 
    u.username as cashier,
    COUNT(b.id) as total_bills,
    SUM(CASE WHEN b.refunded = true THEN 1 ELSE 0 END) as refunded_bills
FROM users u
LEFT JOIN bills b ON u.id = b.cashier_id
WHERE u.role = 'CASHIER'
GROUP BY u.id, u.username;
