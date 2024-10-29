const express = require('express');
const router = express.Router();
const { getAllFields, getFieldById, searchFields } = require('../controllers/FieldController');

// @route   GET /api/sportfields
// @desc    Get all sport fields
router.get('/', getAllFields);

// Route tìm kiếm sân
router.get('/search', searchFields);

//GET field by id
router.get('/:id', getFieldById);


module.exports = router;