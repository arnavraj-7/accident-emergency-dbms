// ============================================================
// Accident Controller
// Handles CRUD operations for the Accident table.
// ============================================================

const pool = require('../config/db');

// GET all accidents
const getAccidents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Accident ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching accidents:', err.message);
    res.status(500).json({ error: 'Failed to fetch accidents' });
  }
};

// POST a new accident
const createAccident = async (req, res) => {
  try {
    const { date, time, location, severity } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Accident (date, time, location, severity) VALUES (?, ?, ?, ?)',
      [date, time, location, severity]
    );
    res.status(201).json({ message: 'Accident reported', accident_id: result.insertId });
  } catch (err) {
    console.error('Error creating accident:', err.message);
    res.status(500).json({ error: 'Failed to report accident' });
  }
};

// DELETE an accident (CASCADE will remove related victims, vehicles, responses)
const deleteAccident = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Accident WHERE accident_id = ?', [id]);
    res.json({ message: 'Accident deleted' });
  } catch (err) {
    console.error('Error deleting accident:', err.message);
    res.status(500).json({ error: 'Failed to delete accident' });
  }
};

module.exports = { getAccidents, createAccident, deleteAccident };
