const express = require('express');
const router = express.Router();
const { payment, callback, checkStatus } = require('../controllers/payment');


router.post('/', payment);


router.post('/callback', callback);


router.post('/check/:apptransid', checkStatus);

module.exports = router;