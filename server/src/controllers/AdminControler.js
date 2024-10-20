const Owner = require('../models/Owner');
const User = require('../models/User');
const Pagination = require('../utils/Pagination');

const {  getProfilePicture } = require('../utils/ProcessIMG');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../utils/Password');
// Owner Controllers
const getAllOwner = async (req, res) => {
    try {


        const page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
        const limit = req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 9;

        const pagination = new Pagination(Owner.find(), page, limit);

        const paginatedFields = await pagination.paginate();

        res.status(200).json(paginatedFields);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOwner = async (req, res) => {
    try {
        const { id } = req.params;

        const owner = await Owner.findById(id);
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        // Chuyển đổi ảnh profile_picture từ base64 thành Buffer
        let profilePicture = null;
        if (owner.profile_picture) {
            profilePicture = `data:image/png;base64,${owner.profile_picture}`;
        }

        // Trả về thông tin Owner và ảnh profile_picture
        res.status(200).json({
            owner,
            profilePicture
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addOwner = async (req, res) => {
    try {
        const { business_name, address, phone_number, email, citizen_identification_card, account_status, password } = req.body;
        const profile_picture = req.file ? req.file.buffer.toString('base64') : null;

        // Mã hóa mật khẩu
        const hashedPassword = await hashPassword(password);

        const newOwner = new Owner({
            business_name,
            address,
            phone_number,
            email,
            password: hashedPassword, // Lưu mật khẩu đã mã hóa
            citizen_identification_card,
            account_status,
            profile_picture,
        });

        await newOwner.save();
        res.status(200).json({
            "EC": 1,
            "EM": "Owner Created",
             newOwner
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const { business_name, address, phone_number, password, citizen_identification_card, account_status } = req.body;

        // Lấy thông tin chủ sở hữu hiện tại
        const owner = await Owner.findById(id);
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        // Sử dụng hàm getProfilePicture để xử lý ảnh hồ sơ
        const profile_picture = await getProfilePicture(req, owner.profile_picture);

        // Mã hóa mật khẩu nếu có thay đổi, nếu không giữ mật khẩu cũ
        let hashedPassword = password ? await hashPassword(password) : owner.password;

        // Tạo đối tượng updateData chứa các trường cần cập nhật
        let updateData = {
            business_name,
            address,
            phone_number,
            password: hashedPassword, // Lưu mật khẩu đã mã hóa hoặc giữ mật khẩu cũ
            profile_picture,          // Giữ hình ảnh cũ nếu không thay đổi
            citizen_identification_card,
            account_status
        };

        const updatedOwner = await Owner.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            "EC": 1,
            "EM": "Owner Updated",
            "data": updatedOwner
        });
    } catch (error) {
        res.status(500).json({
            "EC": 0,
            "EM": error.message,
        });
    }
};
const deleteOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const owner = await Owner.findByIdAndDelete(id);
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }
        res.status(200).json({ message: "Owner Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Controllers
const getAllUser = async (req, res) => {
    try {

        const page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
        const limit = req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 9;

        const pagination = new Pagination(User.find(), page, limit);

        const paginatedFields = await pagination.paginate();

        res.status(200).json(paginatedFields);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }    
        let profilePicture = null;
        if (user.profile_picture) {
            profilePicture = `data:image/png;base64,${user.profile_picture}`;
        }   
        res.status(200).json({
            user,
            profilePicture
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addUser = async (req, res) => {
    try {
        const { name, address, phone_number, email, password, citizen_identification_card, account_status, user_role, verified, verificationToken, isVerified } = req.body;
        const profile_picture = req.file ? req.file.buffer.toString('base64') : null;

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            name,
            address,
            phone_number,
            email,
            password: hashedPassword, 
            profile_picture,
            citizen_identification_card,
            account_status,
            user_role,
            verified,
            verificationToken,
            isVerified
        });

        await newUser.save();
        res.status(200).json({
            "EC": 1,
            "EM": "User Created",  
            newUser

        });
    } catch (error) {
        res.status(500).json({
            "EC": 0,
            "EM": error.message,
             });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, phone_number, password, citizen_identification_card, account_status, user_role, verified, verificationToken, isVerified } = req.body;

        // Lấy thông tin người dùng hiện tại
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Sử dụng hàm getProfilePicture để xử lý ảnh hồ sơ
        const profile_picture = await getProfilePicture(req, user.profile_picture);

        // Mã hóa mật khẩu nếu có thay đổi, nếu không giữ mật khẩu cũ
        let hashedPassword = password ? await hashPassword(password) : user.password;

        // Tạo đối tượng updateData chứa các trường cần cập nhật
        let updateData = {
            name,
            address,
            phone_number,
            password: hashedPassword, // Lưu mật khẩu đã mã hóa hoặc giữ mật khẩu cũ
            profile_picture,          // Giữ hình ảnh cũ nếu không thay đổi
            citizen_identification_card,
            account_status,
            user_role,
            verified,
            verificationToken,
            isVerified
        };

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            "EC": 1,
            "EM": "User Updated",
            "data": updatedUser
        });
    } catch (error) {
        res.status(500).json({
            "EC": 0,
            "EM": error.message,
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ 
            "EC": 1,
            "EM": "User Deleted",
            });
    } catch (error) {
        res.status(500).json({ 
            "EC": 0,
            "EM": error.message,
        });
    }
};

module.exports = {
    getAllOwner,
    getOwner,
    addOwner,
    updateOwner,
    deleteOwner,
    getAllUser,
    getUser,
    addUser,
    updateUser,
    deleteUser
};