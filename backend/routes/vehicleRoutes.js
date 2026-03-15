const express = require('express');
const router = express.Router();
const { getVehicles, createVehicle, deleteVehicle } = require('../controllers/vehicleController');

router.get('/',     getVehicles);
router.post('/',    createVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
