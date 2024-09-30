const Field = require('../models/Field');

// Function to get all sport fields
const getAllFields = async (req, res) => {
    try {
        const Fields = await Field.find();
        res.json(Fields);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllFields
};