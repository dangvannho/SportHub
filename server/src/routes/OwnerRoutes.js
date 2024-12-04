const express = require('express');
const router = express.Router();
const { getFieldsByOwnerId, generateAvailabilityRecords, 
    addPriceSlot, updateFieldRate, deleteFieldRate, getFieldPriceSlots, 
    getOwnerRevenue, getOwnerBookings, getFieldRevenue, getFieldBookings } = require('../controllers/OwnerController');

router.get('/fields', getFieldsByOwnerId);
router.post('/add', addPriceSlot);
router.post('/generate', generateAvailabilityRecords);
router.put('/update', updateFieldRate);
router.delete('/delete', deleteFieldRate);
router.get('/priceSlots', getFieldPriceSlots);
router.get('/chart/ownerRevenue', getOwnerRevenue);
router.get('/chart/ownerBooking', getOwnerBookings);
router.get('/chart/fieldRevenue', getFieldRevenue);
router.get('/chart/fieldBooking', getFieldBookings);

module.exports = router;
