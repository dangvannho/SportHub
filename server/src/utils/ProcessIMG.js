const sharp = require('sharp');

const processImage = async (buffer) => {
    try {
        const resizedBuffer = await sharp(buffer)
            .resize(300, 200)
            .jpeg({ quality: 80 })//chat luong anh 80
            .toBuffer();
        return resizedBuffer.toString('base64');
    } catch (error) {
        throw new Error('Error processing image');
    }
};

module.exports = {
    processImage,
};