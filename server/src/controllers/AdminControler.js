const Owner = require('../models/Owner');
const User = require('../models/User');
const Pagination = require('../utils/Pagination');
const upload = require('../middlewares/uploadIMG')
const { processImage } = require('../utils/ProcessIMG');
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

        const newOwner = new Owner({
            business_name,
            address,
            phone_number,
            email,
            password,
            citizen_identification_card,
            account_status,
            profile_picture,
            
        });

        await newOwner.save();
        res.status(201).json(newOwner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const { business_name, address, phone_number, email, password, citizen_identification_card, account_status } = req.body;

        let profile_picture = null;
        if (req.file) {
            profile_picture = await processImage(req.file.buffer);
        }

        const updatedOwner = await Owner.findByIdAndUpdate(
            id,
            {
                business_name,
                address,
                phone_number,
                email,
                password,
                profile_picture,
                citizen_identification_card,
                account_status
            },
            { new: true }
        );

        res.status(200).json(updatedOwner);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
       
        let profile_picture = null;
        if (req.file) {
            const resizedBuffer = await sharp(req.file.buffer)
            .resize(50, 50)
            .jpeg({ quality: 80 })
            .toBuffer();
            profile_picture = resizedBuffer.toString('base64');
        
        }

        const user = await User.create({ ...req.body, profile_picture });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, phone_number, email, password, citizen_identification_card, account_status, user_role, verified, verificationToken, isVerified } = req.body;

        let profile_picture = null;
        if (req.file) {
            profile_picture = await processImage(req.file.buffer);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                address,
                phone_number,
                email,
                password,
                profile_picture,
                citizen_identification_card,
                account_status,
                user_role,
                verified,
                verificationToken,
                isVerified
            },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
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