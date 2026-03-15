-- ============================================================
-- Accident Reporting and Emergency Response System
-- Database Schema (DDL)
-- ============================================================
-- DBMS Concepts Demonstrated:
--   1. Normalization (3NF) - each table stores one entity
--   2. Referential Integrity - FOREIGN KEY constraints
--   3. Entity Integrity - PRIMARY KEY + NOT NULL constraints
--   4. Domain Constraints - CHECK, ENUM-style VARCHAR limits
-- ============================================================

CREATE DATABASE IF NOT EXISTS EmergencyDB;
USE EmergencyDB;

-- --------------------------------------------------------
-- Table: Accident
-- Represents an accident event reported in the system.
-- This is the central entity; other tables reference it.
-- --------------------------------------------------------
CREATE TABLE Accident (
    accident_id   INT PRIMARY KEY AUTO_INCREMENT,
    date          DATE         NOT NULL,
    time          TIME         NOT NULL,
    location      VARCHAR(150) NOT NULL,
    severity      VARCHAR(20)  DEFAULT 'Moderate'
        CHECK (severity IN ('Low', 'Moderate', 'High', 'Critical'))
);

-- --------------------------------------------------------
-- Table: Victim
-- Stores details of individuals involved in an accident.
-- FK: accident_id -> Accident (Many victims per accident)
-- ON DELETE CASCADE: if an accident is removed, its victims are too.
-- --------------------------------------------------------
CREATE TABLE Victim (
    victim_id    INT PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(100) NOT NULL,
    age          INT,
    gender       VARCHAR(10),
    contact      VARCHAR(15),
    accident_id  INT NOT NULL,
    FOREIGN KEY (accident_id) REFERENCES Accident(accident_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- --------------------------------------------------------
-- Table: Vehicle
-- Records vehicles involved in an accident.
-- UNIQUE constraint on vehicle_number prevents duplicates.
-- --------------------------------------------------------
CREATE TABLE Vehicle (
    vehicle_id      INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_number  VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type    VARCHAR(50),
    accident_id     INT NOT NULL,
    FOREIGN KEY (accident_id) REFERENCES Accident(accident_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- --------------------------------------------------------
-- Table: Emergency_Team
-- Independent entity - teams exist regardless of accidents.
-- --------------------------------------------------------
CREATE TABLE Emergency_Team (
    team_id    INT PRIMARY KEY AUTO_INCREMENT,
    team_name  VARCHAR(100) NOT NULL,
    contact    VARCHAR(15)
);

-- --------------------------------------------------------
-- Table: Hospital
-- Independent entity - hospitals exist regardless of accidents.
-- --------------------------------------------------------
CREATE TABLE Hospital (
    hospital_id    INT PRIMARY KEY AUTO_INCREMENT,
    hospital_name  VARCHAR(100) NOT NULL,
    location       VARCHAR(100),
    contact        VARCHAR(15)
);

-- --------------------------------------------------------
-- Table: Response
-- Associative / junction table linking Accident, Team, Hospital.
-- Demonstrates a ternary relationship in relational model.
-- --------------------------------------------------------
CREATE TABLE Response (
    response_id    INT PRIMARY KEY AUTO_INCREMENT,
    response_time  DATETIME NOT NULL,
    accident_id    INT NOT NULL,
    team_id        INT NOT NULL,
    hospital_id    INT NOT NULL,
    FOREIGN KEY (accident_id)  REFERENCES Accident(accident_id)
        ON DELETE CASCADE,
    FOREIGN KEY (team_id)      REFERENCES Emergency_Team(team_id),
    FOREIGN KEY (hospital_id)  REFERENCES Hospital(hospital_id)
);
