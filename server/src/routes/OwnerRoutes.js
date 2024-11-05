const express = require('express');
const router = express.Router();
const { getFieldsByOwnerId, addFieldRates, updateFieldRate, deleteFieldRate } = require('../controllers/OwnerController');

router.get('/fields', getFieldsByOwnerId);
router.post('/add', addFieldRates);
router.put('/update', updateFieldRate);
router.delete('/delete', deleteFieldRate);

module.exports = router;
