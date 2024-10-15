const Owner = require('../models/Owner');
const User = require('../models/User');
const Pagination = require('../utils/Pagination');
const upload = require('../middlewares/uploadIMG')
const zlib = require('zlib');
const sharp = require('sharp');
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
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addOwner = async (req, res) => {
    try {
        // Lấy dữ liệu từ form-data
        const { business_name, address, phone_number, email, citizen_identification_card, account_status } = req.body;
        
        // Giảm kích thước và nén hình ảnh trước khi chuyển đổi sang base64 nếu có
        let profile_picture = null;
        if (req.file) {
            const resizedBuffer = await sharp(req.file.buffer)
                .resize(100, 100) 
                .jpeg({ quality: 80 }) 
                .toBuffer();
            const compressedBuffer = zlib.deflateSync(resizedBuffer);
            profile_picture = compressedBuffer.toString('base64');
        }

        // Tạo đối tượng Owner mới
        const owner = await Owner.create({
            business_name,
            address,
            phone_number,
            email,
            profile_picture,
            citizen_identification_card,
            account_status
        });

        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const { business_name, address, phone_number, email, citizen_identification_card, account_status } = req.body;


        let profile_picture = null;
        if (req.file) {
            const resizedBuffer = await sharp(req.file.buffer)
                .resize(100, 100) 
                .jpeg({ quality: 80 }) 
                .toBuffer();
            const compressedBuffer = zlib.deflateSync(resizedBuffer);
            profile_picture = compressedBuffer.toString('base64');
        }

        
        const updatedOwner = await Owner.findByIdAndUpdate(
            id,
            {
                business_name,
                address,
                phone_number,
                email,
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
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addUser = async (req, res) => {
    try {
       
        let profile_picture = null;
        if (req.file) {
            const resizedBuffer = await sharp(req.file.buffer)
                .resize(100, 100) 
                .jpeg({ quality: 80 }) 
                .toBuffer();
            const compressedBuffer = zlib.deflateSync(resizedBuffer);
            profile_picture = compressedBuffer.toString('base64');
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

       
        let profile_picture = null;
        if (req.file) {
            const resizedBuffer = await sharp(req.file.buffer)
                .resize(200, 200) 
                .jpeg({ quality: 80 }) 
                .toBuffer();
            const compressedBuffer = zlib.deflateSync(resizedBuffer);
            profile_picture = compressedBuffer.toString('base64');
        }

        
        const user = await User.findByIdAndUpdate(id, { ...req.body, profile_picture }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
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