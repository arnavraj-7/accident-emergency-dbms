const express = require('express');
const router = express.Router();
const { getAccidents, createAccident, deleteAccident } = require('../controllers/accidentController');

router.get('/',     getAccidents);
router.post('/',    createAccident);
router.delete('/:id', deleteAccident);

module.exports = router;
