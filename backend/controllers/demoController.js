// ============================================================
// Transaction & Concurrency Demo Controller
// ============================================================
// This controller demonstrates key DBMS concepts:
//   1. Transaction Control (START, COMMIT, ROLLBACK)
//   2. SAVEPOINTs for partial rollback
//   3. Row-Level Locking (SELECT ... FOR UPDATE)
//
// ACID Properties:
//   A - Atomicity:    All or nothing execution
//   C - Consistency:  DB moves from one valid state to another
//   I - Isolation:    Concurrent transactions don't interfere
//   D - Durability:   Committed data survives crashes
// ============================================================

const pool = require('../config/db');

const runTransactionDemo = async (req, res) => {
  // getConnection() gives us a dedicated connection for manual transaction control
  const connection = await pool.getConnection();
  const logs = [];

  try {
    // ----------------------------------------------------------
    // Step 1: START TRANSACTION
    // This disables auto-commit. Changes are held in a buffer
    // until we explicitly COMMIT or ROLLBACK.
    // ----------------------------------------------------------
    await connection.beginTransaction();
    logs.push('Step 1: START TRANSACTION - Auto-commit disabled');

    // ----------------------------------------------------------
    // Step 2: UPDATE accident severity
    // This change WILL be committed at the end.
    // ----------------------------------------------------------
    await connection.query(
      'UPDATE Accident SET severity = ? WHERE accident_id = 1',
      ['Critical']
    );
    logs.push('Step 2: Updated accident #1 severity to Critical');

    // ----------------------------------------------------------
    // Step 3: Create SAVEPOINT
    // A savepoint marks a point we can rollback to without
    // undoing everything since START TRANSACTION.
    // ----------------------------------------------------------
    await connection.query('SAVEPOINT before_victim_insert');
    logs.push('Step 3: SAVEPOINT created - "before_victim_insert"');

    // ----------------------------------------------------------
    // Step 4: INSERT a victim (this will be rolled back)
    // ----------------------------------------------------------
    await connection.query(
      'INSERT INTO Victim (name, age, gender, contact, accident_id) VALUES (?, ?, ?, ?, ?)',
      ['Demo Victim', 25, 'Male', '0000000000', 1]
    );
    logs.push('Step 4: Inserted "Demo Victim" (will be undone)');

    // ----------------------------------------------------------
    // Step 5: ROLLBACK TO SAVEPOINT
    // This undoes the victim insert but keeps the severity update.
    // ----------------------------------------------------------
    await connection.query('ROLLBACK TO SAVEPOINT before_victim_insert');
    logs.push('Step 5: ROLLBACK TO SAVEPOINT - Victim insert undone');

    // ----------------------------------------------------------
    // Step 6: COMMIT
    // Only the severity update is saved to disk (Durability).
    // ----------------------------------------------------------
    await connection.commit();
    logs.push('Step 6: COMMIT - Only severity update is persisted');

    // ----------------------------------------------------------
    // Step 7: Demonstrate row-level locking (Concurrency Control)
    // FOR UPDATE locks the row so other transactions must wait.
    // ----------------------------------------------------------
    await connection.beginTransaction();
    const [locked] = await connection.query(
      'SELECT * FROM Accident WHERE accident_id = 1 FOR UPDATE'
    );
    logs.push('Step 7: Row-level lock acquired on accident #1 (FOR UPDATE)');

    // Reset severity back to High
    await connection.query(
      'UPDATE Accident SET severity = ? WHERE accident_id = 1',
      ['High']
    );
    await connection.commit();
    logs.push('Step 8: Updated severity back to High and released lock (COMMIT)');

    res.json({
      success: true,
      message: 'Transaction demo completed successfully',
      logs
    });

  } catch (err) {
    // If any error occurs, rollback ALL changes (Atomicity)
    await connection.rollback();
    logs.push('ERROR: Transaction rolled back due to: ' + err.message);
    console.error('Transaction demo error:', err.message);
    res.status(500).json({ success: false, logs, error: err.message });

  } finally {
    // Always release the connection back to the pool
    connection.release();
  }
};

module.exports = { runTransactionDemo };
