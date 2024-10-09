const express = require("express");
const router = express.Router();
const Owner = require('../models/Owner');
const { getAllOwner, getOwner, addOwner, updateOwner, deleteOwner } = require('../controllers/OwnerControler.js');
router.get('/', getAllOwner);
router.get('/:id', getOwner);
router.post('/', addOwner);
//update
router.put('/:id', updateOwner);
//delete user
router.delete('/:id', deleteOwner);
module.exports = router;
