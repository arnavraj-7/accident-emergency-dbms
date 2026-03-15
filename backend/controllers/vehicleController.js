// ============================================================
// Vehicle Controller
// Handles CRUD operations for the Vehicle table.
// UNIQUE constraint on vehicle_number prevents duplicate entries.
// ============================================================

const pool = require('../config/db');

// GET all vehicles with accident details
const getVehicles = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT v.*, a.location AS accident_location
      FROM Vehicle v
      INNER JOIN Accident a ON v.accident_id = a.accident_id
      ORDER BY v.vehicle_id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching vehicles:', err.message);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};

// POST a new vehicle
const createVehicle = async (req, res) => {
  try {
    const { vehicle_number, vehicle_type, accident_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Vehicle (vehicle_number, vehicle_type, accident_id) VALUES (?, ?, ?)',
      [vehicle_number, vehicle_type, accident_id]
    );
    res.status(201).json({ message: 'Vehicle added', vehicle_id: result.insertId });
  } catch (err) {
    // Handle duplicate vehicle_number (UNIQUE constraint violation)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Vehicle number already exists' });
    }
    console.error('Error creating vehicle:', err.message);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
};

// DELETE a vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Vehicle WHERE vehicle_id = ?', [id]);
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    console.error('Error deleting vehicle:', err.message);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
};

module.exports = { getVehicles, createVehicle, deleteVehicle };
