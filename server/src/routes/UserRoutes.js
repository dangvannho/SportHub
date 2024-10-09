const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { getAllUser, getUser, addUser, updateUser,
    deleteUser
} = require('../controllers/UserControler.js');





router.get('/', getAllUser);

router.get('/:id', getUser);

router.post('/', addUser);

//update
router.put('/:id', updateUser)
//delete user
router.delete('/:id', deleteUser)

module.exports = router;