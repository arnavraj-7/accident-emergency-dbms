-- ============================================================
-- Sample Data for EmergencyDB
-- ============================================================

USE EmergencyDB;

-- Accidents
INSERT INTO Accident (date, time, location, severity) VALUES
('2025-01-15', '08:30:00', 'MG Road, Bangalore',        'High'),
('2025-02-20', '14:15:00', 'Ring Road, Delhi',           'Critical'),
('2025-03-05', '19:45:00', 'Marine Drive, Mumbai',       'Moderate'),
('2025-03-18', '11:00:00', 'Anna Salai, Chennai',        'Low'),
('2025-04-02', '22:30:00', 'Park Street, Kolkata',       'High');

-- Victims
INSERT INTO Victim (name, age, gender, contact, accident_id) VALUES
('Rahul Sharma',    28, 'Male',   '9876543210', 1),
('Priya Patel',     35, 'Female', '9123456789', 1),
('Amit Kumar',      42, 'Male',   '9988776655', 2),
('Sneha Reddy',     22, 'Female', '9112233445', 3),
('Vikram Singh',    55, 'Male',   '9001122334', 4),
('Anjali Gupta',    30, 'Female', '9334455667', 5);

-- Vehicles
INSERT INTO Vehicle (vehicle_number, vehicle_type, accident_id) VALUES
('KA01AB1234', 'Car',       1),
('DL05CD5678', 'Truck',     2),
('MH02EF9012', 'Motorcycle', 3),
('TN09GH3456', 'Bus',       4),
('WB06IJ7890', 'Auto',      5);

-- Emergency Teams
INSERT INTO Emergency_Team (team_name, contact) VALUES
('Alpha Rescue',     '1800111001'),
('Bravo Medics',     '1800111002'),
('Charlie Response', '1800111003'),
('Delta Fire Squad', '1800111004');

-- Hospitals
INSERT INTO Hospital (hospital_name, location, contact) VALUES
('City General Hospital',    'MG Road, Bangalore',    '08012345678'),
('AIIMS Delhi',              'Ansari Nagar, Delhi',    '01112345678'),
('Lilavati Hospital',        'Bandra, Mumbai',         '02212345678'),
('Apollo Chennai',           'Greams Road, Chennai',   '04412345678'),
('SSKM Hospital',            'AJC Bose Road, Kolkata', '03312345678');

-- Responses (linking accidents to teams and hospitals)
INSERT INTO Response (response_time, accident_id, team_id, hospital_id) VALUES
('2025-01-15 08:45:00', 1, 1, 1),
('2025-02-20 14:25:00', 2, 2, 2),
('2025-03-05 20:00:00', 3, 3, 3),
('2025-03-18 11:15:00', 4, 4, 4),
('2025-04-02 22:50:00', 5, 1, 5);
