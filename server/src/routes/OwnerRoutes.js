const express = require('express');
const router = express.Router();
const { getFieldsByOwnerId, generateAvailabilityRecords, addPriceSlot, updateFieldRate, deleteFieldRate } = require('../controllers/OwnerController');

router.get('/fields', getFieldsByOwnerId);
router.post('/add', addPriceSlot);
router.post('/generate', generateAvailabilityRecords);
router.put('/update', updateFieldRate);
router.delete('/delete', deleteFieldRate);

module.exports = router;
