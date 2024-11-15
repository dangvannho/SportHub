const express = require('express');
const router = express.Router();
const middlewareController = require("../controllers/middlewareControler");
const { getFieldAvailability, updateFieldAvailabilityStatus, deleteFieldAvailability } = require('../controllers/FieldAvailabilityController');

router.get('/availability', getFieldAvailability);
router.put('/update_status', middlewareController.verifyToken, updateFieldAvailabilityStatus);
router.delete('/delete', middlewareController.verifyToken, deleteFieldAvailability);
module.exports = router; 