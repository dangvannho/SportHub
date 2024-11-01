const sharp = require('sharp');

const processImage = async (buffer) => {
    try {
        const resizedBuffer = await sharp(buffer)
            .resize(300, 200)
            .jpeg({ quality: 80 }) // Chất lượng ảnh 80%
            .toBuffer();
        return resizedBuffer.toString('base64');
    } catch (error) {
        throw new Error('Error processing image');
    }
};

const processFieldImage = async (buffer) => {
    try {
        const resizedBuffer = await sharp(buffer)
            .resize(1000, 1000)
            .jpeg({ quality: 80 }) // Chất lượng ảnh 80%
            .toBuffer();
        return resizedBuffer.toString('base64');
    } catch (error) {
        throw new Error('Error processing image');
    }
};

const getProfilePicture = async (req, currentProfilePicture) => {
    let profile_picture;
    if (req.file) {
        // Nếu có ảnh mới, xử lý ảnh mới
        profile_picture = await processImage(req.file.buffer);
    } else {
        // Nếu không có ảnh mới, giữ lại ảnh cũ
        profile_picture = currentProfilePicture;
    }
    return profile_picture;
};

module.exports = {
    processImage,
    getProfilePicture,
    processFieldImage
};