const express = require("express");
const router = express.Router();
const { getAllOwner, getOwner, addOwner, updateOwner, deleteOwner,
    getAllUser, getUser, addUser, updateUser, deleteUser } = require('../controllers/AdminControler');

// Owner Routes
router.get('/owners', getAllOwner);
router.get('/owners/:id', getOwner);
router.post('/owners', addOwner);
router.put('/owners/:id', updateOwner);
router.delete('/owners/:id', deleteOwner);

// User Routes
router.get('/users', getAllUser);
router.get('/users/:id', getUser);
router.post('/users', addUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);




module.exports = router;