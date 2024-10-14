const User = require("../models/User");
const Owner = require("../models/Owner");
const bcrypt = require("bcrypt");

// User registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone_number } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashed,
            phone_number
        });

        const user = await newUser.save();
        res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// User login
const loginUser = async (req, res) => {
    try {
        const { login, password } = req.body;

        const isEmail = /\S+@\S+\.\S+/.test(login);

        let user;
        if (isEmail) {
            user = await User.findOne({ email: login });
        } else {
            user = await User.findOne({ phone_number: login });
        }

        if (!user) {
            return res.status(404).json("User not found");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json("Invalid password");
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Owner registration
const registerOwner = async (req, res) => {
    try {
        const { business_name, address, phone_number, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const newOwner = new Owner({
            business_name,
            address,
            phone_number,
            email,
            password: hashed
        });

        const owner = await newOwner.save();
        res.status(201).json({ message: "Owner registered successfully", owner });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Owner login
const loginOwner = async (req, res) => {
    try {
        const { login, password } = req.body;

        const isEmail = /\S+@\S+\.\S+/.test(login);

        let owner;
        if (isEmail) {
            owner = await Owner.findOne({ email: login });
        } else {
            owner = await Owner.findOne({ phone_number: login });
        }

        if (!owner) {
            return res.status(404).json("Owner not found");
        }

        const validPassword = await bcrypt.compare(password, owner.password);
        if (!validPassword) {
            return res.status(400).json("Invalid password");
        }

        res.status(200).json(owner);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    registerOwner,
    loginOwner
}
