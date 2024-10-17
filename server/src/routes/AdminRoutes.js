const express = require("express");
const router = express.Router();
const { getAllOwner, getOwner, addOwner, updateOwner, deleteOwner,
    getAllUser, getUser, addUser, updateUser, deleteUser } = require('../controllers/AdminControler');
const middlewareController = require('../controllers/middlewareControler');

// Owner Routes
router.get('/owners', middlewareController.verifyTokenAdmin, getAllOwner);
router.get('/owners/:id', middlewareController.verifyTokenAdmin, getOwner);
router.post('/owners', middlewareController.verifyTokenAdmin, addOwner);
router.put('/owners/:id', middlewareController.verifyToken, updateOwner);
router.delete('/owners/:id', middlewareController.verifyTokenAdmin, deleteOwner);

// User Routes
router.get('/users', middlewareController.verifyTokenAdmin, getAllUser);
router.get('/users/:id', middlewareController.verifyTokenAdmin, getUser);
router.post('/users', middlewareController.verifyTokenAdmin, addUser);
router.put('/users/:id', middlewareController.verifyToken, updateUser);
router.delete('/users/:id', middlewareController.verifyTokenAdmin, deleteUser);

module.exports = router;
