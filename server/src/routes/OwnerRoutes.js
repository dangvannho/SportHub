const express = require('express');
const router = express.Router();
const { getFieldsByOwnerId } = require('../controllers/OwnerController');

// Route GET: /api/fields/owner/:owner_id - Lấy tất cả các sân theo owner_id
router.get('/fields', getFieldsByOwnerId);

module.exports = router;
