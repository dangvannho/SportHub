const express = require("express");
const router = express.Router();
const upload = require('../middlewares/uploadIMG');
const { getAllOwner, getOwner, addOwner, updateOwner, deleteOwner,
    getAllUser, getUser, addUser, updateUser, deleteUser } = require('../controllers/AdminControler');

// Owner Routes
router.get('/owners', getAllOwner);
router.get('/owners/:id', getOwner);
router.post('/owners', upload.single('profile_picture'), addOwner);
router.put('/owners/:id', upload.single('profile_picture'), updateOwner);
router.delete('/owners/:id', deleteOwner);

// User Routes
router.get('/users', getAllUser);
router.get('/users/:id', getUser);
router.post('/users', upload.single('profile_picture'), addUser);
router.put('/users/:id', upload.single('profile_picture'), updateUser);
router.delete('/users/:id', deleteUser);




module.exports = router;