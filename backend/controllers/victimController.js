// ============================================================
// Victim Controller
// Handles CRUD operations for the Victim table.
// Foreign Key: accident_id references Accident table.
// ============================================================

const pool = require('../config/db');

// GET all victims with their associated accident location (JOIN demo)
const getVictims = async (req, res) => {
  try {
    // INNER JOIN demonstrates relational querying across tables
    const [rows] = await pool.query(`
      SELECT v.*, a.location AS accident_location
      FROM Victim v
      INNER JOIN Accident a ON v.accident_id = a.accident_id
      ORDER BY v.victim_id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching victims:', err.message);
    res.status(500).json({ error: 'Failed to fetch victims' });
  }
};

// POST a new victim
const createVictim = async (req, res) => {
  try {
    const { name, age, gender, contact, accident_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Victim (name, age, gender, contact, accident_id) VALUES (?, ?, ?, ?, ?)',
      [name, age, gender, contact, accident_id]
    );
    res.status(201).json({ message: 'Victim added', victim_id: result.insertId });
  } catch (err) {
    console.error('Error creating victim:', err.message);
    res.status(500).json({ error: 'Failed to add victim' });
  }
};

// DELETE a victim
const deleteVictim = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Victim WHERE victim_id = ?', [id]);
    res.json({ message: 'Victim deleted' });
  } catch (err) {
    console.error('Error deleting victim:', err.message);
    res.status(500).json({ error: 'Failed to delete victim' });
  }
};

module.exports = { getVictims, createVictim, deleteVictim };
