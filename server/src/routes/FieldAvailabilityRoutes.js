const express = require('express');
const router = express.Router();
const { getFieldAvailability, updateFieldAvailabilityStatus, deleteFieldAvailability } = require('../controllers/FieldAvailabilityController');

router.get('/availability', getFieldAvailability);
router.put('/update_status', updateFieldAvailabilityStatus);
router.delete('/delete', deleteFieldAvailability);
module.exports = router; 