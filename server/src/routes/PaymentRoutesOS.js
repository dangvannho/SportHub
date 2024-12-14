const express = require('express');
const router = express.Router();

const paymentcontroller = require('../controllers/paymentOS');

router.post('/', paymentcontroller.payment);