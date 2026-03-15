-- ============================================================
-- Transaction Control Demonstration
-- ============================================================
-- DBMS Concepts:
--   - ACID Properties (Atomicity, Consistency, Isolation, Durability)
--   - SAVEPOINT allows partial rollback within a transaction
--   - ROLLBACK undoes changes back to a savepoint or start
--   - COMMIT makes all remaining changes permanent
-- ============================================================

USE EmergencyDB;

-- ============================================================
-- DEMO 1: Full Transaction with SAVEPOINT and partial ROLLBACK
-- ============================================================

-- Step 1: Begin the transaction (Atomicity starts here)
START TRANSACTION;

-- Step 2: Update accident severity (this change WILL be committed)
UPDATE Accident
SET severity = 'Critical'
WHERE accident_id = 1;

-- Step 3: Create a savepoint after the update
SAVEPOINT before_victim_insert;

-- Step 4: Insert a new victim (this change will be ROLLED BACK)
INSERT INTO Victim (name, age, gender, contact, accident_id)
VALUES ('Test Victim', 25, 'Male', '0000000000', 1);

-- Step 5: Rollback to savepoint (undoes the victim insert, keeps severity update)
ROLLBACK TO SAVEPOINT before_victim_insert;

-- Step 6: Commit the transaction (only severity update is saved)
COMMIT;


-- ============================================================
-- DEMO 2: Concurrency Control - Row-Level Locking
-- ============================================================
-- The FOR UPDATE clause acquires an exclusive lock on the selected row.
-- Other transactions attempting to read/write this row will WAIT
-- until this transaction completes (COMMIT or ROLLBACK).
-- This prevents lost updates and dirty reads.
-- ============================================================

START TRANSACTION;

-- This locks the row with accident_id = 1
-- No other transaction can modify this row until we COMMIT or ROLLBACK
SELECT * FROM Accident WHERE accident_id = 1 FOR UPDATE;

-- Perform the update while holding the lock
UPDATE Accident
SET severity = 'High'
WHERE accident_id = 1;

COMMIT;


-- ============================================================
-- DEMO 3: Full ROLLBACK (no changes saved)
-- ============================================================

START TRANSACTION;

-- Delete all responses (dangerous operation!)
DELETE FROM Response WHERE accident_id = 1;

-- Oops! We didn't mean to do that. Rollback everything.
ROLLBACK;

-- The response record for accident_id=1 is still intact.
