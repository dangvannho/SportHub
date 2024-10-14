// routes/ImageRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/ImageHandler');
const { uploadImg, getImg, deleteImg, getImgById } = require('../controllers/ImageControler');


router.post('/upload', upload.single('image'), uploadImg);


router.get('/', getImg);

router.get('/:id', getImgById);

router.delete('/delete/:id', deleteImg);



module.exports = router;