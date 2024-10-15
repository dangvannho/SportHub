// uploadMiddleware.js

const multer = require('multer');

// Cấu hình lưu trữ
const storage = multer.memoryStorage(); // Lưu trữ file trong bộ nhớ

// Cấu hình upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } // Giới hạn kích thước file là 5MB
});

module.exports = upload;