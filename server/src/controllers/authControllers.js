const User = require("../models/User");
const Owner = require("../models/Owner");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone_number } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ EC: 0, EM: "Mật khẩu không khớp!" });
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
    res.status(201).json({ EC: 1, EM: "Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ EC: 0, EM: "Email hoặc số điện thoại đã tồn tại!" });
  }
};
//accessToken
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name || user.business_name,
      email: user.email,
      user_role: user.user_role || "owner",
    },
    process.env.JWT_ACCESS_KEY,
    {
      expiresIn: "10h",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name || user.business_name,
      email: user.email,
      user_role: user.user_role || "owner",
    },
    process.env.JWT_REFRESH_KEY,
    {
      expiresIn: "2d",
    }
  );
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
      return res.status(400).json({ EC: 0, EM: "Mật khẩu không khớp!" });
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
    res.status(201).json({ EC: 1, EM: "Đăng ký thành công", owner });
  } catch (err) {
    res.status(500).json({ EC: 0, EM: "Email hoặc số điện thoại đã tồn tại!" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmail = /\S+@\S+\.\S+/.test(email);

    if (isEmail) {
      const user = await User.findOne({ email: email });
      if (user) {
        // Đăng nhập user
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
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
          return res.status(200).json({
            ...other,
            accessToken,
            EC: 1,
            EM: "User login success",
          });
        }
      }

      const owner = await Owner.findOne({ email: email });
      if (owner) {
        // Đăng nhập owner
        const validPassword = await bcrypt.compare(password, owner.password);
        if (validPassword) {
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
          return res.status(200).json({
            ...other,
            accessToken,
            EC: 1,
            EM: "Đăng nhập thành công",
          });
        }
      }
    }

    // Nếu không tìm thấy user hoặc owner, thử đăng nhập admin
    if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
      const adminUser = {
        name: "Admin",
        user_role: "admin",
      };
      const accessToken = generateAccessToken(adminUser);
      return res.status(200).json({
        EC: 1,
        EM: "Đăng nhập thành công",
        accessToken,
      });
    }

    return res.status(400).json({
      EC: 0,
      EM: "Email hoặc mật khẩu không đúng",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//login admin
const DEFAULT_ADMIN_EMAIL = "admin@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";

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

  registerOwner,

  refreshToken,
  login,
};
