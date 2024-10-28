const express = require('express');
const router = express.Router();
const { getAllFields, getFieldById, searchFieldByName ,addField,updateField,deleteField } = require('../controllers/FieldController');
const middlewareController = require("../controllers/middlewareControler");
const upload = require("../middlewares/uploadIMG");

// @route   GET /api/sportfields
// @desc    Get all sport fields
router.get('/fields', getAllFields);

//GET field by id
router.get('/fields/:id', getFieldById);

// Route tìm kiếm sân theo tên với tính năng autocomplete
router.get('/fields/search/:name', searchFieldByName);

router.post('/fields', upload.single('images'), addField);

router.put('/fields/:id',upload.single('images'),updateField)

router.delete('/fields/:id',deleteField)

module.exports = router;