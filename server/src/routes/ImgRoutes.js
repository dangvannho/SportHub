// routes/ImageRoutes.js

const express = require('express');
const router = express.Router();
const path = require('path');

// Endpoint để truy xuất ảnh
router.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '..', 'uploads', filename);
    res.sendFile(filepath);
});

module.exports = router;