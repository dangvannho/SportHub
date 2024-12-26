const express = require('express');
const router = express.Router();

const paymentcontroller = require('../controllers/paymentOwner');
const middlewareController = require("../controllers/middlewareControler");

router.post('/', middlewareController.verifyToken,paymentcontroller.payment);

router.post('/callback', paymentcontroller.callback);


module.exports = router;