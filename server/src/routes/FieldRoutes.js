const express = require('express');
const router = express.Router();
const { getAllFields, getFieldById, searchFieldByName } = require('../controllers/FieldController');

// @route   GET /api/sportfields
// @desc    Get all sport fields
router.get('/fields', getAllFields);

//GET field by id
router.get('/fields/:id', getFieldById);

// Route tìm kiếm sân theo tên với tính năng autocomplete
router.get('/fields/search/:name', searchFieldByName);

module.exports = router;