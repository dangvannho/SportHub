const express = require('express');
const router = express.Router();
const { getAllFields } = require('../controllers/FieldController');

// @route   GET /api/sportfields
// @desc    Get all sport fields
router.get('/fields', getAllFields);

module.exports = router;