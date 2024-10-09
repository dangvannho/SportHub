const Owner = require('../models/Owner');
const getAllOwner = async (req, res) => {
    try {
        const owners = await Owner.find({})
        res.status(200).json(owners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const owner = await Owner.findById(id)
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//add owner
const addOwner = async (req, res) => {
    try {
        const owner = await Owner.create(req.body);
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOwner = async (req, res) => {
    try {
        const { id } = req.params;

        const owner = await Owner.findByIdAndUpdate(id, req.body);
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }
        const updatedOwner = await Owner.findById(id);
        res.status(200).json(updatedOwner)
    }
    catch (error) {
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

module.exports = {
    getAllOwner,
    getOwner,
    addOwner,
    updateOwner,
    deleteOwner
};