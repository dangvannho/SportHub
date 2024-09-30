const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },  // Foreign Key từ bảng Owner
    name: { type: String, required: true },
    location: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },  // Foreign Key từ bảng Category
    description: { type: String },
    availability_status: { type: Boolean, default: true },
    images: { type: [String] }
}, { timestamps: true });

module.exports = mongoose.model('Field', FieldSchema);
