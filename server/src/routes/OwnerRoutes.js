const express = require('express');
const router = express.Router();
const { getFieldsByOwnerId, generateAvailabilityRecords, addPriceSlot, updateFieldRate, deleteFieldRate, getFieldPriceSlots, getRevenueByDateOrMonth } = require('../controllers/OwnerController');

router.get('/fields', getFieldsByOwnerId);
router.post('/add', addPriceSlot);
router.post('/generate', generateAvailabilityRecords);
router.put('/update', updateFieldRate);
router.delete('/delete', deleteFieldRate);
router.get('/priceSlots', getFieldPriceSlots);
router.get('/chart/Revenue', getRevenueByDateOrMonth);

module.exports = router;
