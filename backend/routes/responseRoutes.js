const express = require('express');
const router = express.Router();
const { getResponses, getDropdownData, createResponse, deleteResponse } = require('../controllers/responseController');

router.get('/',         getResponses);
router.get('/dropdown', getDropdownData);   // For populating form dropdowns
router.post('/',        createResponse);
router.delete('/:id',   deleteResponse);

module.exports = router;
