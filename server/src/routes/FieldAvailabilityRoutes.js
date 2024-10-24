const express = require('express');
const router = express.Router();
const fieldAvailabilityController = require('../controllers/FieldAvailabilityController');

// Route để cập nhật giá tiền cho nhiều khung giờ
router.put('/availability/update-prices', fieldAvailabilityController.updatePrices);


module.exports = router;
