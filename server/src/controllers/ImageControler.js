const img = require('../models/Image');

const uploadImg = async (req, res) => { 
    try {
        const imageBase64 = req.file.buffer.toString('base64');
        const newImage = new img({
            title: req.body.title,
            description: req.body.description,
            imageBase64: imageBase64
        });
        const savedImage = await newImage.save();
        res.status(201).json(savedImage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const getImg = async (req, res) => {
    try {
        const images = await img.find();
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getImgById = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await img.findById(id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.status(200).json(image);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteImg = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedImage = await img.findByIdAndDelete(id);
        if (!deletedImage) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
module.exports = {
    uploadImg,
    getImg,
    deleteImg,
    getImgById
}