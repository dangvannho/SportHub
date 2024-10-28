const express = require('express');
const router = express.Router();
const { getAllFields, getFieldById, searchFields ,addField,updateField,deleteField } = require('../controllers/FieldController');
const middlewareController = require("../controllers/middlewareControler");
const upload = require("../middlewares/uploadIMG");

// @route   GET /api/sportfields
// @desc    Get all sport fields
router.get('/', getAllFields);

// Route tìm kiếm sân
router.get('/search', searchFields);

//GET field by id
router.get('/:id', getFieldById);

// Route tìm kiếm sân theo tên với tính năng autocomplete
router.get('/fields/search/:name', ); // khong co trong field controller

router.post('/', middlewareController.verifyToken, upload.single('images'), addField);

router.put('/:id', middlewareController.verifyToken, upload.single('images'), updateField);

router.delete('/:id', middlewareController.verifyToken, deleteField);

module.exports = router;