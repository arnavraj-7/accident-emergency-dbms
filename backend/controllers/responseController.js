// ============================================================
// Response Controller
// Handles CRUD for the Response table.
// Response is an associative entity linking Accident, Team, Hospital.
// Demonstrates multi-table JOINs.
// ============================================================

const pool = require('../config/db');

// GET all responses with full details from related tables (multi-JOIN)
const getResponses = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        r.response_id,
        r.response_time,
        a.accident_id,
        a.location   AS accident_location,
        a.severity,
        t.team_name,
        h.hospital_name
      FROM Response r
      INNER JOIN Accident a       ON r.accident_id  = a.accident_id
      INNER JOIN Emergency_Team t ON r.team_id      = t.team_id
      INNER JOIN Hospital h       ON r.hospital_id  = h.hospital_id
      ORDER BY r.response_time DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching responses:', err.message);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
};

// GET dropdown data (teams and hospitals) for the form
const getDropdownData = async (req, res) => {
  try {
    const [teams]     = await pool.query('SELECT * FROM Emergency_Team');
    const [hospitals] = await pool.query('SELECT * FROM Hospital');
    const [accidents] = await pool.query('SELECT accident_id, location FROM Accident');
    res.json({ teams, hospitals, accidents });
  } catch (err) {
    console.error('Error fetching dropdown data:', err.message);
    res.status(500).json({ error: 'Failed to fetch dropdown data' });
  }
};

// POST a new response
const createResponse = async (req, res) => {
  try {
    const { response_time, accident_id, team_id, hospital_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Response (response_time, accident_id, team_id, hospital_id) VALUES (?, ?, ?, ?)',
      [response_time, accident_id, team_id, hospital_id]
    );
    res.status(201).json({ message: 'Response recorded', response_id: result.insertId });
  } catch (err) {
    console.error('Error creating response:', err.message);
    res.status(500).json({ error: 'Failed to record response' });
  }
};

// DELETE a response
const deleteResponse = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Response WHERE response_id = ?', [id]);
    res.json({ message: 'Response deleted' });
  } catch (err) {
    console.error('Error deleting response:', err.message);
    res.status(500).json({ error: 'Failed to delete response' });
  }
};

module.exports = { getResponses, getDropdownData, createResponse, deleteResponse };
