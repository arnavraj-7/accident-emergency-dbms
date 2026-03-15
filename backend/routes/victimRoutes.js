const express = require('express');
const router = express.Router();
const { getVictims, createVictim, deleteVictim } = require('../controllers/victimController');

router.get('/',     getVictims);
router.post('/',    createVictim);
router.delete('/:id', deleteVictim);

module.exports = router;
