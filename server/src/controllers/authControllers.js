const User = require("../models/User");
const Owner = require("../models/Owner");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      phone_number,
    });

    const user = await newUser.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//accessToken
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      user_role: user.user_role,
    },
    process.env.JWT_ACCESS_KEY,
    {
      expiresIn: "1h",
    }
  );
};
//refreshToken
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      user_role: user.user_role,
    },
    process.env.JWT_ACCESS_KEY,
    {
      expiresIn: "1d",
    }
  );
};
// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isEmail = /\S+@\S+\.\S+/.test(email);

    let user;
    if (isEmail) {
      user = await User.findOne({ email: email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (user && validPassword) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const { password, ...other } = user._doc;
      res.status(200).json({ ...other, accessToken });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Owner registration
const registerOwner = async (req, res) => {
  try {
    const {
      business_name,
      address,
      phone_number,
      email,
      password,
      confirmPassword,
    } = req.body;

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
      password: hashed,
    });

    const owner = await newOwner.save();
    res.status(201).json({ message: "Owner registered successfully", owner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
    if (owner && validPassword) {
      const accessToken = generateAccessToken(owner);
      const refreshToken = generateRefreshToken(owner);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const { password, ...other } = owner._doc;
      res.status(200).json({ ...other, accessToken, refreshToken });
    } else {
      res.status(400).json("Invalid credentials");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//login admin
const DEFAULT_ADMIN_EMAIL = "admin@example.com";
const DEFAULT_ADMIN_PASSWORD = "adminPassword123";

// Admin login with default credentials
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== DEFAULT_ADMIN_EMAIL || password !== DEFAULT_ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const adminUser = {
      name: "Admin",
      user_role: "admin",
    };

    const accessToken = generateAccessToken(adminUser);
    const refreshToken = generateRefreshToken(adminUser);

    // res.cookie("refreshToken", refreshToken, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     path: "/",
    //     sameSite: "strict",
    //     maxAge: 7 * 24 * 60 * 60 * 1000
    // });

    res.status(200).json({
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  });
};

module.exports = {
  registerUser,
  loginUser,
  registerOwner,
  loginOwner,
  refreshToken,
  loginAdmin,
};
