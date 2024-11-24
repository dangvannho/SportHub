const express = require('express');
const router = express.Router();
const { payment, checkStatus ,hand   } = require('../controllers/payment');
router.use(express.json());
const middlewareController = require("../controllers/middlewareControler");

router.post('/',middlewareController.verifyToken  ,payment);

 router.post('/check', checkStatus);

 

module.exports = router;
