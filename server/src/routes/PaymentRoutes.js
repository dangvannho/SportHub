const express = require('express');
const router = express.Router();
const { payment, checkStatus } = require('../controllers/payment');
router.use(express.json());
const middlewareController = require("../controllers/middlewareControler");

router.post('/', payment);

 router.post('/check', checkStatus);

module.exports = router;
