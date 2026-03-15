const express = require('express');
const router = express.Router();
const { runTransactionDemo } = require('../controllers/demoController');

// POST /api/demo/transaction
router.post('/transaction', runTransactionDemo);

module.exports = router;
