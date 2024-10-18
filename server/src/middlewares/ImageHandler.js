// uploadMiddleware.js

const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ
const storage = multer.memoryStorage(); // Lưu trữ ảnh trong bộ nhớ
        
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Giới hạn kích thước file là 5MB
    fileFilter: fileFilter
});

module.exports = upload;
